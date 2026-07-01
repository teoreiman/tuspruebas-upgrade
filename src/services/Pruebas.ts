import { getToken, clearSession } from "./Auth";

const API_URL = "/api";

export interface Prueba {
  id: number;
  materia: string;
  escuela: string;
  año: string;
  profesor: string;
  tema: string;
  notas?: string;
  archivo_url?: string;
  archivo_nombre?: string;
  archivo_tipo?: string;
  tiene_archivo?: boolean;
  estado: "pendiente" | "aprobada" | "rechazada";
  usuario_nombre: string;
  usuario_email: string;
  usuario_id: number;
  created_at: string;
  favorito?: boolean;
}

export type PruebaEstado = "pendiente" | "aprobada" | "rechazada";

function safeJson(raw: unknown): Record<string, unknown> {
  if (!raw) return {};
  if (typeof raw === "object") return raw as Record<string, unknown>;
  try { return JSON.parse(raw as string); } catch { return {}; }
}

function mapApiPrueba(raw: Record<string, unknown>): Prueba {
  const c = safeJson(raw.contenido);
  const archivoUrl = (c.archivo_url as string) || undefined;
  const archivoTipo = (c.archivo_tipo as string) || undefined;
  return {
    id:             raw.id as number,
    materia:        (raw.materia as string)  || "",
    escuela:        (raw.escuela as string)  || "",
    año:            (raw.anio   as string)  || (raw.año as string) || "",
    profesor:       (raw.profesor as string) || "",
    tema:           (raw.tema as string)     || "",
    notas:          (c.notas as string)      || "",
    archivo_url:    archivoUrl,
    archivo_nombre: (c.archivo_nombre as string) || undefined,
    archivo_tipo:   archivoTipo,
    tiene_archivo:  !!archivoUrl || !!archivoTipo,
    estado:         (raw.estado as Prueba["estado"]) || "pendiente",
    usuario_nombre: (raw.usuario_nombre as string) || (c.usuario_nombre as string) || "Anónimo",
    usuario_email:  (raw.usuario_email  as string) || (c.usuario_email  as string) || "",
    usuario_id:     (raw.usuario_id  as number) || (c.usuario_id  as number) || 0,
    created_at:     (raw.fecha as string) || (raw.created_at as string) || new Date().toISOString(),
    favorito:       (raw.favorito as boolean) ?? false,
  };
}

// Comprime una imagen usando canvas y devuelve un data URL JPEG.
// No requiere ningún servicio externo.
async function compressImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const MAX = 1600;
        let w = img.naturalWidth;
        let h = img.naturalHeight;
        if (w > MAX || h > MAX) {
          if (w >= h) { h = Math.round((h * MAX) / w); w = MAX; }
          else        { w = Math.round((w * MAX) / h); h = MAX; }
        }
        const canvas = document.createElement("canvas");
        canvas.width  = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("Canvas no disponible")); return; }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

async function uploadFileToCloud(file: File): Promise<{ url: string; nombre: string; tipo: string }> {
  // Para imágenes: comprimir con canvas y guardar como base64.
  // Esto funciona sin ningún servicio externo.
  if (file.type.startsWith("image/")) {
    const dataUrl = await compressImageToBase64(file);
    return { url: dataUrl, nombre: file.name, tipo: "image" };
  }

  // Para PDFs y otros archivos: intentar Cloudinary si está configurado.
  const cloudName    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME    as string | undefined;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Para subir PDFs es necesario configurar Cloudinary. " +
      "Las fotos (JPG, PNG) se pueden subir sin configuración adicional."
    );
  }

  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: "POST",
    body: fd,
  });

  if (!res.ok) {
    throw new Error("Error al subir el PDF a Cloudinary. Verificá la configuración.");
  }

  const data = await res.json() as Record<string, unknown>;
  return { url: data.secure_url as string, nombre: file.name, tipo: "pdf" };
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiFetch(url: string, options?: RequestInit): Promise<Response> {
  const res = await fetch(url, options);
  if (res.status === 401) {
    clearSession();
    window.location.href = "/login";
  }
  return res;
}

// ── Pruebas aprobadas (home) ──────────────────────────────────────────────────
export async function fetchPruebas(filters?: {
  escuela?: string;
  año?: string;
  materia?: string;
}): Promise<Prueba[]> {
  const params = new URLSearchParams();
  if (filters?.escuela) params.set("escuela", filters.escuela);
  if (filters?.año)     params.set("anio",    filters.año);
  if (filters?.materia) params.set("materia", filters.materia);

  const res = await apiFetch(`${API_URL}/pruebas?${params}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Error al cargar pruebas");
  const data = await res.json();
  const rows = data.data ?? data;
  return Array.isArray(rows) ? rows.map(mapApiPrueba) : [];
}

// ── Todas las pruebas (admin) ─────────────────────────────────────────────────
export async function fetchAllPruebas(
  filtro?: PruebaEstado | "todas"
): Promise<Prueba[]> {
  const headers = authHeaders();

  if (filtro === "pendiente") {
    const res = await apiFetch(`${API_URL}/admin/pendientes`, { headers });
    if (!res.ok) throw new Error("Error al cargar pruebas");
    const data = await res.json();
    return ((data.data ?? []) as Record<string, unknown>[]).map(mapApiPrueba);
  }

  if (filtro === "aprobada") {
    const res = await apiFetch(`${API_URL}/pruebas`, { headers });
    if (!res.ok) throw new Error("Error al cargar pruebas");
    const data = await res.json();
    return ((data.data ?? []) as Record<string, unknown>[]).map(mapApiPrueba);
  }

  if (filtro === "rechazada") {
    const res = await apiFetch(`${API_URL}/admin/rechazadas`, { headers });
    if (!res.ok) throw new Error("Error al cargar pruebas");
    const data = await res.json();
    return ((data.data ?? []) as Record<string, unknown>[]).map(mapApiPrueba);
  }

  // "todas": pendientes + aprobadas + rechazadas
  const [pendRes, aprRes, rechRes] = await Promise.all([
    apiFetch(`${API_URL}/admin/pendientes`,  { headers }),
    apiFetch(`${API_URL}/pruebas`,           { headers }),
    apiFetch(`${API_URL}/admin/rechazadas`,  { headers }),
  ]);
  const [pend, apr, rech] = await Promise.all([
    pendRes.ok ? pendRes.json() : { data: [] },
    aprRes.ok  ? aprRes.json()  : { data: [] },
    rechRes.ok ? rechRes.json() : { data: [] },
  ]);
  return [
    ...((pend.data ?? []) as Record<string, unknown>[]).map(mapApiPrueba),
    ...((apr.data  ?? []) as Record<string, unknown>[]).map(mapApiPrueba),
    ...((rech.data ?? []) as Record<string, unknown>[]).map(mapApiPrueba),
  ];
}

// ── Favoritos del usuario ─────────────────────────────────────────────────────
export async function fetchFavoritos(): Promise<Prueba[]> {
  const res = await apiFetch(`${API_URL}/pruebas/favoritos`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Error al cargar favoritos");
  const data = await res.json();
  return ((data.data ?? []) as Record<string, unknown>[]).map(mapApiPrueba);
}

// ── Pruebas subidas por el usuario ────────────────────────────────────────────
export async function fetchMisPruebas(): Promise<Prueba[]> {
  const res = await apiFetch(`${API_URL}/pruebas/mis`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Error al cargar tus pruebas");
  const data = await res.json();
  return ((data.data ?? []) as Record<string, unknown>[]).map(mapApiPrueba);
}

// ── Prueba individual ──────────────────────────────────────────────────────────────
export async function fetchPrueba(id: number): Promise<Prueba> {
  const res = await apiFetch(`${API_URL}/pruebas/${id}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Prueba no encontrada");
  const data = await res.json();
  return mapApiPrueba(data.data ?? data);
}

// ── Subir prueba ─────────────────────────────────────────────────────────────────
export async function uploadPrueba(formData: FormData): Promise<Prueba> {
  const colegio        = (formData.get("colegio")        as string) || "";
  const año            = (formData.get("año")            as string) || "";
  const materia        = (formData.get("materia")        as string) || "";
  const profesor       = (formData.get("profesor")       as string) || "";
  const tema           = (formData.get("tema")           as string) || "";
  const notas          = (formData.get("notas")          as string) || "";
  const usuario_nombre = (formData.get("usuario_nombre") as string) || "";
  const usuario_email  = (formData.get("usuario_email")  as string) || "";
  const usuario_id_raw = formData.get("usuario_id");
  const usuario_id     = usuario_id_raw ? Number(usuario_id_raw) : null;
  const archivo        = formData.get("archivo") as File | null;

  // Upload file to cloud storage first
  let archivo_url: string | undefined;
  let archivo_nombre: string | undefined;
  let archivo_tipo: string | undefined;

  if (archivo && archivo.size > 0) {
    const uploaded = await uploadFileToCloud(archivo);
    archivo_url    = uploaded.url;
    archivo_nombre = uploaded.nombre;
    archivo_tipo   = uploaded.tipo;
  }

  const titulo = `${materia}${tema ? ` - ${tema}` : ""} (${colegio} ${año})`;

  const body = {
    titulo,
    materia,
    anio:     año,
    profesor,
    tema,
    escuela:  colegio,
    contenido: {
      notas,
      usuario_id,
      usuario_nombre,
      usuario_email,
      archivo_url,
      archivo_nombre,
      archivo_tipo,
    },
  };

  const res = await apiFetch(`${API_URL}/pruebas`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Error al subir" }));
    throw new Error(err.message);
  }

  const data = await res.json();
  return {
    id:             data.id as number,
    materia,
    escuela:        colegio,
    año,
    profesor,
    tema,
    notas,
    archivo_url,
    archivo_nombre,
    archivo_tipo,
    tiene_archivo:  !!archivo_url,
    estado:         "pendiente",
    usuario_nombre,
    usuario_email,
    usuario_id:     usuario_id ?? 0,
    created_at:     new Date().toISOString(),
    favorito:       false,
  };
}

// ── Cambiar estado (admin) ───────────────────────────────────────────────────
export async function updatePruebaEstado(
  id: number,
  estado: PruebaEstado
): Promise<void> {
  const res = await apiFetch(`${API_URL}/admin/${id}/estado`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ estado }),
  });
  if (!res.ok) throw new Error("Error al actualizar estado");
}

// ── Toggle favorito ───────────────────────────────────────────────────────────
export async function toggleFavorito(id: number): Promise<boolean> {
  const res = await apiFetch(`${API_URL}/pruebas/${id}/favorito`, {
    method: "POST",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Error al guardar favorito");
  const data = await res.json();
  return (data.favorito as boolean) ?? false;
}
