# Backend Updates

Archivos para aplicar en `manu934/Proyecto`. Copiar al repo del backend y reemplazar el existente.

## Pasos

```bash
# 1. Instalar multer
npm install multer

# 2. Copiar los archivos al repo backend:
#    server.js
#    package.json
#    config/multer.js        (NUEVO)
#    models/Prueba.js
#    controllers/auth.controller.js
#    controllers/pruebas.controller.js
#    controllers/admin.controller.js
#    routes/admin.routes.js
#    routes/pruebas.routes.js

# 3. Ejecutar el SQL en Neon (panel SQL o psql):
#    Copiar y pegar db/schema.sql

# 4. Agregar al .env del backend:
FRONTEND_URL=http://localhost:5173
```

## Cambios por archivo

| Archivo | Que cambia |
|---|---|
| `auth.controller.js` | `register` devuelve token igual que login; `googleCallback` redirige al frontend con token en URL |
| `pruebas.controller.js` | `createPrueba` acepta JSON y FormData; guarda info usuario en `contenido`; nuevo `toggleFavorito` |
| `admin.controller.js` | Nuevo `getAllPruebas` — `GET /api/admin/pruebas?estado=X` |
| `routes/admin.routes.js` | Agrega `/pruebas`, `/pruebas/:id/estado`; mantiene `/:id/estado` por compat |
| `routes/pruebas.routes.js` | Agrega multer y ruta `/:id/favorito` |
| `config/multer.js` | NUEVO — disk storage, limite 10MB, filtro por MIME |
| `models/Prueba.js` | `mapRow()` normaliza todas las filas; `getAllAdmin()` con filtro de estado |
| `server.js` | Sirve `/uploads` como carpeta estatica |
| `db/schema.sql` | Schema completo con tabla `favoritos`, indices y migracion segura para `usuario_id` |
