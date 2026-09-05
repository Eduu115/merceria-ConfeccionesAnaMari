ALTER TABLE categorias
  ADD COLUMN padre_id INTEGER REFERENCES categorias(id) ON DELETE CASCADE;
CREATE INDEX idx_categorias_padre ON categorias (padre_id);
