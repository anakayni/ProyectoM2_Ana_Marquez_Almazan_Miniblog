-- setup.sql — Crear tablas, índices e insertar datos de prueba
-- Uso: psql -U <usuario> -d <base> -f src/db/setup.sql

CREATE TABLE IF NOT EXISTS authors (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(150) UNIQUE NOT NULL,
    bio        TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS posts (
    id         SERIAL PRIMARY KEY,
    title      VARCHAR(200) NOT NULL,
    content    TEXT NOT NULL,
    published  BOOLEAN DEFAULT FALSE,
    author_id  INTEGER NOT NULL,
    -- Bug corregido: era "creted_at" (faltaba la 'a')
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
);

-- Índice para acelerar búsquedas de posts por autor
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);

-- ============================================================
-- Seed data — datos de prueba
-- ON CONFLICT DO NOTHING evita error si ya existen
-- ============================================================

INSERT INTO authors (name, email, bio) VALUES
  -- Bug corregido: email tenía un espacio → 'ana@examp le.com'
  ('Ana García',  'ana@example.com',    'Desarrolladora full-stack apasionada por Node.js'),
  ('Carlos Ruiz', 'carlos@example.com', 'Escritor técnico especializado en bases de datos'),
  ('María López', 'maria@example.com',  'Ingeniera de software con foco en APIs REST')
ON CONFLICT (email) DO NOTHING;

INSERT INTO posts (title, content, author_id, published) VALUES
  ('Introducción a Node.js',       'Node.js es un runtime de JavaScript...', 1, true),
  ('PostgreSQL vs MySQL',          'Ambas bases de datos tienen ventajas...', 2, true),
  ('APIs RESTful',                 'REST es un estilo arquitectónico...',     1, true),
  ('Manejo de errores en Express', 'El manejo apropiado de errores...',       3, false),
  ('Async/Await explicado',        'Las promesas simplifican el código asíncrono...', 1, false);
