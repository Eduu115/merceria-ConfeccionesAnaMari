import { Link } from 'react-router-dom';
import { ImageOff } from 'lucide-react';
import { copys } from '../lib/copys';
import { cx } from '../lib/cx';

type Props = {
  variante?: 'tarjeta' | 'ficha';
  className?: string;
};

export function MarcadorSinFoto({ variante = 'tarjeta', className }: Props) {
  return (
    <div
      className={cx(
        'flex aspect-[3/4] w-full flex-col items-center justify-center gap-2 border border-borde bg-crema text-tinta-tenue',
        className,
      )}
    >
      <ImageOff className="h-8 w-8" aria-hidden />
      <p className="text-sm">{copys.sinFoto}</p>
      {variante === 'ficha' && (
        <p className="max-w-[12rem] text-center text-xs">{copys.sinFotoFicha}</p>
      )}
    </div>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cx('block leading-tight text-tinta', className)} aria-label="Inicio">
      <span className="block font-titular text-[1.05rem] font-semibold tracking-tight">
        Confecciones
      </span>
      <span className="block font-titular text-[1.15rem] font-semibold tracking-tight">
        Ana Mari
      </span>
    </Link>
  );
}
