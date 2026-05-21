import 'dotenv/config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import yaml from 'js-yaml';
import router from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// swagger — debe ir antes de las rutas
const swaggerDocument = yaml.load(readFileSync('./openapi.yaml', 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.use('/api', router);

// ruta raiz
app.get('/', (req, res) => {
  res.json({
    message: 'anaKayni Blog API',
    docs: 'http://localhost:3000/api-docs',
    endpoints: {
      authors: '/api/authors',
      posts: '/api/posts'
    }
  });
});

// ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// middleware de errores
app.use(errorHandler);

export default app;
