import { Pool } from "pg";

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 1,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 5_000,
    });
  }
  return pool;
}

const db = getPool();

// No hay sistema de migraciones en este proyecto: la tabla "favoritos" se
// crea sola la primera vez que una función serverless la necesita, en vez de
// depender de que alguien la haya creado a mano en la consola de Postgres.
// El resultado se cachea por instancia de lambda para no pagar el costo en
// cada request.
let favoritosReady: Promise<void> | null = null;

export function ensureFavoritosTable(): Promise<void> {
  if (!favoritosReady) {
    favoritosReady = db
      .query(`
        CREATE TABLE IF NOT EXISTS favoritos (
          id          SERIAL PRIMARY KEY,
          usuario_id  INTEGER NOT NULL,
          prueba_id   INTEGER NOT NULL,
          created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
          UNIQUE (usuario_id, prueba_id)
        )
      `)
      .then(() => undefined)
      .catch((e) => {
        // Si falla, permitir reintentar en la próxima invocación en vez de
        // quedar rota para siempre en esta instancia de lambda.
        favoritosReady = null;
        throw e;
      });
  }
  return favoritosReady;
}

export default db;
