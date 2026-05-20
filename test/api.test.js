// tests/api.test.js
// aqui van los tests de la API con vitest y supertest

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import router from '../src/routes/index.js';

// creo una app de prueba para no tener que levantar el servidor real
const app = express();
app.use(express.json());
app.use('/api', router);


// ---- TESTS DE AUTHORS ----

describe('AUTHORS', () => {

  // GET todos los autores
  describe('GET /api/authors', () => {
    it('debe devolver status 200 y un array', async () => {
      const res = await request(app).get('/api/authors');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // POST crear autor
  describe('POST /api/authors', () => {
    it('crea un autor y devuelve 201', async () => {
      const res = await request(app)
        .post('/api/authors')
        .send({
          name: 'Ana Prueba',
          // uso Date.now() para que el email sea unico cada vez
          email: `ana_${Date.now()}@test.com`,
          bio: 'esto es una bio de prueba'
        });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
    });

    it('devuelve 400 si no mando el nombre', async () => {
      const res = await request(app)
        .post('/api/authors')
        .send({ email: 'sinnombre@test.com' });
      expect(res.status).toBe(400);
    });

    it('devuelve 400 si no mando el email', async () => {
      const res = await request(app)
        .post('/api/authors')
        .send({ name: 'Sin email' });
      expect(res.status).toBe(400);
    });

    it('devuelve 400 si el email ya existe en la base de datos', async () => {
      const email = `repetido_${Date.now()}@test.com`;
      // primero lo creo
      await request(app).post('/api/authors').send({ name: 'Primero', email });
      // luego intento crearlo de nuevo con el mismo email
      const res = await request(app).post('/api/authors').send({ name: 'Segundo', email });
      expect(res.status).toBe(400);
    });
  });

  // GET autor por id
  describe('GET /api/authors/:id', () => {
    it('devuelve 404 si el autor no existe', async () => {
      const res = await request(app).get('/api/authors/999999');
      expect(res.status).toBe(404);
    });

    it('devuelve el autor si existe', async () => {
      // primero creo uno
      const creado = await request(app)
        .post('/api/authors')
        .send({ name: 'Para buscar', email: `buscar_${Date.now()}@test.com` });
      // luego lo busco
      const res = await request(app).get(`/api/authors/${creado.body.id}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(creado.body.id);
    });
  });

  // PUT actualizar autor
  describe('PUT /api/authors/:id', () => {
    it('devuelve 400 si mando el nombre vacio', async () => {
      const creado = await request(app)
        .post('/api/authors')
        .send({ name: 'Original', email: `orig_${Date.now()}@test.com` });
      const res = await request(app)
        .put(`/api/authors/${creado.body.id}`)
        .send({ email: 'otro@test.com' }); // sin el name
      expect(res.status).toBe(400);
    });

    it('actualiza bien y devuelve el autor actualizado', async () => {
      const creado = await request(app)
        .post('/api/authors')
        .send({ name: 'Antes', email: `antes_${Date.now()}@test.com` });
      const res = await request(app)
        .put(`/api/authors/${creado.body.id}`)
        .send({ name: 'Despues', email: creado.body.email });
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Despues');
    });

    it('devuelve 404 si el autor no existe', async () => {
      const res = await request(app)
        .put('/api/authors/999999')
        .send({ name: 'Nadie', email: 'nadie@test.com' });
      expect(res.status).toBe(404);
    });
  });

  // DELETE eliminar autor
  describe('DELETE /api/authors/:id', () => {
    it('elimina el autor y devuelve un mensaje', async () => {
      const creado = await request(app)
        .post('/api/authors')
        .send({ name: 'Para borrar', email: `borrar_${Date.now()}@test.com` });
      const res = await request(app).delete(`/api/authors/${creado.body.id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message');
    });

    it('devuelve 404 si el autor no existe', async () => {
      const res = await request(app).delete('/api/authors/999999');
      expect(res.status).toBe(404);
    });
  });
});


// ---- TESTS DE POSTS ----

describe('POSTS', () => {

  // funcion de ayuda para crear un autor rapido en cada test que lo necesite
  async function crearAutor() {
    const res = await request(app)
      .post('/api/authors')
      .send({ name: 'Autor de prueba', email: `autor_${Date.now()}@test.com` });
    return res.body.id;
  }

  // GET todos los posts
  describe('GET /api/posts', () => {
    it('devuelve status 200 y un array', async () => {
      const res = await request(app).get('/api/posts');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('filtra correctamente por ?published=true', async () => {
      const res = await request(app).get('/api/posts?published=true');
      expect(res.status).toBe(200);
      // todos deben tener published en true
      res.body.forEach(post => expect(post.published).toBe(true));
    });
  });

  // POST crear post
  describe('POST /api/posts', () => {
    it('crea un post y devuelve 201', async () => {
      const authorId = await crearAutor();
      const res = await request(app)
        .post('/api/posts')
        .send({ title: 'Mi primer post', content: 'contenido del post', author_id: authorId });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
    });

    it('devuelve 400 si no mando el titulo', async () => {
      const authorId = await crearAutor();
      const res = await request(app)
        .post('/api/posts')
        .send({ content: 'sin titulo', author_id: authorId });
      expect(res.status).toBe(400);
    });

    it('devuelve 400 si no mando el contenido', async () => {
      const authorId = await crearAutor();
      const res = await request(app)
        .post('/api/posts')
        .send({ title: 'sin contenido', author_id: authorId });
      expect(res.status).toBe(400);
    });

    it('devuelve 400 si no mando el author_id', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send({ title: 'sin autor', content: 'contenido' });
      expect(res.status).toBe(400);
    });

    it('devuelve 404 si el author_id no existe', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send({ title: 'post', content: 'contenido', author_id: 999999 });
      expect(res.status).toBe(404);
    });
  });

  // GET post por id
  describe('GET /api/posts/:id', () => {
    it('devuelve 404 si el post no existe', async () => {
      const res = await request(app).get('/api/posts/999999');
      expect(res.status).toBe(404);
    });

    it('devuelve el post si existe', async () => {
      const authorId = await crearAutor();
      const creado = await request(app)
        .post('/api/posts')
        .send({ title: 'buscar este', content: 'contenido', author_id: authorId });
      const res = await request(app).get(`/api/posts/${creado.body.id}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(creado.body.id);
    });
  });

  // GET posts por autor (con JOIN)
  describe('GET /api/posts/author/:authorId', () => {
    it('devuelve los posts del autor con sus datos', async () => {
      const authorId = await crearAutor();
      // creo un post para ese autor
      await request(app)
        .post('/api/posts')
        .send({ title: 'post del autor', content: 'contenido', author_id: authorId });

      const res = await request(app).get(`/api/posts/author/${authorId}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      // verifico que el JOIN funciono y trajo datos del autor
      expect(res.body[0]).toHaveProperty('author_name');
      expect(res.body[0]).toHaveProperty('author_email');
    });
  });

  // PUT actualizar post
  describe('PUT /api/posts/:id', () => {
    it('actualiza el post correctamente', async () => {
      const authorId = await crearAutor();
      const creado = await request(app)
        .post('/api/posts')
        .send({ title: 'titulo viejo', content: 'contenido', author_id: authorId });
      const res = await request(app)
        .put(`/api/posts/${creado.body.id}`)
        .send({ title: 'titulo nuevo', content: 'contenido actualizado', published: true });
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('titulo nuevo');
    });

    it('devuelve 404 si el post no existe', async () => {
      const res = await request(app)
        .put('/api/posts/999999')
        .send({ title: 'nada', content: 'nada' });
      expect(res.status).toBe(404);
    });
  });

  // DELETE eliminar post
  describe('DELETE /api/posts/:id', () => {
    it('elimina el post y devuelve un mensaje', async () => {
      const authorId = await crearAutor();
      const creado = await request(app)
        .post('/api/posts')
        .send({ title: 'para borrar', content: 'contenido', author_id: authorId });
      const res = await request(app).delete(`/api/posts/${creado.body.id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message');
    });

    it('devuelve 404 si el post no existe', async () => {
      const res = await request(app).delete('/api/posts/999999');
      expect(res.status).toBe(404);
    });
  });
});
