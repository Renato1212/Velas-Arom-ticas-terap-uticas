import { useEffect, useMemo, useRef, useState } from 'react';
import { getSelecao } from '../data/selecoes';
import type { Formacao, Mentalidade } from '../data/tipos';
import {
  calcularTaxas,
  marcadorVazio,
  simularMinuto,
  type ConfigEquipa,
  type EventoPartida,
  type Marcador,
  type TaxasMinuto,
} from '../engine/motorPartida';
import { Botao } from './ui/Botao';

type Props = {
  casaId: string;
  foraId: string;
  idJogador: string;
  rotuloFase: string;
  formacaoJogador: Formacao;
  mentalidadeInicial: Mentalidade;
  isKnockout: boolean;
  onFim: (
    marcador: Marcador,
    info: { prolongamento: boolean; precisaPenaltis: boolean },
  ) => void;
};

type Velocidade = 'pausa' | 'normal' | 'rapido';

const MS: Record<Exclude<Velocidade, 'pausa'>, number> = {
  normal: 230,
  rapido: 70,
};

const MAX_DECISOES = 3;

const COR_EVENTO: Record<string, string> = {
  golo: 'text-amber-300 font-bold',
  ocasiao: 'text-white/80',
  defesa: 'text-sky-300',
  amarelo: 'text-yellow-400',
  vermelho: 'text-red-400 font-bold',
  lesao: 'text-orange-300',
  neutro: 'text-white/45',
  sistema: 'text-green-300 font-semibold',
};

export function EcraPartida({
  casaId,
  foraId,
  idJogador,
  rotuloFase,
  formacaoJogador,
  mentalidadeInicial,
  isKnockout,
  onFim,
}: Props) {
  const casa = getSelecao(casaId);
  const fora = getSelecao(foraId);
  const jogadorEhCasa = casaId === idJogador;

  const [minuto, setMinuto] = useState(0);
  const [placar, setPlacar] = useState({ casa: 0, fora: 0 });
  const [eventos, setEventos] = useState<EventoPartida[]>([]);
  const [mentalidade, setMentalidade] = useState<Mentalidade>(mentalidadeInicial);
  const [velocidade, setVelocidade] = useState<Velocidade>('normal');
  const [decisoes, setDecisoes] = useState(0);
  const [flash, setFlash] = useState(false);
  const [fase, setFase] = useState<'jogo' | 'intervalo-prol' | 'fim'>('jogo');

  // Refs mutáveis para o ciclo de simulação (evita closures obsoletas).
  const marcadorRef = useRef<Marcador>(marcadorVazio());
  const minutoRef = useRef(0);
  const finalizadoRef = useRef(false);
  const feedRef = useRef<HTMLDivElement>(null);

  // Configurações: o jogador aplica formação + mentalidade no seu lado.
  const taxasRef = useRef<TaxasMinuto>({ goloCasa: 0, goloFora: 0 });
  const recomputarTaxas = (m: Mentalidade) => {
    const cfgCasa: ConfigEquipa = jogadorEhCasa
      ? { id: casaId, formacao: formacaoJogador, mentalidade: m, vantagemCampo: true }
      : { id: casaId, vantagemCampo: true };
    const cfgFora: ConfigEquipa = jogadorEhCasa
      ? { id: foraId }
      : { id: foraId, formacao: formacaoJogador, mentalidade: m };
    taxasRef.current = calcularTaxas(cfgCasa, cfgFora, 90);
  };
  // Inicializa as taxas uma vez.
  useMemo(() => recomputarTaxas(mentalidadeInicial), []);

  function registarEvento(ev: EventoPartida | null, min: number) {
    setMinuto(min);
    if (!ev) return;
    setEventos((prev) => [...prev, ev]);
    if (ev.golo) {
      setPlacar({ casa: marcadorRef.current.golosCasa, fora: marcadorRef.current.golosFora });
      setFlash(true);
      window.setTimeout(() => setFlash(false), 950);
    }
  }

  function avancarUmMinuto(): 'continua' | 'fim-90' | 'fim-prol' {
    const min = minutoRef.current + 1;
    minutoRef.current = min;
    const ev = simularMinuto(min, taxasRef.current, casaId, foraId, marcadorRef.current);
    registarEvento(ev, min);

    if (min === 90) {
      const empatado =
        marcadorRef.current.golosCasa === marcadorRef.current.golosFora;
      if (!isKnockout || !empatado) return 'fim-90';
      return 'continua'; // segue para prolongamento
    }
    if (min === 120) return 'fim-prol';
    return 'continua';
  }

  function terminar(precisaPenaltis: boolean) {
    if (finalizadoRef.current) return;
    finalizadoRef.current = true;
    setFase('fim');
    setVelocidade('pausa');
    onFim(
      { ...marcadorRef.current },
      { prolongamento: minutoRef.current > 90, precisaPenaltis },
    );
  }

  // Ciclo de relógio.
  useEffect(() => {
    if (velocidade === 'pausa' || fase !== 'jogo') return;
    const id = window.setInterval(() => {
      const r = avancarUmMinuto();
      if (r === 'fim-90') {
        terminar(false);
      } else if (r === 'fim-prol') {
        const empatado =
          marcadorRef.current.golosCasa === marcadorRef.current.golosFora;
        terminar(empatado); // empate após prolongamento → penáltis
      } else if (minutoRef.current === 90) {
        // Anuncia o prolongamento.
        setEventos((prev) => [
          ...prev,
          {
            minuto: 90,
            tipo: 'sistema',
            texto: 'Fim do tempo regulamentar. Empate! Segue-se o prolongamento (30 min).',
            golo: false,
            placar: `${marcadorRef.current.golosCasa}-${marcadorRef.current.golosFora}`,
          },
        ]);
      }
    }, MS[velocidade]);
    return () => window.clearInterval(id);
  }, [velocidade, fase]);

  // Auto-scroll do feed.
  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight;
  }, [eventos]);

  function saltarParaOFim() {
    setVelocidade('pausa');
    // Simula instantaneamente os minutos que faltam.
    let guard = 0;
    while (!finalizadoRef.current && guard < 200) {
      guard += 1;
      const r = avancarUmMinuto();
      if (r === 'fim-90') {
        terminar(false);
        return;
      }
      if (r === 'fim-prol') {
        const empatado =
          marcadorRef.current.golosCasa === marcadorRef.current.golosFora;
        terminar(empatado);
        return;
      }
    }
  }

  function mudarMentalidade(m: Mentalidade) {
    if (decisoes >= MAX_DECISOES || m === mentalidade || fase === 'fim') return;
    setMentalidade(m);
    recomputarTaxas(m);
    setDecisoes((d) => d + 1);
    setEventos((prev) => [
      ...prev,
      {
        minuto: minutoRef.current,
        tipo: 'sistema',
        texto: `Ajuste tático: passas a jogar de forma ${m}.`,
        golo: false,
        placar: `${marcadorRef.current.golosCasa}-${marcadorRef.current.golosFora}`,
      },
    ]);
  }

  const noProlongamento = minuto > 90;
  const corJogador = jogadorEhCasa ? casa.cor : fora.cor;

  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      <p className="text-center text-amber-400 font-display font-bold tracking-widest text-xs mb-3">
        {rotuloFase.toUpperCase()}
      </p>

      {/* Placar + relógio */}
      <div
        className={`rounded-2xl p-5 border border-white/10 transition-colors ${
          flash ? 'animate-flash-golo' : ''
        }`}
        style={{ background: `linear-gradient(135deg, ${casa.cor}22, ${fora.cor}22)` }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 text-center">
            <div className="text-4xl sm:text-5xl">{casa.bandeira}</div>
            <p className="mt-1 font-display font-bold text-white text-sm sm:text-base">
              {casa.nome}
            </p>
          </div>
          <div className="text-center">
            <div className="font-display font-black text-5xl sm:text-6xl text-white tabular-nums">
              {placar.casa}<span className="text-white/40 px-1">-</span>{placar.fora}
            </div>
            <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-noite-950/70 px-3 py-1">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="font-mono text-sm text-white tabular-nums">{minuto}'</span>
            </div>
            {noProlongamento && (
              <p className="text-[10px] text-amber-300 mt-1 font-semibold">PROLONGAMENTO</p>
            )}
          </div>
          <div className="flex-1 text-center">
            <div className="text-4xl sm:text-5xl">{fora.bandeira}</div>
            <p className="mt-1 font-display font-bold text-white text-sm sm:text-base">
              {fora.nome}
            </p>
          </div>
        </div>
      </div>

      {/* Controlos de velocidade */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <Botao
          tamanho="sm"
          variante={velocidade === 'normal' ? 'principal' : 'secundario'}
          onClick={() => setVelocidade('normal')}
          disabled={fase === 'fim'}
        >
          ▶ Normal
        </Botao>
        <Botao
          tamanho="sm"
          variante={velocidade === 'rapido' ? 'principal' : 'secundario'}
          onClick={() => setVelocidade('rapido')}
          disabled={fase === 'fim'}
        >
          ⏩ Rápido
        </Botao>
        <Botao
          tamanho="sm"
          variante="secundario"
          onClick={() => setVelocidade('pausa')}
          disabled={fase === 'fim'}
        >
          ⏸ Pausa
        </Botao>
        <Botao tamanho="sm" variante="fantasma" onClick={saltarParaOFim} disabled={fase === 'fim'}>
          ⏭ Saltar para o fim
        </Botao>
      </div>

      {/* Decisões */}
      <div className="mt-4 rounded-2xl bg-noite-900/70 border border-white/10 p-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-white/60">
            Decisões táticas
          </p>
          <span className="text-xs text-white/40">{decisoes}/{MAX_DECISOES} usadas</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(['defensiva', 'equilibrada', 'ofensiva'] as Mentalidade[]).map((m) => {
            const ativo = mentalidade === m;
            const bloqueado = decisoes >= MAX_DECISOES && !ativo;
            return (
              <button
                key={m}
                onClick={() => mudarMentalidade(m)}
                disabled={bloqueado || fase === 'fim'}
                aria-pressed={ativo}
                className={`rounded-xl py-2 text-xs font-semibold capitalize transition-all border ${
                  ativo
                    ? 'border-amber-400 bg-amber-400/20 text-white'
                    : 'border-white/10 bg-noite-800/60 text-white/70 hover:border-white/30 disabled:opacity-30'
                }`}
                style={ativo ? { borderColor: corJogador } : undefined}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feed de narração */}
      <div
        ref={feedRef}
        className="mt-4 h-72 overflow-y-auto scrollbar-fina rounded-2xl bg-noite-950/60 border border-white/10 p-4 space-y-1.5"
      >
        {eventos.length === 0 && (
          <p className="text-white/30 text-sm text-center py-8">
            O apito inicial vai soar… Boa sorte!
          </p>
        )}
        {eventos.map((ev, i) => (
          <p
            key={i}
            className={`text-sm leading-snug animate-fade-up ${COR_EVENTO[ev.tipo] ?? 'text-white/60'}`}
          >
            {ev.texto}
          </p>
        ))}
      </div>
    </div>
  );
}
