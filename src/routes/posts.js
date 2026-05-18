import { Router } from 'express';
const router = Router();

// GET /api/posts
router.get('/', (req, res) => {
  res.json({ message: 'Lista de posts' });
});

// GET /api/posts/:id
router.get('/:id', (req, res) => {
  res.json({ message: `Post con id ${req.params.id}` });
});

// POST /api/posts
router.post('/', (req, res) => {
  res.json({ message: 'Post creado' });
});

// PUT /api/posts/:id
router.put('/:id', (req, res) => {
  res.json({ message: `Post ${req.params.id} actualizado` });
});

// DELETE /api/posts/:id
router.delete('/:id', (req, res) => {
  res.json({ message: `Post ${req.params.id} eliminado` });
});

export default router;