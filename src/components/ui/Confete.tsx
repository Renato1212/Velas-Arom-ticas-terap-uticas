import { useMemo } from 'react';

// Chuva de confetes em CSS puro para a celebração do campeão.
export function Confete({ cor }: { cor: string }) {
  const pecas = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        esquerda: Math.random() * 100,
        atraso: Math.random() * 3,
        duracao: 2.5 + Math.random() * 2.5,
        tamanho: 6 + Math.random() * 8,
        cor: [cor, '#facc15', '#ffffff', '#22c55e'][i % 4],
        rodar: Math.random() > 0.5,
      })),
    [cor],
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden>
      {pecas.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 animate-confete"
          style={{
            left: `${p.esquerda}%`,
            width: p.tamanho,
            height: p.tamanho * 0.6,
            backgroundColor: p.cor,
            borderRadius: p.rodar ? '50%' : '2px',
            animationDelay: `${p.atraso}s`,
            animationDuration: `${p.duracao}s`,
          }}
        />
      ))}
    </div>
  );
}
