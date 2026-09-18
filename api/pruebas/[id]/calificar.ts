import type { VercelRequest, VercelResponse } from "@vercel/node";
import pool from "../../lib/db.js";
import { getAuthUser } from "../../lib/auth.js";
import { calificar, eliminarCalificacion, resumenDePrueba } from "../../lib/calificaciones.js";

function leerBody(req: VercelRequest): Record<string, unknown> {
  const raw = req.body;
  if (!raw) return {};
  if (typeof raw === "object") return raw as Record<string, unknown>;
  try {
    return JSON.parse(raw as string) as Record<string, unknown>;
  } catch {
    return {};
  }
}

// POST /api/pruebas/:id/calificar — { puntaje: 1..5 }. Un solo puntaje por
// usuario y prueba: calificar de nuevo reemplaza el anterior. puntaje null/0
// borra la calificación (para poder "deshacer" desde la estrella).
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ message: "No autenticado" });

  const pruebaId = Number(req.query.id);
  if (!Number.isInteger(pruebaId) || pruebaId <= 0) {
    return res.status(400).json({ message: "Prueba inválida" });
  }

  const body = leerBody(req);
  const puntaje = body.puntaje as number | null | undefined;
  const quitar = puntaje === null || puntaje === 0;
  if (!quitar && (!Number.isInteger(puntaje) || (puntaje as number) < 1 || (puntaje as number) > 5)) {
    return res.status(400).json({ message: "El puntaje tiene que ser un número entero de 1 a 5" });
  }

  try {
    const existe = await pool.query("SELECT 1 FROM pruebas WHERE id = $1", [pruebaId]);
    if (existe.rowCount === 0) {
      return res.status(404).json({ message: "Prueba no encontrada" });
    }

    if (quitar) {
      await eliminarCalificacion(user.id, pruebaId);
    } else {
      await calificar(user.id, pruebaId, puntaje as number);
    }

    const resumen = await resumenDePrueba(pruebaId, user.id);
    return res.status(200).json({
      mi_calificacion: resumen.mi_calificacion,
      calificacion_promedio: resumen.promedio,
      calificacion_cantidad: resumen.cantidad,
    });
  } catch (e) {
    console.error("calificar:", e);
    return res.status(500).json({ message: "No se pudo guardar la calificación" });
  }
}
