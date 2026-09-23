import { Link } from 'react-router-dom';
import { cx } from '../lib/cx';

/** Rutas públicas del logo (Vite sirve `public/` en la raíz). */
export const LOGO = {
  /** Círculo con fondo blanco y esquinas transparentes — uso general. */
  webp: '/marca/logo.webp',
  png: '/marca/logo.png',
  /** Solo trazo/texto azul, sin el disco blanco — fondos oscuros. */
  sinFondoWebp: '/marca/logo-sin-fondo.webp',
  sinFondoPng: '/marca/logo-sin-fondo.png',
  /** Cuadrado opaco con fondo blanco — favicon/email. */
  fondoWebp: '/marca/logo-fondo.webp',
  fondoPng: '/marca/logo-fondo.png',
  og: '/og.png',
  apple: '/apple-touch-icon.png',
} as const;

type Tamano = 'cabecera' | 'pie' | 'hero' | 'auth';

const TAMANOS: Record<Tamano, string> = {
  cabecera: 'h-12 w-12 md:h-14 md:w-14',
  pie: 'h-16 w-16',
  hero: 'h-48 w-48 sm:h-56 sm:w-56 md:h-72 md:w-72 lg:h-80 lg:w-80',
  auth: 'h-20 w-20',
};

type Props = {
  tamano?: Tamano;
  className?: string;
  /** Si true, enlaza a inicio (cabecera). */
  enlace?: boolean;
  /** Variante sin el disco blanco (mejor sobre fondos oscuros). */
  sinFondo?: boolean;
};

export function LogoMarca({ tamano = 'cabecera', className, enlace = false, sinFondo = false }: Props) {
  const webp = sinFondo ? LOGO.sinFondoWebp : LOGO.webp;
  const png = sinFondo ? LOGO.sinFondoPng : LOGO.png;

  const img = (
    <picture>
      <source type="image/webp" srcSet={webp} />
      <img
        src={png}
        alt="Mercería Ana Mari · Confort para todos los talles"
        width={512}
        height={512}
        decoding="async"
        className={cx(TAMANOS[tamano], 'object-contain', className)}
      />
    </picture>
  );

  if (!enlace) return img;

  return (
    <Link to="/" className="block shrink-0 leading-none" aria-label="Inicio · Mercería Ana Mari">
      {img}
    </Link>
  );
}

/** Marca de cabecera: solo el logo. */
export function Logo({ className }: { className?: string }) {
  return <LogoMarca tamano="cabecera" enlace className={className} />;
}
