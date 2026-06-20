// Utilitários de aleatoriedade controlada.

export function aleatorioInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function escolher<T>(lista: T[]): T {
  return lista[Math.floor(Math.random() * lista.length)];
}

// Baralha um array (Fisher–Yates), devolvendo uma nova cópia.
export function baralhar<T>(lista: T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

export function probabilidade(p: number): boolean {
  return Math.random() < p;
}
