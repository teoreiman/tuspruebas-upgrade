import type { VercelRequest, VercelResponse } from "@vercel/node";
import pool from "../lib/db";
import { getAuthUser, isAdminUser } from "../lib/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  const user = getAuthUser(req);
  if (!isAdminUser(user)) return res.status(403).json({ message: "Acceso denegado" });

  try {
    const { rows } = await pool.query(`
      SELECT p.*,
        COALESCE(u.nombre, p.contenido->>'usuario_nombre') AS usuario_nombre,
        COALESCE(u.email,  p.contenido->>'usuario_email')  AS usuario_email
      FROM pruebas p
      LEFT JOIN usuarios u ON p.usuario_id = u.id
      WHERE p.estado = 'rechazada'
      ORDER BY p.id DESC
    `);
    return res.status(200).json({ data: rows });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
