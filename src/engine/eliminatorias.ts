import type { Confronto, Grupo, LinhaTabela, RondaId } from '../data/tipos';
import { ranquearTerceiros, tabelaDoGrupo } from './classificacao';

// Ordem de performance para semear o quadro (melhor primeiro).
function melhorPrimeiro(a: LinhaTabela, b: LinhaTabela): number {
  if (b.pontos !== a.pontos) return b.pontos - a.pontos;
  if (b.diferenca !== a.diferenca) return b.diferenca - a.diferenca;
  if (b.golosMarcados !== a.golosMarcados) return b.golosMarcados - a.golosMarcados;
  return a.cartoes - b.cartoes;
}

export type Apuramento = {
  vencedores: LinhaTabela[];
  segundos: LinhaTabela[];
  melhoresTerceiros: { id: string; grupo: string }[];
};

export function calcularApuramento(grupos: Grupo[]): Apuramento {
  const vencedores: LinhaTabela[] = [];
  const segundos: LinhaTabela[] = [];

  grupos.forEach((g) => {
    const tabela = tabelaDoGrupo(g);
    vencedores.push(tabela[0]);
    segundos.push(tabela[1]);
  });

  const terceiros = ranquearTerceiros(grupos).slice(0, 8);

  vencedores.sort(melhorPrimeiro);
  segundos.sort(melhorPrimeiro);

  return {
    vencedores,
    segundos,
    melhoresTerceiros: terceiros.map((t) => ({ id: t.id, grupo: t.grupo })),
  };
}

// Lista semeada de 32 ids (seed 1 = mais forte).
function listaSemeada(grupos: Grupo[]): string[] {
  const { vencedores, segundos, melhoresTerceiros } = calcularApuramento(grupos);
  return [
    ...vencedores.map((l) => l.id),
    ...segundos.map((l) => l.id),
    ...melhoresTerceiros.map((t) => t.id),
  ];
}

const ROTULO_RONDA: Record<RondaId, string> = {
  r32: 'Ronda dos 32',
  r16: 'Oitavos-de-final',
  quartos: 'Quartos-de-final',
  meias: 'Meias-finais',
  terceiro: 'Jogo do 3.º lugar',
  final: 'Final',
};

function confrontoVazio(ronda: RondaId, indice: number): Confronto {
  return {
    id: `${ronda}-${indice}`,
    ronda,
    rotulo: `${ROTULO_RONDA[ronda]} — Jogo ${indice + 1}`,
    jogado: false,
  };
}

// Cria todo o quadro: R32 preenchida + rondas seguintes vazias.
export function montarQuadro(grupos: Grupo[]): Confronto[] {
  const seeds = listaSemeada(grupos);
  const quadro: Confronto[] = [];

  // R32: 16 jogos, semeados 1 vs 32, 2 vs 31, ...
  for (let i = 0; i < 16; i++) {
    const c = confrontoVazio('r32', i);
    c.casaId = seeds[i];
    c.foraId = seeds[31 - i];
    quadro.push(c);
  }

  for (let i = 0; i < 8; i++) quadro.push(confrontoVazio('r16', i));
  for (let i = 0; i < 4; i++) quadro.push(confrontoVazio('quartos', i));
  for (let i = 0; i < 2; i++) quadro.push(confrontoVazio('meias', i));
  quadro.push(confrontoVazio('terceiro', 0));
  quadro.push(confrontoVazio('final', 0));

  return quadro;
}

export function confrontosDaRonda(quadro: Confronto[], ronda: RondaId): Confronto[] {
  return quadro.filter((c) => c.ronda === ronda);
}

const PROXIMA: Record<Exclude<RondaId, 'final' | 'terceiro'>, RondaId> = {
  r32: 'r16',
  r16: 'quartos',
  quartos: 'meias',
  meias: 'final',
};

// Após a ronda estar concluída, preenche as equipas da ronda seguinte.
// Para as meias, alimenta também o jogo do 3.º lugar com os derrotados.
export function avancarQuadro(quadro: Confronto[], ronda: RondaId): Confronto[] {
  if (ronda === 'final' || ronda === 'terceiro') return quadro;

  const atual = confrontosDaRonda(quadro, ronda).sort(
    (a, b) => indice(a) - indice(b),
  );
  const proxima = PROXIMA[ronda];
  const seguintes = confrontosDaRonda(quadro, proxima).sort(
    (a, b) => indice(a) - indice(b),
  );

  for (let i = 0; i < seguintes.length; i++) {
    const jogoA = atual[2 * i];
    const jogoB = atual[2 * i + 1];
    seguintes[i].casaId = jogoA?.vencedorId;
    seguintes[i].foraId = jogoB?.vencedorId;
  }

  if (ronda === 'meias') {
    const terceiro = quadro.find((c) => c.ronda === 'terceiro');
    if (terceiro) {
      terceiro.casaId = derrotado(atual[0]);
      terceiro.foraId = derrotado(atual[1]);
    }
  }

  return quadro;
}

function indice(c: Confronto): number {
  return Number(c.id.split('-')[1]);
}

function derrotado(c?: Confronto): string | undefined {
  if (!c || !c.vencedorId) return undefined;
  return c.vencedorId === c.casaId ? c.foraId : c.casaId;
}

export const SEQUENCIA_RONDAS: RondaId[] = [
  'r32',
  'r16',
  'quartos',
  'meias',
  'terceiro',
  'final',
];

export function rotuloRonda(ronda: RondaId): string {
  return ROTULO_RONDA[ronda];
}
