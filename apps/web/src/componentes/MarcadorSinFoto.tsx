import { Link } from 'react-router-dom';
import { copys } from '../lib/copys';
import { cx } from '../lib/cx';

type Props = {
  variante?: 'tarjeta' | 'ficha' | 'bloque' | 'macro';
  etiqueta?: string;
  className?: string;
};

export function MarcadorSinFoto({ variante = 'tarjeta', etiqueta, className }: Props) {
  const ficha = variante === 'ficha';
  const macro = variante === 'macro';
  const tarjeta = variante === 'tarjeta';
  const texto = etiqueta === '' ? null : (etiqueta ?? (ficha || tarjeta ? copys.sinFoto : null));

  return (
    <div
      className={cx(
        'flex w-full flex-col items-center justify-center text-center text-tinta-tenue',
        macro ? 'trama-macro' : 'trama',
        (tarjeta || ficha) && 'border border-borde',
        tarjeta && !className && 'aspect-[3/4]',
        ficha && 'aspect-[3/4]',
        className,
      )}
    >
      {texto && (
        <p className="max-w-[14rem] px-3 font-mono text-[0.7rem] font-semibold uppercase leading-snug tracking-wide">
          {texto}
        </p>
      )}
      {ficha && <p className="mt-1 max-w-[12rem] px-3 text-xs">{copys.sinFotoFicha}</p>}
    </div>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cx('block leading-none text-tinta', className)} aria-label="Inicio">
      <span className="block font-titular text-[1.4rem] font-semibold leading-none">Confecciones</span>
      <span className="block font-titular text-[1.75rem] font-semibold leading-none">Ana Mari</span>
    </Link>
  );
}
