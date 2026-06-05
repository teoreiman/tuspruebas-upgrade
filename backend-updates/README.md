# Backend Updates

Archivos para aplicar en `manu934/Proyecto`. Copiar cada archivo al repo del backend y reemplazar el existente.

## Pasos

```bash
# 1. Instalar multer
npm install multer

# 2. Reemplazar archivos (desde la raiz del repo backend):
#    backend-updates/server.js               -> server.js
#    backend-updates/package.json            -> package.json
#    backend-updates/config/multer.js        -> config/multer.js  (NUEVO)
#    backend-updates/models/Prueba.js        -> models/Prueba.js
#    backend-updates/controllers/auth.controller.js    -> controllers/
#    backend-updates/controllers/pruebas.controller.js -> controllers/
#    backend-updates/controllers/admin.controller.js   -> controllers/
#    backend-updates/routes/admin.routes.js  -> routes/
#    backend-updates/routes/pruebas.routes.js -> routes/

# 3. Ejecutar migracion en Neon:
#    Abrir db/schema.sql y ejecutarlo en el panel SQL de Neon

# 4. Agregar a .env:
echo "FRONTEND_URL=http://localhost:5173" >> .env
```

## Que cambia

| Archivo | Cambio |
|---|---|
| `auth.controller.js` | `register` ahora devuelve token (igual que login) |
| `auth.controller.js` | `googleCallback` redirige al frontend con token en URL |
| `pruebas.controller.js` | `createPrueba` acepta JSON y FormData; guarda info usuario en `contenido` |
| `pruebas.controller.js` | Nuevo: `toggleFavorito` (`POST /api/pruebas/:id/favorito`) |
| `admin.controller.js` | Nuevo: `getAllPruebas` (`GET /api/admin/pruebas?estado=X`) |
| `routes/admin.routes.js` | Agrega `/pruebas`, `/pruebas/:id/estado`, mantiene compat |
| `routes/pruebas.routes.js` | Agrega multer + ruta favorito |
| `config/multer.js` | NUEVO: manejo de uploads hasta 10MB |
| `models/Prueba.js` | `mapRow` normaliza campos; `getAllAdmin` con filtro estado |
| `server.js` | Sirve `/uploads` como estático |
| `db/schema.sql` | Schema completo + migracion segura |
