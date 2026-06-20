import { getSelecao } from '../data/selecoes';
import { tabelaDoGrupo } from '../engine/classificacao';
import type { Grupo } from '../data/tipos';

type Props = {
  grupo: Grupo;
  idJogador?: string;
  compacta?: boolean;
};

// Tabela de classificação de um grupo com as posições de apuramento destacadas.
export function TabelaClassificacao({ grupo, idJogador, compacta = false }: Props) {
  const linhas = tabelaDoGrupo(grupo);

  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-noite-800 text-white/50 text-xs uppercase tracking-wider">
            <th className="text-left py-2 px-2 font-semibold">#</th>
            <th className="text-left py-2 px-1 font-semibold">Seleção</th>
            <th className="py-2 px-1 font-semibold" title="Jogos">J</th>
            {!compacta && <th className="py-2 px-1 font-semibold">V</th>}
            {!compacta && <th className="py-2 px-1 font-semibold">E</th>}
            {!compacta && <th className="py-2 px-1 font-semibold">D</th>}
            <th className="py-2 px-1 font-semibold" title="Diferença de golos">DG</th>
            <th className="py-2 px-2 font-semibold text-right">Pts</th>
          </tr>
        </thead>
        <tbody>
          {linhas.map((l, i) => {
            const s = getSelecao(l.id);
            const ehJogador = l.id === idJogador;
            const apuramento =
              i < 2 ? 'border-l-4 border-l-green-500' : i === 2 ? 'border-l-4 border-l-amber-400' : 'border-l-4 border-l-transparent';
            return (
              <tr
                key={l.id}
                className={`${apuramento} ${
                  ehJogador ? 'bg-amber-400/15 font-semibold' : 'bg-noite-900/60'
                } border-b border-white/5 last:border-b-0`}
              >
                <td className="py-2 px-2 text-white/40">{i + 1}</td>
                <td className="py-2 px-1">
                  <span className="inline-flex items-center gap-2">
                    <span aria-hidden>{s.bandeira}</span>
                    <span className="text-white">{s.nome}</span>
                  </span>
                </td>
                <td className="py-2 px-1 text-center text-white/70">{l.jogos}</td>
                {!compacta && (
                  <td className="py-2 px-1 text-center text-white/70">{l.vitorias}</td>
                )}
                {!compacta && (
                  <td className="py-2 px-1 text-center text-white/70">{l.empates}</td>
                )}
                {!compacta && (
                  <td className="py-2 px-1 text-center text-white/70">{l.derrotas}</td>
                )}
                <td className="py-2 px-1 text-center text-white/70">
                  {l.diferenca > 0 ? `+${l.diferenca}` : l.diferenca}
                </td>
                <td className="py-2 px-2 text-right font-bold text-white">{l.pontos}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
