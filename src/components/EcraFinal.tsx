import { getSelecao } from '../data/selecoes';
import type { EstadoJogo } from '../data/tipos';
import { rotuloRonda } from '../engine/eliminatorias';
import { Botao } from './ui/Botao';
import { Cartao } from './ui/Cartao';
import { Confete } from './ui/Confete';

type Props = {
  estado: EstadoJogo;
  onJogarDeNovo: () => void;
  onVerQuadro: () => void;
};

export function EcraFinal({ estado, onJogarDeNovo, onVerQuadro }: Props) {
  const jogador = getSelecao(estado.selecaoDoJogador);
  const campeao = estado.campeao ? getSelecao(estado.campeao) : null;
  const venceuTudo = estado.campeao === estado.selecaoDoJogador;
  const e = estado.estatisticas;

  // Percurso do jogador nas eliminatórias.
  const percurso = estado.quadro
    .filter(
      (c) =>
        c.jogado &&
        (c.casaId === estado.selecaoDoJogador || c.foraId === estado.selecaoDoJogador),
    )
    .map((c) => {
      const ehCasa = c.casaId === estado.selecaoDoJogador;
      const advId = ehCasa ? c.foraId! : c.casaId!;
      const golosEu = ehCasa ? c.golosCasa : c.golosFora;
      const golosAdv = ehCasa ? c.golosFora : c.golosCasa;
      const penEu = ehCasa ? c.penCasa : c.penFora;
      const penAdv = ehCasa ? c.penFora : c.penCasa;
      const venceu = c.vencedorId === estado.selecaoDoJogador;
      return { ronda: rotuloRonda(c.ronda), advId, golosEu, golosAdv, penEu, penAdv, venceu };
    });

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-10 overflow-hidden">
      {venceuTudo && <Confete cor={jogador.cor} />}

      <div className="relative z-10 w-full max-w-xl text-center">
        {venceuTudo ? (
          <div className="animate-subir-trofeu">
            <div className="text-7xl">🏆</div>
            <p className="mt-3 text-amber-400 font-display font-bold tracking-widest">
              CAMPEÕES DO MUNDO
            </p>
            <h1 className="font-display font-black text-5xl sm:text-6xl text-white text-sombra mt-1">
              {jogador.bandeira} {jogador.nome}
            </h1>
            <p className="mt-4 text-white/70">
              Ergueram o troféu no estádio de Nova Jérsia. Que caminho glorioso!
            </p>
          </div>
        ) : (
          <div className="animate-fade-up">
            <div className="text-6xl">{estado.faseAtual === 'fim' ? '🥲' : '⚽'}</div>
            <p className="mt-3 text-white/50 font-display font-bold tracking-widest">
              FIM DA JORNADA
            </p>
            <h1 className="font-display font-black text-4xl sm:text-5xl text-white mt-1">
              {jogador.bandeira} {jogador.nome}
            </h1>
            {campeao && (
              <p className="mt-4 text-white/70">
                O troféu foi para {campeao.bandeira}{' '}
                <span className="font-semibold text-white">{campeao.nome}</span>.
              </p>
            )}
          </div>
        )}

        {/* Estatísticas */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          <Estatistica rotulo="Vitórias" valor={e.jogosVencidos} />
          <Estatistica rotulo="Empates" valor={e.jogosEmpatados} />
          <Estatistica rotulo="Derrotas" valor={e.jogosPerdidos} />
          <Estatistica rotulo="Golos marcados" valor={e.golosMarcadosJogador} />
          <Estatistica rotulo="Golos sofridos" valor={e.golosSofridosJogador} />
          <Estatistica
            rotulo="Saldo"
            valor={e.golosMarcadosJogador - e.golosSofridosJogador}
          />
        </div>

        {/* Percurso nas eliminatórias */}
        {percurso.length > 0 && (
          <Cartao className="mt-6 p-4 text-left">
            <h3 className="font-display font-bold text-white mb-2 text-sm">
              Percurso nas eliminatórias
            </h3>
            <ul className="space-y-1.5">
              {percurso.map((p, i) => {
                const adv = getSelecao(p.advId);
                return (
                  <li
                    key={i}
                    className="flex items-center justify-between text-sm border-b border-white/5 last:border-0 pb-1.5"
                  >
                    <span className="text-white/50">{p.ronda}</span>
                    <span className="flex items-center gap-2">
                      <span className="text-white/70">
                        {adv.bandeira} {adv.nome}
                      </span>
                      <span
                        className={`font-bold tabular-nums ${
                          p.venceu ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {p.golosEu}-{p.golosAdv}
                        {p.penEu !== undefined && ` (${p.penEu}-${p.penAdv})`}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </Cartao>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Botao tamanho="lg" onClick={onJogarDeNovo}>
            🔄 Jogar de novo
          </Botao>
          {estado.quadro.length > 0 && (
            <Botao tamanho="lg" variante="secundario" onClick={onVerQuadro}>
              📊 Ver o quadro
            </Botao>
          )}
        </div>
      </div>
    </div>
  );
}

function Estatistica({ rotulo, valor }: { rotulo: string; valor: number }) {
  return (
    <div className="rounded-xl bg-noite-900/70 border border-white/10 py-3">
      <p className="font-display font-black text-2xl text-white tabular-nums">{valor}</p>
      <p className="text-[11px] text-white/50 mt-0.5">{rotulo}</p>
    </div>
  );
}
