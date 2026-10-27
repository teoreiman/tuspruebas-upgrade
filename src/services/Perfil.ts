import { API_URL, apiFetch, authHeaders, jsonHeaders, jsonOrThrow, mensajeDeError } from "./Api";
import { getToken, saveSession, type User } from "./Auth";
import { esImagen, MAX_FOTO_BYTES } from "./Pruebas";

export interface Perfil {
  usuario: User;
  tiene_password: boolean;
}

export interface CambiosPerfil {
  nombre?: string;
  email?: string;
  avatar?: string | null;
  password_actual?: string;
  password_nueva?: string;
}

const LADO_AVATAR = 256;

function leerPerfil(data: Record<string, unknown>): Perfil {
  return { usuario: data.usuario as User, tiene_password: data.tiene_password !== false };
}

export async function fetchPerfil(): Promise<Perfil> {
  const res = await apiFetch(`${API_URL}/perfil`, { headers: authHeaders() });
  const perfil = leerPerfil(await jsonOrThrow(res, "No se pudo cargar tu perfil"));
  const token = getToken();
  if (token) saveSession(token, perfil.usuario);
  return perfil;
}

export async function actualizarPerfil(cambios: CambiosPerfil): Promise<Perfil> {
  const res = await apiFetch(`${API_URL}/perfil`, {
    method: "PATCH",
    headers: jsonHeaders(),
    body: JSON.stringify(cambios),
  });
  if (!res.ok) throw new Error(await mensajeDeError(res, "No se pudieron guardar los cambios"));
  const data = await jsonOrThrow(res, "No se pudieron guardar los cambios");
  const perfil = leerPerfil(data);
  saveSession(data.token as string, perfil.usuario);
  return perfil;
}

export function comprimirAvatar(file: File): Promise<string> {
  if (!esImagen(file)) return Promise.reject(new Error("Elegí una imagen (JPG, PNG o WEBP)."));
  if (file.size > MAX_FOTO_BYTES) return Promise.reject(new Error("La imagen es demasiado pesada."));

  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("El navegador no puede abrir esta imagen. Probá con un JPG o PNG."));
    };
    img.onload = () => {
      URL.revokeObjectURL(url);
      const lado = Math.min(img.naturalWidth, img.naturalHeight);
      const canvas = document.createElement("canvas");
      canvas.width = LADO_AVATAR;
      canvas.height = LADO_AVATAR;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas no disponible")); return; }
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, LADO_AVATAR, LADO_AVATAR);
      ctx.drawImage(
        img,
        (img.naturalWidth - lado) / 2, (img.naturalHeight - lado) / 2, lado, lado,
        0, 0, LADO_AVATAR, LADO_AVATAR,
      );
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.src = url;
  });
}
