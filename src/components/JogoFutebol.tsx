import { useEffect, useRef, useState } from 'react';
import { getSelecao } from '../data/selecoes';
import type { Formacao, Mentalidade } from '../data/tipos';
import type { Marcador } from '../engine/motorPartida';
import { CAMPO_A, CAMPO_L, MotorFutebol } from '../engine/motorFutebol';
import { Botao } from './ui/Botao';

type Props = {
  casaId: string;
  foraId: string;
  idJogador: string;
  rotuloFase: string;
  formacaoJogador: Formacao;
  mentalidadeInicial: Mentalidade;
  isKnockout: boolean;
  onFim: (
    marcador: Marcador,
    info: { prolongamento: boolean; precisaPenaltis: boolean },
  ) => void;
};

const POT_MIN = 340;
const POT_MAX = 680;
const CARGA_MS = 700;
const MAX_DECISOES = 3;

export function JogoFutebol({
  casaId,
  foraId,
  idJogador,
  rotuloFase,
  formacaoJogador,
  mentalidadeInicial,
  isKnockout,
  onFim,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const motorRef = useRef<MotorFutebol | null>(null);
  const teclasRef = useRef<Set<string>>(new Set());
  const joystickRef = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
  const cargaInicioRef = useRef<number | null>(null);
  const finalizadoRef = useRef(false);
  const pausadoRef = useRef(false);
  const ultimoTRef = useRef(0);
  // Espelhos para evitar re-renders desnecessários.
  const placarRef = useRef({ j: 0, a: 0 });
  const minutoRef = useRef(0);
  const flashRef = useRef(false);

  const eu = getSelecao(idJogador);
  const advId = idJogador === casaId ? foraId : casaId;
  const adv = getSelecao(advId);

  const [placar, setPlacar] = useState({ j: 0, a: 0 });
  const [minuto, setMinuto] = useState(0);
  const [poderPct, setPoderPct] = useState(0);
  const [flash, setFlash] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [fimApito, setFimApito] = useState(false);
  const [mentalidade, setMentalidade] = useState<Mentalidade>(mentalidadeInicial);
  const [decisoes, setDecisoes] = useState(0);
  const [comecou, setComecou] = useState(false);

  // Cria o motor uma vez.
  if (!motorRef.current) {
    motorRef.current = new MotorFutebol(
      idJogador,
      advId,
      formacaoJogador,
      mentalidadeInicial,
    );
  }

  function dispararCarga() {
    const motor = motorRef.current;
    if (!motor || cargaInicioRef.current === null) return;
    const dur = Math.min(CARGA_MS, Date.now() - cargaInicioRef.current);
    const pct = dur / CARGA_MS;
    cargaInicioRef.current = null;
    setPoderPct(0);
    motor.chutarHumano(POT_MIN + pct * (POT_MAX - POT_MIN));
  }

  function iniciarCarga() {
    if (cargaInicioRef.current === null) cargaInicioRef.current = Date.now();
  }

  // Teclado.
  useEffect(() => {
    const teclasMov = ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'];
    const onDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (teclasMov.includes(k) || k === ' ') e.preventDefault();
      if (k === ' ') {
        iniciarCarga();
        return;
      }
      teclasRef.current.add(k);
    };
    const onUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === ' ') {
        dispararCarga();
        return;
      }
      teclasRef.current.delete(k);
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  // Ciclo de jogo (requestAnimationFrame).
  useEffect(() => {
    const canvas = canvasRef.current;
    const motor = motorRef.current;
    if (!canvas || !motor) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    ultimoTRef.current = performance.now();

    const loop = (t: number) => {
      const dt = (t - ultimoTRef.current) / 1000;
      ultimoTRef.current = t;

      if (!pausadoRef.current && comecou && !motor.terminado) {
        const teclas = teclasRef.current;
        const km = (a: string, b: string) => (teclas.has(a) || teclas.has(b) ? 1 : 0);
        let dx = km('arrowright', 'd') - km('arrowleft', 'a');
        let dy = km('arrowdown', 's') - km('arrowup', 'w');
        // Combina com o joystick tátil.
        dx += joystickRef.current.dx;
        dy += joystickRef.current.dy;
        motor.atualizar(dt, { dx, dy });
      }

      motor.render(ctx);

      // Sincroniza HUD.
      if (motor.placarJogador !== placarRef.current.j || motor.placarAdv !== placarRef.current.a) {
        placarRef.current = { j: motor.placarJogador, a: motor.placarAdv };
        setPlacar({ j: motor.placarJogador, a: motor.placarAdv });
      }
      if (motor.minuto !== minutoRef.current) {
        minutoRef.current = motor.minuto;
        setMinuto(motor.minuto);
      }
      const fl = motor.flashGolo > 0;
      if (fl !== flashRef.current) {
        flashRef.current = fl;
        setFlash(fl);
      }
      if (cargaInicioRef.current !== null) {
        const pct = Math.min(1, (Date.now() - cargaInicioRef.current) / CARGA_MS);
        setPoderPct(pct);
      }

      if (motor.terminado && !finalizadoRef.current) {
        finalizadoRef.current = true;
        setFimApito(true);
        window.setTimeout(() => terminarJogo(), 1600);
        return; // para o ciclo
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comecou]);

  function terminarJogo() {
    const motor = motorRef.current;
    if (!motor) return;
    const golosCasa = idJogador === casaId ? motor.placarJogador : motor.placarAdv;
    const golosFora = idJogador === casaId ? motor.placarAdv : motor.placarJogador;
    const precisaPenaltis = isKnockout && golosCasa === golosFora;
    onFim(
      {
        golosCasa,
        golosFora,
        amarelosCasa: 0,
        amarelosFora: 0,
        vermelhosCasa: 0,
        vermelhosFora: 0,
      },
      { prolongamento: false, precisaPenaltis },
    );
  }

  function alternarPausa() {
    pausadoRef.current = !pausadoRef.current;
    setPausado(pausadoRef.current);
  }

  function mudarMentalidade(m: Mentalidade) {
    if (decisoes >= MAX_DECISOES || m === mentalidade) return;
    motorRef.current?.definirMentalidade(m);
    setMentalidade(m);
    setDecisoes((d) => d + 1);
  }

  // Joystick tátil.
  const joyBaseRef = useRef<{ x: number; y: number } | null>(null);
  function joyDown(e: React.PointerEvent) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    joyBaseRef.current = { x: e.clientX, y: e.clientY };
  }
  function joyMove(e: React.PointerEvent) {
    if (!joyBaseRef.current) return;
    const dx = e.clientX - joyBaseRef.current.x;
    const dy = e.clientY - joyBaseRef.current.y;
    const mag = Math.hypot(dx, dy) || 1;
    const lim = Math.min(1, mag / 50);
    joystickRef.current = { dx: (dx / mag) * lim, dy: (dy / mag) * lim };
  }
  function joyUp(e: React.PointerEvent) {
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    joyBaseRef.current = null;
    joystickRef.current = { dx: 0, dy: 0 };
  }

  return (
    <div className="max-w-4xl mx-auto px-2 py-3">
      <p className="text-center text-amber-400 font-display font-bold tracking-widest text-xs mb-2">
        {rotuloFase.toUpperCase()}
      </p>

      {/* Placar + relógio */}
      <div className="flex items-center justify-center gap-3 sm:gap-6 mb-2">
        <Lado bandeira={eu.bandeira} nome={eu.nome} golos={placar.j} cor={eu.cor} destaque />
        <div className="text-center">
          <div className="inline-flex items-center gap-1 rounded-full bg-noite-950/80 px-3 py-1">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-sm text-white tabular-nums">{minuto}'</span>
          </div>
        </div>
        <Lado bandeira={adv.bandeira} nome={adv.nome} golos={placar.a} cor={adv.cor} />
      </div>

      {/* Campo */}
      <div className="relative rounded-xl overflow-hidden border border-white/15 select-none touch-none">
        <canvas
          ref={canvasRef}
          width={CAMPO_L}
          height={CAMPO_A}
          className="w-full h-auto block"
        />

        {/* Flash de golo */}
        {flash && (
          <div className="absolute inset-0 flex items-center justify-center bg-amber-400/30 animate-flash-golo pointer-events-none">
            <span className="font-display font-black text-5xl sm:text-7xl text-white text-sombra">
              GOLO!
            </span>
          </div>
        )}

        {/* Início */}
        {!comecou && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-noite-950/80 px-4 text-center">
            <h3 className="font-display font-black text-2xl text-white mb-2">
              Pronto para jogar?
            </h3>
            <p className="text-white/70 text-sm max-w-md mb-1">
              Controla o jogador com o <strong>anel amarelo</strong> (o mais perto da bola).
            </p>
            <p className="text-white/50 text-xs max-w-md mb-4">
              <span className="hidden sm:inline">
                Teclado: <strong>WASD / setas</strong> para mover, <strong>Espaço</strong>{' '}
                (segura para mais força) para rematar.
              </span>
              <span className="sm:hidden">
                Joystick à esquerda para mover, botão <strong>CHUTAR</strong> à direita
                (segura para mais força).
              </span>
            </p>
            <Botao tamanho="lg" onClick={() => setComecou(true)}>
              ▶ Apito inicial
            </Botao>
          </div>
        )}

        {/* Apito final */}
        {fimApito && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-noite-950/85">
            <p className="font-display font-black text-3xl text-white">Apito final!</p>
            <p className="text-amber-300 font-display font-bold text-2xl mt-1">
              {placar.j} - {placar.a}
            </p>
          </div>
        )}

        {/* Pausa */}
        {pausado && !fimApito && (
          <div className="absolute inset-0 flex items-center justify-center bg-noite-950/70">
            <p className="font-display font-black text-3xl text-white">⏸ Pausa</p>
          </div>
        )}

        {/* Controlos táteis */}
        {comecou && !fimApito && (
          <>
            <div
              onPointerDown={joyDown}
              onPointerMove={joyMove}
              onPointerUp={joyUp}
              onPointerCancel={joyUp}
              className="sm:hidden absolute bottom-3 left-3 w-28 h-28 rounded-full bg-white/10 border border-white/20 flex items-center justify-center"
            >
              <span className="w-10 h-10 rounded-full bg-white/30" />
            </div>
            <button
              onPointerDown={(e) => {
                e.preventDefault();
                iniciarCarga();
              }}
              onPointerUp={(e) => {
                e.preventDefault();
                dispararCarga();
              }}
              className="sm:hidden absolute bottom-5 right-4 w-24 h-24 rounded-full bg-amber-400 text-noite-950 font-display font-black text-lg active:scale-95"
            >
              CHUTAR
            </button>
          </>
        )}
      </div>

      {/* Barra de potência */}
      <div className="mt-2 h-3 rounded-full bg-noite-800 overflow-hidden border border-white/10">
        <div
          className="h-full bg-gradient-to-r from-amber-300 to-red-500 transition-[width] duration-75"
          style={{ width: `${poderPct * 100}%` }}
        />
      </div>

      {/* Controlos */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Botao tamanho="sm" variante="secundario" onClick={alternarPausa} disabled={!comecou || fimApito}>
            {pausado ? '▶ Retomar' : '⏸ Pausa'}
          </Botao>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40">Tática {decisoes}/{MAX_DECISOES}</span>
          {(['defensiva', 'equilibrada', 'ofensiva'] as Mentalidade[]).map((m) => {
            const ativo = mentalidade === m;
            const bloq = decisoes >= MAX_DECISOES && !ativo;
            return (
              <button
                key={m}
                onClick={() => mudarMentalidade(m)}
                disabled={bloq || fimApito}
                aria-pressed={ativo}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold capitalize border transition-all ${
                  ativo
                    ? 'border-amber-400 bg-amber-400/20 text-white'
                    : 'border-white/10 bg-noite-800/60 text-white/60 hover:border-white/30 disabled:opacity-30'
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Lado({
  bandeira,
  nome,
  golos,
  cor,
  destaque = false,
}: {
  bandeira: string;
  nome: string;
  golos: number;
  cor: string;
  destaque?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-3xl sm:text-4xl">{bandeira}</span>
      <div className={destaque ? 'text-left' : 'text-right'}>
        <p className="font-display font-bold text-white text-sm leading-none">{nome}</p>
        <p
          className="font-display font-black text-3xl tabular-nums leading-none mt-0.5"
          style={{ color: destaque ? cor === '#111111' ? '#fff' : cor : '#fff' }}
        >
          {golos}
        </p>
      </div>
    </div>
  );
}
