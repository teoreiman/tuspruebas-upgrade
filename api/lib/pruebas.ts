// Las fotos se guardan como data URL (base64) dentro de contenido.archivo_url.
// En listados con varias pruebas eso puede superar el límite de payload de
// Vercel (4.5 MB), así que se quita ahí y se sirve completo sólo desde
// GET /api/pruebas/:id.
export function stripInlineImages(rows: Record<string, unknown>[]): Record<string, unknown>[] {
  return rows.map((row) => {
    const c = row.contenido as Record<string, unknown> | null;
    if (c && typeof c === "object") {
      const url = c.archivo_url as string | undefined;
      if (url && url.startsWith("data:")) {
        return { ...row, contenido: { ...c, archivo_url: undefined } };
      }
    }
    return row;
  });
}
