import { Router } from 'express';
const router = Router();

// GET /api/authors
router.get('/', (req, res) => {
  res.json({ message: 'Lista de autores' });
});

// GET /api/authors/:id
router.get('/:id', (req, res) => {
  res.json({ message: `Autor con id ${req.params.id}` });
});

// POST /api/authors
router.post('/', (req, res) => {
  res.json({ message: 'Autor creado' });
});

// PUT /api/authors/:id
router.put('/:id', (req, res) => {
  res.json({ message: `Autor ${req.params.id} actualizado` });
});

// DELETE /api/authors/:id
router.delete('/:id', (req, res) => {
  res.json({ message: `Autor ${req.params.id} eliminado` });
});

export default router;