// app.js
// separo la app de server.js para poder importarla en los tests
// sin que se quede escuchando con app.listen()

import express from 'express';
import router from './routes/index.js';

const app = express();

app.use(express.json());
app.use('/api', router);

// ruta raiz para verificar que la api esta corriendo
app.get('/', (req, res) => {
  res.json({
    message: 'Blog API',
    endpoints: {
      authors: '/api/authors',
      posts: '/api/posts'
    }
  });
});

// si la ruta no existe
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// manejo de errores generales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

export default app;
