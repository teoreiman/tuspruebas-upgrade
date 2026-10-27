import pool from "./db.js";

let avatarListo: Promise<void> | null = null;

const YA_EXISTE = new Set(["23505", "42P07", "42710", "42701"]);
function ignorarSiYaExiste(e: unknown): void {
  const code = (e as { code?: string } | null)?.code;
  if (code && YA_EXISTE.has(code)) return;
  throw e;
}

async function crearColumnaAvatar(): Promise<void> {
  const { rows } = await pool.query(
    `SELECT 1 FROM information_schema.columns
      WHERE table_schema = current_schema() AND table_name = 'usuarios' AND column_name = 'avatar'`
  );
  if (rows.length > 0) return;
  await pool.query(`ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS avatar TEXT`).catch(ignorarSiYaExiste);
}

export function ensureAvatarColumn(): Promise<void> {
  if (!avatarListo) {
    avatarListo = crearColumnaAvatar().catch((e) => {
      avatarListo = null;
      throw e;
    });
  }
  return avatarListo;
}

export interface UsuarioPublico {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  avatar: string | null;
}

export function usuarioPublico(row: Record<string, unknown>): UsuarioPublico {
  return {
    id: row.id as number,
    nombre: row.nombre as string,
    email: row.email as string,
    rol: row.rol as string,
    avatar: (row.avatar as string | null | undefined) ?? null,
  };
}
