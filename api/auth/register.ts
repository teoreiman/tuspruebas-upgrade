import type { VercelRequest, VercelResponse } from "@vercel/node";
import bcrypt from "bcryptjs";
import pool from "../lib/db";
import { signToken } from "../lib/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { nombre, email, password } = req.body ?? {};
  if (!nombre || !email || !password) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }

  try {
    const existing = await pool.query("SELECT id FROM usuarios WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "El email ya está registrado" });
    }

    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      "INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING id, nombre, email, rol",
      [nombre, email, hash]
    );
    const user = rows[0];
    const token = signToken({ id: user.id, email: user.email, rol: user.rol });

    return res.status(201).json({
      ok: true,
      token,
      usuario: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
