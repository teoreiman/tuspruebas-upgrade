import { getToken } from "./Auth";

const API_URL = "http://localhost:3000/api";
const USE_MOCK = true;
const DB_KEY = "tp_pruebas_db";

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
  archivo_tipo?: string;
  estado: "pendiente" | "aprobada" | "rechazada";
  usuario_nombre: string;
  usuario_email: string;
  usuario_id: number;
  created_at: string;
  favorito?: boolean;
}

export type PruebaEstado = "pendiente" | "aprobada" | "rechazada";

// ── Seed data ─────────────────────────────────────────────────────────────────
const SEED: Prueba[] = [
  {
    id: 1, materia: "Matemática", escuela: "ORT Almagro", año: "5to",
    profesor: "García", tema: "Integrales",
    notas: "Parcial del segundo trimestre. Entran integrales indefinidas y definidas.",
    archivo_url: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/pdf-sample.pdf",
    archivo_nombre: "parcial_mate_5to.pdf", archivo_tipo: "pdf",
    estado: "aprobada", usuario_nombre: "Teo Reiman", usuario_email: "teo@tuspruebas.com", usuario_id: 1,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 2, materia: "Química", escuela: "ORT Belgrano", año: "5to",
    profesor: "Rosenfeld", tema: "Estequiometría",
    notas: "Incluye problemas de estequiometría con reactivo limitante.",
    archivo_url: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/pdf-sample.pdf",
    archivo_nombre: "quimica_5to.pdf", archivo_tipo: "pdf",
    estado: "aprobada", usuario_nombre: "Fede Hanono", usuario_email: "fede@tuspruebas.com", usuario_id: 2,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: 3, materia: "Historia", escuela: "ORT Almagro", año: "3ro",
    profesor: "Levy", tema: "Segunda Guerra Mundial",
    notas: "Temas: causas, desarrollo, consecuencias. Mapa conceptual.",
    archivo_url: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/pdf-sample.pdf",
    archivo_nombre: "historia_3ro.pdf", archivo_tipo: "pdf",
    estado: "aprobada", usuario_nombre: "Manu Szwarc", usuario_email: "manu@tuspruebas.com", usuario_id: 3,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 4, materia: "Inglés", escuela: "ORT Belgrano", año: "4to",
    profesor: "Cohen", tema: "Conditional sentences",
    notas: "First, second and third conditional. Reading comprehension.",
    archivo_url: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/pdf-sample.pdf",
    archivo_nombre: "ingles_4to.pdf", archivo_tipo: "pdf",
    estado: "aprobada", usuario_nombre: "Teo Reiman", usuario_email: "teo@tuspruebas.com", usuario_id: 1,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: 5, materia: "Físico-Química", escuela: "ORT Almagro", año: "3ro",
    profesor: "Mizrahi", tema: "Cinemática",
    notas: "MRU y MRUA. Ejercicios de aplicación.",
    archivo_url: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/pdf-sample.pdf",
    archivo_nombre: "fisicoquimica_3ro.pdf", archivo_tipo: "pdf",
    estado: "aprobada", usuario_nombre: "Fede Hanono", usuario_email: "fede@tuspruebas.com", usuario_id: 2,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 6, materia: "Biología", escuela: "ORT Almagro", año: "2do",
    profesor: "Fernández", tema: "Genética",
    notas: "Leyes de Mendel, cuadros de Punnett.",
    archivo_url: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/pdf-sample.pdf",
    archivo_nombre: "biologia_2do.pdf", archivo_tipo: "pdf",
    estado: "aprobada", usuario_nombre: "Manu Szwarc", usuario_email: "manu@tuspruebas.com", usuario_id: 3,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

// ── localStorage persistence ───────────────────────────────────────────────────
function loadDB(): Prueba[] {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw) as Prueba[];
  } catch {}
  localStorage.setItem(DB_KEY, JSON.stringify(SEED));
  return SEED;
}

function saveDB(pruebas: Prueba[]) {
  localStorage.setItem(DB_KEY, JSON.stringify(pruebas));
}

// ── Fetch pruebas aprobadas (home) ────────────────────────────────────────────
export async function fetchPruebas(filters?: {
  escuela?: string;
  año?: string;
  materia?: string;
}): Promise<Prueba[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    let result = loadDB().filter((p) => p.estado === "aprobada");
    if (filters?.escuela) result = result.filter((p) => p.escuela === filters.escuela);
    if (filters?.año)     result = result.filter((p) => p.año === filters.año);
    if (filters?.materia) result = result.filter((p) => p.materia === filters.materia);
    return result;
  }

  const params = new URLSearchParams();
  if (filters?.escuela) params.set("escuela", filters.escuela);
  if (filters?.año)     params.set("año", filters.año);
  if (filters?.materia) params.set("materia", filters.materia);

  const res = await fetch(`${API_URL}/pruebas?${params}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Error al cargar pruebas");
  return res.json();
}

// ── Fetch todas las pruebas (admin) ───────────────────────────────────────────
export async function fetchAllPruebas(
  filtro?: PruebaEstado | "todas"
): Promise<Prueba[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    const db = loadDB();
    if (!filtro || filtro === "todas") return db;
    return db.filter((p) => p.estado === filtro);
  }

  const url =
    filtro && filtro !== "todas"
      ? `${API_URL}/admin/pruebas?estado=${filtro}`
      : `${API_URL}/admin/pruebas`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Error al cargar pruebas");
  return res.json();
}

// ── Fetch single prueba ───────────────────────────────────────────────────────
export async function fetchPrueba(id: number): Promise<Prueba> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    const p = loadDB().find((p) => p.id === id);
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
    const db = loadDB();
    const newId = Math.max(...db.map((p) => p.id), 0) + 1;

    const ext = file?.name?.split(".").pop()?.toLowerCase() ?? "";
    const tipo = ext === "pdf" ? "pdf" : ["jpg", "jpeg", "png"].includes(ext) ? "image" : "doc";

    const newPrueba: Prueba = {
      id: newId,
      materia:        formData.get("materia") as string || "",
      escuela:        formData.get("colegio") as string || "",
      año:            formData.get("año") as string || "",
      profesor:       formData.get("profesor") as string || "",
      tema:           formData.get("tema") as string || "",
      notas:          formData.get("notas") as string || "",
      archivo_url:    file ? URL.createObjectURL(file) : undefined,
      archivo_nombre: file?.name,
      archivo_tipo:   tipo,
      estado:         "pendiente",
      usuario_nombre: formData.get("usuario_nombre") as string || "",
      usuario_email:  formData.get("usuario_email") as string || "",
      usuario_id:     Number(formData.get("usuario_id")) || 0,
      created_at:     new Date().toISOString(),
    };

    db.push(newPrueba);
    saveDB(db);
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

// ── Cambiar estado (admin) ────────────────────────────────────────────────────
export async function updatePruebaEstado(
  id: number,
  estado: PruebaEstado
): Promise<void> {
  if (USE_MOCK) {
    const db = loadDB();
    const idx = db.findIndex((p) => p.id === id);
    if (idx >= 0) {
      db[idx] = { ...db[idx], estado };
      saveDB(db);
    }
    return;
  }

  const res = await fetch(`${API_URL}/admin/pruebas/${id}/estado`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ estado }),
  });
  if (!res.ok) throw new Error("Error al actualizar estado");
}

// ── Toggle favorito ───────────────────────────────────────────────────────────
export async function toggleFavorito(id: number): Promise<boolean> {
  if (USE_MOCK) {
    const db = loadDB();
    const idx = db.findIndex((p) => p.id === id);
    if (idx >= 0) {
      db[idx] = { ...db[idx], favorito: !db[idx].favorito };
      saveDB(db);
      return db[idx].favorito ?? false;
    }
    return false;
  }

  const res = await fetch(`${API_URL}/pruebas/${id}/favorito`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Error al guardar favorito");
  const data = await res.json();
  return data.favorito;
}
