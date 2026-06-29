import type { VercelRequest, VercelResponse } from "@vercel/node";
import pool from "../lib/db";
import { getAuthUser } from "../lib/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ message: "No autenticado" });

  try {
    const { rows } = await pool.query(
      `SELECT p.*,
        COALESCE(u.nombre, p.contenido->>'usuario_nombre') AS usuario_nombre,
        COALESCE(u.email,  p.contenido->>'usuario_email')  AS usuario_email,
        true AS favorito
       FROM pruebas p
       INNER JOIN favoritos fav ON fav.prueba_id = p.id AND fav.usuario_id = $1
       LEFT JOIN usuarios u ON p.usuario_id = u.id
       WHERE p.estado = 'aprobada'
       ORDER BY p.id DESC`,
      [user.id]
    );
    return res.status(200).json({ data: rows });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
