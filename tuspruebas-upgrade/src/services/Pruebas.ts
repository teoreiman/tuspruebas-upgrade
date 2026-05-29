import { getToken } from "./Auth";

const API_URL = "http://localhost:3000/api";

// ── Manu: cambiar a false cuando el backend esté listo ───────────────────────
const USE_MOCK = false;

// ── Types ─────────────────────────────────────────────────────────────────────
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
  archivo_tipo?: string; // "pdf" | "image" | "doc"
  estado: "pendiente" | "aprobada" | "rechazada";
  usuario_nombre: string;
  usuario_id: number;
  created_at: string;
  favorito?: boolean;
}

// ── Mock data ─────────────────────────────────────────────────────────────────
let MOCK_DB: Prueba[] = [
  {
    id: 1, materia: "Matemática", escuela: "ORT Almagro", año: "5to",
    profesor: "García", tema: "Integrales",
    notas: "Parcial del segundo trimestre. Entran integrales indefinidas y definidas.",
    archivo_url: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/pdf-sample.pdf",
    archivo_nombre: "parcial_mate_5to.pdf", archivo_tipo: "pdf",
    estado: "aprobada", usuario_nombre: "Teo Reiman", usuario_id: 1,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 2, materia: "Química", escuela: "ORT Belgrano", año: "5to",
    profesor: "Rosenfeld", tema: "Estequiometría",
    notas: "Incluye problemas de estequiometría con reactivo limitante.",
    archivo_url: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/pdf-sample.pdf",
    archivo_nombre: "quimica_5to.pdf", archivo_tipo: "pdf",
    estado: "aprobada", usuario_nombre: "Fede Hanono", usuario_id: 2,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: 3, materia: "Historia", escuela: "ORT Almagro", año: "3ro",
    profesor: "Levy", tema: "Segunda Guerra Mundial",
    notas: "Temas: causas, desarrollo, consecuencias. Mapa conceptual.",
    archivo_url: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/pdf-sample.pdf",
    archivo_nombre: "historia_3ro.pdf", archivo_tipo: "pdf",
    estado: "aprobada", usuario_nombre: "Manu Szwarc", usuario_id: 3,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 4, materia: "Inglés", escuela: "ORT Belgrano", año: "4to",
    profesor: "Cohen", tema: "Conditional sentences",
    notas: "First, second and third conditional. Reading comprehension.",
    archivo_url: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/pdf-sample.pdf",
    archivo_nombre: "ingles_4to.pdf", archivo_tipo: "pdf",
    estado: "aprobada", usuario_nombre: "Teo Reiman", usuario_id: 1,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: 5, materia: "Físico-Química", escuela: "ORT Almagro", año: "3ro",
    profesor: "Mizrahi", tema: "Cinemática",
    notas: "MRU y MRUA. Ejercicios de aplicación.",
    archivo_url: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/pdf-sample.pdf",
    archivo_nombre: "fisicoquimica_3ro.pdf", archivo_tipo: "pdf",
    estado: "aprobada", usuario_nombre: "Fede Hanono", usuario_id: 2,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 6, materia: "Biología", escuela: "ORT Almagro", año: "2do",
    profesor: "Fernández", tema: "Genética",
    notas: "Leyes de Mendel, cuadros de Punnett.",
    archivo_url: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/pdf-sample.pdf",
    archivo_nombre: "biologia_2do.pdf", archivo_tipo: "pdf",
    estado: "aprobada", usuario_nombre: "Manu Szwarc", usuario_id: 3,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

let nextId = 7;

// ── Fetch all pruebas ─────────────────────────────────────────────────────────
export async function fetchPruebas(filters?: {
  escuela?: string;
  año?: string;
  materia?: string;
}): Promise<Prueba[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    let result = MOCK_DB.filter((p) => p.estado === "aprobada");
    if (filters?.escuela) result = result.filter((p) => p.escuela === filters.escuela);
    if (filters?.año) result = result.filter((p) => p.año === filters.año);
    if (filters?.materia) result = result.filter((p) => p.materia === filters.materia);
    return result;
  }

  const params = new URLSearchParams();
  if (filters?.escuela) params.set("escuela", filters.escuela);
  if (filters?.año) params.set("año", filters.año);
  if (filters?.materia) params.set("materia", filters.materia);

  const res = await fetch(`${API_URL}/pruebas?${params}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Error al cargar pruebas");
  return res.json();
}

// ── Fetch single prueba ───────────────────────────────────────────────────────
export async function fetchPrueba(id: number): Promise<Prueba> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    const p = MOCK_DB.find((p) => p.id === id);
    if (!p) throw new Error("Prueba no encontrada");
    return p;
  }

  const res = await fetch(`${API_URL}/pruebas/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Prueba no encontrada");
  return res.json();
}

// ── Upload prueba ─────────────────────────────────────────────────────────────
export async function uploadPrueba(formData: FormData): Promise<Prueba> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 900));
    const file = formData.get("archivo") as File | null;
    const newPrueba: Prueba = {
      id: nextId++,
      materia:       formData.get("materia") as string || "",
      escuela:       formData.get("colegio") as string || "",
      año:           formData.get("año") as string || "",
      profesor:      formData.get("profesor") as string || "",
      tema:          formData.get("tema") as string || "",
      notas:         formData.get("notas") as string || "",
      archivo_url:   file ? URL.createObjectURL(file) : undefined,
      archivo_nombre: file?.name,
      archivo_tipo:  file?.name?.endsWith(".pdf") ? "pdf" : "image",
      estado:        "pendiente",
      usuario_nombre: formData.get("usuario_nombre") as string || "",
      usuario_id:    Number(formData.get("usuario_id")) || 0,
      created_at:    new Date().toISOString(),
    };
    MOCK_DB.push(newPrueba);
    return newPrueba;
  }

  const res = await fetch(`${API_URL}/pruebas`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Error al subir" }));
    throw new Error(err.message);
  }
  return res.json();
}

// ── Toggle favorito ───────────────────────────────────────────────────────────
export async function toggleFavorito(id: number): Promise<boolean> {
  if (USE_MOCK) {
    const p = MOCK_DB.find((p) => p.id === id);
    if (p) p.favorito = !p.favorito;
    return p?.favorito ?? false;
  }

  const res = await fetch(`${API_URL}/pruebas/${id}/favorito`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Error al guardar favorito");
  const data = await res.json();
  return data.favorito;
}