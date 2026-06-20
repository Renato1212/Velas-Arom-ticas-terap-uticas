import { SELECOES } from './selecoes';
import type { Selecao } from './tipos';

// Os 4 potes para o sorteio dos grupos, derivados do campo `pote` de cada seleção.
// Cada pote deve ter exatamente 12 seleções (12 grupos × 1 por pote).
export function obterPotes(): [Selecao[], Selecao[], Selecao[], Selecao[]] {
  const p1 = SELECOES.filter((s) => s.pote === 1);
  const p2 = SELECOES.filter((s) => s.pote === 2);
  const p3 = SELECOES.filter((s) => s.pote === 3);
  const p4 = SELECOES.filter((s) => s.pote === 4);
  return [p1, p2, p3, p4];
}
