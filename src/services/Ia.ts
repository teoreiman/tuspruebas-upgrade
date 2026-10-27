import { API_URL, apiFetch, jsonHeaders, mensajeDeError } from "./Api";

export interface ContextoIA {
  colegio: string;
  año: string;
  materia: string;
  profesor: string;
  tema: string;
}

export interface MensajeIA {
  role: "user" | "assistant";
  content: string;
}

export interface RespuestaIA {
  reply: string;
  conversacionId: number;
}

export async function enviarMensajeIA(params: {
  mensajes: MensajeIA[];
  contexto: ContextoIA;
  pruebaId?: number | null;
  conversacionId?: number | null;
  imagenRespuesta?: string | null;
}): Promise<RespuestaIA> {
  const res = await apiFetch(`${API_URL}/ia`, {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify({
      mensajes: params.mensajes.map((m) => ({ role: m.role, content: m.content })),
      contexto: params.contexto,
      prueba_id: params.pruebaId ?? null,
      conversacion_id: params.conversacionId ?? null,
      imagen_respuesta: params.imagenRespuesta ?? null,
    }),
  });

  if (!res.ok) {
    throw new Error(await mensajeDeError(res, "La IA no pudo responder"));
  }

  const data = (await res.json().catch(() => null)) as
    | { reply?: string; conversacion_id?: number }
    | null;
  if (!data || typeof data.reply !== "string" || !data.reply.trim()) {
    throw new Error(
      "El servidor no devolvió una respuesta de la IA. Revisá que /api/ia esté desplegada y que GEMINI_API_KEY esté configurada."
    );
  }
  return { reply: data.reply, conversacionId: data.conversacion_id ?? 0 };
}

export async function generarPruebaPractica(
  pruebaId: number,
  conversacionId?: number | null
): Promise<RespuestaIA> {
  const res = await apiFetch(`${API_URL}/ia/${pruebaId}/generar`, {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify({ conversacion_id: conversacionId ?? null }),
  });

  if (!res.ok) {
    throw new Error(await mensajeDeError(res, "No se pudo generar la prueba de práctica"));
  }

  const data = (await res.json().catch(() => null)) as
    | { texto?: string; conversacion_id?: number }
    | null;
  if (!data || typeof data.texto !== "string" || !data.texto.trim()) {
    throw new Error("El servidor no devolvió ejercicios generados.");
  }
  return { reply: data.texto, conversacionId: data.conversacion_id ?? 0 };
}
