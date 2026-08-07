import { getToken, clearSession } from "./Auth";

export const API_URL = "/api";

export function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function jsonHeaders(): Record<string, string> {
  return { "Content-Type": "application/json", ...authHeaders() };
}

export async function apiFetch(url: string, options?: RequestInit): Promise<Response> {
  const res = await fetch(url, options);
  if (res.status === 401) {
    clearSession();
    window.location.href = "/login";
  }
  return res;
}

// Si las funciones serverless no están desplegadas, el rewrite del SPA devuelve
// index.html con status 200: res.json() explota con un error de sintaxis que no
// le dice nada al usuario. Por eso distinguimos ese caso.
async function leerJson(res: Response): Promise<Record<string, unknown> | null> {
  const texto = await res.text().catch(() => "");
  if (!texto) return null;
  try {
    return JSON.parse(texto) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Mensaje de error del backend, o uno genérico si no vino ninguno. */
export async function mensajeDeError(res: Response, fallback: string): Promise<string> {
  const body = await leerJson(res);
  const message = body?.message;
  if (typeof message === "string" && message) return message;
  return `${fallback} (HTTP ${res.status})`;
}

export async function jsonOrThrow(res: Response, fallback: string): Promise<Record<string, unknown>> {
  if (!res.ok) {
    throw new Error(`${fallback} (${await mensajeDeError(res, "error")})`);
  }
  const body = await leerJson(res);
  if (!body) {
    throw new Error(
      `${fallback}: el servidor no devolvió JSON. Revisá que las funciones de /api estén desplegadas.`
    );
  }
  return body;
}
