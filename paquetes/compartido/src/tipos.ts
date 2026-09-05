export type CategoriaPublica = {
  slug: string;
  nombre: string;
  descripcion: string | null;
  tipo: 'ropa' | 'merceria';
  orden: number;
  padreSlug: string | null;
};

export type TallaPublica = {
  talla: string;
  disponible: boolean;
};

export type AtributoPublico = {
  familia: 'tipo_merceria' | 'color';
  slug: string;
  nombre: string;
  hex: string | null;
};

export type ImagenPublica = {
  ruta: string;
  alt: string;
  ancho: number | null;
  alto: number | null;
  principal: boolean;
  orden: number;
};

export type ProductoTarjeta = {
  slug: string;
  nombre: string;
  tipo: 'ropa' | 'merceria';
  agotado: boolean;
  caracteristica: string | null;
  categoria: { slug: string; nombre: string };
  tallas: TallaPublica[];
  imagen: ImagenPublica | null;
};

export type ProductoFicha = ProductoTarjeta & {
  descripcion: string | null;
  composicion: string | null;
  colores: string | null;
  atributos: AtributoPublico[];
  imagenes: ImagenPublica[];
  relacionados: ProductoTarjeta[];
};

export type ListadoProductos = {
  productos: ProductoTarjeta[];
  total: number;
  pagina: number;
  paginas: number;
  por_pagina: number;
};

export type ServicioPublico = {
  slug: string;
  nombre: string;
  incluye: string;
  orden: number;
};

export type PreguntaPublica = {
  grupo: 'tienda' | 'arreglos' | 'comprar';
  pregunta: string;
  respuesta: string;
  orden: number;
};

export type DiaHorario = {
  dia: number;
  cerrado: boolean;
  manana_abre: string | null;
  manana_cierra: string | null;
  tarde_abre: string | null;
  tarde_cierra: string | null;
};

export type HorarioPublico = {
  dias: DiaHorario[];
  abierto_ahora: boolean;
  linea: string;
};

export type AjustesPublicos = {
  negocio_descripcion: string;
  direccion: string;
  poblacion: string;
  telefono: string;
  email: string;
  whatsapp_telefono: string;
  mapa_embed_url: string;
  redes_facebook: string;
  redes_instagram: string;
  inicio_titular: string;
  inicio_subtitulo: string;
  arreglos_intro: string;
  nosotros_titular: string;
  nosotros_p1: string;
  nosotros_p2: string;
  nosotros_p3: string;
  catalogo_intro: string;
};

export type PaginaPublica = {
  slug: string;
  titulo: string;
  contenido: string;
  actualizado_en: string;
};

export type InicioPublico = {
  ajustes: AjustesPublicos;
  categorias: CategoriaPublica[];
  destacados: ProductoTarjeta[];
  servicios: ServicioPublico[];
  horario: HorarioPublico;
};
