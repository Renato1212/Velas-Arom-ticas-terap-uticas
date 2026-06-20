import { escolher } from './aleatorio';

// Banco variado de frases de narração em português de Portugal.
// {S} é substituído pelo nome da seleção; {M} pelo minuto.

const GOLO = [
  'Minuto {M} — GOLOOO de {S}! Que finalização de classe!',
  'Minuto {M} — {S} marca! O guarda-redes nada pôde fazer!',
  'Minuto {M} — Está lá dentro! {S} festeja um golão!',
  'Minuto {M} — Que jogada de {S}! Bola no fundo das redes!',
  'Minuto {M} — GOLO de {S}! O estádio veio abaixo!',
  'Minuto {M} — Cabeceamento certeiro e {S} faz o golo!',
  'Minuto {M} — Remate colocado ao ângulo — {S} não perdoa!',
  'Minuto {M} — Contra-ataque fulminante e {S} dilata a vantagem!',
];

const OCASIAO = [
  'Minuto {M} — {S} perdoa uma ocasião soberana!',
  'Minuto {M} — Que falhanço de {S}! A bola passou ao lado do poste.',
  'Minuto {M} — {S} esteve mesmo perto, mas a bola saiu por cima!',
  'Minuto {M} — Remate de {S} a rasar o poste! Por pouco.',
  'Minuto {M} — Grande oportunidade desperdiçada por {S}.',
  'Minuto {M} — {S} chega com perigo, mas falta a pontaria.',
];

const DEFESA = [
  'Minuto {M} — Que defesa do guarda-redes! Negou o golo a {S}.',
  'Minuto {M} — Enorme intervenção! O guardião trava {S}.',
  'Minuto {M} — Defesa espetacular a parar o remate de {S}!',
  'Minuto {M} — O guarda-redes voa e impede o golo de {S}!',
];

const AMARELO = [
  'Minuto {M} — Cartão amarelo para {S}. Entrada dura.',
  'Minuto {M} — Amarelo mostrado a {S} pelo árbitro.',
  'Minuto {M} — {S} vê o amarelo após falta tática.',
  'Minuto {M} — Advertência amarela para um jogador de {S}.',
];

const VERMELHO = [
  'Minuto {M} — VERMELHO! {S} fica reduzida a dez!',
  'Minuto {M} — Expulsão! {S} perde um jogador.',
  'Minuto {M} — Cartão vermelho direto para {S}. Que reviravolta!',
];

const LESAO = [
  'Minuto {M} — Lesão preocupante num jogador de {S}.',
  'Minuto {M} — {S} obrigada a parar — jogador no relvado.',
  'Minuto {M} — Assistência médica a um atleta de {S}.',
];

const NEUTRO = [
  'Minuto {M} — {S} controla a posse de bola a meio-campo.',
  'Minuto {M} — Jogo equilibrado, ninguém arrisca demasiado.',
  'Minuto {M} — {S} pressiona em busca do espaço.',
  'Minuto {M} — Troca de passes pacientes de {S}.',
  'Minuto {M} — O ritmo abranda no meio-campo.',
];

export type TipoEvento =
  | 'golo'
  | 'ocasiao'
  | 'defesa'
  | 'amarelo'
  | 'vermelho'
  | 'lesao'
  | 'neutro'
  | 'apito'
  | 'sistema';

const BANCOS: Record<Exclude<TipoEvento, 'apito' | 'sistema'>, string[]> = {
  golo: GOLO,
  ocasiao: OCASIAO,
  defesa: DEFESA,
  amarelo: AMARELO,
  vermelho: VERMELHO,
  lesao: LESAO,
  neutro: NEUTRO,
};

export function narrar(tipo: TipoEvento, nomeSelecao: string, minuto: number): string {
  if (tipo === 'apito' || tipo === 'sistema') return '';
  const modelo = escolher(BANCOS[tipo]);
  return modelo.replace('{S}', nomeSelecao).replace('{M}', String(minuto));
}
