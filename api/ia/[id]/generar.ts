import type { VercelRequest, VercelResponse } from "@vercel/node";
import pool from "../../lib/db";
import { getAuthUser } from "../../lib/auth";
import { LIMITE_DIARIO, usoUltimas24hs, registrarUso } from "../../lib/iaUso";
import { crearConversacion, agregarMensaje, conversacionPerteneceA } from "../../lib/conversaciones";

// La IA corre en el backend: la API key nunca sale del servidor.
export const config = { maxDuration: 60 };

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const TIMEOUT_MS = 45_000;
const MAX_ARCHIVO_BYTES = 15 * 1024 * 1024;

interface ParteArchivo {
  inlineData: { mimeType: string; data: string };
}

function apiKey(): string | null {
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENAI_API_KEY || null;
}

function modelosACandidatos(): string[] {
  const preferido = process.env.GEMINI_MODEL?.trim();
  const lista = [preferido, "gemini-2.5-flash", "gemini-2.0-flash"].filter(Boolean) as string[];
  return [...new Set(lista)];
}

function safeJson(raw: unknown): Record<string, unknown> {
  if (!raw) return {};
  if (typeof raw === "object") return raw as Record<string, unknown>;
  try {
    return JSON.parse(raw as string) as Record<string, unknown>;
  } catch {
    return {};
  }
}

/** Convierte el archivo de la prueba en una parte que Gemini pueda "ver". */
async function archivoComoParte(
  archivoUrl: string | undefined,
  archivoTipo: string | undefined
): Promise<ParteArchivo | null> {
  if (!archivoUrl) return null;

  if (archivoUrl.startsWith("data:")) {
    const coma = archivoUrl.indexOf(",");
    const encabezado = archivoUrl.slice(0, coma);
    const datos = archivoUrl.slice(coma + 1);
    if (!/;base64/i.test(encabezado) || !datos) return null;
    const mimeType = /^data:([^;,]+)/.exec(encabezado)?.[1] ?? "image/jpeg";
    if (datos.length > MAX_ARCHIVO_BYTES) return null;
    return { inlineData: { mimeType, data: datos } };
  }

  if (!/^https?:\/\//i.test(archivoUrl)) return null;

  try {
    const res = await fetch(archivoUrl);
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength > MAX_ARCHIVO_BYTES) return null;
    const mimeType =
      res.headers.get("content-type")?.split(";")[0] ||
      (archivoTipo === "pdf" ? "application/pdf" : "image/jpeg");
    if (!/^(image\/|application\/pdf)/.test(mimeType)) return null;
    return { inlineData: { mimeType, data: buf.toString("base64") } };
  } catch {
    return null;
  }
}

// Prompt de una sola vuelta: pide ejercicios NUEVOS parecidos a los de la
// prueba, no las resoluciones. El formato de salida va explícito y al final:
// si no, el modelo tiende a copiar la estructura del pedido en vez de generar
// la prueba en sí.
function construirPrompt(prueba: Record<string, unknown>, contenido: Record<string, unknown>, imagen: ParteArchivo | null): string {
  const partes = [
    `Generá una prueba escolar NUEVA de ${(prueba.materia as string) || "la materia"} para ` +
      `${(prueba.anio as string) || "el año correspondiente"} sobre el tema ` +
      `"${(prueba.tema as string) || "el mismo tema"}".`,
    ``,
    imagen
      ? `Los ejercicios de referencia están en la foto adjunta. Leelos y tomalos como referencia ` +
        `de dificultad y estilo, pero NO los repitas:`
      : `Tomá estos ejercicios como referencia de dificultad y estilo, pero NO los repitas:\n` +
        JSON.stringify({ preguntas: contenido.preguntas, notas: contenido.notas }),
    ``,
    `Formato de salida obligatorio: una lista numerada solo con los ejercicios nuevos. No repitas ` +
      `el enunciado de esta consigna ni agregues títulos, materia, año, resoluciones ni explicaciones.`,
  ];
  return partes.join("\n");
}

interface RespuestaGemini {
  candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[];
  promptFeedback?: { blockReason?: string };
  error?: { message?: string; status?: string };
}

async function llamarGemini(
  modelo: string,
  key: string,
  payload: unknown
): Promise<{ ok: true; texto: string } | { ok: false; status: number; mensaje: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${GEMINI_URL}/${encodeURIComponent(modelo)}:generateContent?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const data = (await res.json().catch(() => null)) as RespuestaGemini | null;

    if (!res.ok) {
      return { ok: false, status: res.status, mensaje: data?.error?.message || `Gemini respondió ${res.status}` };
    }

    const bloqueo = data?.promptFeedback?.blockReason;
    if (bloqueo) return { ok: false, status: 200, mensaje: `La IA no pudo responder (${bloqueo}).` };

    const texto = data?.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("").trim() ?? "";
    if (!texto) {
      const razon = data?.candidates?.[0]?.finishReason;
      return {
        ok: false, status: 200,
        mensaje: razon ? `La IA cortó la respuesta (${razon}).` : "La IA devolvió una respuesta vacía.",
      };
    }
    return { ok: true, texto };
  } catch (e) {
    const abortada = (e as { name?: string })?.name === "AbortError";
    return {
      ok: false,
      status: abortada ? 504 : 502,
      mensaje: abortada ? "La IA tardó demasiado en responder." : `No se pudo contactar a la IA: ${(e as Error).message}`,
    };
  } finally {
    clearTimeout(timer);
  }
}

// POST /api/ia/:id/generar — "Modo autoevaluación": genera ejercicios nuevos
// parecidos a los de la prueba, y lo deja guardado en la conversación para
// poder seguir pidiendo ayuda o corrección ahí mismo después.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ message: "No autenticado" });

  const usados = await usoUltimas24hs(user.id).catch(() => 0);
  if (usados >= LIMITE_DIARIO) {
    return res.status(429).json({
      message: `Alcanzaste el límite de ${LIMITE_DIARIO} preguntas a la IA por día. Probá de nuevo más tarde.`,
    });
  }

  const key = apiKey();
  if (!key) {
    return res.status(503).json({ message: "La IA no está configurada: falta GEMINI_API_KEY en el servidor." });
  }

  const pruebaId = Number(req.query.id);
  if (!Number.isInteger(pruebaId) || pruebaId <= 0) {
    return res.status(400).json({ message: "Prueba inválida" });
  }

  try {
    const { rows } = await pool.query("SELECT * FROM pruebas WHERE id = $1", [pruebaId]);
    const prueba = rows[0];
    if (!prueba) return res.status(404).json({ message: "Prueba no encontrada" });

    const contenido = safeJson(prueba.contenido);
    const pedido = "Generame una prueba de práctica parecida a esta, para autoevaluarme.";

    const body = (typeof req.body === "object" ? req.body : {}) as { conversacion_id?: number };
    let conversacionId = Number(body.conversacion_id);
    const esConversacionNueva = !Number.isInteger(conversacionId) || conversacionId <= 0;

    if (esConversacionNueva) {
      conversacionId = await crearConversacion({
        usuarioId: user.id,
        pruebaId: prueba.id,
        contexto: {
          colegio: prueba.escuela, año: prueba.anio, materia: prueba.materia,
          profesor: prueba.profesor, tema: prueba.tema,
        },
        primerMensaje: pedido,
      });
    } else if (!(await conversacionPerteneceA(conversacionId, user.id))) {
      return res.status(404).json({ message: "Conversación no encontrada" });
    }

    await agregarMensaje(conversacionId, "user", pedido);

    const imagen = await archivoComoParte(
      contenido.archivo_url as string | undefined,
      contenido.archivo_tipo as string | undefined
    );
    const prompt = construirPrompt(prueba, contenido, imagen);
    const parts: ({ text: string } | ParteArchivo)[] = [{ text: prompt }];
    if (imagen) parts.push(imagen);

    let ultimoError = { status: 502, mensaje: "No se pudo contactar a la IA" };

    for (const modelo of modelosACandidatos()) {
      const payload = {
        contents: [{ role: "user", parts }],
        generationConfig: { temperature: 0.8, topP: 0.95, maxOutputTokens: 2048 },
      };

      const r = await llamarGemini(modelo, key, payload);
      if (!r.ok) {
        ultimoError = { status: r.status, mensaje: r.mensaje };
        const seguirConOtroModelo = r.status === 404 || /not found|not supported|is not available/i.test(r.mensaje);
        if (seguirConOtroModelo) continue;
        break;
      }

      await registrarUso(user.id).catch(() => {});
      await agregarMensaje(conversacionId, "assistant", r.texto).catch(() => {});
      return res.status(200).json({
        texto: r.texto,
        conversacion_id: conversacionId,
        usados: usados + 1,
        limite: LIMITE_DIARIO,
      });
    }

    const status = ultimoError.status === 504 ? 504 : 502;
    return res.status(status).json({ message: `No se pudo generar la prueba de práctica: ${ultimoError.mensaje}` });
  } catch (e) {
    console.error("ia/:id/generar:", e);
    return res.status(500).json({ message: "Error interno del servidor al generar la prueba de práctica" });
  }
}
