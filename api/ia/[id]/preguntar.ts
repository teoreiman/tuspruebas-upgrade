import type { VercelRequest, VercelResponse } from "@vercel/node";
import pool from "../../lib/db";
import { askWithContext } from "../../lib/ia";

// POST /api/ia/:id/preguntar — pregunta sobre una prueba puntual guardada en la base.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, message: "Method not allowed" });

  const id = Number(req.query.id);
  const { pregunta } = req.body ?? {};
  if (!pregunta) return res.status(400).json({ ok: false, message: "Falta la pregunta" });

  try {
    const { rows } = await pool.query("SELECT * FROM pruebas WHERE id = $1", [id]);
    const prueba = rows[0];
    if (!prueba) return res.status(404).json({ ok: false, message: "Prueba no encontrada" });

    const respuesta = await askWithContext(pregunta, prueba);
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
