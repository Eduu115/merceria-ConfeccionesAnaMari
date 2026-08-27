import type {
  AjustesPublicos,
  ImagenPublica,
  ProductoTarjeta,
  TallaPublica,
} from '@anamari/compartido';

const CLAVES_PUBLICAS: (keyof AjustesPublicos)[] = [
  'negocio_descripcion',
  'direccion',
  'poblacion',
  'telefono',
  'email',
  'whatsapp_telefono',
  'mapa_embed_url',
  'redes_facebook',
  'redes_instagram',
  'inicio_titular',
  'inicio_subtitulo',
  'arreglos_intro',
  'nosotros_titular',
  'nosotros_p1',
  'nosotros_p2',
  'nosotros_p3',
  'catalogo_intro',
];

export function mapearAjustes(filas: { clave: string; valor: string }[]): AjustesPublicos {
  const mapa = Object.fromEntries(filas.map((f) => [f.clave, f.valor]));
  const out = {} as AjustesPublicos;
  for (const clave of CLAVES_PUBLICAS) {
    out[clave] = mapa[clave] ?? '';
  }
  return out;
}

export function imagenPublica(img: {
  ruta: string;
  alt: string;
  ancho: number | null;
  alto: number | null;
  principal: boolean;
  orden: number;
}): ImagenPublica {
  return {
    ruta: img.ruta,
    alt: img.alt,
    ancho: img.ancho,
    alto: img.alto,
    principal: img.principal,
    orden: img.orden,
  };
}

export function tarjetaProducto(p: {
  slug: string;
  nombre: string;
  tipo: 'ropa' | 'merceria';
  agotado: boolean;
  caracteristica: string | null;
  categoriaSlug: string;
  categoriaNombre: string;
  tallas: TallaPublica[];
  imagen: ImagenPublica | null;
}): ProductoTarjeta {
  return {
    slug: p.slug,
    nombre: p.nombre,
    tipo: p.tipo,
    agotado: p.agotado,
    caracteristica: p.caracteristica,
    categoria: { slug: p.categoriaSlug, nombre: p.categoriaNombre },
    tallas: p.tallas,
    imagen: p.imagen,
  };
}
