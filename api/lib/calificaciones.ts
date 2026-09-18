import pool from "./db.js";

// Misma idea que las demás tablas "lazy": se crea sola la primera vez que
// hace falta. Mismo esquema que el Express local (models/Calificacion.js).
let calificacionesReady: Promise<void> | null = null;

const YA_EXISTE = new Set(["23505", "42P07", "42710"]);

function ignorarSiYaExiste(e: unknown): void {
  const code = (e as { code?: string } | null)?.code;
  if (code && YA_EXISTE.has(code)) return;
  throw e;
}

async function crearTablaCalificaciones(): Promise<void> {
  await pool
    .query(`
      CREATE TABLE IF NOT EXISTS calificaciones (
        id          SERIAL PRIMARY KEY,
        usuario_id  INTEGER NOT NULL,
        prueba_id   INTEGER NOT NULL,
        puntaje     SMALLINT NOT NULL CHECK (puntaje BETWEEN 1 AND 5),
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
        UNIQUE (usuario_id, prueba_id)
      )
    `)
    .catch(ignorarSiYaExiste);

  await pool
    .query(`CREATE INDEX IF NOT EXISTS calificaciones_prueba_idx ON calificaciones (prueba_id)`)
    .catch(ignorarSiYaExiste);
}

export function ensureCalificacionesTable(): Promise<void> {
  if (!calificacionesReady) {
    calificacionesReady = crearTablaCalificaciones().catch((e) => {
      calificacionesReady = null;
      throw e;
    });
  }
  return calificacionesReady;
}

// SQL reutilizable: mismo patrón que el EXISTS(...) de favoritos, pero de
// promedio/cantidad. Se pega como fragmento en cada SELECT que liste pruebas.
export const CALIFICACION_JOIN = `
  LEFT JOIN (
    SELECT prueba_id, ROUND(AVG(puntaje)::numeric, 1) AS promedio, COUNT(*)::int AS cantidad
    FROM calificaciones GROUP BY prueba_id
  ) cal ON cal.prueba_id = p.id
`;
export const CALIFICACION_SELECT = "cal.promedio AS calificacion_promedio, COALESCE(cal.cantidad, 0) AS calificacion_cantidad";

export async function calificar(usuarioId: number, pruebaId: number, puntaje: number): Promise<void> {
  await ensureCalificacionesTable();
  await pool.query(
    `INSERT INTO calificaciones (usuario_id, prueba_id, puntaje)
     VALUES ($1,$2,$3)
     ON CONFLICT (usuario_id, prueba_id) DO UPDATE SET puntaje = EXCLUDED.puntaje, created_at = now()`,
    [usuarioId, pruebaId, puntaje]
  );
}

export async function eliminarCalificacion(usuarioId: number, pruebaId: number): Promise<void> {
  await ensureCalificacionesTable();
  await pool.query(`DELETE FROM calificaciones WHERE usuario_id = $1 AND prueba_id = $2`, [usuarioId, pruebaId]);
}

export async function resumenDePrueba(
  pruebaId: number,
  usuarioId: number | null
): Promise<{ promedio: number | null; cantidad: number; mi_calificacion: number | null }> {
  await ensureCalificacionesTable();
  const { rows } = await pool.query(
    `SELECT ${CALIFICACION_SELECT},
        ${usuarioId ? "(SELECT puntaje FROM calificaciones WHERE prueba_id = $1 AND usuario_id = $2)" : "NULL"} AS mi_calificacion
       FROM (SELECT $1::int AS id) p
       ${CALIFICACION_JOIN}`,
    usuarioId ? [pruebaId, usuarioId] : [pruebaId]
  );
  const row = rows[0] ?? {};
  return {
    promedio: row.calificacion_promedio !== null && row.calificacion_promedio !== undefined ? Number(row.calificacion_promedio) : null,
    cantidad: Number(row.calificacion_cantidad) || 0,
    mi_calificacion: row.mi_calificacion ?? null,
  };
}
