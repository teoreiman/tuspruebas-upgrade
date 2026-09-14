import { API_URL, apiFetch, authHeaders, jsonHeaders, jsonOrThrow, mensajeDeError } from "./Api";
import { sincronizarFavoritos } from "./Favoritos";

export interface ArchivoPrueba {
  url: string;
  nombre: string;
  tipo: string;
}

export interface Prueba {
  id: number;
  materia: string;
  escuela: string;
  año: string;
  profesor: string;
  tema: string;
  notas?: string;
  preguntas?: string;
  // Una prueba puede tener varias fotos (una prueba de varias hojas). Los
  // campos archivo_* de abajo son la primera página, para todo el código
  // viejo que todavía espera un solo archivo — pero `archivos` es la lista
  // completa y es lo que hay que usar para mostrarlas todas.
  archivos?: ArchivoPrueba[];
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

// Las pruebas de varias hojas guardan `contenido.archivos` (la lista). Las
// viejas de una sola foto solo tienen `contenido.archivo_url/nombre/tipo` —
// acá las envolvemos en un array de un elemento para que el resto del código
// (visor, IA) siempre trabaje con una lista, sin importar cómo se guardó.
function archivosDesdeContenido(c: Record<string, unknown>): ArchivoPrueba[] {
  if (Array.isArray(c.archivos)) {
    return (c.archivos as Record<string, unknown>[])
      .filter((a) => typeof a?.url === "string" && a.url)
      .map((a) => ({
        url:    a.url as string,
        nombre: (a.nombre as string) || "",
        tipo:   (a.tipo as string) || "",
      }));
  }
  const url = c.archivo_url as string | undefined;
  if (!url) return [];
  return [{ url, nombre: (c.archivo_nombre as string) || "", tipo: (c.archivo_tipo as string) || "" }];
}

function mapApiPrueba(raw: Record<string, unknown>): Prueba {
  const c = safeJson(raw.contenido);
  const archivos = archivosDesdeContenido(c);
  const primera = archivos[0];
  return {
    id:             raw.id as number,
    materia:        (raw.materia as string)  || "",
    escuela:        (raw.escuela as string)  || "",
    año:            (raw.anio   as string)  || (raw.año as string) || "",
    profesor:       (raw.profesor as string) || "",
    tema:           (raw.tema as string)     || "",
    notas:          (c.notas as string)      || "",
    preguntas:      (c.preguntas as string)   || "",
    archivos,
    archivo_url:    primera?.url || undefined,
    archivo_nombre: primera?.nombre || undefined,
    archivo_tipo:   primera?.tipo || undefined,
    tiene_archivo:  archivos.length > 0,
    estado:         (raw.estado as Prueba["estado"]) || "pendiente",
    usuario_nombre: (raw.usuario_nombre as string) || (c.usuario_nombre as string) || "Anónimo",
    usuario_email:  (raw.usuario_email  as string) || (c.usuario_email  as string) || "",
    usuario_id:     (raw.usuario_id  as number) || (c.usuario_id  as number) || 0,
    created_at:     (raw.fecha as string) || (raw.created_at as string) || new Date().toISOString(),
    // Los endpoints de admin no calculan favoritos: ahí queda undefined (que no
    // es lo mismo que "no es favorita") para no pisar el estado real del store.
    favorito:       typeof raw.favorito === "boolean" ? raw.favorito : undefined,
  };
}

// Los listados vienen con el favorito ya resuelto para el usuario logueado:
// es la fuente de verdad del store compartido de estrellas.
function mapYSincronizar(rows: Record<string, unknown>[]): Prueba[] {
  const pruebas = rows.map(mapApiPrueba);
  sincronizarFavoritos(pruebas);
  return pruebas;
}

// Vercel Serverless Functions rechazan requests/responses de más de 4.5 MB.
// La(s) imagen(es) viajan como base64 (dataURL) dentro de un JSON, así que
// nos quedamos por debajo de ese límite para que la prueba después se pueda
// leer sin problemas desde /api/pruebas/:id.
const MAX_DATA_URL_BYTES = 3.2 * 1024 * 1024;
// Con varias fotos en la misma prueba, el presupuesto se reparte entre todas
// (dejando margen para el resto del JSON) — por eso cada una sale más chica
// cuantas más páginas tenga la prueba.
const MAX_TOTAL_FOTOS_BYTES = 3.6 * 1024 * 1024;
export const MAX_PAGINAS = 8;

// Lado más largo de la foto ya comprimida. Con 2600 px una hoja A4 fotografiada
// se lee sin problemas (antes eran 1600 px y el texto chico quedaba borroso).
const MAX_LADO_PX = 2600;

// Tamaño máximo del archivo original que aceptamos. Las fotos se recomprimen en
// el navegador antes de subirse, así que puede entrar mucho más peso del que
// después viaja al servidor.
export const MAX_FOTO_BYTES = 30 * 1024 * 1024;
export const MAX_ARCHIVO_BYTES = 10 * 1024 * 1024;

// Comprime una imagen usando canvas y devuelve un data URL JPEG que entre
// dentro de maxBytes. No requiere ningún servicio externo.
async function compressImageToBase64(file: File, maxBytes: number = MAX_DATA_URL_BYTES): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error(
        `El navegador no puede procesar este tipo de imagen (${file.type || file.name.split(".").pop()}). ` +
        "Probá convertirla a JPG o PNG, o sacar una captura de pantalla."
      ));
      img.onload = () => {
        const MAX = MAX_LADO_PX;
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
        // JPEG no soporta transparencia: sin este fondo, las zonas
        // transparentes de un PNG se ven negras en vez de blancas.
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);

        // Arrancamos con calidad alta y sólo bajamos si no entra en el límite
        // de payload de Vercel. Como el límite ahora es más grande, la mayoría
        // de las fotos se guardan en calidad casi original.
        let quality = 0.92;
        let dataUrl = canvas.toDataURL("image/jpeg", quality);
        while (dataUrl.length > maxBytes && quality > 0.45) {
          quality -= 0.08;
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }
        // Última red de contención: si ni con calidad baja entra (fotos
        // enormes), recortamos resolución hasta que entre.
        let intentos = 0;
        while (dataUrl.length > maxBytes && intentos < 4) {
          const scale = Math.sqrt((maxBytes / dataUrl.length) * 0.95);
          canvas.width  = Math.max(1, Math.round(canvas.width  * scale));
          canvas.height = Math.max(1, Math.round(canvas.height * scale));
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          dataUrl = canvas.toDataURL("image/jpeg", 0.75);
          intentos++;
        }
        resolve(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export const IMAGE_EXTENSIONS = ["jpg","jpeg","png","gif","webp","heic","heif","bmp","avif","tiff","tif"];

export function esImagen(file: File): boolean {
  // Algunos navegadores/SO no informan el MIME type de HEIC/HEIF (y Windows a
  // veces tampoco el de .jpg), por eso también miramos la extensión.
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return file.type.startsWith("image/") || IMAGE_EXTENSIONS.includes(ext);
}

async function uploadFileToCloud(file: File, maxBytes: number = MAX_DATA_URL_BYTES): Promise<{ url: string; nombre: string; tipo: string }> {
  // Para imágenes: comprimir con canvas y guardar como base64.
  // Esto funciona sin ningún servicio externo.
  if (esImagen(file)) {
    const dataUrl = await compressImageToBase64(file, maxBytes);
    // Se guarda re-codificada a JPEG, así que el nombre tiene que decir .jpg
    // (si no, la descarga sale con una extensión que no corresponde).
    const base = file.name.replace(/\.[^.]+$/, "") || "prueba";
    return { url: dataUrl, nombre: `${base}.jpg`, tipo: "image" };
  }

  // Para PDFs y otros archivos: intentar Cloudinary si está configurado.
  const cloudName    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME    as string | undefined;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Para subir PDFs es necesario configurar Cloudinary. " +
      "Las fotos se pueden subir sin configuración adicional."
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

// Sube uno o varios archivos. Con más de uno, todos tienen que ser fotos (no
// se puede repartir el presupuesto de tamaño con un PDF alojado afuera de por
// medio) — el presupuesto de cada foto se achica cuantas más páginas haya.
export async function uploadFilesToCloud(files: File[]): Promise<ArchivoPrueba[]> {
  if (files.length === 0) return [];
  if (files.length === 1) return [await uploadFileToCloud(files[0])];

  if (files.some((f) => !esImagen(f))) {
    throw new Error("Para subir varias páginas, todas tienen que ser fotos (no se puede combinar con un PDF).");
  }
  const maxBytes = Math.max(300_000, Math.floor(MAX_TOTAL_FOTOS_BYTES / files.length));
  const resultados: ArchivoPrueba[] = [];
  for (const file of files) {
    resultados.push(await uploadFileToCloud(file, maxBytes));
  }
  return resultados;
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
  const data = await jsonOrThrow(res, "Error al cargar pruebas");
  const rows = data.data ?? data;
  return Array.isArray(rows) ? mapYSincronizar(rows) : [];
}

// ── Todas las pruebas (admin) ─────────────────────────────────────────────────
export async function fetchAllPruebas(
  filtro?: PruebaEstado | "todas"
): Promise<Prueba[]> {
  const headers = authHeaders();

  if (filtro === "pendiente") {
    const res = await apiFetch(`${API_URL}/admin/pendientes`, { headers });
    const data = await jsonOrThrow(res, "Error al cargar pendientes");
    return ((data.data ?? []) as Record<string, unknown>[]).map(mapApiPrueba);
  }

  if (filtro === "aprobada") {
    const res = await apiFetch(`${API_URL}/pruebas`, { headers });
    const data = await jsonOrThrow(res, "Error al cargar aprobadas");
    return mapYSincronizar((data.data ?? []) as Record<string, unknown>[]);
  }

  if (filtro === "rechazada") {
    const res = await apiFetch(`${API_URL}/admin/rechazadas`, { headers });
    const data = await jsonOrThrow(res, "Error al cargar rechazadas");
    return ((data.data ?? []) as Record<string, unknown>[]).map(mapApiPrueba);
  }

  // "todas": pendientes + aprobadas + rechazadas
  const fuentes = [
    { nombre: "pendientes",  url: `${API_URL}/admin/pendientes` },
    { nombre: "aprobadas",   url: `${API_URL}/pruebas` },
    { nombre: "rechazadas",  url: `${API_URL}/admin/rechazadas` },
  ];

  const resultados = await Promise.all(
    fuentes.map(async (f) => {
      try {
        const res = await apiFetch(f.url, { headers });
        const data = await jsonOrThrow(res, `Error al cargar ${f.nombre}`);
        return { ok: true as const, nombre: f.nombre, rows: (data.data ?? []) as Record<string, unknown>[] };
      } catch (e) {
        return { ok: false as const, nombre: f.nombre, error: e instanceof Error ? e.message : "error desconocido" };
      }
    })
  );

  const fallidas = resultados.filter((r) => !r.ok);
  if (fallidas.length === fuentes.length) {
    throw new Error(fallidas.map((f) => `${f.nombre}: ${(f as { error: string }).error}`).join(" · "));
  }
  if (fallidas.length > 0) {
    console.error("No se pudieron cargar algunas pruebas:", fallidas);
  }

  return resultados
    .filter((r): r is { ok: true; nombre: string; rows: Record<string, unknown>[] } => r.ok)
    .flatMap((r) => r.rows.map(mapApiPrueba));
}

// ── Favoritos del usuario ─────────────────────────────────────────────────────
export async function fetchFavoritos(): Promise<Prueba[]> {
  const res = await apiFetch(`${API_URL}/pruebas/favoritos`, {
    headers: authHeaders(),
  });
  const data = await jsonOrThrow(res, "Error al cargar favoritos");
  return mapYSincronizar((data.data ?? []) as Record<string, unknown>[]);
}

// ── Pruebas subidas por el usuario ────────────────────────────────────────────
export async function fetchMisPruebas(): Promise<Prueba[]> {
  const res = await apiFetch(`${API_URL}/pruebas/mis`, {
    headers: authHeaders(),
  });
  const data = await jsonOrThrow(res, "Error al cargar tus pruebas");
  return mapYSincronizar((data.data ?? []) as Record<string, unknown>[]);
}

// ── Prueba individual ──────────────────────────────────────────────────────────────
export async function fetchPrueba(id: number): Promise<Prueba> {
  const res = await apiFetch(`${API_URL}/pruebas/${id}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await mensajeDeError(res, "Prueba no encontrada"));
  const data = await res.json();
  const prueba = mapApiPrueba((data.data ?? data) as Record<string, unknown>);
  sincronizarFavoritos([prueba]);
  return prueba;
}

// ── Subir prueba ─────────────────────────────────────────────────────────────────
export async function uploadPrueba(formData: FormData): Promise<Prueba> {
  const colegio        = (formData.get("colegio")        as string) || "";
  const año            = (formData.get("año")            as string) || "";
  const materia        = (formData.get("materia")        as string) || "";
  const profesor       = (formData.get("profesor")       as string) || "";
  const tema           = (formData.get("tema")           as string) || "";
  const notas          = (formData.get("notas")          as string) || "";
  const preguntas      = (formData.get("preguntas")      as string) || "";
  const usuario_nombre = (formData.get("usuario_nombre") as string) || "";
  const usuario_email  = (formData.get("usuario_email")  as string) || "";
  const usuario_id_raw = formData.get("usuario_id");
  const usuario_id     = usuario_id_raw ? Number(usuario_id_raw) : null;
  // Una o varias fotos (prueba de varias hojas), todas bajo la misma clave.
  const archivosSubidos = formData.getAll("archivos").filter((f): f is File => f instanceof File && f.size > 0);

  if (archivosSubidos.length === 0 && !preguntas.trim()) {
    throw new Error("Subí una foto de la prueba o escribí las preguntas a mano.");
  }

  const archivos = await uploadFilesToCloud(archivosSubidos);
  // Primera página como campos sueltos, para todo el código que todavía
  // espera un solo archivo (miniaturas de tarjetas, IA local vieja, etc.).
  const primera = archivos[0];

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
      preguntas,
      usuario_id,
      usuario_nombre,
      usuario_email,
      archivos,
      archivo_url:    primera?.url,
      archivo_nombre: primera?.nombre,
      archivo_tipo:   primera?.tipo,
    },
  };

  const res = await apiFetch(`${API_URL}/pruebas`, {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(await mensajeDeError(res, "Error al subir la prueba"));
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
    preguntas,
    archivos,
    archivo_url:    primera?.url,
    archivo_nombre: primera?.nombre,
    archivo_tipo:   primera?.tipo,
    tiene_archivo:  archivos.length > 0,
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
    headers: jsonHeaders(),
    body: JSON.stringify({ estado }),
  });
  if (!res.ok) throw new Error(await mensajeDeError(res, "Error al actualizar estado"));
}

// El manejo de favoritos vive en ./Favoritos (store compartido entre pantallas).
export { toggleFavorito, setFavorito, useFavorito } from "./Favoritos";

// ── Eliminar prueba ───────────────────────────────────────────────────────────
export async function deletePrueba(id: number): Promise<void> {
  const res = await apiFetch(`${API_URL}/pruebas/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) {
    throw new Error(await mensajeDeError(res, "Error al eliminar la prueba"));
  }
}
