import type { VercelRequest, VercelResponse } from "@vercel/node";
import { askFreeform } from "../lib/ia";

// POST /api/ia/preguntar — chat libre, sin prueba asociada.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, message: "Method not allowed" });

  const { pregunta, contexto } = req.body ?? {};
  if (!pregunta) return res.status(400).json({ ok: false, message: "Falta la pregunta" });

  try {
    const respuesta = await askFreeform(pregunta, contexto);
    return res.status(200).json({ ok: true, respuesta });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      ok: false,
      message: "Error con la IA",
      error: e instanceof Error ? e.message : String(e),
    });
  }
}
