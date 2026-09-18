import pool from "./db.js";

// Misma idea que favoritos (en db.ts): la tabla se crea sola la primera vez
// que una función serverless la necesita. Mismo esquema que usa el Express
// local (models/Notificacion.js), porque comparten la misma base de Neon.
let notificacionesReady: Promise<void> | null = null;

const YA_EXISTE = new Set(["23505", "42P07", "42710"]);

function ignorarSiYaExiste(e: unknown): void {
  const code = (e as { code?: string } | null)?.code;
  if (code && YA_EXISTE.has(code)) return;
  throw e;
}

async function crearTablaNotificaciones(): Promise<void> {
  await pool
    .query(`
      CREATE TABLE IF NOT EXISTS notificaciones (
        id          SERIAL PRIMARY KEY,
        usuario_id  INTEGER NOT NULL,
        tipo        TEXT NOT NULL,
        mensaje     TEXT NOT NULL,
        prueba_id   INTEGER,
        leida       BOOLEAN NOT NULL DEFAULT false,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `)
    .catch(ignorarSiYaExiste);

  await pool
    .query(`CREATE INDEX IF NOT EXISTS notificaciones_usuario_idx ON notificaciones (usuario_id, leida)`)
    .catch(ignorarSiYaExiste);
}

export function ensureNotificacionesTable(): Promise<void> {
  if (!notificacionesReady) {
    notificacionesReady = crearTablaNotificaciones().catch((e) => {
      notificacionesReady = null; // permitir reintentar en la próxima invocación
      throw e;
    });
  }
  return notificacionesReady;
}

export interface Notificacion {
  id: number;
  usuario_id: number;
  tipo: string;
  mensaje: string;
  prueba_id: number | null;
  leida: boolean;
  created_at: string;
}

// Pruebas subidas por alguien sin cuenta (usuarioId null) no generan aviso.
export async function crearNotificacion(opts: {
  usuarioId: number | null;
  tipo: string;
  mensaje: string;
  pruebaId?: number | null;
}): Promise<number | null> {
  if (!opts.usuarioId) return null;
  await ensureNotificacionesTable();
  const { rows } = await pool.query(
    `INSERT INTO notificaciones (usuario_id, tipo, mensaje, prueba_id) VALUES ($1,$2,$3,$4) RETURNING id`,
    [opts.usuarioId, opts.tipo, opts.mensaje, opts.pruebaId ?? null]
  );
  return rows[0].id as number;
}

export async function listarNotificaciones(usuarioId: number, limit = 30): Promise<Notificacion[]> {
  await ensureNotificacionesTable();
  const { rows } = await pool.query(
    `SELECT * FROM notificaciones WHERE usuario_id = $1 ORDER BY created_at DESC LIMIT $2`,
    [usuarioId, limit]
  );
  return rows as Notificacion[];
}

export async function contarNoLeidas(usuarioId: number): Promise<number> {
  await ensureNotificacionesTable();
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS n FROM notificaciones WHERE usuario_id = $1 AND leida = false`,
    [usuarioId]
  );
  return rows[0].n as number;
}

export async function marcarNotificacionLeida(id: number, usuarioId: number): Promise<number> {
  await ensureNotificacionesTable();
  const result = await pool.query(
    `UPDATE notificaciones SET leida = true WHERE id = $1 AND usuario_id = $2`,
    [id, usuarioId]
  );
  return result.rowCount ?? 0;
}

export async function marcarTodasLeidas(usuarioId: number): Promise<void> {
  await ensureNotificacionesTable();
  await pool.query(`UPDATE notificaciones SET leida = true WHERE usuario_id = $1 AND leida = false`, [usuarioId]);
}
