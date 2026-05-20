# MiniBlog API

API REST con Node.js, Express y PostgreSQL para gestionar autores y posts.
Proyecto del módulo 2 — Ana Márquez Almazán.

---

## ¿Qué hace este proyecto?

Es una API que permite crear, leer, actualizar y borrar (CRUD) autores y posts.
Los datos se guardan en una base de datos PostgreSQL.

---

## Estructura de carpetas

```
miniblog/
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
├── tests/
│   └── api.test.js            # tests con vitest y supertest
├── vitest.config.js
├── openapi.yaml               # documentacion de los endpoints
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Como correrlo en local

### 1. Clonar el repo

```bash
git clone https://github.com/tu-usuario/miniblog-api.git
cd miniblog-api
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copiar el archivo de ejemplo y rellenar con tus datos:

```bash
cp .env.example .env
```

El `.env` debe quedar así (con tus datos reales):

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=miniblog
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
```

### 4. Crear la base de datos en PostgreSQL

```bash
psql -U tu_usuario -c "CREATE DATABASE miniblog;"
```

### 5. Crear las tablas y meter datos de prueba

```bash
psql -U tu_usuario -d miniblog -f src/db/setup.sql
```

### 6. Arrancar el servidor

```bash
npm start       # modo normal
npm run dev     # modo desarrollo (se reinicia solo al guardar)
```

La API estará en: `http://localhost:3000`

---

## Endpoints disponibles

### Authors

| Método | Ruta              | Qué hace              |
|--------|-------------------|-----------------------|
| GET    | /api/authors      | lista todos los autores |
| GET    | /api/authors/:id  | trae un autor por id  |
| POST   | /api/authors      | crea un autor         |
| PUT    | /api/authors/:id  | actualiza un autor    |
| DELETE | /api/authors/:id  | elimina un autor      |

### Posts

| Método | Ruta                        | Qué hace                              |
|--------|-----------------------------|---------------------------------------|
| GET    | /api/posts                  | lista todos los posts                 |
| GET    | /api/posts/:id              | trae un post por id                   |
| GET    | /api/posts/author/:authorId | posts de un autor con datos del autor |
| POST   | /api/posts                  | crea un post                          |
| PUT    | /api/posts/:id              | actualiza un post                     |
| DELETE | /api/posts/:id              | elimina un post                       |

El endpoint de GET /api/posts acepta el filtro `?published=true` o `?published=false`.

---

## Como correr los tests

Necesitas tener la base de datos corriendo y el `.env` configurado.

```bash
npm test
```

Para ver cuanto codigo cubren los tests:

```bash
npm run test:coverage
```

---

## Documentacion OpenAPI

El archivo `openapi.yaml` tiene la documentacion de todos los endpoints.

Para verla de forma visual:
1. Ir a https://editor.swagger.io
2. File → Import file
3. Subir el archivo `openapi.yaml`

---

## Deploy en Railway

### 1. Crear cuenta en Railway (https://railway.app)

### 2. Conectar el repositorio de GitHub

- New Project → Deploy from GitHub repo
- Seleccionar el repo

### 3. Agregar base de datos PostgreSQL

- Dentro del proyecto: New → Database → PostgreSQL
- Railway la crea automaticamente

### 4. Agregar las variables de entorno

En la pestaña Variables del servicio de Node.js poner:

| Variable    | Valor                                       |
|-------------|---------------------------------------------|
| PORT        | 3000                                        |
| DB_HOST     | el internal host que da Railway (ver Connect)|
| DB_PORT     | 5432                                        |
| DB_NAME     | railway                                     |
| DB_USER     | postgres                                    |
| DB_PASSWORD | el password que genera Railway              |

### 5. Crear las tablas

En Railway, abrir la base de datos → pestaña Query → pegar el contenido de `src/db/setup.sql` y ejecutar.

### 6. Listo

Cada vez que hagas `git push` a main se despliega automaticamente.
La URL publica aparece en Settings → Domains.

---

## Uso de IA

Use Claude (Anthropic) para:
- Encontrar y corregir bugs en posts.js
- Corregir el typo en setup.sql (creted_at)
- Generar los tests con Vitest y Supertest
- Armar la documentacion OpenAPI
- Ayudarme con el README

Todo lo revise y fui entendiendo cada parte antes de usarlo.