-- Schema completo para tuspruebas
-- Ejecutar en Neon para crear/migrar las tablas

CREATE TABLE IF NOT EXISTS usuarios (
  id         SERIAL PRIMARY KEY,
  nombre     TEXT NOT NULL,
  email      TEXT UNIQUE NOT NULL,
  password   TEXT,
  rol        TEXT NOT NULL DEFAULT 'usuario',
  google_id  TEXT,
  avatar     TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pruebas (
  id         SERIAL PRIMARY KEY,
  titulo     TEXT NOT NULL,
  materia    TEXT NOT NULL,
  anio       TEXT NOT NULL,
  profesor   TEXT,
  tema       TEXT,
  escuela    TEXT NOT NULL,
  contenido  JSONB,
  estado     TEXT NOT NULL DEFAULT 'pendiente'
               CHECK (estado IN ('pendiente', 'aprobada', 'rechazada')),
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
  fecha      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS favoritos (
  id         SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  prueba_id  INTEGER NOT NULL REFERENCES pruebas(id)  ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(usuario_id, prueba_id)
);

CREATE INDEX IF NOT EXISTS idx_pruebas_estado  ON pruebas(estado);
CREATE INDEX IF NOT EXISTS idx_pruebas_materia ON pruebas(materia);
CREATE INDEX IF NOT EXISTS idx_pruebas_escuela ON pruebas(escuela);
CREATE INDEX IF NOT EXISTS idx_pruebas_anio    ON pruebas(anio);
CREATE INDEX IF NOT EXISTS idx_favoritos_user  ON favoritos(usuario_id);

-- Migracion segura: agrega usuario_id si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pruebas' AND column_name = 'usuario_id'
  ) THEN
    ALTER TABLE pruebas
      ADD COLUMN usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL;
  END IF;
END $$;
