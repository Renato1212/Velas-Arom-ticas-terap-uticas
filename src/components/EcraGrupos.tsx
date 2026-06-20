import { getSelecao } from '../data/selecoes';
import { grupoDoJogador } from '../engine/sorteio';
import { proximoJogoGrupo } from '../state/useJogo';
import type { EstadoJogo } from '../data/tipos';
import { Botao } from './ui/Botao';
import { Cartao } from './ui/Cartao';
import { TabelaClassificacao } from './TabelaClassificacao';
import { Bandeira } from './ui/Bandeira';

type Props = {
  estado: EstadoJogo;
  onJogar: () => void;
};

export function EcraGrupos({ estado, onJogar }: Props) {
  const grupo = grupoDoJogador(estado.grupos, estado.selecaoDoJogador);
  const proximo = proximoJogoGrupo(grupo, estado.selecaoDoJogador);
  const jogador = getSelecao(estado.selecaoDoJogador);

  const jogosJogador = grupo.jogos.filter(
    (j) => j.casaId === estado.selecaoDoJogador || j.foraId === estado.selecaoDoJogador,
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <header className="mb-6">
        <p className="text-amber-400 font-display font-bold tracking-widest text-sm">
          FASE DE GRUPOS · GRUPO {grupo.letra}
        </p>
        <h2 className="font-display font-black text-3xl text-white flex items-center gap-3">
          <span className="text-4xl">{jogador.bandeira}</span>
          {jogador.nome}
        </h2>
      </header>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Cartao className="p-4">
            <h3 className="font-display font-bold text-white mb-3">
              Classificação — Grupo {grupo.letra}
            </h3>
            <TabelaClassificacao grupo={grupo} idJogador={estado.selecaoDoJogador} />
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-white/50">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-green-500 inline-block" /> 1.º e 2.º
                apurados
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-400 inline-block" /> 3.º pode
                apurar-se
              </span>
            </div>
          </Cartao>

          <Cartao className="p-4">
            <h3 className="font-display font-bold text-white mb-3">Os teus jogos</h3>
            <ul className="space-y-2">
              {jogosJogador.map((j, i) => {
                const advId = j.casaId === estado.selecaoDoJogador ? j.foraId : j.casaId;
                const adv = getSelecao(advId);
                return (
                  <li
                    key={i}
                    className={`flex items-center justify-between rounded-xl px-3 py-2.5 ${
                      j.jogado ? 'bg-noite-800/50' : 'bg-amber-400/10 border border-amber-400/30'
                    }`}
                  >
                    <span className="flex items-center gap-2 text-white">
                      <span aria-hidden>{adv.bandeira}</span>
                      <span className="font-medium">{adv.nome}</span>
                      <span className="text-white/40 text-xs">({adv.forca})</span>
                    </span>
                    {j.jogado ? (
                      <span className="font-display font-bold text-white tabular-nums">
                        {j.casaId === estado.selecaoDoJogador
                          ? `${j.golosCasa} - ${j.golosFora}`
                          : `${j.golosFora} - ${j.golosCasa}`}
                      </span>
                    ) : (
                      <span className="text-amber-400 text-sm font-semibold">A seguir</span>
                    )}
                  </li>
                );
              })}
            </ul>

            {proximo && (
              <div className="mt-4">
                <Botao tamanho="lg" className="w-full" onClick={onJogar}>
                  ⚽ Jogar próxima partida
                </Botao>
              </div>
            )}
          </Cartao>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Cartao className="p-4">
            <h3 className="font-display font-bold text-white mb-3 text-sm">
              Outros grupos
            </h3>
            <div className="space-y-3 max-h-[460px] overflow-y-auto scrollbar-fina pr-1">
              {estado.grupos
                .filter((g) => g.letra !== grupo.letra)
                .map((g) => (
                  <div key={g.letra}>
                    <p className="text-xs text-white/40 font-semibold mb-1">
                      Grupo {g.letra}
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {[...g.equipas]
                        .map((id) => id)
                        .map((id) => (
                          <Bandeira key={id} id={id} mostrarNome tamanho="sm" className="text-xs text-white/70" />
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          </Cartao>
        </div>
      </div>
    </div>
  );
}
