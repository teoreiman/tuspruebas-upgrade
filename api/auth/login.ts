import type { VercelRequest, VercelResponse } from "@vercel/node";
import bcrypt from "bcryptjs";
import pool from "../lib/db";
import { signToken } from "../lib/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ message: "Email y contraseña requeridos" });

  try {
    const { rows } = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const token = signToken({ id: user.id, email: user.email, rol: user.rol });
    return res.status(200).json({
      ok: true,
      token,
      usuario: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
