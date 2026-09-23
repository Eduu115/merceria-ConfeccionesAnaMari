-- Colores de producto como filas (no columnas fijas ni texto-lista).
CREATE TABLE producto_colores (
  id SERIAL PRIMARY KEY,
  producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  valor TEXT NOT NULL,
  orden SMALLINT NOT NULL DEFAULT 0,
  UNIQUE (producto_id, orden)
);

CREATE INDEX idx_producto_colores_producto ON producto_colores (producto_id);

-- Trasladar los tres slots del admin (si existen).
INSERT INTO producto_colores (producto_id, valor, orden)
SELECT id, color_primario, 0 FROM productos WHERE color_primario IS NOT NULL AND btrim(color_primario) <> '';

INSERT INTO producto_colores (producto_id, valor, orden)
SELECT id, color_secundario, 1 FROM productos WHERE color_secundario IS NOT NULL AND btrim(color_secundario) <> '';

INSERT INTO producto_colores (producto_id, valor, orden)
SELECT id, color_terciario, 2 FROM productos WHERE color_terciario IS NOT NULL AND btrim(color_terciario) <> '';

-- Trasladar atributos de familia color que aún no tengan fila equivalente.
INSERT INTO producto_colores (producto_id, valor, orden)
SELECT
  pa.producto_id,
  COALESCE(a.hex, a.slug),
  COALESCE(
    (SELECT MAX(pc.orden) + 1 FROM producto_colores pc WHERE pc.producto_id = pa.producto_id),
    0
  )
FROM producto_atributos pa
INNER JOIN atributos a ON a.id = pa.atributo_id
WHERE a.familia = 'color'
  AND NOT EXISTS (
    SELECT 1 FROM producto_colores pc
    WHERE pc.producto_id = pa.producto_id
      AND (
        (a.hex IS NOT NULL AND lower(pc.valor) = lower(a.hex))
        OR lower(pc.valor) = lower(a.slug)
      )
  );

-- Quitar filas M2M de color: el tipo de mercería sigue en producto_atributos.
DELETE FROM producto_atributos pa
USING atributos a
WHERE pa.atributo_id = a.id AND a.familia = 'color';

ALTER TABLE productos
  DROP COLUMN IF EXISTS color_primario,
  DROP COLUMN IF EXISTS color_secundario,
  DROP COLUMN IF EXISTS color_terciario,
  DROP COLUMN IF EXISTS colores;
