import type { Grupo, Jogo, LinhaTabela } from '../data/tipos';

function linhaVazia(id: string): LinhaTabela {
  return {
    id,
    jogos: 0,
    vitorias: 0,
    empates: 0,
    derrotas: 0,
    golosMarcados: 0,
    golosSofridos: 0,
    diferenca: 0,
    pontos: 0,
    cartoes: 0,
  };
}

function aplicarJogo(linha: LinhaTabela, gm: number, gs: number, cartoes: number) {
  linha.jogos += 1;
  linha.golosMarcados += gm;
  linha.golosSofridos += gs;
  linha.cartoes += cartoes;
  if (gm > gs) {
    linha.vitorias += 1;
    linha.pontos += 3;
  } else if (gm === gs) {
    linha.empates += 1;
    linha.pontos += 1;
  } else {
    linha.derrotas += 1;
  }
  linha.diferenca = linha.golosMarcados - linha.golosSofridos;
}

// Calcula as linhas (sem ordenar) para um conjunto de equipas e jogos já disputados.
function calcularLinhas(equipas: string[], jogos: Jogo[]): Map<string, LinhaTabela> {
  const mapa = new Map<string, LinhaTabela>();
  equipas.forEach((id) => mapa.set(id, linhaVazia(id)));

  jogos
    .filter((j) => j.jogado)
    .forEach((j) => {
      const casa = mapa.get(j.casaId);
      const fora = mapa.get(j.foraId);
      if (!casa || !fora) return;
      const cartoesCasa = j.amarelosCasa + 3 * j.vermelhosCasa;
      const cartoesFora = j.amarelosFora + 3 * j.vermelhosFora;
      aplicarJogo(casa, j.golosCasa, j.golosFora, cartoesCasa);
      aplicarJogo(fora, j.golosFora, j.golosCasa, cartoesFora);
    });

  return mapa;
}

// Confronto direto: mini-tabela apenas entre as equipas empatadas.
function confrontoDireto(
  empatadas: string[],
  jogos: Jogo[],
): Map<string, { pontos: number; diferenca: number; golos: number }> {
  const set = new Set(empatadas);
  const mini = new Map<string, { pontos: number; diferenca: number; golos: number }>();
  empatadas.forEach((id) => mini.set(id, { pontos: 0, diferenca: 0, golos: 0 }));

  jogos
    .filter((j) => j.jogado && set.has(j.casaId) && set.has(j.foraId))
    .forEach((j) => {
      const casa = mini.get(j.casaId)!;
      const fora = mini.get(j.foraId)!;
      casa.golos += j.golosCasa;
      fora.golos += j.golosFora;
      casa.diferenca += j.golosCasa - j.golosFora;
      fora.diferenca += j.golosFora - j.golosCasa;
      if (j.golosCasa > j.golosFora) casa.pontos += 3;
      else if (j.golosCasa < j.golosFora) fora.pontos += 3;
      else {
        casa.pontos += 1;
        fora.pontos += 1;
      }
    });

  return mini;
}

// Ordena as linhas aplicando os critérios oficiais de desempate, por esta ordem:
// 1. Pontos  2. Diferença de golos  3. Golos marcados
// 4. Confronto direto (pontos, dif, golos entre empatadas)
// 5. Fair-play (menos cartões)  6. Sorteio (estável/aleatório suave)
export function ordenarTabela(equipas: string[], jogos: Jogo[]): LinhaTabela[] {
  const mapa = calcularLinhas(equipas, jogos);
  const linhas = [...mapa.values()];

  linhas.sort((a, b) => {
    if (b.pontos !== a.pontos) return b.pontos - a.pontos;
    if (b.diferenca !== a.diferenca) return b.diferenca - a.diferenca;
    if (b.golosMarcados !== a.golosMarcados) return b.golosMarcados - a.golosMarcados;

    // Confronto direto entre o grupo de equipas com pontos/dif/golos iguais.
    const empatadas = linhas
      .filter(
        (l) =>
          l.pontos === a.pontos &&
          l.diferenca === a.diferenca &&
          l.golosMarcados === a.golosMarcados,
      )
      .map((l) => l.id);

    if (empatadas.length > 1) {
      const cd = confrontoDireto(empatadas, jogos);
      const ca = cd.get(a.id)!;
      const cb = cd.get(b.id)!;
      if (cb.pontos !== ca.pontos) return cb.pontos - ca.pontos;
      if (cb.diferenca !== ca.diferenca) return cb.diferenca - ca.diferenca;
      if (cb.golos !== ca.golos) return cb.golos - ca.golos;
    }

    // Fair-play: menos cartões fica à frente.
    if (a.cartoes !== b.cartoes) return a.cartoes - b.cartoes;

    // Sorteio: desempate final pseudo-aleatório mas estável por ids.
    return a.id < b.id ? -1 : 1;
  });

  return linhas;
}

export function tabelaDoGrupo(grupo: Grupo): LinhaTabela[] {
  return ordenarTabela(grupo.equipas, grupo.jogos);
}

export type TerceiroClassificado = LinhaTabela & { grupo: string };

// Recolhe os 3.os classificados de todos os grupos e ordena-os para escolher os 8 melhores.
// Critérios: pontos, diferença de golos, golos marcados, fair-play, sorteio.
export function ranquearTerceiros(grupos: Grupo[]): TerceiroClassificado[] {
  const terceiros: TerceiroClassificado[] = grupos.map((g) => {
    const tabela = tabelaDoGrupo(g);
    return { ...tabela[2], grupo: g.letra };
  });

  terceiros.sort((a, b) => {
    if (b.pontos !== a.pontos) return b.pontos - a.pontos;
    if (b.diferenca !== a.diferenca) return b.diferenca - a.diferenca;
    if (b.golosMarcados !== a.golosMarcados) return b.golosMarcados - a.golosMarcados;
    if (a.cartoes !== b.cartoes) return a.cartoes - b.cartoes;
    return a.id < b.id ? -1 : 1;
  });

  return terceiros;
}

export function gruposCompletos(grupos: Grupo[]): boolean {
  return grupos.every((g) => g.jogos.every((j) => j.jogado));
}
