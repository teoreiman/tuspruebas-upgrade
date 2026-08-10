import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAuthUser } from "../lib/auth";
import { listarConversacionesDeUsuario } from "../lib/conversaciones";

// GET /api/ia/conversaciones — historial de chats del usuario, más nuevo primero.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ message: "No autenticado" });

  try {
    const data = await listarConversacionesDeUsuario(user.id);
    return res.status(200).json({ data });
  } catch (e) {
    console.error("ia/conversaciones:", e);
    return res.status(500).json({ message: "Error al listar conversaciones" });
  }
}
