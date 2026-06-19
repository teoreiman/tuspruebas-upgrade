import type { VercelRequest, VercelResponse } from "@vercel/node";
import pool from "../lib/db";
import { getAuthUser } from "../lib/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  const user = getAuthUser(req);
  const id = Number(req.query.id);

  try {
    const { rows } = await pool.query(
      `SELECT p.*,
        COALESCE(u.nombre, p.contenido->>'usuario_nombre') AS usuario_nombre,
        COALESCE(u.email,  p.contenido->>'usuario_email')  AS usuario_email,
        EXISTS(
          SELECT 1 FROM favoritos f WHERE f.prueba_id = p.id AND f.usuario_id = $2
        ) AS favorito
      FROM pruebas p
      LEFT JOIN usuarios u ON p.usuario_id = u.id
      WHERE p.id = $1`,
      [id, user?.id ?? null]
    );

    if (!rows[0]) return res.status(404).json({ message: "Prueba no encontrada" });
    return res.status(200).json({ data: rows[0] });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
