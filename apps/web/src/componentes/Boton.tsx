import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { cx } from '../lib/cx';
import { copys } from '../lib/copys';
import { IconoWhatsApp } from './IconoWhatsApp';
import type { ReactNode } from 'react';

type Props = {
  variante?: 'primario' | 'secundario' | 'whatsapp';
  to?: string;
  href?: string;
  externo?: boolean;
  type?: 'button' | 'submit';
  disabled?: boolean;
  cargando?: boolean;
  className?: string;
  children: ReactNode;
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
    'inline-flex items-center justify-center gap-2 text-[0.95rem] font-semibold leading-none transition-colors',
    'min-h-12 w-full rounded-lg px-4 md:min-h-11 md:w-auto md:rounded-md md:px-3.5 md:py-0',
    variante === 'primario' && 'bg-boton text-white hover:bg-neutral-800',
    variante === 'secundario' &&
      'border-[1.5px] border-boton bg-transparent text-tinta hover:bg-crema',
    variante === 'whatsapp' &&
      'border-[1.5px] border-boton bg-crema text-tinta hover:bg-arena-2',
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

function Chip({ className, children }: { className: string; children: ReactNode }) {
  return (
    <span
      className={cx('grid h-5 w-5 shrink-0 place-items-center rounded-sm', className)}
      aria-hidden
    >
      {children}
    </span>
  );
}

export function BotonWhatsApp({
  href,
  className,
  children,
  'aria-label': aria,
}: {
  href: string;
  className?: string;
  children?: ReactNode;
  'aria-label'?: string;
}) {
  const texto = children ?? copys.botones.contactaWas;
  return (
    <Boton
      variante="whatsapp"
      href={href}
      externo
      className={className}
      aria-label={aria ?? copys.botones.contactaWas}
    >
      <Chip className="bg-whatsapp text-white">
        <IconoWhatsApp className="h-3 w-3" />
      </Chip>
      {texto}
    </Boton>
  );
}

export function BotonTelefono({
  href,
  className,
  children,
  'aria-label': aria,
}: {
  href: string;
  className?: string;
  children?: ReactNode;
  'aria-label'?: string;
}) {
  const texto = children ?? copys.botones.contactaTel;
  return (
    <Boton
      variante="whatsapp"
      href={href}
      className={className}
      aria-label={aria ?? copys.botones.contactaTel}
    >
      <Chip className="bg-boton text-white">
        <Phone className="h-3 w-3" strokeWidth={2.25} />
      </Chip>
      {texto}
    </Boton>
  );
}

export function EnlaceTexto({
  to,
  className,
  children,
}: {
  to: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      className={cx(
        'inline-flex shrink-0 items-center font-semibold text-acento',
        'origin-left transition-transform duration-200 ease-out motion-safe:hover:scale-[1.06]',
        className,
      )}
    >
      {children}
    </Link>
  );
}
export function BotonesContacto({
  whatsapp,
  telefono,
  className,
  conArreglos = true,
}: {
  whatsapp: string;
  telefono: string;
  className?: string;
  conArreglos?: boolean;
}) {
  return (
    <div className={cx('flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center', className)}>
      <BotonWhatsApp href={whatsapp} />
      <BotonTelefono href={telefono} />
      {conArreglos && (
        <EnlaceTexto to="/arreglos" className="min-h-12 justify-center md:min-h-11">
          {copys.botones.verArreglos}
        </EnlaceTexto>
      )}
    </div>
  );
}
