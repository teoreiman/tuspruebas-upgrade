export function stripInlineImages(rows: Record<string, unknown>[]): Record<string, unknown>[] {
  return rows.map((row) => {
    const c = row.contenido as Record<string, unknown> | null;
    if (!c || typeof c !== "object") return row;

    const url = c.archivo_url as string | undefined;
    const archivos = c.archivos as Record<string, unknown>[] | undefined;
    const hayInline = (url && url.startsWith("data:")) ||
      (Array.isArray(archivos) && archivos.some((a) => typeof a?.url === "string" && (a.url as string).startsWith("data:")));
    if (!hayInline) return row;

    return {
      ...row,
      contenido: {
        ...c,
        archivo_url: undefined,
        archivos: Array.isArray(archivos)
          ? archivos.map((a) => (typeof a?.url === "string" && a.url.startsWith("data:") ? { ...a, url: undefined } : a))
          : archivos,
      },
    };
  });
}
