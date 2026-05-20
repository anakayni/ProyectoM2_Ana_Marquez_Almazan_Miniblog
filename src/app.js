import express from 'express';

const app = express();

app.use(express.json());

// Rutas

//GET /users
app.get('/users', (req, res) => {
  res.json(users);
});

//GET /users/:id
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  res.json(user);
});

//POST /users
app.post('/users', (req, res) => {
  const { name, email, age } = req.body;
  const user = {id: nextId++, name, email, age};
  users.push(user);
  res.status(201).json(user);
});

//PUT /users/:id
app.put('/users/:id', (req, res) => {
  const index = users.find((u) => u.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  const { name, email, age } = req.body;
  users[index] = { id: users[index].id, name, email, age };
  res.json(users[index]);
});

//DELETE /users/:id
app.delete('/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  users.splice(index, 1);
  res.json({ message: 'Usuario eliminado' });
});

export default app;