import type { VercelRequest, VercelResponse } from "@vercel/node";
import pool from "../lib/db";
import { getAuthUser } from "../lib/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    const user = getAuthUser(req);
    const { escuela, anio, materia } = req.query;

    let q = `
      SELECT p.*,
        COALESCE(u.nombre, p.contenido->>'usuario_nombre') AS usuario_nombre,
        COALESCE(u.email,  p.contenido->>'usuario_email')  AS usuario_email,
        EXISTS(
          SELECT 1 FROM favoritos f WHERE f.prueba_id = p.id AND f.usuario_id = $1
        ) AS favorito
      FROM pruebas p
      LEFT JOIN usuarios u ON p.usuario_id = u.id
      WHERE p.estado = 'aprobada'
    `;
    const params: (string | number | null)[] = [user?.id ?? null];

    if (escuela) { params.push(escuela as string); q += ` AND p.escuela ILIKE $${params.length}`; }
    if (anio)    { params.push(anio as string);    q += ` AND p.anio = $${params.length}`; }
    if (materia) { params.push(materia as string); q += ` AND p.materia ILIKE $${params.length}`; }

    q += " ORDER BY p.id DESC";

    try {
      const { rows } = await pool.query(q, params);
      return res.status(200).json({ data: rows });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  if (req.method === "POST") {
    const user = getAuthUser(req);
    if (!user) return res.status(401).json({ message: "No autenticado" });

    const { titulo, materia, anio, profesor, tema, escuela, contenido } = req.body ?? {};
    if (!titulo || !materia || !anio || !escuela) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    try {
      const { rows } = await pool.query(
        `INSERT INTO pruebas (titulo, materia, anio, profesor, tema, escuela, contenido, usuario_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
        [titulo, materia, anio, profesor ?? null, tema ?? null, escuela, JSON.stringify(contenido ?? {}), user.id]
      );
      return res.status(201).json({ id: rows[0].id });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
