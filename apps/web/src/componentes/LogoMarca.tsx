import { Link } from 'react-router-dom';
import { cx } from '../lib/cx';

/** Rutas públicas del logo (Vite sirve `public/` en la raíz). */
export const LOGO = {
  /** Círculo con fondo blanco y esquinas transparentes — uso general. */
  webp: '/marca/logo.webp',
  png: '/marca/logo.png',
  /** Versión compacta para cabecera / pie (evita bajar 512px). */
  cabeceraWebp: '/marca/logo-128.webp',
  cabeceraPng: '/marca/logo-128.png',
  /** Solo trazo/texto azul, sin el disco blanco — fondos oscuros. */
  sinFondoWebp: '/marca/logo-sin-fondo.webp',
  sinFondoPng: '/marca/logo-sin-fondo.png',
  /** Cuadrado opaco con fondo blanco — favicon/email/PWA. */
  fondoWebp: '/marca/logo-fondo.webp',
  fondoPng: '/marca/logo-fondo.png',
  icon192: '/marca/logo-fondo-192.png',
  icon512: '/marca/icon-512.png',
  /** Preview al compartir (1200×630). */
  og: '/og.png',
  /** Preview cuadrada (WhatsApp / algunos clientes). */
  ogCuadrado: '/og-cuadrado.png',
  apple: '/apple-touch-icon.png',
  favicon: '/favicon.ico',
} as const;

type Tamano = 'cabecera' | 'pie' | 'hero' | 'auth';

const TAMANOS: Record<Tamano, string> = {
  cabecera: 'h-12 w-12 md:h-14 md:w-14',
  pie: 'h-16 w-16',
  hero: 'h-48 w-48 sm:h-56 sm:w-56 md:h-72 md:w-72 lg:h-80 lg:w-80',
  auth: 'h-20 w-20',
};

const PX: Record<Tamano, number> = {
  cabecera: 128,
  pie: 128,
  hero: 512,
  auth: 256,
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
  const compacto = tamano === 'cabecera' || tamano === 'pie';
  const webp = sinFondo ? LOGO.sinFondoWebp : compacto ? LOGO.cabeceraWebp : LOGO.webp;
  const png = sinFondo ? LOGO.sinFondoPng : compacto ? LOGO.cabeceraPng : LOGO.png;
  const lado = PX[tamano];

  const img = (
    <picture>
      <source type="image/webp" srcSet={webp} />
      <img
        src={png}
        alt="Mercería Ana Mari · Confort para todos los talles"
        width={lado}
        height={lado}
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
