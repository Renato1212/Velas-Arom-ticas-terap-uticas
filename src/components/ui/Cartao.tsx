import type { HTMLAttributes, ReactNode } from 'react';

type Props = HTMLAttributes<HTMLDivElement> & { children: ReactNode };

export function Cartao({ className = '', children, ...props }: Props) {
  return (
    <div
      className={`rounded-2xl bg-noite-900/80 border border-white/10 backdrop-blur-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
