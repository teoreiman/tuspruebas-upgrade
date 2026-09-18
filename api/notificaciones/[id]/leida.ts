import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAuthUser } from "../../lib/auth.js";
import { marcarNotificacionLeida } from "../../lib/notificaciones.js";

// PATCH /api/notificaciones/:id/leida
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "PATCH") return res.status(405).json({ message: "Method not allowed" });

  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ message: "No autenticado" });

  const id = Number(req.query.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: "Notificación inválida" });
  }

  try {
    await marcarNotificacionLeida(id, user.id);
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("notificaciones/[id]/leida:", e);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
