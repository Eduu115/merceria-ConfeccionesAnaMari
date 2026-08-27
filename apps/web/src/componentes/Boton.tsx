import { Link } from 'react-router-dom';
import { cx } from '../lib/cx';

type Props = {
  variante?: 'primario' | 'secundario';
  to?: string;
  href?: string;
  externo?: boolean;
  type?: 'button' | 'submit';
  disabled?: boolean;
  cargando?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  'aria-label'?: string;
};

export function Boton({
  variante = 'primario',
  to,
  href,
  externo,
  type = 'button',
  disabled,
  cargando,
  className,
  children,
  onClick,
  ...rest
}: Props) {
  const clases = cx(
    'inline-flex items-center justify-center text-[0.95rem] font-semibold transition-colors',
    'min-h-12 w-full rounded-lg px-4 md:min-h-0 md:w-auto md:rounded-md md:px-3.5 md:py-2.5',
    variante === 'primario' && 'bg-boton text-white hover:bg-neutral-800',
    variante === 'secundario' &&
      'border-[1.5px] border-boton bg-transparent text-tinta hover:bg-crema',
    (disabled || cargando) && 'pointer-events-none opacity-60',
    className,
  );

  if (to) {
    return (
      <Link to={to} className={clases} aria-label={rest['aria-label']} onClick={onClick}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a
        href={href}
        className={clases}
        aria-label={rest['aria-label']}
        onClick={onClick}
        {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={clases} disabled={disabled || cargando} onClick={onClick} {...rest}>
      {cargando ? 'Enviando…' : children}
    </button>
  );
}
