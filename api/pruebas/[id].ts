import type { VercelRequest, VercelResponse } from "@vercel/node";
import pool, { ensureFavoritosTable } from "../lib/db";
import { getAuthUser, isAdminUser } from "../lib/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = Number(req.query.id);

  if (req.method === "GET") {
    const user = getAuthUser(req);

    try {
      await ensureFavoritosTable();
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

  if (req.method === "DELETE") {
    const user = getAuthUser(req);
    if (!user) return res.status(401).json({ message: "No autenticado" });

    try {
      const { rows } = await pool.query("SELECT usuario_id FROM pruebas WHERE id = $1", [id]);
      if (!rows[0]) return res.status(404).json({ message: "Prueba no encontrada" });

      const esDueño = rows[0].usuario_id === user.id;
      if (!esDueño && !isAdminUser(user)) {
        return res.status(403).json({ message: "No podés eliminar esta prueba" });
      }

      await ensureFavoritosTable();
      await pool.query("DELETE FROM favoritos WHERE prueba_id = $1", [id]);
      await pool.query("DELETE FROM pruebas WHERE id = $1", [id]);
      return res.status(200).json({ ok: true });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
