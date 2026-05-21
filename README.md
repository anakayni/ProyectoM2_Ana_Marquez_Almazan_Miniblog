# Blog API
### ProyectoM2_Ana_Marquez_Almazan

API REST con Node.js, Express y PostgreSQL para gestionar autores y posts.
Proyecto del módulo 2 — Ana Márquez Almazán - Soy Henry Fullstack

---

## ¿Qué hace este proyecto?

Es una API que permite crear, leer, actualizar y borrar (CRUD) autores y posts.
Los datos se guardan en una base de datos PostgreSQL.

Este fue mi primer proyecto backend completo. Aprendi a conectar Express con una base de datos real, a escribir queries SQL parametrizadas, a manejar errores con codigos HTTP correctos y a hacer tests automatizados. Fue bastante desafiante al principio pero fui entendiendo cada parte poco a poco.

---

## Que aprendi en este proyecto

- Como estructurar una API REST con rutas separadas por entidad
- Como conectar Node.js a PostgreSQL usando el modulo `pg`
- Que son las queries parametrizadas y por que son importantes (evitan SQL injection)
- Como manejar errores de la base de datos y devolver respuestas HTTP correctas (400, 404, 500)
- Como hacer un JOIN entre dos tablas para traer datos relacionados
- Como escribir tests con Vitest y Supertest sin levantar el servidor real
- Como usar variables de entorno para no exponer credenciales
- Como desplegar una app en Railway

Algo que me costo bastante fue entender el orden de las rutas en Express. Por ejemplo el endpoint `/posts/author/:authorId` tiene que ir antes de `/posts/:id` porque si no, Express interpreta "author" como si fuera un id numerico y nunca llega a la ruta correcta.

---

## Como use la IA en este proyecto

Use Claude (Anthropic) como asistente durante el desarrollo. Estas son las cosas puntuales para las que lo use:

- Me ayudo a encontrar bugs en mi codigo que yo no veia, por ejemplo tenia un typo `publishe` en vez de `published` y la condicion del filtro de posts estaba invertida (`=== 'undefined'` en vez de `!== undefined`)
- Me explico por que el orden de las rutas importa en Express
- Me ayudo a entender como hacer el JOIN entre posts y authors
- Genero los tests con Vitest y Supertest cuando yo todavia no sabia como estructurarlos
- Me ayudo a armar la documentacion OpenAPI
- Me explico el error de la columna `creted_at` (typo en el SQL original) y como arreglarlo directamente en la base de datos con ALTER TABLE

Todo lo que me genero lo lei, lo entendi y lo probe antes de usarlo. Tambien tuve que resolver cosas por mi cuenta como configurar bien el `.env`, crear el usuario y la base de datos en PostgreSQL y corregir los permisos cuando el ALTER TABLE fallaba.

---

## Estructura de carpetas

```
ProyectoM2_Ana_Marquez_Almazan/
├── src/
│   ├── db/
│   │   ├── config.js          # configuracion de la conexion a postgres
│   │   ├── setup.sql          # script para crear las tablas y meter datos de prueba
│   │   └── test-connection.js # para verificar que la db conecta bien
│   ├── routes/
│   │   ├── index.js           # une todas las rutas
│   │   ├── authors.js         # rutas de autores
│   │   └── posts.js           # rutas de posts
│   └── server.js              # aqui arranca el servidor
├── test/
│   └── api.test.js            # 26 tests con vitest y supertest
├── vitest.config.js
├── openapi.yaml               # documentacion de los endpoints
├── .env.example               # ejemplo de variables de entorno
├── .gitignore
├── package.json
└── README.md
```

---

## Requisitos previos

- Node.js 18 o superior
- PostgreSQL 14 o superior
- npm

---

## Setup — como correrlo en local

### 1. Clonar el repo

```bash
git clone https://github.com/anakayni/ProyectoM2_Ana_Marquez_Almazan_Miniblog.git
cd ProyectoM2_Ana_Marquez_Almazan_Miniblog
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copiar el archivo de ejemplo:

```bash
cp .env.example .env
```

Editar `.env` con tus datos reales (ver seccion `.env.example` abajo):

### 4. Crear el usuario y la base de datos en PostgreSQL

```bash
psql -U postgres
```

Dentro de psql:

```sql
CREATE USER blog_user WITH PASSWORD 'tu_password';
CREATE DATABASE blog_db OWNER blog_user;
\q
```

### 5. Crear las tablas e insertar datos de prueba

```bash
psql -U blog_user -d blog_db -f src/db/setup.sql
```

### 6. Verificar que la conexion funciona

```bash
node src/db/test-connection.js
```

Debe mostrar:
```
Conexión exitosa a PostgreSQL
Hora del servidor de base de datos: 2026-...
```

### 7. Arrancar el servidor

```bash
npm start       # modo normal
npm run dev     # modo desarrollo (se reinicia solo al guardar)
```

La API estara en: `http://localhost:3000`

---

## .env.example

El proyecto necesita estas variables de entorno. Nunca subas el `.env` real a GitHub.

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=blog_db
DB_USER=blog_user
DB_PASSWORD=tu_password
```

---

## Endpoints disponibles

### Authors

| Método | Ruta              | Qué hace                |
|--------|-------------------|-------------------------|
| GET    | /api/authors      | lista todos los autores |
| GET    | /api/authors/:id  | trae un autor por id    |
| POST   | /api/authors      | crea un autor           |
| PUT    | /api/authors/:id  | actualiza un autor      |
| DELETE | /api/authors/:id  | elimina un autor        |

### Posts

| Método | Ruta                        | Qué hace                              |
|--------|-----------------------------|---------------------------------------|
| GET    | /api/posts                  | lista todos los posts                 |
| GET    | /api/posts/:id              | trae un post por id                   |
| GET    | /api/posts/author/:authorId | posts de un autor con datos del autor |
| POST   | /api/posts                  | crea un post                          |
| PUT    | /api/posts/:id              | actualiza un post                     |
| DELETE | /api/posts/:id              | elimina un post                       |

El endpoint GET /api/posts acepta el filtro `?published=true` o `?published=false`.

### Validaciones

- `name` y `email` son obligatorios para authors
- `email` debe ser unico
- `title`, `content` y `author_id` son obligatorios para posts
- Si el `author_id` no existe en la DB devuelve 404

---

## Tests

Los tests usan Vitest y Supertest. Hay 26 tests en total que cubren todos los endpoints.

Necesitas tener la base de datos corriendo y el `.env` configurado antes de correr los tests.

```bash
npm test
```

Para ver la cobertura de codigo:

```bash
npm run test:coverage
```

Resultado esperado:
```
✓ AUTHORS (12 tests)
✓ POSTS (14 tests)

Test Files  1 passed (1)
Tests      26 passed (26)
```

---

## Documentacion OpenAPI

El archivo `openapi.yaml` tiene la documentacion de todos los endpoints con ejemplos de request y response.

Para verla de forma visual:
1. Ir a https://editor.swagger.io
2. File → Import file
3. Subir el archivo `openapi.yaml`

---

## Deploy en Railway

### 1. Crear cuenta en Railway

Ir a https://railway.app y crear una cuenta.

### 2. Conectar el repositorio de GitHub

- New Project → Deploy from GitHub repo
- Seleccionar este repo

### 3. Agregar base de datos PostgreSQL

- Dentro del proyecto: New → Database → PostgreSQL
- Railway la crea automaticamente y genera las credenciales

### 4. Configurar las variables de entorno

En la pestaña Variables del servicio de Node.js agregar:

| Variable    | Valor                                        |
|-------------|----------------------------------------------|
| PORT        | 3000                                         |
| DB_HOST     | el internal host que muestra Railway (Connect)|
| DB_PORT     | 5432                                         |
| DB_NAME     | railway                                      |
| DB_USER     | postgres                                     |
| DB_PASSWORD | el password que genera Railway               |

### 5. Crear las tablas

En Railway, abrir la base de datos → pestaña Query → pegar el contenido de `src/db/setup.sql` y ejecutar.

### 6. Deploy automatico

Cada `git push` a main despliega automaticamente.
La URL publica aparece en Settings → Domains.

---

## Comandos utiles

```bash
npm start              # iniciar servidor
npm run dev            # iniciar con reinicio automatico
npm test               # correr los 26 tests
npm run test:coverage  # ver cobertura de tests
```
