import type { VercelRequest, VercelResponse } from "@vercel/node";
import pool from "../../lib/db";
import { getAuthUser } from "../../lib/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "PATCH") return res.status(405).json({ message: "Method not allowed" });

  const user = getAuthUser(req);
  if (!user || user.rol !== "admin") return res.status(403).json({ message: "Acceso denegado" });

  const id = Number(req.query.id);
  const { estado } = req.body ?? {};

  if (!["aprobada", "rechazada", "pendiente"].includes(estado)) {
    return res.status(400).json({ message: "Estado inválido" });
  }

  try {
    await pool.query("UPDATE pruebas SET estado = $1 WHERE id = $2", [estado, id]);
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
