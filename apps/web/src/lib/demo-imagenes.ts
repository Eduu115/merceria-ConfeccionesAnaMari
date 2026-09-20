/**
 * Imágenes demo (Unsplash / Pexels License — uso libre).
 * Rama temporal `demo/fotos-placeholder`. Sustituir por fotos reales de la tienda.
 */

const base = '/demo';

export const demoEditorial = {
  heroCoser: `${base}/hero-coser.jpg`,
  equipo: `${base}/equipo.jpg`,
  taller: `${base}/taller.jpg`,
  macroHilos: `${base}/macro-hilos.jpg`,
} as const;

export const demoCategoria: Record<string, string> = {
  'ropa-de-mujer': `${base}/categoria-mujer.jpg`,
  'ropa-de-hombre': `${base}/categoria-hombre.jpg`,
  'infantil-y-bebe': `${base}/categoria-infantil.jpg`,
  'merceria-y-costura': `${base}/categoria-merceria.jpg`,
};

export const demoLocal = [
  `${base}/local-fachada.jpg`,
  `${base}/local-interior.jpg`,
  `${base}/local-mostrador.jpg`,
  `${base}/local-hilos.jpg`,
];

const ropa = [
  `${base}/producto-ropa-1.jpg`,
  `${base}/producto-ropa-2.jpg`,
  `${base}/producto-ropa-3.jpg`,
  `${base}/producto-ropa-4.jpg`,
];

const merceria = [
  `${base}/producto-merceria-1.jpg`,
  `${base}/producto-merceria-2.jpg`,
  `${base}/producto-merceria-3.jpg`,
  `${base}/producto-merceria-4.jpg`,
];

function hashSlug(slug: string): number {
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) | 0;
  return Math.abs(h);
}

export function demoImagenProducto(slug: string, tipo: 'ropa' | 'merceria'): string {
  const pool = tipo === 'ropa' ? ropa : merceria;
  return pool[hashSlug(slug) % pool.length]!;
}
