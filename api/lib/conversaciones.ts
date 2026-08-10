import pool from "./db";

let tablasListas: Promise<void> | null = null;

const YA_EXISTE = new Set(["23505", "42P07", "42710"]);
function ignorarSiYaExiste(e: unknown): void {
  const code = (e as { code?: string } | null)?.code;
  if (code && YA_EXISTE.has(code)) return;
  throw e;
}

async function crearTablas(): Promise<void> {
  await pool
    .query(`
      CREATE TABLE IF NOT EXISTS conversaciones (
        id          SERIAL PRIMARY KEY,
        usuario_id  INTEGER NOT NULL,
        prueba_id   INTEGER,
        titulo      VARCHAR(120) NOT NULL DEFAULT 'Nueva conversación',
        contexto    JSONB NOT NULL DEFAULT '{}',
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `)
    .catch(ignorarSiYaExiste);

  await pool
    .query(`
      CREATE TABLE IF NOT EXISTS mensajes_ia (
        id               SERIAL PRIMARY KEY,
        conversacion_id  INTEGER NOT NULL REFERENCES conversaciones(id) ON DELETE CASCADE,
        role             VARCHAR(20) NOT NULL,
        content          TEXT NOT NULL,
        created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `)
    .catch(ignorarSiYaExiste);

  await pool
    .query(`CREATE INDEX IF NOT EXISTS conversaciones_usuario_idx ON conversaciones (usuario_id, updated_at DESC)`)
    .catch(ignorarSiYaExiste);
  await pool
    .query(`CREATE INDEX IF NOT EXISTS mensajes_ia_conversacion_idx ON mensajes_ia (conversacion_id, created_at)`)
    .catch(ignorarSiYaExiste);
}

export function ensureConversacionesTables(): Promise<void> {
  if (!tablasListas) {
    tablasListas = crearTablas().catch((e) => {
      tablasListas = null;
      throw e;
    });
  }
  return tablasListas;
}

// Título corto a partir de la primera pregunta, como hacen Claude/ChatGPT
// antes de generar uno con el modelo (acá no vale la pena gastar una llamada
// a la IA solo para titular el chat).
function tituloDesde(texto: string): string {
  const limpio = (texto || "").trim().replace(/\s+/g, " ");
  if (!limpio) return "Nueva conversación";
  return limpio.length > 60 ? `${limpio.slice(0, 60)}…` : limpio;
}

export interface ConversacionRow {
  id: number;
  titulo: string;
  prueba_id: number | null;
  contexto: unknown;
  created_at: string;
  updated_at: string;
}

export async function crearConversacion(params: {
  usuarioId: number;
  pruebaId: number | null;
  contexto: unknown;
  primerMensaje: string;
}): Promise<number> {
  await ensureConversacionesTables();
  const { rows } = await pool.query(
    `INSERT INTO conversaciones (usuario_id, prueba_id, titulo, contexto)
     VALUES ($1, $2, $3, $4) RETURNING id`,
    [params.usuarioId, params.pruebaId, tituloDesde(params.primerMensaje), JSON.stringify(params.contexto ?? {})]
  );
  return rows[0].id;
}

export async function agregarMensaje(conversacionId: number, role: string, content: string): Promise<void> {
  await ensureConversacionesTables();
  await pool.query(
    "INSERT INTO mensajes_ia (conversacion_id, role, content) VALUES ($1, $2, $3)",
    [conversacionId, role, content]
  );
  await pool.query("UPDATE conversaciones SET updated_at = now() WHERE id = $1", [conversacionId]);
}

export async function conversacionPerteneceA(conversacionId: number, usuarioId: number): Promise<boolean> {
  await ensureConversacionesTables();
  const { rows } = await pool.query(
    "SELECT 1 FROM conversaciones WHERE id = $1 AND usuario_id = $2",
    [conversacionId, usuarioId]
  );
  return rows.length > 0;
}

export async function listarConversacionesDeUsuario(usuarioId: number): Promise<Record<string, unknown>[]> {
  await ensureConversacionesTables();
  const { rows } = await pool.query(
    `SELECT c.id, c.titulo, c.prueba_id, c.contexto, c.updated_at, c.created_at,
        (SELECT content FROM mensajes_ia m WHERE m.conversacion_id = c.id ORDER BY m.id DESC LIMIT 1) AS ultimo_mensaje
      FROM conversaciones c
     WHERE c.usuario_id = $1
     ORDER BY c.updated_at DESC`,
    [usuarioId]
  );
  return rows;
}

export async function obtenerConversacionConMensajes(
  conversacionId: number,
  usuarioId: number
): Promise<Record<string, unknown> | null> {
  await ensureConversacionesTables();
  const { rows: convRows } = await pool.query(
    "SELECT id, titulo, prueba_id, contexto, created_at, updated_at FROM conversaciones WHERE id = $1 AND usuario_id = $2",
    [conversacionId, usuarioId]
  );
  if (!convRows[0]) return null;

  const { rows: mensajes } = await pool.query(
    "SELECT id, role, content, created_at FROM mensajes_ia WHERE conversacion_id = $1 ORDER BY id ASC",
    [conversacionId]
  );
  return { ...convRows[0], mensajes };
}

export async function eliminarConversacion(conversacionId: number, usuarioId: number): Promise<boolean> {
  await ensureConversacionesTables();
  const { rowCount } = await pool.query(
    "DELETE FROM conversaciones WHERE id = $1 AND usuario_id = $2",
    [conversacionId, usuarioId]
  );
  return (rowCount ?? 0) > 0;
}
