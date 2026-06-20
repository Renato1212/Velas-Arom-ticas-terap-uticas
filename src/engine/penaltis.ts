import { escolher, probabilidade } from './aleatorio';

// 6 zonas da baliza (2 linhas × 3 colunas).
export type Zona = 'ce' | 'cc' | 'cd' | 'be' | 'bc' | 'bd';
// c = cima, b = baixo; e = esquerda, c = centro, d = direita.

export const ZONAS: Zona[] = ['ce', 'cc', 'cd', 'be', 'bc', 'bd'];

export const ROTULO_ZONA: Record<Zona, string> = {
  ce: 'Canto superior esquerdo',
  cc: 'Meio alto',
  cd: 'Canto superior direito',
  be: 'Canto inferior esquerdo',
  bc: 'Rente ao chão (meio)',
  bd: 'Canto inferior direito',
};

const CANTOS: Zona[] = ['ce', 'cd', 'be', 'bd'];

export type ResultadoPenalti = 'golo' | 'defesa' | 'fora';

// O jogador remata: escolhe zona e tem uma precisão (0..1) vinda da barra de timing.
export function rematarJogador(
  zonaJogador: Zona,
  precisao: number,
  zonaGuardiao: Zona,
): ResultadoPenalti {
  if (precisao < 0.16) return 'fora';
  const mesmaZona = zonaJogador === zonaGuardiao;
  if (mesmaZona) {
    // Remate muito bem colocado num canto ainda pode bater o guardião.
    if (precisao > 0.86 && CANTOS.includes(zonaJogador) && probabilidade(0.4)) {
      return 'golo';
    }
    return 'defesa';
  }
  return 'golo';
}

// O guarda-redes adversário tenta adivinhar (ligeira preferência pelos cantos).
export function palpiteGuardiaoIA(): Zona {
  if (probabilidade(0.6)) return escolher(CANTOS);
  return escolher(ZONAS);
}

// O jogador defende: escolhe a zona para onde se atira; a IA remata.
export function defenderJogador(zonaDefesa: Zona, zonaRemateIA: Zona): ResultadoPenalti {
  if (probabilidade(0.06)) return 'fora'; // rematador falha a baliza
  if (zonaDefesa === zonaRemateIA) {
    // Cantos são mais difíceis de agarrar mesmo indo para o lado certo.
    const probDefesa = CANTOS.includes(zonaRemateIA) ? 0.7 : 0.9;
    return probabilidade(probDefesa) ? 'defesa' : 'golo';
  }
  return 'golo';
}

// A IA escolhe onde rematar (preferência por cantos).
export function remateGuardiaoIA(): Zona {
  if (probabilidade(0.62)) return escolher(CANTOS);
  return escolher(ZONAS);
}

const FRASES: Record<ResultadoPenalti, string[]> = {
  golo: ['Golo!', 'Lá dentro!', 'Não falhou!', 'Golaço!'],
  defesa: ['Defendeu!!', 'Que defesa!', 'Agarrou!', 'Travou o remate!'],
  fora: ['Para fora!', 'Falhou a baliza!', 'Por cima!', 'Ao lado!'],
};

export function frasePenalti(r: ResultadoPenalti): string {
  return escolher(FRASES[r]);
}

// Decide se a sequência terminou. Formato: 5 cada, depois morte súbita.
// `marcadosA`/`marcadosB` e `restantesA`/`restantesB` referem-se às 5 séries iniciais.
export function decidirFimPenaltis(
  golosA: number,
  golosB: number,
  batidosA: number,
  batidosB: number,
): { terminou: boolean; vencedor?: 'A' | 'B' } {
  const restantesA = Math.max(0, 5 - batidosA);
  const restantesB = Math.max(0, 5 - batidosB);

  if (batidosA <= 5 || batidosB <= 5) {
    // Durante as 5 séries: termina se a diferença for inalcançável.
    if (golosA > golosB + restantesB) return { terminou: true, vencedor: 'A' };
    if (golosB > golosA + restantesA) return { terminou: true, vencedor: 'B' };
  }

  // Morte súbita: ambos bateram o mesmo número (>=5) e há diferença.
  if (batidosA >= 5 && batidosB >= 5 && batidosA === batidosB) {
    if (golosA !== golosB) {
      return { terminou: true, vencedor: golosA > golosB ? 'A' : 'B' };
    }
  }

  return { terminou: false };
}
