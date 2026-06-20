import { getSelecao } from '../../data/selecoes';

type Props = {
  id: string;
  mostrarNome?: boolean;
  tamanho?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
};

const TAM: Record<NonNullable<Props['tamanho']>, string> = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
  xl: 'text-6xl',
};

// Mostra a bandeira (emoji) e, opcionalmente, o nome da seleção.
export function Bandeira({ id, mostrarNome = false, tamanho = 'md', className = '' }: Props) {
  const s = getSelecao(id);
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className={TAM[tamanho]} aria-hidden>
        {s.bandeira}
      </span>
      {mostrarNome && <span className="font-semibold">{s.nome}</span>}
    </span>
  );
}

// Pequena barra de força (0–100) para os cartões de seleção.
export function BarraForca({ forca, cor }: { forca: number; cor: string }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{ width: `${forca}%`, backgroundColor: cor }}
      />
    </div>
  );
}
