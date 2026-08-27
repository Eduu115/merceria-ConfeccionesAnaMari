CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE tipo_catalogo AS ENUM ('ropa', 'merceria');
CREATE TYPE rol_usuario AS ENUM ('admin_web', 'propietario', 'cliente');
CREATE TYPE familia_atributo AS ENUM ('tipo_merceria', 'color');
CREATE TYPE grupo_pregunta AS ENUM ('tienda', 'arreglos', 'comprar');

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  nombre TEXT NOT NULL,
  rol rol_usuario NOT NULL DEFAULT 'cliente',
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE sesiones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  expira_en TIMESTAMPTZ NOT NULL,
  ip TEXT,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_sesiones_usuario ON sesiones (usuario_id);
CREATE INDEX idx_sesiones_expira ON sesiones (expira_en);

CREATE TABLE imagenes (
  id SERIAL PRIMARY KEY,
  producto_id INTEGER,
  ruta TEXT NOT NULL,
  alt TEXT NOT NULL,
  ancho INTEGER,
  alto INTEGER,
  principal BOOLEAN NOT NULL DEFAULT FALSE,
  orden INTEGER NOT NULL DEFAULT 0,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE categorias (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  tipo tipo_catalogo NOT NULL,
  imagen_id INTEGER REFERENCES imagenes(id) ON DELETE SET NULL,
  orden INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE productos (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  categoria_id INTEGER NOT NULL REFERENCES categorias(id),
  tipo tipo_catalogo NOT NULL,
  composicion TEXT,
  colores TEXT,
  caracteristica TEXT,
  agotado BOOLEAN NOT NULL DEFAULT FALSE,
  destacado BOOLEAN NOT NULL DEFAULT FALSE,
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  orden INTEGER NOT NULL DEFAULT 0,
  precio_centimos INTEGER,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_productos_cat ON productos (categoria_id, visible, orden);
CREATE INDEX idx_productos_tipo ON productos (tipo, visible);

ALTER TABLE imagenes
  ADD CONSTRAINT imagenes_producto_id_fkey
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE;

CREATE TABLE producto_tallas (
  id SERIAL PRIMARY KEY,
  producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  talla TEXT NOT NULL,
  disponible BOOLEAN NOT NULL DEFAULT TRUE,
  orden INTEGER NOT NULL DEFAULT 0,
  UNIQUE (producto_id, talla)
);

CREATE TABLE atributos (
  id SERIAL PRIMARY KEY,
  familia familia_atributo NOT NULL,
  slug TEXT NOT NULL,
  nombre TEXT NOT NULL,
  hex TEXT,
  orden INTEGER NOT NULL DEFAULT 0,
  UNIQUE (familia, slug)
);

CREATE TABLE producto_atributos (
  producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  atributo_id INTEGER NOT NULL REFERENCES atributos(id) ON DELETE CASCADE,
  PRIMARY KEY (producto_id, atributo_id)
);

CREATE TABLE servicios (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  incluye TEXT NOT NULL,
  orden INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE preguntas (
  id SERIAL PRIMARY KEY,
  grupo grupo_pregunta NOT NULL,
  pregunta TEXT NOT NULL,
  respuesta TEXT NOT NULL,
  orden INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE horario (
  dia INTEGER PRIMARY KEY CHECK (dia BETWEEN 0 AND 6),
  cerrado BOOLEAN NOT NULL DEFAULT FALSE,
  manana_abre TEXT,
  manana_cierra TEXT,
  tarde_abre TEXT,
  tarde_cierra TEXT,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE mensajes (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  leido BOOLEAN NOT NULL DEFAULT FALSE,
  ip TEXT,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ajustes (
  clave TEXT PRIMARY KEY,
  valor TEXT NOT NULL,
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE paginas (
  slug TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  contenido TEXT NOT NULL,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE correos_pendientes (
  id SERIAL PRIMARY KEY,
  para TEXT NOT NULL,
  asunto TEXT NOT NULL,
  texto TEXT NOT NULL,
  html TEXT,
  intentos INTEGER NOT NULL DEFAULT 0,
  ultimo_error TEXT,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);
