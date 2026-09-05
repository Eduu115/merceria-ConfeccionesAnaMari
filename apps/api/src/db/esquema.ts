import {
  type AnyPgColumn,
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';

export const tipoCatalogo = pgEnum('tipo_catalogo', ['ropa', 'merceria']);
export const rolUsuario = pgEnum('rol_usuario', [
  'admin_web',
  'propietario',
  'cliente',
]);
export const familiaAtributo = pgEnum('familia_atributo', [
  'tipo_merceria',
  'color',
]);
export const grupoPregunta = pgEnum('grupo_pregunta', [
  'tienda',
  'arreglos',
  'comprar',
]);

export const usuarios = pgTable('usuarios', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  nombre: text('nombre').notNull(),
  rol: rolUsuario('rol').notNull().default('cliente'),
  activo: boolean('activo').notNull().default(true),
  creadoEn: timestamp('creado_en', { withTimezone: true }).notNull().defaultNow(),
  actualizadoEn: timestamp('actualizado_en', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const sesiones = pgTable('sesiones', {
  id: uuid('id').primaryKey().defaultRandom(),
  usuarioId: integer('usuario_id')
    .notNull()
    .references(() => usuarios.id, { onDelete: 'cascade' }),
  expiraEn: timestamp('expira_en', { withTimezone: true }).notNull(),
  ip: text('ip'),
  creadoEn: timestamp('creado_en', { withTimezone: true }).notNull().defaultNow(),
});

export const imagenes = pgTable('imagenes', {
  id: serial('id').primaryKey(),
  productoId: integer('producto_id'),
  ruta: text('ruta').notNull(),
  alt: text('alt').notNull(),
  ancho: integer('ancho'),
  alto: integer('alto'),
  principal: boolean('principal').notNull().default(false),
  orden: integer('orden').notNull().default(0),
  creadoEn: timestamp('creado_en', { withTimezone: true }).notNull().defaultNow(),
});

export const categorias = pgTable('categorias', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  nombre: text('nombre').notNull(),
  descripcion: text('descripcion'),
  tipo: tipoCatalogo('tipo').notNull(),
  imagenId: integer('imagen_id').references(() => imagenes.id, {
    onDelete: 'set null',
  }),
  padreId: integer('padre_id').references((): AnyPgColumn => categorias.id, {
    onDelete: 'cascade',
  }),
  orden: integer('orden').notNull().default(0),
  visible: boolean('visible').notNull().default(true),
  creadoEn: timestamp('creado_en', { withTimezone: true }).notNull().defaultNow(),
  actualizadoEn: timestamp('actualizado_en', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const productos = pgTable('productos', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  nombre: text('nombre').notNull(),
  descripcion: text('descripcion'),
  categoriaId: integer('categoria_id')
    .notNull()
    .references(() => categorias.id),
  tipo: tipoCatalogo('tipo').notNull(),
  composicion: text('composicion'),
  colores: text('colores'),
  caracteristica: text('caracteristica'),
  agotado: boolean('agotado').notNull().default(false),
  destacado: boolean('destacado').notNull().default(false),
  visible: boolean('visible').notNull().default(true),
  orden: integer('orden').notNull().default(0),
  precioCentimos: integer('precio_centimos'),
  creadoEn: timestamp('creado_en', { withTimezone: true }).notNull().defaultNow(),
  actualizadoEn: timestamp('actualizado_en', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const productoTallas = pgTable(
  'producto_tallas',
  {
    id: serial('id').primaryKey(),
    productoId: integer('producto_id')
      .notNull()
      .references(() => productos.id, { onDelete: 'cascade' }),
    talla: text('talla').notNull(),
    disponible: boolean('disponible').notNull().default(true),
    orden: integer('orden').notNull().default(0),
  },
  (t) => [unique().on(t.productoId, t.talla)],
);

export const atributos = pgTable(
  'atributos',
  {
    id: serial('id').primaryKey(),
    familia: familiaAtributo('familia').notNull(),
    slug: text('slug').notNull(),
    nombre: text('nombre').notNull(),
    hex: text('hex'),
    orden: integer('orden').notNull().default(0),
  },
  (t) => [unique().on(t.familia, t.slug)],
);

export const productoAtributos = pgTable(
  'producto_atributos',
  {
    productoId: integer('producto_id')
      .notNull()
      .references(() => productos.id, { onDelete: 'cascade' }),
    atributoId: integer('atributo_id')
      .notNull()
      .references(() => atributos.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.productoId, t.atributoId] })],
);

export const servicios = pgTable('servicios', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  nombre: text('nombre').notNull(),
  incluye: text('incluye').notNull(),
  orden: integer('orden').notNull().default(0),
  visible: boolean('visible').notNull().default(true),
  creadoEn: timestamp('creado_en', { withTimezone: true }).notNull().defaultNow(),
  actualizadoEn: timestamp('actualizado_en', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const preguntas = pgTable('preguntas', {
  id: serial('id').primaryKey(),
  grupo: grupoPregunta('grupo').notNull(),
  pregunta: text('pregunta').notNull(),
  respuesta: text('respuesta').notNull(),
  orden: integer('orden').notNull().default(0),
  visible: boolean('visible').notNull().default(true),
  creadoEn: timestamp('creado_en', { withTimezone: true }).notNull().defaultNow(),
  actualizadoEn: timestamp('actualizado_en', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const horario = pgTable('horario', {
  dia: integer('dia').primaryKey(),
  cerrado: boolean('cerrado').notNull().default(false),
  mananaAbre: text('manana_abre'),
  mananaCierra: text('manana_cierra'),
  tardeAbre: text('tarde_abre'),
  tardeCierra: text('tarde_cierra'),
  creadoEn: timestamp('creado_en', { withTimezone: true }).notNull().defaultNow(),
  actualizadoEn: timestamp('actualizado_en', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const mensajes = pgTable('mensajes', {
  id: serial('id').primaryKey(),
  nombre: text('nombre').notNull(),
  email: text('email').notNull(),
  mensaje: text('mensaje').notNull(),
  leido: boolean('leido').notNull().default(false),
  ip: text('ip'),
  creadoEn: timestamp('creado_en', { withTimezone: true }).notNull().defaultNow(),
});

export const ajustes = pgTable('ajustes', {
  clave: text('clave').primaryKey(),
  valor: text('valor').notNull(),
  actualizadoEn: timestamp('actualizado_en', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const paginas = pgTable('paginas', {
  slug: text('slug').primaryKey(),
  titulo: text('titulo').notNull(),
  contenido: text('contenido').notNull(),
  creadoEn: timestamp('creado_en', { withTimezone: true }).notNull().defaultNow(),
  actualizadoEn: timestamp('actualizado_en', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const correosPendientes = pgTable('correos_pendientes', {
  id: serial('id').primaryKey(),
  para: text('para').notNull(),
  asunto: text('asunto').notNull(),
  texto: text('texto').notNull(),
  html: text('html'),
  intentos: integer('intentos').notNull().default(0),
  ultimoError: text('ultimo_error'),
  creadoEn: timestamp('creado_en', { withTimezone: true }).notNull().defaultNow(),
});
