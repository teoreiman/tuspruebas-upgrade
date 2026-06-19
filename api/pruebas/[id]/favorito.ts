import type { VercelRequest, VercelResponse } from "@vercel/node";
import pool from "../../lib/db";
import { getAuthUser } from "../../lib/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ message: "No autenticado" });

  const pruebaId = Number(req.query.id);

  try {
    const existing = await pool.query(
      "SELECT id FROM favoritos WHERE usuario_id = $1 AND prueba_id = $2",
      [user.id, pruebaId]
    );

    if (existing.rows.length > 0) {
      await pool.query("DELETE FROM favoritos WHERE usuario_id = $1 AND prueba_id = $2", [user.id, pruebaId]);
      return res.status(200).json({ favorito: false });
    } else {
      await pool.query("INSERT INTO favoritos (usuario_id, prueba_id) VALUES ($1, $2)", [user.id, pruebaId]);
      return res.status(200).json({ favorito: true });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
