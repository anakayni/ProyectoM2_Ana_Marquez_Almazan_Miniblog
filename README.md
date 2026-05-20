# MiniBlog API

API REST construida con **Node.js + Express + PostgreSQL** para gestionar autores y posts.  
Proyecto backend para DevSpark — Ana Márquez Almazán.

---

## Estructura del proyecto

```
miniblog/
├── src/
│   ├── db/
│   │   ├── config.js         # Pool de conexión a PostgreSQL
│   │   ├── setup.sql         # Crear tablas + datos de prueba
│   │   └── test-connection.js
│   ├── routes/
│   │   ├── index.js          # Agrupa todas las rutas
│   │   ├── authors.js        # CRUD de autores
│   │   └── posts.js          # CRUD de posts
│   └── server.js             # Punto de entrada
├── tests/
│   └── api.test.js           # Tests con Jest + Supertest
├── openapi.yaml              # Documentación de la API
├── .env.example              # Variables de entorno de ejemplo
├── .gitignore
├── package.json
└── README.md
```

---

## Cómo ejecutar localmente

### 1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/miniblog-api.git
cd miniblog-api
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. Configura las variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con tus datos de PostgreSQL:

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=miniblog
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
```

### 4. Crea la base de datos

```bash
psql -U tu_usuario -c "CREATE DATABASE miniblog;"
```

### 5. Ejecuta el script de setup (tablas + datos de prueba)

```bash
psql -U tu_usuario -d miniblog -f src/db/setup.sql
```

### 6. Inicia el servidor

```bash
npm start          # producción
npm run dev        # desarrollo (reinicio automático)
```

Servidor disponible en: `http://localhost:3000`

---

## Endpoints

| Método | Ruta                        | Descripción                              |
|--------|-----------------------------|------------------------------------------|
| GET    | /api/authors                | Listar autores                           |
| GET    | /api/authors/:id            | Obtener autor por ID                     |
| POST   | /api/authors                | Crear autor                              |
| PUT    | /api/authors/:id            | Actualizar autor                         |
| DELETE | /api/authors/:id            | Eliminar autor                           |
| GET    | /api/posts                  | Listar posts (opcional: ?published=true) |
| GET    | /api/posts/:id              | Obtener post por ID                      |
| GET    | /api/posts/author/:authorId | Posts de un autor con datos del autor    |
| POST   | /api/posts                  | Crear post                               |
| PUT    | /api/posts/:id              | Actualizar post                          |
| DELETE | /api/posts/:id              | Eliminar post                            |

---

## Cómo ejecutar los tests

Los tests requieren que la base de datos esté corriendo y el `.env` configurado.

```bash
npm test
```

Se usan **Jest** y **Supertest**. Los tests cubren todos los endpoints con casos felices y casos de error (validaciones, 404, emails duplicados, etc.).

---

## Documentación OpenAPI

El archivo `openapi.yaml` documenta todos los endpoints.

**Para verla visualmente:**
1. Ve a [https://editor.swagger.io](https://editor.swagger.io)
2. Click en **File → Import file**
3. Sube `openapi.yaml`

---

## Deploy en Railway

### 1. Crea cuenta en [Railway](https://railway.app)

### 2. Conecta tu repo de GitHub

- **New Project → Deploy from GitHub repo**
- Selecciona tu repositorio

### 3. Agrega PostgreSQL

- Dentro del proyecto: **New → Database → PostgreSQL**

### 4. Configura las variables de entorno

En la pestaña **Variables** de tu servicio Node.js:

| Variable    | Valor                                   |
|-------------|-----------------------------------------|
| PORT        | 3000                                    |
| DB_HOST     | (internal host de Railway — ver Connect)|
| DB_PORT     | 5432                                    |
| DB_NAME     | railway                                 |
| DB_USER     | postgres                                |
| DB_PASSWORD | (generado por Railway)                  |

### 5. Ejecuta el setup.sql

En Railway, abre tu base de datos → pestaña **Query** → pega el contenido de `src/db/setup.sql`.

### 6. Deploy automático

Cada `git push` a `main` despliega automáticamente.  
Tu URL pública aparece en **Settings → Domains**.

---

## Uso de IA en el proyecto

Este proyecto fue desarrollado con asistencia de **Claude (Anthropic)** para:

- Detectar y corregir bugs en `posts.js` (condición invertida, typo `publishe`, orden de rutas, falta de espacio en query SQL)
- Corregir `setup.sql` (typo `creted_at`, espacio en email de seed data)
- Agregar el JOIN en `GET /posts/author/:authorId`
- Generar los tests con Jest + Supertest
- Escribir la documentación OpenAPI
- Redactar este README

Todo el código fue revisado y entendido por la desarrolladora.
