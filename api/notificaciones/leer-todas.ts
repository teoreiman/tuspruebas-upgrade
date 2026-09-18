import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAuthUser } from "../lib/auth.js";
import { marcarTodasLeidas } from "../lib/notificaciones.js";

// PATCH /api/notificaciones/leer-todas
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "PATCH") return res.status(405).json({ message: "Method not allowed" });

  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ message: "No autenticado" });

  try {
    await marcarTodasLeidas(user.id);
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("notificaciones/leer-todas:", e);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
