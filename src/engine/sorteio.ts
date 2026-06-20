import { obterPotes } from '../data/potes';
import type { Grupo, Jogo } from '../data/tipos';
import { baralhar } from './aleatorio';

const LETRAS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

// Gera os 6 jogos (todos-contra-todos) de um grupo de 4 equipas.
function gerarJogosGrupo(equipas: string[]): Jogo[] {
  const jogos: Jogo[] = [];
  for (let i = 0; i < equipas.length; i++) {
    for (let j = i + 1; j < equipas.length; j++) {
      jogos.push({
        casaId: equipas[i],
        foraId: equipas[j],
        golosCasa: 0,
        golosFora: 0,
        amarelosCasa: 0,
        amarelosFora: 0,
        vermelhosCasa: 0,
        vermelhosFora: 0,
        jogado: false,
      });
    }
  }
  return jogos;
}

// Sorteia 12 grupos de 4, um de cada pote, garantindo que a seleção do jogador
// fica colocada (para que o jogo funcione sempre).
export function gerarSorteio(idJogador: string): Grupo[] {
  const [p1, p2, p3, p4] = obterPotes().map((p) => baralhar(p));

  const grupos: Grupo[] = LETRAS.map((letra) => ({
    letra,
    equipas: [],
    jogos: [],
  }));

  const potes = [p1, p2, p3, p4];
  potes.forEach((pote) => {
    pote.forEach((selecao, idx) => {
      grupos[idx].equipas.push(selecao.id);
    });
  });

  // Garante que a seleção do jogador aparece (caso a lista mude e algo falhe,
  // não quebra; em condições normais já está sempre colocada).
  const jaColocado = grupos.some((g) => g.equipas.includes(idJogador));
  if (!jaColocado) {
    grupos[0].equipas[grupos[0].equipas.length - 1] = idJogador;
  }

  grupos.forEach((g) => {
    g.jogos = gerarJogosGrupo(g.equipas);
  });

  return grupos;
}

export function grupoDoJogador(grupos: Grupo[], idJogador: string): Grupo {
  return grupos.find((g) => g.equipas.includes(idJogador)) ?? grupos[0];
}
