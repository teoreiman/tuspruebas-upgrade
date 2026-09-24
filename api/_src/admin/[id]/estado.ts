import type { VercelRequest, VercelResponse } from "@vercel/node";
import pool from "../../lib/db.js";
import { getAuthUser, isAdminUser } from "../../lib/auth.js";
import { crearNotificacion } from "../../lib/notificaciones.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "PATCH") return res.status(405).json({ message: "Method not allowed" });

  const user = getAuthUser(req);
  if (!isAdminUser(user)) return res.status(403).json({ message: "Acceso denegado" });

  const id = Number(req.query.id);
  const { estado } = req.body ?? {};

  if (!["aprobada", "rechazada", "pendiente"].includes(estado)) {
    return res.status(400).json({ message: "Estado inválido" });
  }

  try {
    // La necesitamos antes de cambiar el estado para saber a quién avisarle
    // y con qué texto (materia/tema de la prueba).
    const { rows } = await pool.query(
      "SELECT usuario_id, materia, tema FROM pruebas WHERE id = $1",
      [id]
    );
    const prueba = rows[0];

    await pool.query("UPDATE pruebas SET estado = $1 WHERE id = $2", [estado, id]);

    if (prueba?.usuario_id && (estado === "aprobada" || estado === "rechazada")) {
      const detalle = [prueba.materia, prueba.tema].filter(Boolean).join(" · ");
      const mensaje = estado === "aprobada"
        ? `Tu prueba${detalle ? ` de ${detalle}` : ""} fue aprobada y ya está publicada.`
        : `Tu prueba${detalle ? ` de ${detalle}` : ""} fue rechazada.`;
      // No bloquea la respuesta al admin si por algún motivo falla el aviso.
      crearNotificacion({
        usuarioId: prueba.usuario_id,
        tipo: `prueba_${estado}`,
        mensaje,
        pruebaId: id,
      }).catch((e) => console.error("No se pudo crear la notificación:", e));
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
