import type { Prueba } from "./Pruebas";

function cargarImagen(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("No se pudo cargar una de las páginas para armar el PDF."));
    img.src = url;
  });
}

function nombreArchivo(prueba: Prueba): string {
  const base = `${prueba.materia || "prueba"}${prueba.tema ? ` - ${prueba.tema}` : ""}`;
  return base.replace(/[\\/:*?"<>|]/g, "").trim() || "prueba";
}

export async function exportarPruebaComoPdf(prueba: Prueba): Promise<void> {
  const fotos = (prueba.archivos ?? []).filter((a) => a.tipo === "image" && a.url);
  if (fotos.length === 0) {
    throw new Error("Esta prueba no tiene fotos para exportar a PDF.");
  }

  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margen = 24;

  for (let i = 0; i < fotos.length; i++) {
    const img = await cargarImagen(fotos[i].url);
    const maxW = pageW - margen * 2;
    const maxH = pageH - margen * 2;
    const escala = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight, 1);
    const w = img.naturalWidth * escala;
    const h = img.naturalHeight * escala;
    const x = (pageW - w) / 2;
    const y = (pageH - h) / 2;

    if (i > 0) doc.addPage();
    doc.addImage(img, "JPEG", x, y, w, h);
  }

  doc.save(`${nombreArchivo(prueba)}.pdf`);
}
