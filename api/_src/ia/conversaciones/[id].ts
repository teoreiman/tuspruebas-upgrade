import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAuthUser } from "../../lib/auth.js";
import { obtenerConversacionConMensajes, renombrarConversacion, eliminarConversacion } from "../../lib/conversaciones.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ message: "No autenticado" });

  const id = Number(req.query.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: "Conversación inválida" });
  }

  if (req.method === "GET") {
    try {
      const data = await obtenerConversacionConMensajes(id, user.id);
      if (!data) return res.status(404).json({ message: "Conversación no encontrada" });
      return res.status(200).json({ data });
    } catch (e) {
      console.error("ia/conversaciones/[id] GET:", e);
      return res.status(500).json({ message: "Error al obtener la conversación" });
    }
  }

  if (req.method === "PATCH") {
    try {
      const raw = req.body;
      const body = (typeof raw === "object" && raw ? raw : JSON.parse((raw as string) || "{}")) as { titulo?: unknown };
      const titulo = typeof body.titulo === "string" ? body.titulo.trim() : "";
      if (!titulo) return res.status(400).json({ message: "El nombre no puede estar vacío" });

      const renombrada = await renombrarConversacion(id, user.id, titulo.slice(0, 120));
      if (!renombrada) return res.status(404).json({ message: "Conversación no encontrada" });
      return res.status(200).json({ ok: true });
    } catch (e) {
      console.error("ia/conversaciones/[id] PATCH:", e);
      return res.status(500).json({ message: "Error al renombrar la conversación" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const borrada = await eliminarConversacion(id, user.id);
      if (!borrada) return res.status(404).json({ message: "Conversación no encontrada" });
      return res.status(200).json({ ok: true });
    } catch (e) {
      console.error("ia/conversaciones/[id] DELETE:", e);
      return res.status(500).json({ message: "Error al eliminar la conversación" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
