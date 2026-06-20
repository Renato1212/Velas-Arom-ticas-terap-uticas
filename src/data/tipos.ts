// Tipos centrais partilhados por todo o jogo.

export type Selecao = {
  id: string; // "POR"
  nome: string; // "Portugal"
  bandeira: string; // emoji (ex.: 🇵🇹)
  forca: number; // 60–95, usado pelo motor de simulação
  pote: 1 | 2 | 3 | 4; // para o sorteio
  cor: string; // cor principal (hex) para a UI
  confederacao: Confederacao;
};

export type Confederacao = 'UEFA' | 'CONMEBOL' | 'CONCACAF' | 'CAF' | 'AFC' | 'OFC';

export type Formacao = '4-3-3' | '4-4-2' | '3-5-2' | '5-3-2' | '4-2-3-1';

export type Mentalidade = 'defensiva' | 'equilibrada' | 'ofensiva';

export type FaseAtual =
  | 'grupos'
  | 'r32'
  | 'r16'
  | 'quartos'
  | 'meias'
  | 'terceiro'
  | 'final'
  | 'fim';

// Um jogo simulado (resultado final, com cartões para fair-play).
export type Jogo = {
  casaId: string;
  foraId: string;
  golosCasa: number;
  golosFora: number;
  amarelosCasa: number;
  amarelosFora: number;
  vermelhosCasa: number;
  vermelhosFora: number;
  jogado: boolean;
};

export type Grupo = {
  letra: string; // "A" .. "L"
  equipas: string[]; // ids das 4 seleções
  jogos: Jogo[]; // 6 jogos (todos contra todos)
};

export type LinhaTabela = {
  id: string;
  jogos: number;
  vitorias: number;
  empates: number;
  derrotas: number;
  golosMarcados: number;
  golosSofridos: number;
  diferenca: number;
  pontos: number;
  cartoes: number; // amarelos + 3*vermelhos (índice de fair-play)
};

export type RondaId = 'r32' | 'r16' | 'quartos' | 'meias' | 'terceiro' | 'final';

export type Confronto = {
  id: string; // "r32-0"
  ronda: RondaId;
  rotulo: string; // "Ronda dos 32 — Jogo 1"
  casaId?: string;
  foraId?: string;
  golosCasa?: number;
  golosFora?: number;
  // Resultado dos penáltis, quando aplicável.
  penCasa?: number;
  penFora?: number;
  prolongamento?: boolean;
  vencedorId?: string;
  jogado: boolean;
};

export type EstatTorneio = {
  golosMarcadosJogador: number;
  golosSofridosJogador: number;
  jogosVencidos: number;
  jogosEmpatados: number;
  jogosPerdidos: number;
};

export type EstadoJogo = {
  versao: number;
  selecaoDoJogador: string;
  grupos: Grupo[];
  faseAtual: FaseAtual;
  quadro: Confronto[];
  formacaoJogador: Formacao;
  mentalidade: Mentalidade;
  campeao?: string;
  eliminado: boolean;
  estatisticas: EstatTorneio;
};
