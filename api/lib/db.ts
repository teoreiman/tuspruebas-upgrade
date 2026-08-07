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

// Dos lambdas corriendo CREATE ... IF NOT EXISTS a la vez pueden chocar en el
// catálogo de Postgres: el error es benigno (el objeto quedó creado igual).
const YA_EXISTE = new Set(["23505", "42P07", "42710"]);

function ignorarSiYaExiste(e: unknown): void {
  const code = (e as { code?: string } | null)?.code;
  if (code && YA_EXISTE.has(code)) return;
  throw e;
}

function crearIndicePorUsuario(): Promise<void> {
  return db
    .query(`CREATE INDEX IF NOT EXISTS favoritos_usuario_idx ON favoritos (usuario_id)`)
    .then(() => undefined)
    .catch(ignorarSiYaExiste);
}

async function crearTablaFavoritos(): Promise<void> {
  await db
    .query(`
      CREATE TABLE IF NOT EXISTS favoritos (
        id          SERIAL PRIMARY KEY,
        usuario_id  INTEGER NOT NULL,
        prueba_id   INTEGER NOT NULL,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
        UNIQUE (usuario_id, prueba_id)
      )
    `)
    .catch(ignorarSiYaExiste);

  // La tabla puede venir de una versión anterior sin la restricción única, y sin
  // ella un doble click deja dos filas y la prueba aparece duplicada en
  // "guardadas". Creamos el índice único aparte; si hay duplicados viejos, los
  // limpiamos y reintentamos.
  try {
    await db.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS favoritos_usuario_prueba_idx
         ON favoritos (usuario_id, prueba_id)`
    );
  } catch (e) {
    const code = (e as { code?: string } | null)?.code;
    if (code !== "23505") {
      // No son duplicados: si el error es "ya existe" lo ignoramos, si no, sube.
      ignorarSiYaExiste(e);
      return crearIndicePorUsuario();
    }
    await db.query(`
      DELETE FROM favoritos a
        USING favoritos b
       WHERE a.ctid < b.ctid
         AND a.usuario_id = b.usuario_id
         AND a.prueba_id  = b.prueba_id
    `);
    await db
      .query(
        `CREATE UNIQUE INDEX IF NOT EXISTS favoritos_usuario_prueba_idx
           ON favoritos (usuario_id, prueba_id)`
      )
      .catch(ignorarSiYaExiste);
  }

  await crearIndicePorUsuario();
}

export function ensureFavoritosTable(): Promise<void> {
  if (!favoritosReady) {
    favoritosReady = crearTablaFavoritos().catch((e) => {
      // Si falla, permitir reintentar en la próxima invocación en vez de
      // quedar rota para siempre en esta instancia de lambda.
      favoritosReady = null;
      throw e;
    });
  }
  return favoritosReady;
}

export default db;
