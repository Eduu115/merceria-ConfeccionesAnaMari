export type OrigenWhatsApp =
  | 'cabecera'
  | 'hero'
  | 'arreglos'
  | 'producto'
  | 'catalogo-vacio'
  | 'merceria-vacio'
  | 'faq';

const mensajes: Record<OrigenWhatsApp, (nombre?: string) => string> = {
  cabecera: () => 'Hola, os escribo desde la web.',
  hero: () => 'Hola, os escribo desde la web.',
  arreglos: () => 'Hola, quería preguntar por un arreglo:',
  producto: (nombre) => `Hola, me interesa «${nombre ?? 'este artículo'}». ¿Lo tenéis disponible?`,
  'catalogo-vacio': () => 'Hola, busco algo que no encuentro en la web:',
  'merceria-vacio': () => 'Hola, necesito un artículo de mercería:',
  faq: () => 'Hola, tengo una duda:',
};

export function enlaceWhatsApp(
  telefono: string,
  origen: OrigenWhatsApp,
  datos?: { nombre?: string },
): string {
  const num = telefono.replace(/[^\d]/g, '');
  const text = encodeURIComponent(mensajes[origen](datos?.nombre));
  return `https://wa.me/${num}?text=${text}`;
}

export function telHref(telefono: string): string {
  return `tel:+${telefono.replace(/[^\d]/g, '')}`;
}

export function mapsDir(direccion: string, poblacion: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${direccion}, ${poblacion}`)}`;
}
