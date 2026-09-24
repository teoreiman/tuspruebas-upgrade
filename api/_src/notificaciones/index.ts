import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAuthUser } from "../lib/auth.js";
import { listarNotificaciones, contarNoLeidas } from "../lib/notificaciones.js";

// GET /api/notificaciones — las últimas del usuario logueado + cuántas no leyó.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ message: "No autenticado" });

  try {
    const [data, no_leidas] = await Promise.all([
      listarNotificaciones(user.id),
      contarNoLeidas(user.id),
    ]);
    return res.status(200).json({ data, no_leidas });
  } catch (e) {
    console.error("notificaciones:", e);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
