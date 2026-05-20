import { Router } from 'express';
import pool from '../db/config.js';

const router = Router();

// GET /api/authors
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM authors ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo autores:', error);
    res.status(500).json({ error: 'Error obteniendo autores' });
  }
});

// GET /api/authors/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM authors WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error obteniendo autor:', error);
    res.status(500).json({ error: 'Error obteniendo autor' });
  }
});

// POST /api/authors
router.post('/', async (req, res) => {
  try {
    const { name, email, bio } = req.body;

    // Validaciones básicas
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }
    if (!email || email.trim() === '') {
      return res.status(400).json({ error: 'El email es obligatorio' });
    }

    const result = await pool.query(
      'INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING *',
      [name.trim(), email.trim(), bio || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    // Error de email duplicado (unique constraint de PostgreSQL)
    if (error.code === '23505') {
      return res.status(400).json({ error: 'El email ya está en uso' });
    }
    console.error('Error creando autor:', error);
    res.status(500).json({ error: 'Error creando autor' });
  }
});

// PUT /api/authors/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, bio } = req.body;

    // Validaciones básicas
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }
    if (!email || email.trim() === '') {
      return res.status(400).json({ error: 'El email es obligatorio' });
    }

    const result = await pool.query(
      'UPDATE authors SET name = $1, email = $2, bio = $3 WHERE id = $4 RETURNING *',
      [name.trim(), email.trim(), bio || null, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    // Error de email duplicado
    if (error.code === '23505') {
      return res.status(400).json({ error: 'El email ya está en uso' });
    }
    console.error('Error actualizando autor:', error);
    res.status(500).json({ error: 'Error actualizando autor' });
  }
});

// DELETE /api/authors/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM authors WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }
    res.json({ message: 'Autor eliminado', author: result.rows[0] });
  } catch (error) {
    console.error('Error eliminando autor:', error);
    res.status(500).json({ error: 'Error eliminando autor' });
  }
});

export default router;
