import { useCallback, useEffect, useState } from 'react';
import type {
  Confronto,
  EstadoJogo,
  Formacao,
  Grupo,
  Mentalidade,
  RondaId,
} from '../data/tipos';
import { gerarSorteio, grupoDoJogador } from '../engine/sorteio';
import type { Marcador } from '../engine/motorPartida';
import {
  resolverEliminatoria,
  resolverJogo,
} from '../engine/resolverDeterministico';
import {
  avancarQuadro,
  calcularApuramento,
  confrontosDaRonda,
  montarQuadro,
} from '../engine/eliminatorias';

const CHAVE = 'copa2026:estado';
const VERSAO = 1;

// ---------- Persistência ----------

export function carregarEstado(): EstadoJogo | null {
  try {
    const cru = localStorage.getItem(CHAVE);
    if (!cru) return null;
    const obj = JSON.parse(cru) as EstadoJogo;
    if (obj.versao !== VERSAO) return null;
    return obj;
  } catch {
    return null;
  }
}

function guardarEstado(estado: EstadoJogo) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(estado));
  } catch {
    // localStorage indisponível — o jogo continua a funcionar em memória.
  }
}

export function existeSave(): boolean {
  return carregarEstado() !== null;
}

// ---------- Criação de um novo torneio ----------

function novoEstado(idJogador: string): EstadoJogo {
  const grupos = gerarSorteio(idJogador);
  simularJogosDeFundoGrupos(grupos, idJogador);
  return {
    versao: VERSAO,
    selecaoDoJogador: idJogador,
    grupos,
    faseAtual: 'grupos',
    quadro: [],
    formacaoJogador: '4-3-3',
    mentalidade: 'equilibrada',
    eliminado: false,
    campeao: undefined,
    estatisticas: {
      golosMarcadosJogador: 0,
      golosSofridosJogador: 0,
      jogosVencidos: 0,
      jogosEmpatados: 0,
      jogosPerdidos: 0,
    },
  };
}

// Simula todos os jogos de grupo que NÃO envolvem o jogador.
function simularJogosDeFundoGrupos(grupos: Grupo[], idJogador: string) {
  grupos.forEach((g) => {
    g.jogos.forEach((j) => {
      if (j.jogado) return;
      if (j.casaId === idJogador || j.foraId === idJogador) return;
      const r = resolverJogo(j.casaId, j.foraId);
      aplicarResultadoJogo(j, r);
    });
  });
}

function aplicarResultadoJogo(j: Grupo['jogos'][number], r: Marcador) {
  j.golosCasa = r.golosCasa;
  j.golosFora = r.golosFora;
  j.amarelosCasa = r.amarelosCasa;
  j.amarelosFora = r.amarelosFora;
  j.vermelhosCasa = r.vermelhosCasa;
  j.vermelhosFora = r.vermelhosFora;
  j.jogado = true;
}

// ---------- Hook principal ----------

export function useJogo() {
  const [estado, setEstado] = useState<EstadoJogo | null>(null);

  // Carrega um eventual save ao montar.
  useEffect(() => {
    setEstado(carregarEstado());
  }, []);

  // Guarda sempre que o estado muda.
  useEffect(() => {
    if (estado) guardarEstado(estado);
  }, [estado]);

  const novoTorneio = useCallback((idJogador: string) => {
    setEstado(novoEstado(idJogador));
  }, []);

  const continuar = useCallback(() => {
    const s = carregarEstado();
    if (s) setEstado(s);
  }, []);

  const recomecar = useCallback(() => {
    localStorage.removeItem(CHAVE);
    setEstado(null);
  }, []);

  const definirTatica = useCallback((formacao: Formacao, mentalidade: Mentalidade) => {
    setEstado((s) => (s ? { ...s, formacaoJogador: formacao, mentalidade } : s));
  }, []);

  // Regista o resultado de um jogo de grupo do jogador.
  const registarJogoGrupo = useCallback((marcador: Marcador) => {
    setEstado((s) => {
      if (!s) return s;
      const novo = clonar(s);
      const grupo = grupoDoJogador(novo.grupos, novo.selecaoDoJogador);
      const jogo = proximoJogoGrupo(grupo, novo.selecaoDoJogador);
      if (jogo) {
        aplicarResultadoJogo(jogo, marcador);
        atualizarEstatisticas(novo, jogo.casaId, jogo.golosCasa, jogo.golosFora);
      }
      // Se o jogador terminou os 3 jogos, fecha a fase de grupos.
      if (!proximoJogoGrupo(grupo, novo.selecaoDoJogador)) {
        fecharFaseGrupos(novo);
      }
      return novo;
    });
  }, []);

  // Regista o resultado do confronto de eliminatória do jogador e avança.
  const registarEliminatoria = useCallback(
    (resultado: {
      golosCasa: number;
      golosFora: number;
      penCasa?: number;
      penFora?: number;
      prolongamento: boolean;
    }) => {
      setEstado((s) => {
        if (!s) return s;
        const novo = clonar(s);
        concluirRondaJogador(novo, resultado);
        return novo;
      });
    },
    [],
  );

  return {
    estado,
    novoTorneio,
    continuar,
    recomecar,
    definirTatica,
    registarJogoGrupo,
    registarEliminatoria,
  };
}

// ---------- Lógica de progressão ----------

function clonar(s: EstadoJogo): EstadoJogo {
  return JSON.parse(JSON.stringify(s)) as EstadoJogo;
}

export function proximoJogoGrupo(grupo: Grupo, idJogador: string) {
  return grupo.jogos.find(
    (j) => !j.jogado && (j.casaId === idJogador || j.foraId === idJogador),
  );
}

function atualizarEstatisticas(
  estado: EstadoJogo,
  casaId: string,
  golosCasa: number,
  golosFora: number,
) {
  const ehCasa = casaId === estado.selecaoDoJogador;
  const marcados = ehCasa ? golosCasa : golosFora;
  const sofridos = ehCasa ? golosFora : golosCasa;
  estado.estatisticas.golosMarcadosJogador += marcados;
  estado.estatisticas.golosSofridosJogador += sofridos;
  if (marcados > sofridos) estado.estatisticas.jogosVencidos += 1;
  else if (marcados === sofridos) estado.estatisticas.jogosEmpatados += 1;
  else estado.estatisticas.jogosPerdidos += 1;
}

function fecharFaseGrupos(estado: EstadoJogo) {
  const quadro = montarQuadro(estado.grupos);
  estado.quadro = quadro;

  // O jogador apurou-se?
  const apurado = quadro.some(
    (c) => c.casaId === estado.selecaoDoJogador || c.foraId === estado.selecaoDoJogador,
  );

  if (!apurado) {
    estado.eliminado = true;
    estado.faseAtual = 'fim';
    return;
  }

  estado.faseAtual = 'r32';
  prepararRonda(estado, 'r32');
}

// Simula todos os confrontos da ronda que não envolvem o jogador.
function prepararRonda(estado: EstadoJogo, ronda: RondaId) {
  confrontosDaRonda(estado.quadro, ronda).forEach((c) => {
    if (c.jogado) return;
    if (!c.casaId || !c.foraId) return;
    if (c.casaId === estado.selecaoDoJogador || c.foraId === estado.selecaoDoJogador) return;
    simularConfrontoIA(c);
  });
}

function simularConfrontoIA(c: Confronto) {
  const r = resolverEliminatoria(c.casaId!, c.foraId!);
  c.golosCasa = r.golosCasa;
  c.golosFora = r.golosFora;
  c.penCasa = r.penCasa;
  c.penFora = r.penFora;
  c.prolongamento = r.prolongamento;
  c.vencedorId = r.vencedorId;
  c.jogado = true;
}

export function confrontoDoJogador(estado: EstadoJogo): Confronto | undefined {
  const ronda = estado.faseAtual;
  if (ronda === 'grupos' || ronda === 'fim') return undefined;
  return confrontosDaRonda(estado.quadro, ronda as RondaId).find(
    (c) =>
      !c.jogado &&
      (c.casaId === estado.selecaoDoJogador || c.foraId === estado.selecaoDoJogador),
  );
}

function concluirRondaJogador(
  estado: EstadoJogo,
  resultado: {
    golosCasa: number;
    golosFora: number;
    penCasa?: number;
    penFora?: number;
    prolongamento: boolean;
  },
) {
  const ronda = estado.faseAtual as RondaId;
  const confronto = confrontosDaRonda(estado.quadro, ronda).find(
    (c) =>
      !c.jogado &&
      (c.casaId === estado.selecaoDoJogador || c.foraId === estado.selecaoDoJogador),
  );
  if (!confronto) return;

  confronto.golosCasa = resultado.golosCasa;
  confronto.golosFora = resultado.golosFora;
  confronto.penCasa = resultado.penCasa;
  confronto.penFora = resultado.penFora;
  confronto.prolongamento = resultado.prolongamento;
  confronto.jogado = true;

  const venceuJogador = determinarVencedor(confronto) === estado.selecaoDoJogador;
  confronto.vencedorId = determinarVencedor(confronto);

  atualizarEstatisticas(
    estado,
    confronto.casaId!,
    resultado.golosCasa,
    resultado.golosFora,
  );

  // Garante que o resto da ronda também fica simulado.
  prepararRonda(estado, ronda);
  avancarQuadro(estado.quadro, ronda);

  decidirProximaFase(estado, ronda, venceuJogador);
}

function determinarVencedor(c: Confronto): string {
  if (c.penCasa !== undefined && c.penFora !== undefined) {
    return c.penCasa > c.penFora ? c.casaId! : c.foraId!;
  }
  return (c.golosCasa ?? 0) >= (c.golosFora ?? 0) ? c.casaId! : c.foraId!;
}

function decidirProximaFase(estado: EstadoJogo, ronda: RondaId, venceu: boolean) {
  if (ronda === 'r32' || ronda === 'r16' || ronda === 'quartos') {
    if (venceu) {
      const prox = ronda === 'r32' ? 'r16' : ronda === 'r16' ? 'quartos' : 'meias';
      estado.faseAtual = prox;
      prepararRonda(estado, prox);
    } else {
      estado.eliminado = true;
      estado.faseAtual = 'fim';
    }
    return;
  }

  if (ronda === 'meias') {
    if (venceu) {
      // Vai à final; o jogo do 3.º lugar (entre os outros) é simulado.
      estado.faseAtual = 'final';
      simularConfrontoSeNecessario(estado, 'terceiro');
      prepararRonda(estado, 'final');
    } else {
      // Disputa o 3.º lugar; a final (entre os outros) é simulada.
      estado.faseAtual = 'terceiro';
      simularConfrontoSeNecessario(estado, 'final');
      definirCampeaoFinal(estado);
    }
    return;
  }

  if (ronda === 'terceiro') {
    // O jogador disputou o 3.º lugar; a final já foi simulada.
    estado.faseAtual = 'fim';
    return;
  }

  if (ronda === 'final') {
    estado.faseAtual = 'fim';
    if (venceu) estado.campeao = estado.selecaoDoJogador;
    else definirCampeaoFinal(estado);
  }
}

function simularConfrontoSeNecessario(estado: EstadoJogo, ronda: RondaId) {
  const c = confrontosDaRonda(estado.quadro, ronda)[0];
  if (c && !c.jogado && c.casaId && c.foraId) {
    simularConfrontoIA(c);
  }
}

function definirCampeaoFinal(estado: EstadoJogo) {
  const final = confrontosDaRonda(estado.quadro, 'final')[0];
  if (final?.vencedorId) {
    estado.campeao = final.vencedorId;
  } else if (final?.jogado) {
    estado.campeao = determinarVencedor(final);
  }
}

export { calcularApuramento };
