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

/**
 * Manda la conversación al backend (/api/ia). La clave de la IA vive en el
 * servidor: el navegador nunca la ve. Si la conversación referencia una prueba,
 * el backend le adjunta la foto y las preguntas al modelo.
 *
 * El backend guarda el historial solo: pasale el conversacionId que te haya
 * devuelto la vez anterior para seguir el mismo chat, o dejalo en null para
 * arrancar uno nuevo.
 */
export async function enviarMensajeIA(params: {
  mensajes: MensajeIA[];
  contexto: ContextoIA;
  pruebaId?: number | null;
  conversacionId?: number | null;
}): Promise<RespuestaIA> {
  const res = await apiFetch(`${API_URL}/ia`, {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify({
      mensajes: params.mensajes.map((m) => ({ role: m.role, content: m.content })),
      contexto: params.contexto,
      prueba_id: params.pruebaId ?? null,
      conversacion_id: params.conversacionId ?? null,
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
