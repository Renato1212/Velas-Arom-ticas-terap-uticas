import { getSelecao } from '../data/selecoes';
import type { Formacao, Mentalidade } from '../data/tipos';

// Motor de futebol 2D em tempo real (vista de topo).
// Sem aleatoriedade no jogo do jogador: o resultado depende do que o jogador faz.
// O lado 'jogador' ataca para a DIREITA; o 'adversario' ataca para a ESQUERDA.

export const CAMPO_L = 1050;
export const CAMPO_A = 680;
const GOLO_TOP = 250;
const GOLO_BOT = 430;

const RAIO_ATLETA = 15;
const RAIO_BOLA = 9;
const RAIO_CONTROLO = 34; // distância a que um atleta domina a bola
const RAIO_ROUBO = 28; // distância a que um adversário pode roubar
const DIST_DRIBLE = 26; // a bola fica à frente do dono a esta distância

const DURACAO_JOGO = 80; // segundos reais (mostrados como 0'–90')
const PAUSA_GOLO = 1.4; // segundos de celebração após golo

export type Lado = 'jogador' | 'adversario';
export type Papel = 'GR' | 'DEF' | 'MID' | 'ATA';

export interface Atleta {
  x: number;
  y: number;
  vx: number;
  vy: number;
  lado: Lado;
  papel: Papel;
  numero: number;
  baseX: number; // posição-base (formação) em coordenadas do mundo
  baseY: number;
  faceX: number; // direção para onde está virado
  faceY: number;
}

export interface Bola {
  x: number;
  y: number;
  vx: number;
  vy: number;
  dono: Atleta | null;
  travaChute: number; // impede o rematador de recuperar logo a bola
  ultimoDono: Atleta | null;
}

export type Entrada = { dx: number; dy: number };

function dist(ax: number, ay: number, bx: number, by: number): number {
  return Math.hypot(ax - bx, ay - by);
}
function clamp(v: number, a: number, b: number): number {
  return Math.max(a, Math.min(b, v));
}

export class MotorFutebol {
  atletas: Atleta[] = [];
  bola: Bola;
  placarJogador = 0;
  placarAdv = 0;
  tempoRestante = DURACAO_JOGO;
  terminado = false;

  pausaGolo = 0;
  ultimoGolo: Lado | null = null;
  flashGolo = 0;

  private velJogador: number;
  private velAdv: number;
  private mentalidade: Mentalidade;
  private controladoAtual: Atleta | null = null;
  private travaPosse = 0;

  readonly idJogador: string;
  readonly idAdv: string;

  constructor(
    idJogador: string,
    idAdv: string,
    formacao: Formacao,
    mentalidade: Mentalidade,
  ) {
    this.idJogador = idJogador;
    this.idAdv = idAdv;
    this.mentalidade = mentalidade;
    const fJog = getSelecao(idJogador).forca;
    const fAdv = getSelecao(idAdv).forca;
    // Velocidade depende (deterministicamente) da força — adversários fortes são
    // mais difíceis, mas batíveis com boa jogada. Não há sorte envolvida.
    this.velJogador = 210 + (fJog - 70) * 1.3;
    this.velAdv = 205 + (fAdv - 70) * 1.35;

    this.criarEquipas(formacao);
    this.bola = {
      x: CAMPO_L / 2,
      y: CAMPO_A / 2,
      vx: 0,
      vy: 0,
      dono: null,
      travaChute: 0,
      ultimoDono: null,
    };
  }

  // ---- Construção das equipas ----

  private slotsFormacao(formacao: Formacao): { x: number; y: number; papel: Papel }[] {
    // Posições normalizadas (0..1) no campo, na orientação a atacar para a direita.
    // 5 jogadores: 1 GR + 4 de campo.
    const ment = this.mentalidade;
    const empurra = ment === 'ofensiva' ? 0.1 : ment === 'defensiva' ? -0.1 : 0;
    let defX = 0.28;
    let midX = 0.5;
    let ataX = 0.72;
    if (formacao === '5-3-2') {
      defX = 0.22;
      ataX = 0.64;
    } else if (formacao === '4-3-3') {
      ataX = 0.78;
    } else if (formacao === '3-5-2') {
      midX = 0.54;
      defX = 0.3;
    } else if (formacao === '4-2-3-1') {
      midX = 0.46;
      ataX = 0.76;
    }
    return [
      { x: 0.06, y: 0.5, papel: 'GR' },
      { x: clamp(defX + empurra, 0.1, 0.9), y: 0.3, papel: 'DEF' },
      { x: clamp(defX + empurra, 0.1, 0.9), y: 0.7, papel: 'DEF' },
      { x: clamp(midX + empurra, 0.1, 0.9), y: 0.5, papel: 'MID' },
      { x: clamp(ataX + empurra, 0.1, 0.92), y: 0.5, papel: 'ATA' },
    ];
  }

  private criarEquipas(formacao: Formacao) {
    this.atletas = [];
    const slots = this.slotsFormacao(formacao);
    // Jogador: ataca para a direita → posição-base = slot direto.
    slots.forEach((s, i) => {
      this.atletas.push(this.novoAtleta('jogador', s.papel, i + 1, s.x * CAMPO_L, s.y * CAMPO_A));
    });
    // Adversário: ataca para a esquerda → espelha x e usa formação equilibrada.
    const slotsAdv = this.slotsFormacao('4-3-3');
    slotsAdv.forEach((s, i) => {
      const x = (1 - s.x) * CAMPO_L;
      this.atletas.push(this.novoAtleta('adversario', s.papel, i + 1, x, s.y * CAMPO_A));
    });
  }

  private novoAtleta(
    lado: Lado,
    papel: Papel,
    numero: number,
    x: number,
    y: number,
  ): Atleta {
    return {
      x,
      y,
      vx: 0,
      vy: 0,
      lado,
      papel,
      numero,
      baseX: x,
      baseY: y,
      faceX: lado === 'jogador' ? 1 : -1,
      faceY: 0,
    };
  }

  private reporPosicoes() {
    this.atletas.forEach((a) => {
      a.x = a.baseX;
      a.y = a.baseY;
      a.vx = 0;
      a.vy = 0;
    });
    this.bola.x = CAMPO_L / 2;
    this.bola.y = CAMPO_A / 2;
    this.bola.vx = 0;
    this.bola.vy = 0;
    this.bola.dono = null;
    this.bola.ultimoDono = null;
    this.bola.travaChute = 0;
    this.travaPosse = 0.3;
  }

  definirMentalidade(m: Mentalidade) {
    this.mentalidade = m;
    const empurra = m === 'ofensiva' ? 0.1 : m === 'defensiva' ? -0.1 : 0;
    // Ajusta as posições-base dos jogadores de campo do utilizador.
    this.atletas
      .filter((a) => a.lado === 'jogador' && a.papel !== 'GR')
      .forEach((a) => {
        const baseNorm =
          a.papel === 'DEF' ? 0.28 : a.papel === 'MID' ? 0.5 : 0.72;
        a.baseX = clamp(baseNorm + empurra, 0.1, 0.92) * CAMPO_L;
      });
  }

  // O atleta do jogador atualmente controlado (o mais perto da bola, com histerese).
  get controlado(): Atleta | null {
    return this.controladoAtual;
  }

  get minuto(): number {
    return Math.min(90, Math.floor((1 - this.tempoRestante / DURACAO_JOGO) * 90));
  }

  private atualizarControlado() {
    const candidatos = this.atletas.filter(
      (a) => a.lado === 'jogador' && a.papel !== 'GR',
    );
    let melhor = candidatos[0];
    let melhorD = Infinity;
    candidatos.forEach((a) => {
      const d = dist(a.x, a.y, this.bola.x, this.bola.y);
      if (d < melhorD) {
        melhorD = d;
        melhor = a;
      }
    });
    // Histerese: só troca se o novo estiver claramente mais perto.
    if (!this.controladoAtual) {
      this.controladoAtual = melhor;
      return;
    }
    if (this.bola.dono === this.controladoAtual) return; // mantém quem tem a bola
    const dAtual = dist(
      this.controladoAtual.x,
      this.controladoAtual.y,
      this.bola.x,
      this.bola.y,
    );
    if (melhor !== this.controladoAtual && melhorD < dAtual - 25) {
      this.controladoAtual = melhor;
    }
  }

  // ---- Ciclo principal ----

  atualizar(dt: number, entrada: Entrada) {
    dt = Math.min(dt, 0.05);
    if (this.terminado) return;

    this.flashGolo = Math.max(0, this.flashGolo - dt);

    if (this.pausaGolo > 0) {
      this.pausaGolo -= dt;
      if (this.pausaGolo <= 0) this.reporPosicoes();
      return;
    }

    this.tempoRestante -= dt;
    if (this.tempoRestante <= 0) {
      this.tempoRestante = 0;
      this.terminado = true;
      return;
    }

    if (this.travaPosse > 0) this.travaPosse -= dt;
    if (this.bola.travaChute > 0) this.bola.travaChute -= dt;

    this.atualizarControlado();

    // Movimento de cada atleta.
    this.atletas.forEach((a) => {
      if (a === this.controladoAtual) {
        this.moverControlado(a, entrada, dt);
      } else {
        this.moverIA(a, dt);
      }
    });

    this.resolverPosse();
    this.integrarBola(dt);
  }

  private moverControlado(a: Atleta, entrada: Entrada, dt: number) {
    const mag = Math.hypot(entrada.dx, entrada.dy);
    if (mag > 0.01) {
      const nx = entrada.dx / mag;
      const ny = entrada.dy / mag;
      a.vx = nx * this.velJogador;
      a.vy = ny * this.velJogador;
      a.faceX = nx;
      a.faceY = ny;
    } else {
      a.vx = 0;
      a.vy = 0;
    }
    this.integrarAtleta(a, dt);
  }

  private velDe(a: Atleta): number {
    return a.lado === 'jogador' ? this.velJogador : this.velAdv;
  }

  private goloAtacado(lado: Lado): { x: number; y: number } {
    // Jogador ataca à direita; adversário à esquerda.
    return lado === 'jogador'
      ? { x: CAMPO_L, y: CAMPO_A / 2 }
      : { x: 0, y: CAMPO_A / 2 };
  }
  private moverIA(a: Atleta, dt: number) {
    const b = this.bola;
    const vel = this.velDe(a);

    if (a.papel === 'GR') {
      this.moverGuardaRedes(a, dt);
      return;
    }

    const equipaTemBola = b.dono !== null && b.dono.lado === a.lado;
    // O "perseguidor" da IA exclui o atleta controlado pelo humano, para que
    // exista sempre pressão defensiva mesmo que o jogador esteja parado.
    const chaser = this.maisPertoDaBolaIA(a.lado);

    let alvoX: number;
    let alvoY: number;

    if (b.dono === a) {
      // Tem a bola: dribla para a baliza adversária.
      const golo = this.goloAtacado(a.lado);
      alvoX = golo.x;
      alvoY = b.y + (golo.y - b.y) * 0.3;
      // Remata se estiver em zona de finalização.
      if (this.emZonaDeRemate(a)) {
        this.iaRemata(a);
        return;
      }
    } else if (!equipaTemBola && a === chaser) {
      // Sem posse e é o mais perto: vai à bola.
      alvoX = b.x;
      alvoY = b.y;
    } else if (equipaTemBola && a.papel === 'ATA') {
      // Apoia o ataque, fazendo profundidade.
      const golo = this.goloAtacado(a.lado);
      alvoX = (a.baseX + golo.x) / 2;
      alvoY = clamp(b.y + (a.numero % 2 === 0 ? 90 : -90), 60, CAMPO_A - 60);
    } else {
      // Posição dinâmica: base deslocada na direção da bola, dentro da sua zona.
      alvoX = a.baseX + (b.x - a.baseX) * 0.25;
      alvoY = a.baseY + (b.y - a.baseY) * 0.45;
    }

    this.acelerarPara(a, alvoX, alvoY, vel, dt);
  }

  private moverGuardaRedes(a: Atleta, dt: number) {
    const b = this.bola;
    const linhaX = a.lado === 'jogador' ? 40 : CAMPO_L - 40;
    const alvoY = clamp(b.y, GOLO_TOP + 10, GOLO_BOT - 10);
    // Sai um pouco da linha se a bola se aproxima da baliza.
    const dBola = Math.abs(b.x - linhaX);
    const saida = dBola < 220 ? clamp((220 - dBola) / 4, 0, 45) : 0;
    const alvoX = a.lado === 'jogador' ? linhaX + saida : linhaX - saida;
    this.acelerarPara(a, alvoX, alvoY, this.velDe(a) * 0.95, dt);

    // Se o GR tem a bola, descarrega para a frente (de forma determinística).
    if (b.dono === a) {
      const golo = this.goloAtacado(a.lado);
      const dx = golo.x - a.x;
      const dy = (a.y < CAMPO_A / 2 ? 1 : -1) * 130;
      this.chutarBola(a, dx, dy, 520);
    }
  }

  private acelerarPara(
    a: Atleta,
    alvoX: number,
    alvoY: number,
    vel: number,
    dt: number,
  ) {
    const dx = alvoX - a.x;
    const dy = alvoY - a.y;
    const d = Math.hypot(dx, dy);
    if (d < 4) {
      a.vx = 0;
      a.vy = 0;
    } else {
      a.vx = (dx / d) * vel;
      a.vy = (dy / d) * vel;
      a.faceX = dx / d;
      a.faceY = dy / d;
    }
    this.integrarAtleta(a, dt);
  }

  private integrarAtleta(a: Atleta, dt: number) {
    a.x = clamp(a.x + a.vx * dt, RAIO_ATLETA, CAMPO_L - RAIO_ATLETA);
    a.y = clamp(a.y + a.vy * dt, RAIO_ATLETA, CAMPO_A - RAIO_ATLETA);
  }

  // Mais perto da bola entre os atletas geridos pela IA (exclui GR e o
  // jogador controlado pelo humano, que se gere a si próprio).
  private maisPertoDaBolaIA(lado: Lado): Atleta | null {
    let melhor: Atleta | null = null;
    let melhorD = Infinity;
    this.atletas.forEach((a) => {
      if (a.lado !== lado) return;
      if (a.papel === 'GR') return;
      if (a === this.controladoAtual) return;
      const d = dist(a.x, a.y, this.bola.x, this.bola.y);
      if (d < melhorD) {
        melhorD = d;
        melhor = a;
      }
    });
    return melhor;
  }

  private emZonaDeRemate(a: Atleta): boolean {
    const golo = this.goloAtacado(a.lado);
    return dist(a.x, a.y, golo.x, golo.y) < 250;
  }

  private iaRemata(a: Atleta) {
    const golo = this.goloAtacado(a.lado);
    // Aponta para o canto mais longe do guarda-redes adversário.
    const grAdv = this.atletas.find(
      (o) => o.papel === 'GR' && o.lado !== a.lado,
    );
    let alvoY = golo.y;
    if (grAdv) {
      alvoY = grAdv.y > CAMPO_A / 2 ? GOLO_TOP + 25 : GOLO_BOT - 25;
    }
    const dx = golo.x - a.x;
    const dy = alvoY - a.y;
    this.chutarBola(a, dx, dy, 600);
  }

  // Remate do jogador humano (chamado ao largar o botão de chuto).
  chutarHumano(potencia: number): boolean {
    const a = this.controladoAtual;
    if (!a || this.bola.dono !== a) return false;
    const fx = a.faceX || (a.lado === 'jogador' ? 1 : -1);
    const fy = a.faceY;
    this.chutarBola(a, fx, fy, potencia);
    return true;
  }

  private chutarBola(a: Atleta, dx: number, dy: number, potencia: number) {
    const d = Math.hypot(dx, dy) || 1;
    this.bola.vx = (dx / d) * potencia;
    this.bola.vy = (dy / d) * potencia;
    this.bola.dono = null;
    this.bola.ultimoDono = a;
    this.bola.travaChute = 0.25;
  }

  private resolverPosse() {
    const b = this.bola;
    // Mais perto dentro do raio de controlo.
    let maisPerto: Atleta | null = null;
    let maisPertoD = Infinity;
    this.atletas.forEach((a) => {
      const alcance = a.papel === 'GR' ? RAIO_CONTROLO + 8 : RAIO_CONTROLO;
      const d = dist(a.x, a.y, b.x, b.y);
      if (d < alcance && d < maisPertoD) {
        maisPertoD = d;
        maisPerto = a;
      }
    });

    if (b.dono) {
      if (this.travaPosse > 0) return;
      // Tentativa de roubo por um adversário do dono.
      let ladrao: Atleta | null = null;
      let ladraoD = Infinity;
      this.atletas.forEach((a) => {
        if (a.lado === b.dono!.lado) return;
        const d = dist(a.x, a.y, b.x, b.y);
        if (d < RAIO_ROUBO && d < ladraoD) {
          ladraoD = d;
          ladrao = a;
        }
      });
      const donoD = dist(b.dono.x, b.dono.y, b.x, b.y);
      if (ladrao && ladraoD < donoD) {
        b.dono = ladrao;
        this.travaPosse = 0.22;
      }
    } else if (maisPerto) {
      // Bola solta: o mais perto domina (exceto o rematador durante a trava).
      if (b.travaChute > 0 && maisPerto === b.ultimoDono) return;
      b.dono = maisPerto;
      this.travaPosse = 0.18;
    }
  }

  private integrarBola(dt: number) {
    const b = this.bola;
    if (b.dono) {
      // Cola-se à frente do dono, na direção a que este está virado.
      const fx = b.dono.faceX || (b.dono.lado === 'jogador' ? 1 : -1);
      const fy = b.dono.faceY;
      const fm = Math.hypot(fx, fy) || 1;
      b.x = b.dono.x + (fx / fm) * DIST_DRIBLE;
      b.y = b.dono.y + (fy / fm) * DIST_DRIBLE;
      b.vx = 0;
      b.vy = 0;
      b.x = clamp(b.x, RAIO_BOLA, CAMPO_L - RAIO_BOLA);
      b.y = clamp(b.y, RAIO_BOLA, CAMPO_A - RAIO_BOLA);
      return;
    }

    b.x += b.vx * dt;
    b.y += b.vy * dt;
    const amort = Math.exp(-1.8 * dt);
    b.vx *= amort;
    b.vy *= amort;

    // Ressalta no topo e fundo.
    if (b.y < RAIO_BOLA) {
      b.y = RAIO_BOLA;
      b.vy = Math.abs(b.vy);
    } else if (b.y > CAMPO_A - RAIO_BOLA) {
      b.y = CAMPO_A - RAIO_BOLA;
      b.vy = -Math.abs(b.vy);
    }

    const naBaliza = b.y > GOLO_TOP && b.y < GOLO_BOT;

    // Linha da esquerda (baliza do jogador).
    if (b.x < RAIO_BOLA) {
      if (naBaliza) {
        this.marcar('adversario');
        return;
      }
      b.x = RAIO_BOLA;
      b.vx = Math.abs(b.vx);
    }
    // Linha da direita (baliza do adversário).
    if (b.x > CAMPO_L - RAIO_BOLA) {
      if (naBaliza) {
        this.marcar('jogador');
        return;
      }
      b.x = CAMPO_L - RAIO_BOLA;
      b.vx = -Math.abs(b.vx);
    }
  }

  private marcar(quem: Lado) {
    if (quem === 'jogador') this.placarJogador += 1;
    else this.placarAdv += 1;
    this.ultimoGolo = quem;
    this.pausaGolo = PAUSA_GOLO;
    this.flashGolo = 1;
    this.bola.dono = null;
    this.bola.vx = 0;
    this.bola.vy = 0;
  }

  // ---- Render ----
  render(ctx: CanvasRenderingContext2D) {
    const corCasa = getSelecao(this.idJogador).cor;
    const corAdv = getSelecao(this.idAdv).cor;

    // Relva com riscas.
    ctx.fillStyle = '#0e5128';
    ctx.fillRect(0, 0, CAMPO_L, CAMPO_A);
    const faixas = 10;
    for (let i = 0; i < faixas; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#13652f' : '#0e5128';
      ctx.fillRect((i * CAMPO_L) / faixas, 0, CAMPO_L / faixas, CAMPO_A);
    }

    // Linhas.
    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    ctx.lineWidth = 3;
    ctx.strokeRect(12, 12, CAMPO_L - 24, CAMPO_A - 24);
    ctx.beginPath();
    ctx.moveTo(CAMPO_L / 2, 12);
    ctx.lineTo(CAMPO_L / 2, CAMPO_A - 12);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(CAMPO_L / 2, CAMPO_A / 2, 70, 0, Math.PI * 2);
    ctx.stroke();

    // Áreas e balizas.
    this.desenharBaliza(ctx, true);
    this.desenharBaliza(ctx, false);

    // Atletas.
    this.atletas.forEach((a) => {
      const cor = a.lado === 'jogador' ? corCasa : corAdv;
      const ehControlado = a === this.controladoAtual;
      if (ehControlado) {
        ctx.beginPath();
        ctx.arc(a.x, a.y, RAIO_ATLETA + 6, 0, Math.PI * 2);
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(a.x, a.y, RAIO_ATLETA, 0, Math.PI * 2);
      ctx.fillStyle = a.papel === 'GR' ? '#f59e0b' : cor;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(0,0,0,0.4)';
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(a.numero), a.x, a.y);
    });

    // Bola.
    ctx.beginPath();
    ctx.arc(this.bola.x, this.bola.y, RAIO_BOLA, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#1f2937';
    ctx.stroke();
  }

  private desenharBaliza(ctx: CanvasRenderingContext2D, esquerda: boolean) {
    const x = esquerda ? 12 : CAMPO_L - 12;
    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    ctx.lineWidth = 3;
    // Área.
    const larguraArea = 150;
    const alturaArea = 320;
    const ax = esquerda ? 12 : CAMPO_L - 12 - larguraArea;
    ctx.strokeRect(ax, (CAMPO_A - alturaArea) / 2, larguraArea, alturaArea);
    // Postes.
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(x, GOLO_TOP);
    ctx.lineTo(x, GOLO_BOT);
    ctx.stroke();
  }
}
