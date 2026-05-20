import { Router } from 'express';
import pool from '../db/config.js';

const router = Router();

// GET /api/posts  (opcional: ?published=true o ?published=false)
router.get('/', async (req, res) => {
  const { published } = req.query;

  try {
    let query = 'SELECT * FROM posts';
    const params = [];

    // Bug corregido: era === 'undefined', condición invertida
    if (published !== undefined) {
      query += ' WHERE published = $1';
      params.push(published === 'true');
    }

    // Bug corregido: faltaba el espacio antes de ORDER
    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo posts:', error);
    res.status(500).json({ error: 'Error obteniendo posts' });
  }
});

// ⚠️ IMPORTANTE: esta ruta debe ir ANTES de /:id
// Si va después, Express interpreta "author" como un :id y nunca llega aquí
// GET /api/posts/author/:authorId — posts con datos del autor (JOIN)
router.get('/author/:authorId', async (req, res) => {
  try {
    const { authorId } = req.params;

    const result = await pool.query(
      `SELECT
        posts.id,
        posts.title,
        posts.content,
        posts.published,
        posts.created_at,
        authors.id    AS author_id,
        authors.name  AS author_name,
        authors.email AS author_email,
        authors.bio   AS author_bio
       FROM posts
       JOIN authors ON posts.author_id = authors.id
       WHERE posts.author_id = $1
       ORDER BY posts.created_at DESC`,
      [authorId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo posts por autor:', error);
    res.status(500).json({ error: 'Error obteniendo posts por autor' });
  }
});

// GET /api/posts/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM posts WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error obteniendo post:', error);
    res.status(500).json({ error: 'Error obteniendo post' });
  }
});

// POST /api/posts
router.post('/', async (req, res) => {
  // Bug corregido: era "publishe" (typo)
  const { title, content, author_id, published } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'El título es obligatorio' });
  }
  if (!content || content.trim() === '') {
    return res.status(400).json({ error: 'El contenido es obligatorio' });
  }
  if (!author_id) {
    return res.status(400).json({ error: 'El author_id es obligatorio' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO posts (title, content, author_id, published) VALUES ($1, $2, $3, $4) RETURNING *',
      [title.trim(), content.trim(), author_id, published ?? false]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    // Error de FK: el autor no existe
    if (error.code === '23503') {
      return res.status(404).json({ error: 'El autor especificado no existe' });
    }
    console.error('Error creando post:', error);
    res.status(500).json({ error: 'Error creando post' });
  }
});

// PUT /api/posts/:id
router.put('/:id', async (req, res) => {
  const { title, content, published } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'El título es obligatorio' });
  }
  if (!content || content.trim() === '') {
    return res.status(400).json({ error: 'El contenido es obligatorio' });
  }

  try {
    const result = await pool.query(
      `UPDATE posts
       SET title = $1, content = $2, published = $3
       WHERE id = $4
       RETURNING *`,
      [title.trim(), content.trim(), published ?? false, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error actualizando post:', error);
    res.status(500).json({ error: 'Error actualizando post' });
  }
});

// DELETE /api/posts/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM posts WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    res.json({ message: 'Post eliminado', post: result.rows[0] });
  } catch (error) {
    console.error('Error eliminando post:', error);
    res.status(500).json({ error: 'Error eliminando post' });
  }
});

export default router;