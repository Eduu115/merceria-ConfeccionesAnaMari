/**
 * Fotos del local de Confecciones Ana Mari (Getafe).
 * A diferencia de las de /demo, estas sí son la tienda real.
 *
 * Origen: capturas de Google Maps / Street View. Sustituir por fotos propias
 * de la tienda en cuanto las haya — ver CREDITOS.txt.
 */
/** Entrada de la tienda: ilustra la sección «sobre nosotros» hasta tener foto de Ana. */
export const fotoEntrada = {
  src: '/tienda/entrada.webp',
  alt: 'Entrada de Confecciones Ana Mari con el escaparate y el rótulo',
} as const;

/** Fachada completa: cabecera de la página Nosotros. */
export const fotoFrente = {
  src: '/tienda/frente.webp',
  alt: 'Fachada de Confecciones Ana Mari con el rótulo y el escaparate',
} as const;

export const fotosTienda = [
  { src: '/tienda/fachada.webp', pie: 'Fachada', alt: 'Fachada de Confecciones Ana Mari con su rótulo' },
  { src: '/tienda/escaparate.webp', pie: 'Escaparate', alt: 'Escaparate de lencería y mercería' },
  { src: '/tienda/interior.webp', pie: 'Interior', alt: 'Interior de la tienda con la ropa expuesta' },
  { src: '/tienda/mostrador.webp', pie: 'Mostrador', alt: 'Mostrador con hilos, botones y artículos de mercería' },
] as const;
