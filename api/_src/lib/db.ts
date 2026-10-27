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

let favoritosReady: Promise<void> | null = null;

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

  try {
    await db.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS favoritos_usuario_prueba_idx
         ON favoritos (usuario_id, prueba_id)`
    );
  } catch (e) {
    const code = (e as { code?: string } | null)?.code;
    if (code !== "23505") {
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
      favoritosReady = null;
      throw e;
    });
  }
  return favoritosReady;
}

export default db;
