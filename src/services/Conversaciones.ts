import { API_URL, apiFetch, jsonHeaders, mensajeDeError } from "./Api";
import type { ContextoIA } from "./Ia";

export interface ConversacionResumen {
  id: number;
  titulo: string;
  pruebaId: number | null;
  contexto: ContextoIA;
  ultimoMensaje: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MensajeGuardado {
  id: number;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface ConversacionCompleta extends ConversacionResumen {
  mensajes: MensajeGuardado[];
}

function mapResumen(raw: Record<string, unknown>): ConversacionResumen {
  return {
    id: raw.id as number,
    titulo: (raw.titulo as string) || "Nueva conversación",
    pruebaId: (raw.prueba_id as number | null) ?? null,
    contexto: (raw.contexto as ContextoIA) || { colegio: "", año: "", materia: "", profesor: "", tema: "" },
    ultimoMensaje: (raw.ultimo_mensaje as string | null) ?? null,
    createdAt: raw.created_at as string,
    updatedAt: raw.updated_at as string,
  };
}

/** Historial de chats del usuario, más reciente primero. */
export async function listarConversaciones(): Promise<ConversacionResumen[]> {
  const res = await apiFetch(`${API_URL}/ia/conversaciones`, { headers: jsonHeaders() });
  if (!res.ok) throw new Error(await mensajeDeError(res, "No se pudo cargar el historial"));
  const data = (await res.json().catch(() => null)) as { data?: Record<string, unknown>[] } | null;
  return (data?.data ?? []).map(mapResumen);
}

/** Un chat completo, con todos sus mensajes, para retomarlo. */
export async function obtenerConversacion(id: number): Promise<ConversacionCompleta> {
  const res = await apiFetch(`${API_URL}/ia/conversaciones/${id}`, { headers: jsonHeaders() });
  if (!res.ok) throw new Error(await mensajeDeError(res, "No se pudo abrir la conversación"));
  const data = (await res.json().catch(() => null)) as { data?: Record<string, unknown> } | null;
  if (!data?.data) throw new Error("Conversación no encontrada");
  const raw = data.data;
  const mensajes = ((raw.mensajes as Record<string, unknown>[]) ?? []).map((m) => ({
    id: m.id as number,
    role: m.role as "user" | "assistant",
    content: m.content as string,
    createdAt: m.created_at as string,
  }));
  return { ...mapResumen(raw), mensajes };
}

export async function eliminarConversacion(id: number): Promise<void> {
  const res = await apiFetch(`${API_URL}/ia/conversaciones/${id}`, {
    method: "DELETE",
    headers: jsonHeaders(),
  });
  if (!res.ok) throw new Error(await mensajeDeError(res, "No se pudo borrar la conversación"));
}
