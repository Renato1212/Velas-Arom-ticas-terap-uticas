import { getSelecao } from '../data/selecoes';
import { rotuloForca } from '../engine/motorPartida';
import type { Formacao, Mentalidade } from '../data/tipos';
import { Botao } from './ui/Botao';
import { Cartao } from './ui/Cartao';

type Props = {
  idJogador: string;
  advId: string;
  rotuloFase: string;
  formacao: Formacao;
  mentalidade: Mentalidade;
  onDefinir: (formacao: Formacao, mentalidade: Mentalidade) => void;
  onComecar: () => void;
};

const FORMACOES: { valor: Formacao; nota: string }[] = [
  { valor: '4-3-3', nota: 'Ofensiva e larga' },
  { valor: '4-4-2', nota: 'Equilíbrio clássico' },
  { valor: '4-2-3-1', nota: 'Criativa' },
  { valor: '3-5-2', nota: 'Domínio do meio' },
  { valor: '5-3-2', nota: 'Muralha defensiva' },
];

const MENTALIDADES: { valor: Mentalidade; rotulo: string; desc: string; icone: string }[] = [
  { valor: 'defensiva', rotulo: 'Defensiva', desc: 'Menos golos sofridos, menos marcados', icone: '🛡️' },
  { valor: 'equilibrada', rotulo: 'Equilibrada', desc: 'Sem riscos nem exageros', icone: '⚖️' },
  { valor: 'ofensiva', rotulo: 'Ofensiva', desc: 'Marcas mais, mas arriscas sofrer', icone: '⚔️' },
];

export function EcraPreJogo({
  idJogador,
  advId,
  rotuloFase,
  formacao,
  mentalidade,
  onDefinir,
  onComecar,
}: Props) {
  const eu = getSelecao(idJogador);
  const adv = getSelecao(advId);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <p className="text-amber-400 font-display font-bold tracking-widest text-sm text-center">
        {rotuloFase.toUpperCase()}
      </p>

      <div className="my-6 flex items-center justify-center gap-4 sm:gap-8">
        <div className="text-center">
          <div className="text-5xl sm:text-6xl">{eu.bandeira}</div>
          <p className="mt-2 font-display font-bold text-white">{eu.nome}</p>
        </div>
        <span className="font-display font-black text-white/30 text-3xl">VS</span>
        <div className="text-center">
          <div className="text-5xl sm:text-6xl">{adv.bandeira}</div>
          <p className="mt-2 font-display font-bold text-white">{adv.nome}</p>
          <p className="text-xs text-white/50">
            Força {adv.forca} · {rotuloForca(adv.forca)}
          </p>
        </div>
      </div>

      <Cartao className="p-5 mb-4">
        <h3 className="font-display font-bold text-white mb-3">Formação</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {FORMACOES.map((f) => {
            const ativo = formacao === f.valor;
            return (
              <button
                key={f.valor}
                onClick={() => onDefinir(f.valor, mentalidade)}
                aria-pressed={ativo}
                className={`rounded-xl py-3 px-2 text-center border transition-all ${
                  ativo
                    ? 'border-amber-400 bg-amber-400/15'
                    : 'border-white/10 bg-noite-800/60 hover:border-white/30'
                }`}
              >
                <p className="font-display font-bold text-white">{f.valor}</p>
                <p className="text-[10px] text-white/50 leading-tight mt-1">{f.nota}</p>
              </button>
            );
          })}
        </div>
      </Cartao>

      <Cartao className="p-5 mb-6">
        <h3 className="font-display font-bold text-white mb-3">Mentalidade</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {MENTALIDADES.map((m) => {
            const ativo = mentalidade === m.valor;
            return (
              <button
                key={m.valor}
                onClick={() => onDefinir(formacao, m.valor)}
                aria-pressed={ativo}
                className={`rounded-xl py-3 px-3 text-left border transition-all ${
                  ativo
                    ? 'border-amber-400 bg-amber-400/15'
                    : 'border-white/10 bg-noite-800/60 hover:border-white/30'
                }`}
              >
                <p className="font-bold text-white">
                  {m.icone} {m.rotulo}
                </p>
                <p className="text-[11px] text-white/50 leading-tight mt-1">{m.desc}</p>
              </button>
            );
          })}
        </div>
      </Cartao>

      <Botao tamanho="lg" className="w-full" onClick={onComecar}>
        ▶ Começar a partida
      </Botao>
    </div>
  );
}
