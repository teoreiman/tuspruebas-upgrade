import type { VercelRequest, VercelResponse } from "@vercel/node";
import bcrypt from "bcryptjs";
import pool from "./lib/db.js";
import { getAuthUser, signToken, SUPER_ADMIN_EMAIL } from "./lib/auth.js";
import { ensureAvatarColumn, usuarioPublico } from "./lib/usuarios.js";

const MAX_NOMBRE = 60;
const MIN_PASSWORD = 6;
const MAX_AVATAR = 200_000;
const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const AVATAR_VALIDO = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/;

function datosDePerfil(row: Record<string, unknown>) {
  return { usuario: usuarioPublico(row), tiene_password: !!row.password };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const auth = getAuthUser(req);
  if (!auth) return res.status(401).json({ message: "No autenticado" });

  try {
    await ensureAvatarColumn();
    const { rows } = await pool.query("SELECT * FROM usuarios WHERE id = $1", [auth.id]);
    const actual = rows[0];
    if (!actual) return res.status(404).json({ message: "Usuario no encontrado" });

    if (req.method === "GET") return res.status(200).json(datosDePerfil(actual));

    const { nombre, email, avatar, password_actual, password_nueva } = req.body ?? {};
    const cambios: Record<string, unknown> = {};

    if (nombre !== undefined) {
      const limpio = typeof nombre === "string" ? nombre.trim() : "";
      if (!limpio) return res.status(400).json({ message: "El nombre no puede quedar vacío" });
      if (limpio.length > MAX_NOMBRE) {
        return res.status(400).json({ message: `El nombre puede tener hasta ${MAX_NOMBRE} caracteres` });
      }
      if (limpio !== actual.nombre) cambios.nombre = limpio;
    }

    if (avatar !== undefined) {
      const valido = avatar === null ||
        (typeof avatar === "string" && avatar.length <= MAX_AVATAR && AVATAR_VALIDO.test(avatar));
      if (!valido) return res.status(400).json({ message: "La foto de perfil no es válida" });
      cambios.avatar = avatar;
    }

    if (email !== undefined) {
      const limpio = typeof email === "string" ? email.trim() : "";
      if (limpio !== actual.email) {
        if (!EMAIL_VALIDO.test(limpio)) return res.status(400).json({ message: "El email no es válido" });
        if (String(actual.email).toLowerCase() === SUPER_ADMIN_EMAIL) {
          return res.status(403).json({ message: "El email de la cuenta de administración no se puede cambiar" });
        }
        cambios.email = limpio;
      }
    }

    if (password_nueva !== undefined && password_nueva !== "") {
      if (typeof password_nueva !== "string" || password_nueva.length < MIN_PASSWORD) {
        return res.status(400).json({ message: `La contraseña nueva debe tener al menos ${MIN_PASSWORD} caracteres` });
      }
    }
    const cambiaPassword = typeof password_nueva === "string" && password_nueva !== "";

    if ((cambios.email !== undefined || cambiaPassword) && actual.password) {
      const coincide = typeof password_actual === "string" && (await bcrypt.compare(password_actual, actual.password));
      if (!coincide) return res.status(400).json({ message: "La contraseña actual no es correcta" });
    }

    if (cambios.email !== undefined) {
      const emailMin = (cambios.email as string).toLowerCase();
      const ocupado = emailMin === SUPER_ADMIN_EMAIL || (await pool.query(
        "SELECT 1 FROM usuarios WHERE LOWER(email) = $1 AND id <> $2",
        [emailMin, auth.id]
      )).rows.length > 0;
      if (ocupado) return res.status(409).json({ message: "El email ya está registrado" });
    }

    if (cambiaPassword) cambios.password = await bcrypt.hash(password_nueva, 10);

    let usuario = actual;
    const columnas = Object.keys(cambios);
    if (columnas.length > 0) {
      const sets = columnas.map((columna, i) => `${columna} = $${i + 2}`).join(", ");
      const actualizado = await pool.query(
        `UPDATE usuarios SET ${sets} WHERE id = $1 RETURNING *`,
        [auth.id, ...columnas.map((columna) => cambios[columna])]
      );
      usuario = actualizado.rows[0];
    }

    return res.status(200).json({
      ok: true,
      token: signToken({ id: usuario.id, email: usuario.email, rol: usuario.rol }),
      ...datosDePerfil(usuario),
    });
  } catch (e) {
    if ((e as { code?: string } | null)?.code === "23505") {
      return res.status(409).json({ message: "El email ya está registrado" });
    }
    console.error(e);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
