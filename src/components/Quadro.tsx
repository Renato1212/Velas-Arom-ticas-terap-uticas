import { getSelecao } from '../data/selecoes';
import { rotuloRonda } from '../engine/eliminatorias';
import type { Confronto, EstadoJogo, RondaId } from '../data/tipos';
import { Cartao } from './ui/Cartao';

const COLUNAS: RondaId[] = ['r32', 'r16', 'quartos', 'meias', 'final'];

type Props = { estado: EstadoJogo };

export function Quadro({ estado }: Props) {
  const terceiro = estado.quadro.find((c) => c.ronda === 'terceiro');

  return (
    <div className="px-2 py-4">
      <h2 className="font-display font-black text-2xl text-white text-center mb-4">
        Quadro Final
      </h2>

      <div className="overflow-x-auto scrollbar-fina pb-3">
        <div className="flex gap-4 min-w-max px-2">
          {COLUNAS.map((ronda) => {
            const jogos = estado.quadro
              .filter((c) => c.ronda === ronda)
              .sort((a, b) => indice(a) - indice(b));
            return (
              <div key={ronda} className="flex flex-col gap-2 w-52">
                <p className="text-xs font-display font-bold text-amber-400 uppercase tracking-wider text-center sticky top-0">
                  {rotuloRonda(ronda)}
                </p>
                <div className="flex flex-col gap-2 justify-around h-full">
                  {jogos.map((c) => (
                    <ConfrontoCartao
                      key={c.id}
                      confronto={c}
                      idJogador={estado.selecaoDoJogador}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {terceiro && (terceiro.casaId || terceiro.foraId) && (
        <div className="max-w-xs mx-auto mt-5">
          <p className="text-xs font-display font-bold text-white/50 uppercase tracking-wider text-center mb-2">
            {rotuloRonda('terceiro')}
          </p>
          <ConfrontoCartao confronto={terceiro} idJogador={estado.selecaoDoJogador} />
        </div>
      )}
    </div>
  );
}

function indice(c: Confronto): number {
  return Number(c.id.split('-')[1]);
}

export function ConfrontoCartao({
  confronto,
  idJogador,
}: {
  confronto: Confronto;
  idJogador: string;
}) {
  const envolveJogador =
    confronto.casaId === idJogador || confronto.foraId === idJogador;

  return (
    <Cartao
      className={`p-2 ${
        envolveJogador ? 'ring-2 ring-amber-400/70' : ''
      }`}
    >
      <LinhaEquipa
        id={confronto.casaId}
        golos={confronto.golosCasa}
        pen={confronto.penCasa}
        vencedor={confronto.vencedorId === confronto.casaId && confronto.jogado}
        idJogador={idJogador}
      />
      <div className="border-t border-white/10 my-1" />
      <LinhaEquipa
        id={confronto.foraId}
        golos={confronto.golosFora}
        pen={confronto.penFora}
        vencedor={confronto.vencedorId === confronto.foraId && confronto.jogado}
        idJogador={idJogador}
      />
      {confronto.prolongamento && confronto.jogado && (
        <p className="text-[9px] text-amber-300/80 text-center mt-1">
          {confronto.penCasa !== undefined ? 'após penáltis' : 'após prolong.'}
        </p>
      )}
    </Cartao>
  );
}

function LinhaEquipa({
  id,
  golos,
  pen,
  vencedor,
  idJogador,
}: {
  id?: string;
  golos?: number;
  pen?: number;
  vencedor: boolean;
  idJogador: string;
}) {
  if (!id) {
    return (
      <div className="flex items-center justify-between py-0.5 px-1 text-white/25 text-sm">
        <span>A definir…</span>
      </div>
    );
  }
  const s = getSelecao(id);
  const ehJogador = id === idJogador;
  return (
    <div
      className={`flex items-center justify-between py-0.5 px-1 rounded ${
        ehJogador ? 'bg-amber-400/15' : ''
      }`}
    >
      <span
        className={`flex items-center gap-1.5 text-sm truncate ${
          vencedor ? 'font-bold text-white' : 'text-white/60'
        }`}
      >
        <span aria-hidden>{s.bandeira}</span>
        <span className="truncate">{s.nome}</span>
      </span>
      <span className="flex items-center gap-1 tabular-nums">
        <span className={vencedor ? 'font-bold text-white' : 'text-white/50'}>
          {golos ?? '–'}
        </span>
        {pen !== undefined && (
          <span className="text-[10px] text-amber-300">({pen})</span>
        )}
      </span>
    </div>
  );
}
