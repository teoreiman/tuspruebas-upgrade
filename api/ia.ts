import type { VercelRequest, VercelResponse } from "@vercel/node";
import pool from "./lib/db";
import { getAuthUser } from "./lib/auth";
import { LIMITE_DIARIO, usoUltimas24hs, registrarUso } from "./lib/iaUso";
import { crearConversacion, agregarMensaje, conversacionPerteneceA } from "./lib/conversaciones";

// La IA corre en el backend: la API key nunca sale del servidor y el modelo
// puede ver la foto de la prueba (que está guardada como base64 en la base y
// nunca tendría que viajar al navegador sólo para reenviarla).
export const config = { maxDuration: 60 };

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const TIMEOUT_MS = 45_000;
const MAX_ARCHIVO_BYTES = 15 * 1024 * 1024;

// Materias donde las respuestas suelen tener fórmulas/cálculos: ahí conviene
// el formato con LaTeX y pasos numerados. El chat renderiza Markdown + LaTeX
// (remark-math/rehype-katex), así que tiene sentido pedírselo al modelo.
const MATERIAS_CON_FORMULAS = new Set(["Matemática", "Física", "Química", "Físico-Química"]);

interface MensajeCliente {
  role?: string;
  content?: string;
}

interface Contexto {
  colegio?: string;
  año?: string;
  materia?: string;
  profesor?: string;
  tema?: string;
}

interface ParteArchivo {
  inlineData: { mimeType: string; data: string };
}

function apiKey(): string | null {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENAI_API_KEY ||
    null
  );
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

  // Archivo alojado afuera (Cloudinary): lo bajamos acá para poder mandárselo
  // al modelo. Gemini acepta imágenes y PDFs inline.
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

function construirSystemPrompt(ctx: Contexto, prueba: Record<string, unknown> | null): string {
  const c = prueba ? safeJson(prueba.contenido) : {};
  const preguntas = typeof c.preguntas === "string" ? c.preguntas.trim() : "";
  const notas = typeof c.notas === "string" ? c.notas.trim() : "";

  const partes = [
    `Sos la IA de tusPruebas, un asistente educativo para estudiantes de secundaria de colegios judíos de Buenos Aires (ORT, Tarbut, Martín Buber, Wolfson).`,
    ``,
    `CONTEXTO DEL ESTUDIANTE`,
    `- Colegio: ${ctx.colegio || "No especificado"}`,
    `- Año: ${ctx.año || "No especificado"}`,
    `- Materia: ${ctx.materia || "No especificada"}`,
    `- Profesor/a: ${ctx.profesor || "No especificado"}`,
    `- Tema: ${ctx.tema || "No especificado"}`,
    ``,
    `CÓMO RESPONDÉS`,
    `- Siempre en español rioplatense (vos, tenés, hacé), claro y directo.`,
    `- Resolvés los ejercicios paso a paso, explicando el razonamiento de cada paso.`,
    `- Adaptás el nivel de complejidad al año escolar del estudiante.`,
    `- Usás **negrita** para los títulos y los resultados finales.`,
    `- Si algo del enunciado es ambiguo o no se llega a leer, lo decís en vez de inventarlo.`,
    `- Sos alentador y paciente, sin ser meloso.`,
  ];

  const materiaEfectiva = (prueba?.materia as string) || ctx.materia || "";
  if (MATERIAS_CON_FORMULAS.has(materiaEfectiva)) {
    partes.push(
      ``,
      `CÓMO RESOLVÉS EJERCICIOS DE ESTA MATERIA`,
      `El chat renderiza Markdown y LaTeX de verdad (no muestres el código, se ve como fórmula), ` +
        `así que resolvé los ejercicios con esta estructura:`,
      `1. Arrancá con un saludo corto, de tu propia redacción (no copies este renglón tal cual), ` +
        `contando en una oración qué vas a resolver.`,
      `2. Si hace falta, seguí con un recordatorio breve con la fórmula clave en bloque ($$...$$) ` +
        `y una lista de qué es cada término.`,
      `3. Después poné un separador (---), la consigna transcripta tal cual como cita (> ...), y otro separador.`,
      `4. Seguí con un título "### Resolución" y, si hay varios incisos, un "#### Parte a)" por cada uno.`,
      `5. Desarrollá pasos numerados ("Paso 1:", "Paso 2:"...), cada uno con una frase tuya ` +
        `explicando qué hacés y la cuenta correspondiente en LaTeX: $...$ para algo en medio de una ` +
        `oración, $$...$$ en línea aparte para desarrollos o el resultado de un paso.`,
      `6. Cerrá con el resultado final en **negrita**.`,
      `No hace falta este formato completo para preguntas cortas o conceptuales: usalo cuando ` +
        `estés resolviendo un ejercicio de verdad.`
    );
  }

  if (prueba) {
    partes.push(
      ``,
      `PRUEBA QUE ESTÁ MIRANDO EL ESTUDIANTE`,
      `- Tema: ${(prueba.tema as string) || "—"}`,
      `- Materia: ${(prueba.materia as string) || "—"}`,
      `- Colegio y año: ${(prueba.escuela as string) || "—"} · ${(prueba.anio as string) || "—"}`,
      `- Profesor/a: ${(prueba.profesor as string) || "—"}`
    );
    if (preguntas) {
      partes.push(``, `PREGUNTAS DE LA PRUEBA (transcriptas por quien la subió):`, preguntas);
    }
    if (notas) {
      partes.push(``, `NOTAS DE QUIEN LA SUBIÓ:`, notas);
    }
    partes.push(
      ``,
      `Si además te adjuntan la foto de la prueba, leela con atención: transcribí cada consigna antes de resolverla para no confundir números ni signos.`
    );
  }

  return partes.join("\n");
}

interface RespuestaGemini {
  candidates?: {
    content?: { parts?: { text?: string }[] };
    finishReason?: string;
  }[];
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
      return {
        ok: false,
        status: res.status,
        mensaje: data?.error?.message || `Gemini respondió ${res.status}`,
      };
    }

    const bloqueo = data?.promptFeedback?.blockReason;
    if (bloqueo) {
      return { ok: false, status: 200, mensaje: `La IA no pudo responder (${bloqueo}).` };
    }

    const texto =
      data?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text ?? "")
        .join("")
        .trim() ?? "";

    if (!texto) {
      const razon = data?.candidates?.[0]?.finishReason;
      return {
        ok: false,
        status: 200,
        mensaje: razon
          ? `La IA cortó la respuesta (${razon}). Probá reformular la pregunta.`
          : "La IA devolvió una respuesta vacía.",
      };
    }

    return { ok: true, texto };
  } catch (e) {
    const abortada = (e as { name?: string })?.name === "AbortError";
    return {
      ok: false,
      status: abortada ? 504 : 502,
      mensaje: abortada
        ? "La IA tardó demasiado en responder. Probá de nuevo con una pregunta más corta."
        : `No se pudo contactar a la IA: ${(e as Error).message}`,
    };
  } finally {
    clearTimeout(timer);
  }
}

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
    return res.status(503).json({
      message:
        "La IA no está configurada: falta la variable de entorno GEMINI_API_KEY en el servidor.",
    });
  }

  const body = leerBody(req);
  const mensajes = (Array.isArray(body.mensajes) ? body.mensajes : []) as MensajeCliente[];
  const contexto = (body.contexto ?? {}) as Contexto;
  const pruebaIdRaw = body.prueba_id;
  const pruebaId = Number(pruebaIdRaw);
  const conversacionIdRaw = body.conversacion_id;

  const limpios = mensajes
    .filter((m) => typeof m?.content === "string" && m.content.trim())
    .slice(-20); // sólo las últimas vueltas: alcanza y no infla el pedido

  if (limpios.length === 0) {
    return res.status(400).json({ message: "No hay ningún mensaje para responder" });
  }

  try {
    let prueba: Record<string, unknown> | null = null;
    if (Number.isInteger(pruebaId) && pruebaId > 0) {
      const { rows } = await pool.query("SELECT * FROM pruebas WHERE id = $1", [pruebaId]);
      prueba = rows[0] ?? null;
    }

    // El historial se guarda solo (como en Claude/ChatGPT): el último mensaje
    // del array es siempre el que el estudiante acaba de escribir, el resto ya
    // está guardado de vueltas anteriores.
    const nuevoMensaje = limpios[limpios.length - 1];
    let conversacionId = Number(conversacionIdRaw);
    const esConversacionNueva = !Number.isInteger(conversacionId) || conversacionId <= 0;

    if (esConversacionNueva) {
      conversacionId = await crearConversacion({
        usuarioId: user.id,
        pruebaId: (prueba?.id as number | undefined) ?? null,
        contexto,
        primerMensaje: nuevoMensaje.content!,
      });
    } else if (!(await conversacionPerteneceA(conversacionId, user.id))) {
      return res.status(404).json({ message: "Conversación no encontrada" });
    }

    await agregarMensaje(conversacionId, "user", nuevoMensaje.content!);

    const contenido = prueba ? safeJson(prueba.contenido) : {};
    const parteArchivo = prueba
      ? await archivoComoParte(
          contenido.archivo_url as string | undefined,
          contenido.archivo_tipo as string | undefined
        )
      : null;

    const contents = limpios.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content!.trim() }] as ({ text: string } | ParteArchivo)[],
    }));

    // La foto se adjunta al primer turno del usuario: queda en el contexto de
    // toda la conversación sin repetirse en cada mensaje.
    if (parteArchivo) {
      const primerUsuario = contents.find((c) => c.role === "user");
      if (primerUsuario) primerUsuario.parts.unshift(parteArchivo);
    }

    const systemPrompt = construirSystemPrompt(contexto, prueba);

    let ultimoError = { status: 502, mensaje: "No se pudo contactar a la IA" };

    for (const modelo of modelosACandidatos()) {
      // Los modelos 2.5 "piensan" antes de responder: con el presupuesto de
      // pensamiento en 0 responden más rápido y no se comen el límite de tokens
      // antes de escribir la respuesta. Si el modelo no soporta la opción,
      // reintentamos sin ella.
      let sinPensamiento = /2\.5-flash/.test(modelo);
      let seguirConOtroModelo = true;

      for (let intento = 0; intento < 2; intento++) {
        const payload: Record<string, unknown> = {
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            maxOutputTokens: 4096,
            ...(sinPensamiento ? { thinkingConfig: { thinkingBudget: 0 } } : {}),
          },
        };

        const r = await llamarGemini(modelo, key, payload);
        if (r.ok) {
          // Se cuenta recién si la IA respondió bien: un error nuestro o de la
          // API no debería gastarle cupo al estudiante.
          await registrarUso(user.id).catch(() => {});
          await agregarMensaje(conversacionId, "assistant", r.texto).catch(() => {});
          return res.status(200).json({
            reply: r.texto,
            modelo,
            conversacion_id: conversacionId,
            usados: usados + 1,
            limite: LIMITE_DIARIO,
          });
        }

        ultimoError = { status: r.status, mensaje: r.mensaje };

        if (sinPensamiento && /thinking/i.test(r.mensaje)) {
          sinPensamiento = false;
          continue;
        }

        // 404 / modelo inexistente: probamos el siguiente de la lista.
        seguirConOtroModelo =
          r.status === 404 || /not found|not supported|is not available/i.test(r.mensaje);
        break;
      }

      if (!seguirConOtroModelo) break;
    }

    const status = ultimoError.status === 504 ? 504 : 502;
    return res.status(status).json({ message: ultimoError.mensaje });
  } catch (e) {
    console.error("ia:", e);
    return res.status(500).json({ message: "Error interno del servidor al consultar la IA" });
  }
}
