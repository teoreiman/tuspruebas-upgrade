import type { VercelRequest, VercelResponse } from "@vercel/node";
import pool, { ensureFavoritosTable } from "../lib/db.js";
import { getAuthUser } from "../lib/auth.js";
import { stripInlineImages } from "../lib/pruebas.js";
import { ensureCalificacionesTable, CALIFICACION_JOIN, CALIFICACION_SELECT } from "../lib/calificaciones.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ message: "No autenticado" });

  try {
    await ensureFavoritosTable();
    await ensureCalificacionesTable();
    const { rows } = await pool.query(
      `SELECT p.*,
        COALESCE(u.nombre, p.contenido->>'usuario_nombre') AS usuario_nombre,
        COALESCE(u.email,  p.contenido->>'usuario_email')  AS usuario_email,
        EXISTS(
          SELECT 1 FROM favoritos f WHERE f.prueba_id = p.id AND f.usuario_id = $1
        ) AS favorito,
        (SELECT puntaje FROM calificaciones c WHERE c.prueba_id = p.id AND c.usuario_id = $1) AS mi_calificacion,
        ${CALIFICACION_SELECT}
       FROM pruebas p
       LEFT JOIN usuarios u ON p.usuario_id = u.id
       ${CALIFICACION_JOIN}
       WHERE p.usuario_id = $1
       ORDER BY p.id DESC`,
      [user.id]
    );
    return res.status(200).json({ data: stripInlineImages(rows) });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
