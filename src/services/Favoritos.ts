import { useCallback, useState, useSyncExternalStore } from "react";
import { API_URL, apiFetch, jsonHeaders, mensajeDeError } from "./Api";
import { getUser } from "./Auth";

const estado = new Map<number, boolean>();
const listeners = new Set<() => void>();
let dueño: number | null = null;

function emitir() {
  for (const l of listeners) l();
}

function verificarDueño(): boolean {
  const actual = getUser()?.id ?? null;
  if (actual === dueño) return false;
  dueño = actual;
  estado.clear();
  return true;
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function limpiarFavoritos() {
  dueño = getUser()?.id ?? null;
  estado.clear();
  emitir();
}

export function sincronizarFavoritos(pruebas: { id: number; favorito?: boolean }[]) {
  let cambio = verificarDueño();
  for (const p of pruebas) {
    if (typeof p.favorito !== "boolean") continue;
    if (estado.get(p.id) !== p.favorito) {
      estado.set(p.id, p.favorito);
      cambio = true;
    }
  }
  if (cambio) emitir();
}

export function getFavorito(id: number, porDefecto = false): boolean {
  return estado.get(id) ?? porDefecto;
}

function fijarLocal(id: number, valor: boolean | undefined) {
  if (valor === undefined) estado.delete(id);
  else estado.set(id, valor);
  emitir();
}

export async function setFavorito(id: number, valor: boolean): Promise<boolean> {
  verificarDueño();
  const previo = estado.get(id);
  fijarLocal(id, valor);

  try {
    const res = await apiFetch(`${API_URL}/pruebas/${id}/favorito`, {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify({ favorito: valor }),
    });
    if (!res.ok) {
      throw new Error(await mensajeDeError(res, "No se pudo guardar el favorito"));
    }
    const data = (await res.json().catch(() => null)) as { favorito?: boolean } | null;
    const real = typeof data?.favorito === "boolean" ? data.favorito : valor;
    fijarLocal(id, real);
    return real;
  } catch (e) {
    fijarLocal(id, previo);
    throw e;
  }
}

export function toggleFavorito(id: number): Promise<boolean> {
  return setFavorito(id, !getFavorito(id));
}

export function useFavorito(id: number, inicial = false) {
  const saved = useSyncExternalStore(subscribe, () => estado.get(id) ?? inicial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const toggle = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      await setFavorito(id, !getFavorito(id, inicial));
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar el favorito");
    } finally {
      setSaving(false);
    }
  }, [id, inicial, saving]);

  return { saved, saving, error, toggle };
}
