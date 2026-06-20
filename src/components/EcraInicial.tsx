import { useMemo, useState } from 'react';
import { SELECOES } from '../data/selecoes';
import { Botao } from './ui/Botao';
import { BarraForca } from './ui/Bandeira';
import { rotuloForca } from '../engine/motorPartida';

type Props = {
  temSave: boolean;
  onNovo: (idJogador: string) => void;
  onContinuar: () => void;
  onRecomecar: () => void;
};

export function EcraInicial({ temSave, onNovo, onContinuar, onRecomecar }: Props) {
  const [vista, setVista] = useState<'menu' | 'escolher'>('menu');
  const [selecionado, setSelecionado] = useState<string | null>(null);

  const ordenadas = useMemo(
    () => [...SELECOES].sort((a, b) => b.forca - a.forca),
    [],
  );

  if (vista === 'menu') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-relva-900 via-noite-900 to-noite-950">
        <div className="text-center max-w-2xl animate-fade-up">
          <p className="text-amber-400 font-display font-bold tracking-[0.3em] text-sm sm:text-base">
            COPA 2026
          </p>
          <h1 className="mt-3 font-display font-black text-5xl sm:text-7xl leading-none text-white text-sombra">
            Caminho para
            <br />a Glória
          </h1>
          <p className="mt-6 text-white/70 text-lg">
            Escolhe a tua seleção, define a tática e leva-a do sorteio até erguer o
            troféu. 48 seleções, 12 grupos, um só campeão.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Botao tamanho="lg" onClick={() => setVista('escolher')}>
              ⚽ Novo Torneio
            </Botao>
            {temSave && (
              <Botao tamanho="lg" variante="secundario" onClick={onContinuar}>
                ▶ Continuar
              </Botao>
            )}
          </div>

          {temSave && (
            <button
              onClick={() => {
                if (confirm('Tens a certeza? Isto apaga o torneio guardado.')) {
                  onRecomecar();
                }
              }}
              className="mt-6 text-sm text-white/40 hover:text-white/70 underline"
            >
              Apagar torneio guardado
            </button>
          )}
        </div>

        <footer className="mt-16 text-center text-white/30 text-xs">
          Anfitriões: Estados Unidos 🇺🇸 · Canadá 🇨🇦 · México 🇲🇽
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-b from-noite-900 to-noite-950">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between gap-4 mb-6">
          <div>
            <button
              onClick={() => setVista('menu')}
              className="text-white/50 hover:text-white text-sm mb-1"
            >
              ← Voltar
            </button>
            <h2 className="font-display font-black text-3xl text-white">
              Escolhe a tua seleção
            </h2>
          </div>
          <Botao
            disabled={!selecionado}
            onClick={() => selecionado && onNovo(selecionado)}
          >
            Confirmar →
          </Botao>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {ordenadas.map((s) => {
            const ativo = selecionado === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSelecionado(s.id)}
                aria-pressed={ativo}
                className={`text-left rounded-2xl p-4 border transition-all ${
                  ativo
                    ? 'border-amber-400 bg-amber-400/10 scale-[1.02]'
                    : 'border-white/10 bg-noite-800/60 hover:border-white/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl" aria-hidden>
                    {s.bandeira}
                  </span>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: s.cor, color: '#fff' }}
                  >
                    {s.forca}
                  </span>
                </div>
                <p className="mt-3 font-display font-bold text-white leading-tight">
                  {s.nome}
                </p>
                <p className="text-[11px] text-white/40 mb-2">{rotuloForca(s.forca)}</p>
                <BarraForca forca={s.forca} cor={s.cor} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
