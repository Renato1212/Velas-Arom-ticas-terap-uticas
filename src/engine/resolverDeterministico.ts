import { getSelecao } from '../data/selecoes';

// Resolução determinística dos jogos que NÃO envolvem o jogador (sem aleatoriedade).
// O resultado depende apenas da diferença de força — a equipa mais forte vence,
// equipas equivalentes empatam. Assim, nada no torneio fica entregue à sorte.

export type ResultadoDet = {
  golosCasa: number;
  golosFora: number;
  amarelosCasa: number;
  amarelosFora: number;
  vermelhosCasa: number;
  vermelhosFora: number;
};

function golos(forte: number, fraco: number): { gForte: number; gFraco: number } {
  const gap = forte - fraco;
  if (gap < 3) return { gForte: 1, gFraco: 1 }; // equilíbrio → empate
  if (gap < 8) return { gForte: 2, gFraco: 1 };
  if (gap < 14) return { gForte: 2, gFraco: 0 };
  if (gap < 20) return { gForte: 3, gFraco: 0 };
  return { gForte: 4, gFraco: 0 };
}

export function resolverJogo(casaId: string, foraId: string): ResultadoDet {
  // Pequena vantagem determinística para a equipa da casa.
  const fCasa = getSelecao(casaId).forca + 2;
  const fFora = getSelecao(foraId).forca;

  let golosCasa: number;
  let golosFora: number;
  if (fCasa >= fFora) {
    const { gForte, gFraco } = golos(fCasa, fFora);
    golosCasa = gForte;
    golosFora = gFraco;
  } else {
    const { gForte, gFraco } = golos(fFora, fCasa);
    golosFora = gForte;
    golosCasa = gFraco;
  }

  return {
    golosCasa,
    golosFora,
    amarelosCasa: 0,
    amarelosFora: 0,
    vermelhosCasa: 0,
    vermelhosFora: 0,
  };
}

// Eliminatória determinística: garante sempre um vencedor.
export function resolverEliminatoria(casaId: string, foraId: string): {
  golosCasa: number;
  golosFora: number;
  penCasa?: number;
  penFora?: number;
  prolongamento: boolean;
  vencedorId: string;
} {
  const r = resolverJogo(casaId, foraId);
  if (r.golosCasa !== r.golosFora) {
    return {
      golosCasa: r.golosCasa,
      golosFora: r.golosFora,
      prolongamento: false,
      vencedorId: r.golosCasa > r.golosFora ? casaId : foraId,
    };
  }
  // Empate → decide-se nas grandes penalidades de forma determinística:
  // a equipa de maior força (desempate por id) leva a melhor.
  const fCasa = getSelecao(casaId).forca;
  const fFora = getSelecao(foraId).forca;
  const casaVence = fCasa > fFora || (fCasa === fFora && casaId < foraId);
  return {
    golosCasa: r.golosCasa,
    golosFora: r.golosFora,
    penCasa: casaVence ? 4 : 3,
    penFora: casaVence ? 3 : 4,
    prolongamento: true,
    vencedorId: casaVence ? casaId : foraId,
  };
}
