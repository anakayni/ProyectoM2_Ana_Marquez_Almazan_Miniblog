import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import authorsRouter from './routes/authors';
import postsRouter from './routes/posts';
import router from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3000;ß

// Middleware para parsear JSON
app.use(express.json());
app.use(router);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ 
    message: 'Blog API',
    endpoints: {
      authors: '/api/authors',
      posts: '/api/posts'
    }
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
