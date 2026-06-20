import { getSelecao } from '../data/selecoes';
import type { Formacao, Mentalidade } from '../data/tipos';
import { aleatorioInt, probabilidade } from './aleatorio';
import { narrar, type TipoEvento } from './narracao';

// ----- Ratings de ataque/defesa em função de formação e mentalidade -----

const MOD_FORMACAO: Record<Formacao, { ataque: number; defesa: number }> = {
  '4-3-3': { ataque: 4, defesa: -2 },
  '4-2-3-1': { ataque: 3, defesa: -1 },
  '4-4-2': { ataque: 1, defesa: 1 },
  '3-5-2': { ataque: 3, defesa: -3 },
  '5-3-2': { ataque: -3, defesa: 5 },
};

const MOD_MENTALIDADE: Record<Mentalidade, { ataque: number; defesa: number }> = {
  ofensiva: { ataque: 6, defesa: -5 },
  equilibrada: { ataque: 0, defesa: 0 },
  defensiva: { ataque: -5, defesa: 6 },
};

export type ConfigEquipa = {
  id: string;
  formacao?: Formacao;
  mentalidade?: Mentalidade;
  vantagemCampo?: boolean;
};

type Ratings = { ataque: number; defesa: number };

function ratings(cfg: ConfigEquipa): Ratings {
  const base = getSelecao(cfg.id).forca;
  const f = cfg.formacao ? MOD_FORMACAO[cfg.formacao] : { ataque: 0, defesa: 0 };
  const m = cfg.mentalidade ? MOD_MENTALIDADE[cfg.mentalidade] : { ataque: 0, defesa: 0 };
  const casa = cfg.vantagemCampo ? 2 : 0;
  return {
    ataque: base + f.ataque + m.ataque + casa,
    defesa: base + f.defesa + m.defesa + casa,
  };
}

// Golos esperados em 90 min de uma equipa face à defesa adversária.
function golosEsperados(ataque: number, defesaAdv: number): number {
  const exp = 1.25 + (ataque - defesaAdv) * 0.035;
  return Math.min(4.3, Math.max(0.2, exp));
}

// ----- Evento de uma partida -----

export type EventoPartida = {
  minuto: number;
  tipo: TipoEvento;
  equipaId?: string; // a equipa associada ao evento (quando aplicável)
  texto: string;
  golo: boolean;
  placar: string; // "1-0" no momento
};

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

// Probabilidades por minuto a partir das configurações das duas equipas.
export type TaxasMinuto = {
  goloCasa: number;
  goloFora: number;
};

export function calcularTaxas(
  casa: ConfigEquipa,
  fora: ConfigEquipa,
  totalMinutos = 90,
): TaxasMinuto {
  const rc = ratings(casa);
  const rf = ratings(fora);
  const expCasa = golosEsperados(rc.ataque, rf.defesa);
  const expFora = golosEsperados(rf.ataque, rc.defesa);
  return {
    goloCasa: expCasa / totalMinutos,
    goloFora: expFora / totalMinutos,
  };
}

// Simula um único minuto e devolve no máximo um evento (mantém o feed legível).
// `lado` indica de que equipa parte a jogada quando há evento.
export function simularMinuto(
  minuto: number,
  taxas: TaxasMinuto,
  casaId: string,
  foraId: string,
  marcador: Marcador,
): EventoPartida | null {
  const nomeCasa = getSelecao(casaId).nome;
  const nomeFora = getSelecao(foraId).nome;

  // Decide se há lance perigoso e de quem.
  const rollCasa = Math.random();
  const rollFora = Math.random();
  const lanceCasa = rollCasa < taxas.goloCasa * 4; // janela de oportunidade
  const lanceFora = rollFora < taxas.goloFora * 4;

  // Golos têm prioridade.
  if (rollCasa < taxas.goloCasa) {
    marcador.golosCasa += 1;
    return evento(minuto, 'golo', casaId, nomeCasa, true, marcador);
  }
  if (rollFora < taxas.goloFora) {
    marcador.golosFora += 1;
    return evento(minuto, 'golo', foraId, nomeFora, true, marcador);
  }

  // Cartões / lesões (raros).
  if (probabilidade(0.018)) {
    const ladoCasa = Math.random() < 0.5;
    if (probabilidade(0.12)) {
      if (ladoCasa) marcador.vermelhosCasa += 1;
      else marcador.vermelhosFora += 1;
      return evento(minuto, 'vermelho', ladoCasa ? casaId : foraId, ladoCasa ? nomeCasa : nomeFora, false, marcador);
    }
    if (ladoCasa) marcador.amarelosCasa += 1;
    else marcador.amarelosFora += 1;
    return evento(minuto, 'amarelo', ladoCasa ? casaId : foraId, ladoCasa ? nomeCasa : nomeFora, false, marcador);
  }
  if (probabilidade(0.006)) {
    const ladoCasa = Math.random() < 0.5;
    return evento(minuto, 'lesao', ladoCasa ? casaId : foraId, ladoCasa ? nomeCasa : nomeFora, false, marcador);
  }

  // Ocasiões e defesas.
  if (lanceCasa) {
    const tipo: TipoEvento = Math.random() < 0.5 ? 'ocasiao' : 'defesa';
    return evento(minuto, tipo, casaId, nomeCasa, false, marcador);
  }
  if (lanceFora) {
    const tipo: TipoEvento = Math.random() < 0.5 ? 'ocasiao' : 'defesa';
    return evento(minuto, tipo, foraId, nomeFora, false, marcador);
  }

  // Eventos neutros ocasionais para dar ritmo ao feed.
  if (probabilidade(0.1)) {
    const ladoCasa = Math.random() < 0.5;
    return evento(minuto, 'neutro', ladoCasa ? casaId : foraId, ladoCasa ? nomeCasa : nomeFora, false, marcador);
  }

  return null;
}

function evento(
  minuto: number,
  tipo: TipoEvento,
  equipaId: string,
  nome: string,
  golo: boolean,
  marcador: Marcador,
): EventoPartida {
  return {
    minuto,
    tipo,
    equipaId,
    texto: narrar(tipo, nome, minuto),
    golo,
    placar: `${marcador.golosCasa}-${marcador.golosFora}`,
  };
}

// ----- Simulação completa e instantânea (jogos de fundo / IA) -----

export type ResultadoSimulado = Marcador;

export function simularJogoCompleto(
  casa: ConfigEquipa,
  fora: ConfigEquipa,
  minutos = 90,
): ResultadoSimulado {
  const taxas = calcularTaxas(casa, fora, minutos);
  const marcador = marcadorVazio();
  for (let m = 1; m <= minutos; m++) {
    simularMinuto(m, taxas, casa.id, fora.id, marcador);
  }
  return marcador;
}

// Desempate na simulação instantânea de eliminatórias: devolve o vencedor.
// Aplica prolongamento; se persistir empate, decide por penáltis simulados.
export function simularEliminatoriaCompleta(
  casa: ConfigEquipa,
  fora: ConfigEquipa,
): {
  golosCasa: number;
  golosFora: number;
  penCasa?: number;
  penFora?: number;
  prolongamento: boolean;
  vencedorId: string;
} {
  const m = simularJogoCompleto(casa, fora, 90);
  if (m.golosCasa !== m.golosFora) {
    return {
      golosCasa: m.golosCasa,
      golosFora: m.golosFora,
      prolongamento: false,
      vencedorId: m.golosCasa > m.golosFora ? casa.id : fora.id,
    };
  }

  // Prolongamento (30 min).
  const taxasExtra = calcularTaxas(casa, fora, 90);
  let extraCasa = 0;
  let extraFora = 0;
  const tmp = marcadorVazio();
  for (let i = 0; i < 30; i++) {
    const antesC = tmp.golosCasa;
    const antesF = tmp.golosFora;
    simularMinuto(91 + i, taxasExtra, casa.id, fora.id, tmp);
    extraCasa += tmp.golosCasa - antesC;
    extraFora += tmp.golosFora - antesF;
  }
  const totalCasa = m.golosCasa + extraCasa;
  const totalFora = m.golosFora + extraFora;
  if (totalCasa !== totalFora) {
    return {
      golosCasa: totalCasa,
      golosFora: totalFora,
      prolongamento: true,
      vencedorId: totalCasa > totalFora ? casa.id : fora.id,
    };
  }

  // Penáltis simulados (jogos de IA — o do jogador é interativo no ecrã próprio).
  const { penCasa, penFora } = simularPenaltis(casa.id, fora.id);
  return {
    golosCasa: totalCasa,
    golosFora: totalFora,
    penCasa,
    penFora,
    prolongamento: true,
    vencedorId: penCasa > penFora ? casa.id : fora.id,
  };
}

function simularPenaltis(casaId: string, foraId: string): { penCasa: number; penFora: number } {
  const fc = getSelecao(casaId).forca;
  const ff = getSelecao(foraId).forca;
  const probCasa = 0.62 + (fc - ff) * 0.004;
  const probFora = 0.62 + (ff - fc) * 0.004;
  let penCasa = 0;
  let penFora = 0;
  for (let i = 0; i < 5; i++) {
    if (probabilidade(probCasa)) penCasa += 1;
    if (probabilidade(probFora)) penFora += 1;
  }
  // Morte súbita até desempatar.
  let voltas = 0;
  while (penCasa === penFora && voltas < 20) {
    const c = probabilidade(probCasa);
    const f = probabilidade(probFora);
    if (c) penCasa += 1;
    if (f) penFora += 1;
    voltas += 1;
  }
  if (penCasa === penFora) {
    // Salvaguarda: força um vencedor.
    if (probabilidade(0.5)) penCasa += 1;
    else penFora += 1;
  }
  return { penCasa, penFora };
}

// Pequeno utilitário usado pela UI para descrições de força do adversário.
export function rotuloForca(forca: number): string {
  if (forca >= 88) return 'Candidata ao título';
  if (forca >= 82) return 'Forte';
  if (forca >= 75) return 'Equilibrada';
  if (forca >= 68) return 'Acessível';
  return 'Frágil';
}

export { aleatorioInt };
