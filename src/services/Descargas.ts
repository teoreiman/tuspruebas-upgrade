const EXT_POR_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg":  "jpg",
  "image/png":  "png",
  "image/webp": "webp",
  "image/gif":  "gif",
  "image/avif": "avif",
  "image/bmp":  "bmp",
  "image/tiff": "tiff",
  "image/heic": "heic",
  "image/heif": "heif",
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

function limpiarNombre(nombre: string): string {
  const limpio = nombre.replace(/[\\/:*?"<>|]+/g, "-").trim();
  return limpio || "prueba";
}

function nombreConExtension(nombre: string, mime: string): string {
  const base = limpiarNombre(nombre);
  const ext = EXT_POR_MIME[mime.toLowerCase()];
  if (!ext) return base;

  const actual = base.includes(".") ? base.split(".").pop()!.toLowerCase() : "";
  const equivalentes = ext === "jpg" ? ["jpg", "jpeg"] : [ext];
  if (equivalentes.includes(actual)) return base;

  const sinExt = base.replace(/\.[^.]+$/, "") || "prueba";
  return `${sinExt}.${ext}`;
}

function dataUrlABlob(dataUrl: string): Blob {
  const coma = dataUrl.indexOf(",");
  const encabezado = dataUrl.slice(0, coma);
  const datos = dataUrl.slice(coma + 1);
  const mime = /^data:([^;,]+)/.exec(encabezado)?.[1] ?? "application/octet-stream";

  if (!/;base64/i.test(encabezado)) {
    return new Blob([decodeURIComponent(datos)], { type: mime });
  }

  const binario = atob(datos);
  const bytes = new Uint8Array(binario.length);
  for (let i = 0; i < binario.length; i++) bytes[i] = binario.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

function guardarBlob(blob: Blob, nombre: string) {
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = nombreConExtension(nombre, blob.type);
  a.rel = "noopener";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
}

export async function descargarArchivo(url: string, nombreSugerido = "prueba"): Promise<void> {
  if (!url) throw new Error("Esta prueba no tiene archivo para descargar.");

  if (url.startsWith("data:")) {
    guardarBlob(dataUrlABlob(url), nombreSugerido);
    return;
  }

  if (url.startsWith("blob:")) {
    const a = document.createElement("a");
    a.href = url;
    a.download = limpiarNombre(nombreSugerido);
    document.body.appendChild(a);
    a.click();
    a.remove();
    return;
  }

  try {
    const res = await fetch(url, { mode: "cors", credentials: "omit" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    guardarBlob(await res.blob(), nombreSugerido);
  } catch {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noreferrer";
    a.download = limpiarNombre(nombreSugerido);
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}
