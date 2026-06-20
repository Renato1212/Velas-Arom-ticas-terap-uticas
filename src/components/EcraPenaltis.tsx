import { useEffect, useRef, useState } from 'react';
import { getSelecao } from '../data/selecoes';
import {
  decidirFimPenaltis,
  defenderJogador,
  frasePenalti,
  palpiteGuardiaoIA,
  remateGuardiaoIA,
  rematarJogador,
  ROTULO_ZONA,
  ZONAS,
  type ResultadoPenalti,
  type Zona,
} from '../engine/penaltis';
import { Botao } from './ui/Botao';

type Props = {
  casaId: string;
  foraId: string;
  idJogador: string;
  onFim: (penCasa: number, penFora: number) => void;
};

type Fase = 'escolher' | 'barra' | 'resultado';

type Registo = { lado: 'A' | 'B'; marcou: boolean };

// O jogador é sempre "A"; o adversário é "B".
export function EcraPenaltis({ casaId, foraId, idJogador, onFim }: Props) {
  const eu = getSelecao(idJogador);
  const advId = idJogador === casaId ? foraId : casaId;
  const adv = getSelecao(advId);

  const [vez, setVez] = useState<'A' | 'B'>('A');
  const [golosA, setGolosA] = useState(0);
  const [golosB, setGolosB] = useState(0);
  const [batidosA, setBatidosA] = useState(0);
  const [batidosB, setBatidosB] = useState(0);
  const [historico, setHistorico] = useState<Registo[]>([]);

  const [fase, setFase] = useState<Fase>('escolher');
  const [zonaEscolhida, setZonaEscolhida] = useState<Zona | null>(null);
  const [barra, setBarra] = useState(0);
  const [resultado, setResultado] = useState<ResultadoPenalti | null>(null);
  const [frase, setFrase] = useState('');

  const dirRef = useRef(1);
  const finalizadoRef = useRef(false);

  const morteSubita = batidosA >= 5 && batidosB >= 5;

  // Barra de potência/precisão (oscila enquanto o jogador remata).
  useEffect(() => {
    if (fase !== 'barra') return;
    const id = window.setInterval(() => {
      setBarra((v) => {
        let nv = v + dirRef.current * 0.04;
        if (nv >= 1) {
          nv = 1;
          dirRef.current = -1;
        } else if (nv <= 0) {
          nv = 0;
          dirRef.current = 1;
        }
        return nv;
      });
    }, 28);
    return () => window.clearInterval(id);
  }, [fase]);

  function escolherZona(z: Zona) {
    if (fase !== 'escolher') return;
    setZonaEscolhida(z);
    if (vez === 'A') {
      // A rematar: passa à barra de precisão.
      setBarra(0);
      dirRef.current = 1;
      setFase('barra');
    } else {
      // A defender: resolve já (a IA remata).
      const zonaIA = remateGuardiaoIA();
      const r = defenderJogador(z, zonaIA);
      // Para a equipa B, "marcou" = golo (defesa/fora = falhou).
      resolverKick('B', r);
    }
  }

  function disparar() {
    if (fase !== 'barra' || !zonaEscolhida) return;
    // Precisão: ideal perto de 0.82; afasta-se → menos precisão.
    const ideal = 0.82;
    const precisao = Math.max(0, 1 - Math.abs(barra - ideal) / 0.42);
    const zonaGuardiao = palpiteGuardiaoIA();
    const r = rematarJogador(zonaEscolhida, precisao, zonaGuardiao);
    resolverKick('A', r);
  }

  function resolverKick(lado: 'A' | 'B', r: ResultadoPenalti) {
    const marcou = r === 'golo';
    setResultado(r);
    setFrase(frasePenalti(r));
    setFase('resultado');
    setHistorico((h) => [...h, { lado, marcou }]);

    if (lado === 'A') {
      setBatidosA((b) => b + 1);
      if (marcou) setGolosA((g) => g + 1);
    } else {
      setBatidosB((b) => b + 1);
      if (marcou) setGolosB((g) => g + 1);
    }
  }

  function continuar() {
    // Calcula os totais já atualizados.
    const gA = golosA;
    const gB = golosB;
    const bA = batidosA;
    const bB = batidosB;

    const fim = decidirFimPenaltis(gA, gB, bA, bB);
    if (fim.terminou && !finalizadoRef.current) {
      finalizar(gA, gB);
      return;
    }

    // Próxima vez: alterna A → B → A …
    const proxima: 'A' | 'B' = vez === 'A' ? 'B' : 'A';
    setVez(proxima);
    setZonaEscolhida(null);
    setResultado(null);
    setFrase('');
    setFase('escolher');
  }

  function finalizar(gA: number, gB: number) {
    finalizadoRef.current = true;
    // Mapeia A/B (jogador/adv) para casa/fora do confronto.
    const penCasa = idJogador === casaId ? gA : gB;
    const penFora = idJogador === casaId ? gB : gA;
    onFim(penCasa, penFora);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <p className="text-center text-amber-400 font-display font-bold tracking-widest text-xs mb-1">
        GRANDES PENALIDADES
      </p>
      <h2 className="text-center font-display font-black text-2xl text-white mb-4">
        {eu.nome} <span className="text-white/40">vs</span> {adv.nome}
      </h2>

      {/* Placar de penáltis */}
      <div className="flex items-center justify-center gap-6 mb-5">
        <PlacarLado nome={eu.nome} bandeira={eu.bandeira} golos={golosA} destaque />
        <span className="font-display font-black text-white/30 text-2xl">—</span>
        <PlacarLado nome={adv.nome} bandeira={adv.bandeira} golos={golosB} />
      </div>

      <SequenciaMarcadores historico={historico} />

      {morteSubita && (
        <p className="text-center text-amber-300 font-bold text-sm mt-3 animate-pulso">
          MORTE SÚBITA!
        </p>
      )}

      {/* Zona de ação */}
      <div className="mt-5 rounded-2xl bg-noite-900/70 border border-white/10 p-5">
        {fase !== 'resultado' && (
          <p className="text-center font-semibold text-white mb-4">
            {vez === 'A'
              ? '⚽ É a tua vez de REMATAR — escolhe o canto'
              : '🧤 Defende! — escolhe para que lado te atiras'}
          </p>
        )}

        {fase === 'resultado' ? (
          <div className="text-center py-4">
            <p
              className={`font-display font-black text-4xl ${
                resultado === 'golo'
                  ? vez === 'A'
                    ? 'text-green-400'
                    : 'text-red-400'
                  : vez === 'A'
                    ? 'text-red-400'
                    : 'text-green-400'
              }`}
            >
              {frase}
            </p>
            <p className="text-white/50 text-sm mt-2">
              {vez === 'A'
                ? resultado === 'golo'
                  ? 'Marcaste!'
                  : 'Falhaste esta…'
                : resultado === 'golo'
                  ? `${adv.nome} marcou.`
                  : 'Travaste o remate!'}
            </p>
            <Botao className="mt-5" onClick={continuar}>
              Continuar →
            </Botao>
          </div>
        ) : (
          <>
            <BalizaGrelha
              zonaEscolhida={zonaEscolhida}
              desativada={fase === 'barra'}
              onEscolher={escolherZona}
            />

            {fase === 'barra' && (
              <div className="mt-5">
                <p className="text-center text-xs text-white/50 mb-2">
                  Carrega em <strong>DISPARAR</strong> quando a barra estiver na zona
                  verde!
                </p>
                <div className="relative h-6 rounded-full bg-noite-800 overflow-hidden border border-white/10">
                  {/* Zona ideal */}
                  <div
                    className="absolute top-0 bottom-0 bg-green-500/40"
                    style={{ left: '64%', width: '24%' }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-1.5 bg-amber-400"
                    style={{ left: `${barra * 100}%` }}
                  />
                </div>
                <Botao className="mt-4 w-full" onClick={disparar}>
                  🎯 DISPARAR!
                </Botao>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function PlacarLado({
  nome,
  bandeira,
  golos,
  destaque = false,
}: {
  nome: string;
  bandeira: string;
  golos: number;
  destaque?: boolean;
}) {
  return (
    <div className="text-center">
      <div className="text-3xl">{bandeira}</div>
      <p className="text-xs text-white/60 mt-1">{nome}</p>
      <p
        className={`font-display font-black text-4xl tabular-nums ${
          destaque ? 'text-amber-300' : 'text-white'
        }`}
      >
        {golos}
      </p>
    </div>
  );
}

function SequenciaMarcadores({ historico }: { historico: Registo[] }) {
  const a = historico.filter((h) => h.lado === 'A');
  const b = historico.filter((h) => h.lado === 'B');
  const linha = (regs: Registo[]) => (
    <div className="flex gap-1.5 justify-center">
      {regs.map((r, i) => (
        <span
          key={i}
          className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
            r.marcou ? 'bg-green-500 text-white' : 'bg-red-500/80 text-white'
          }`}
        >
          {r.marcou ? '✓' : '✗'}
        </span>
      ))}
    </div>
  );
  return (
    <div className="space-y-1.5">
      {linha(a)}
      {linha(b)}
    </div>
  );
}

function BalizaGrelha({
  zonaEscolhida,
  desativada,
  onEscolher,
}: {
  zonaEscolhida: Zona | null;
  desativada: boolean;
  onEscolher: (z: Zona) => void;
}) {
  return (
    <div className="relative mx-auto max-w-sm">
      {/* Moldura da baliza */}
      <div className="rounded-t-xl border-x-4 border-t-4 border-white/70 bg-gradient-to-b from-noite-950/40 to-relva-800/30 p-2">
        <div className="grid grid-cols-3 grid-rows-2 gap-2 aspect-[3/2]">
          {ZONAS.map((z) => {
            const ativo = zonaEscolhida === z;
            return (
              <button
                key={z}
                disabled={desativada}
                onClick={() => onEscolher(z)}
                aria-label={ROTULO_ZONA[z]}
                aria-pressed={ativo}
                className={`rounded-lg border-2 transition-all flex items-center justify-center text-2xl ${
                  ativo
                    ? 'border-amber-400 bg-amber-400/30 scale-105'
                    : 'border-white/15 bg-white/5 hover:bg-white/15 disabled:opacity-40'
                }`}
              >
                {ativo ? '🎯' : ''}
              </button>
            );
          })}
        </div>
      </div>
      <div className="h-2 bg-relva-700 rounded-b" />
    </div>
  );
}
