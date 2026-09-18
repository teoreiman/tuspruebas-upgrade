import { API_URL, apiFetch, authHeaders, jsonOrThrow, mensajeDeError } from "./Api";

export interface Notificacion {
  id: number;
  tipo: string;
  mensaje: string;
  prueba_id: number | null;
  leida: boolean;
  created_at: string;
}

export async function fetchNotificaciones(): Promise<{ notificaciones: Notificacion[]; noLeidas: number }> {
  const res = await apiFetch(`${API_URL}/notificaciones`, { headers: authHeaders() });
  const data = await jsonOrThrow(res, "Error al cargar notificaciones");
  return {
    notificaciones: (data.data ?? []) as Notificacion[],
    noLeidas: Number(data.no_leidas) || 0,
  };
}

export async function marcarNotificacionLeida(id: number): Promise<void> {
  const res = await apiFetch(`${API_URL}/notificaciones/${id}/leida`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await mensajeDeError(res, "No se pudo marcar como leída"));
}

export async function marcarTodasLasNotificacionesLeidas(): Promise<void> {
  const res = await apiFetch(`${API_URL}/notificaciones/leer-todas`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await mensajeDeError(res, "No se pudo marcar como leídas"));
}
