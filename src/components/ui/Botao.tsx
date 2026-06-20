import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variante = 'principal' | 'secundario' | 'fantasma' | 'perigo';
type Tamanho = 'sm' | 'md' | 'lg';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: Variante;
  tamanho?: Tamanho;
  children: ReactNode;
};

const VARIANTES: Record<Variante, string> = {
  principal:
    'bg-amber-400 text-noite-950 hover:bg-amber-300 active:bg-amber-500 shadow-lg shadow-amber-400/20 font-bold',
  secundario:
    'bg-noite-700 text-white hover:bg-noite-600 border border-white/10 font-semibold',
  fantasma: 'bg-transparent text-white/80 hover:bg-white/10 font-medium',
  perigo: 'bg-red-600 text-white hover:bg-red-500 font-semibold',
};

const TAMANHOS: Record<Tamanho, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-base rounded-xl',
  lg: 'px-7 py-3.5 text-lg rounded-2xl',
};

export function Botao({
  variante = 'principal',
  tamanho = 'md',
  className = '',
  children,
  ...props
}: Props) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${VARIANTES[variante]} ${TAMANHOS[tamanho]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
