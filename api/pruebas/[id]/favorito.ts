import type { VercelRequest, VercelResponse } from "@vercel/node";
import pool, { ensureFavoritosTable } from "../../lib/db";
import { getAuthUser } from "../../lib/auth";

// El body puede llegar como objeto (Vercel parsea application/json) o como
// string si el cliente no mandó el Content-Type.
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

async function esFavorito(usuarioId: number, pruebaId: number): Promise<boolean> {
  const { rows } = await pool.query(
    "SELECT EXISTS(SELECT 1 FROM favoritos WHERE usuario_id = $1 AND prueba_id = $2) AS favorito",
    [usuarioId, pruebaId]
  );
  return rows[0]?.favorito === true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const metodo = req.method ?? "GET";
  if (!["GET", "POST", "PUT", "DELETE"].includes(metodo)) {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ message: "No autenticado" });

  const pruebaId = Number(req.query.id);
  if (!Number.isInteger(pruebaId) || pruebaId <= 0) {
    return res.status(400).json({ message: "Prueba inválida" });
  }

  try {
    await ensureFavoritosTable();

    if (metodo === "GET") {
      return res.status(200).json({ favorito: await esFavorito(user.id, pruebaId) });
    }

    // Un favorito de una prueba borrada quedaría huérfano y rompería el listado.
    const existe = await pool.query("SELECT 1 FROM pruebas WHERE id = $1", [pruebaId]);
    if (existe.rowCount === 0) {
      return res.status(404).json({ message: "Prueba no encontrada" });
    }

    // El cliente manda el estado que quiere ({ favorito: true|false }); si no
    // manda nada, se comporta como toggle. Mandar el estado explícito hace que
    // dos clicks rápidos converjan al mismo resultado en vez de pisarse.
    const body = leerBody(req);
    const deseado =
      metodo === "DELETE"
        ? false
        : typeof body.favorito === "boolean"
        ? body.favorito
        : !(await esFavorito(user.id, pruebaId));

    if (deseado) {
      await pool.query(
        `INSERT INTO favoritos (usuario_id, prueba_id)
         VALUES ($1, $2)
         ON CONFLICT (usuario_id, prueba_id) DO NOTHING`,
        [user.id, pruebaId]
      );
    } else {
      await pool.query("DELETE FROM favoritos WHERE usuario_id = $1 AND prueba_id = $2", [
        user.id,
        pruebaId,
      ]);
    }

    // Devolvemos lo que quedó realmente guardado, no lo que pidió el cliente.
    return res.status(200).json({ favorito: await esFavorito(user.id, pruebaId) });
  } catch (e) {
    console.error("favorito:", e);
    return res.status(500).json({ message: "No se pudo guardar el favorito" });
  }
}
