/**
 * Imágenes de relleno genéricas (Unsplash / Pexels License — uso libre).
 * Son decorativas: costura, tejidos y prendas sin identificar a nadie.
 *
 * Las fotos que afirman algo sobre el negocio real (Ana y el equipo, el local)
 * NO se rellenan con stock: usan MarcadorSinFoto hasta tener las de la tienda.
 * Las de producto tampoco: llegan por el panel de administración.
 */

const base = '/demo';

export const demoEditorial = {
  heroCoser: `${base}/hero-coser.webp`,
  macroHilos: `${base}/macro-hilos.webp`,
  taller: `${base}/taller.jpg`,
} as const;

/** Claves = slug de la categoría raíz en la BD. Si no hay entrada, se cae al marcador. */
export const demoCategoria: Record<string, string | undefined> = {
  mujer: `${base}/categoria-mujer.webp`,
  hombre: `${base}/categoria-hombre.webp`,
  ninos: `${base}/categoria-infantil.webp`,
  'merceria-y-costura': `${base}/categoria-merceria.webp`,
};
