// Tipos e utilitários partilhados sobre o resultado de uma partida.
// (A simulação por minuto foi substituída por um jogo de futebol 2D jogável —
//  ver `motorFutebol.ts`. Os jogos de fundo são resolvidos de forma
//  determinística em `resolverDeterministico.ts`.)

export type Marcador = {
  golosCasa: number;
  golosFora: number;
  amarelosCasa: number;
  amarelosFora: number;
  vermelhosCasa: number;
  vermelhosFora: number;
};

export function marcadorVazio(): Marcador {
  return {
    golosCasa: 0,
    golosFora: 0,
    amarelosCasa: 0,
    amarelosFora: 0,
    vermelhosCasa: 0,
    vermelhosFora: 0,
  };
}

// Rótulo descritivo da força de uma seleção, usado na UI.
export function rotuloForca(forca: number): string {
  if (forca >= 88) return 'Candidata ao título';
  if (forca >= 82) return 'Forte';
  if (forca >= 75) return 'Equilibrada';
  if (forca >= 68) return 'Acessível';
  return 'Frágil';
}
