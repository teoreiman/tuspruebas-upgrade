import pool from "./db";

// Sin límite, un solo usuario (o un bot) puede vaciar la cuota/plata de la API
// de IA en un rato. Un tope diario simple por usuario alcanza para evitar eso
// sin ser invasivo para el uso normal de un estudiante. Misma tabla que usa el
// backend Express (comparten la base), así que el límite es real sin importar
// desde dónde se conecte el estudiante.
export const LIMITE_DIARIO = Number(process.env.IA_LIMITE_DIARIO) || 5;

let tablaLista: Promise<void> | null = null;

const YA_EXISTE = new Set(["23505", "42P07", "42710"]);
function ignorarSiYaExiste(e: unknown): void {
  const code = (e as { code?: string } | null)?.code;
  if (code && YA_EXISTE.has(code)) return;
  throw e;
}

async function crearTabla(): Promise<void> {
  await pool
    .query(`
      CREATE TABLE IF NOT EXISTS ia_uso (
        id          SERIAL PRIMARY KEY,
        usuario_id  INTEGER NOT NULL,
        creado_en   TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `)
    .catch(ignorarSiYaExiste);

  await pool
    .query(`CREATE INDEX IF NOT EXISTS ia_uso_usuario_fecha_idx ON ia_uso (usuario_id, creado_en)`)
    .catch(ignorarSiYaExiste);
}

export function ensureIaUsoTable(): Promise<void> {
  if (!tablaLista) {
    tablaLista = crearTabla().catch((e) => {
      tablaLista = null;
      throw e;
    });
  }
  return tablaLista;
}

// Ventana móvil de 24hs, no "desde la medianoche": así no se resetea el
// contador esperando el cambio de día.
export async function usoUltimas24hs(usuarioId: number): Promise<number> {
  await ensureIaUsoTable();
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS n FROM ia_uso WHERE usuario_id = $1 AND creado_en > now() - interval '24 hours'`,
    [usuarioId]
  );
  return rows[0]?.n ?? 0;
}

export async function registrarUso(usuarioId: number): Promise<void> {
  await ensureIaUsoTable();
  await pool.query("INSERT INTO ia_uso (usuario_id) VALUES ($1)", [usuarioId]);
}
