import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface Prueba {
  id: number;
  materia: string;
  escuela: string;
  año: string;
  profesor: string;
  tema: string;
}

// ── Materias por colegio y año ────────────────────────────────────────────────
const ORT_MATERIAS: Record<string, string[]> = {
  "7mo": ["Tecnología", "Matemática", "Lengua y Literatura", "Inglés", "Ciencias Sociales", "Ciencias Naturales", "Arte", "Hebreo"],
  "1ro": ["Arte", "Biología", "Tecnología", "Educación Judía", "Formación Ética y Ciudadana", "Geografía", "Historia", "Matemática", "Lengua y Literatura", "Inglés"],
  "2do": ["Arte", "Biología", "Educación Judía", "Tecnología", "Formación Ética y Ciudadana", "Geografía", "Historia", "Matemática", "Lengua y Literatura", "Inglés"],
  "3ro": ["Biología", "Cultura Judía", "Economía", "Educación Judía", "Físico-Química", "Formación Ética y Ciudadana", "Geografía", "Historia", "Lengua y Literatura", "Matemática", "Inglés"],
  "4to": ["Cultura Judía", "Educación Judía", "Inglés", "Geografía", "Formación Ética y Ciudadana", "Física", "Historia", "Lengua y Literatura", "Matemática"],
  "5to": ["Cultura Judía", "Educación Judía", "Matemática", "Filosofía", "Lengua y Literatura", "Química", "Marketing"],
};

const MATERIAS_POR_COLEGIO: Record<string, Record<string, string[]>> = {
  "ORT Almagro":  ORT_MATERIAS,
  "ORT Belgrano": ORT_MATERIAS,
  "Martín Buber": { "7mo": [], "1ro": [], "2do": [], "3ro": [], "4to": [], "5to": [] },
  "Wolfson":      { "7mo": [], "1ro": [], "2do": [], "3ro": [], "4to": [], "5to": [] },
  "Tarbut":       { "7mo": [], "1ro": [], "2do": [], "3ro": [], "4to": [], "5to": [] },
};

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_PRUEBAS: Prueba[] = [
  { id: 1, materia: "Matemática", escuela: "ORT Almagro", año: "5to", profesor: "García", tema: "Integrales" },
  { id: 2, materia: "Química", escuela: "ORT Belgrano", año: "5to", profesor: "Rosenfeld", tema: "Estequiometría" },
  { id: 3, materia: "Historia", escuela: "ORT Almagro", año: "3ro", profesor: "Levy", tema: "Segunda Guerra Mundial" },
  { id: 4, materia: "Inglés", escuela: "ORT Belgrano", año: "4to", profesor: "Cohen", tema: "Conditional sentences" },
  { id: 5, materia: "Físico-Química", escuela: "ORT Almagro", año: "3ro", profesor: "Mizrahi", tema: "Cinemática" },
  { id: 6, materia: "Biología", escuela: "ORT Almagro", año: "2do", profesor: "Fernández", tema: "Genética" },
  { id: 7, materia: "Matemática", escuela: "ORT Belgrano", año: "3ro", profesor: "Sznajder", tema: "Trigonometría" },
  { id: 8, materia: "Lengua y Literatura", escuela: "ORT Almagro", año: "5to", profesor: "Goldberg", tema: "El túnel" },
  { id: 9, materia: "Filosofía", escuela: "ORT Belgrano", año: "5to", profesor: "Perelman", tema: "Ética contemporánea" },
  { id: 10, materia: "Historia", escuela: "ORT Almagro", año: "4to", profesor: "García", tema: "Revolución Francesa" },
  { id: 11, materia: "Inglés", escuela: "ORT Belgrano", año: "1ro", profesor: "Smith", tema: "Present Perfect" },
  { id: 12, materia: "Tecnología", escuela: "ORT Almagro", año: "7mo", profesor: "López", tema: "Introducción a la programación" },
  { id: 13, materia: "Matemática", escuela: "ORT Almagro", año: "4to", profesor: "Ruiz", tema: "Logaritmos" },
  { id: 14, materia: "Geografía", escuela: "ORT Belgrano", año: "2do", profesor: "Klein", tema: "Geopolítica" },
  { id: 15, materia: "Cultura Judía", escuela: "ORT Almagro", año: "5to", profesor: "Shapiro", tema: "Sionismo" },
  { id: 16, materia: "Arte", escuela: "ORT Belgrano", año: "1ro", profesor: "Berezovsky", tema: "Expresionismo" },
  { id: 17, materia: "Economía", escuela: "ORT Almagro", año: "3ro", profesor: "Stein", tema: "Oferta y demanda" },
  { id: 18, materia: "Marketing", escuela: "ORT Belgrano", año: "5to", profesor: "Berger", tema: "Estrategias digitales" },
  { id: 19, materia: "Ciencias Naturales", escuela: "ORT Almagro", año: "7mo", profesor: "Rosen", tema: "Ecosistemas" },
  { id: 20, materia: "Hebreo", escuela: "ORT Belgrano", año: "7mo", profesor: "Katz", tema: "Vocabulario básico" },
];

const AÑOS_TABS = ["7mo", "1ro", "2do", "3ro", "4to", "5to"];
const ESCUELAS = ["ORT Almagro", "ORT Belgrano", "Martín Buber", "Wolfson", "Tarbut"];

const MATERIA_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Matemática":                  { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
  "Física":                      { bg: "#faf5ff", text: "#7e22ce", border: "#e9d5ff" },
  "Físico-Química":              { bg: "#fdf4ff", text: "#86198f", border: "#f5d0fe" },
  "Química":                     { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
  "Biología":                    { bg: "#ecfdf5", text: "#065f46", border: "#a7f3d0" },
  "Historia":                    { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
  "Geografía":                   { bg: "#fefce8", text: "#a16207", border: "#fef08a" },
  "Inglés":                      { bg: "#fdf2f8", text: "#9d174d", border: "#fbcfe8" },
  "Lengua y Literatura":         { bg: "#fff1f2", text: "#be123c", border: "#fecdd3" },
  "Arte":                        { bg: "#fff7ed", text: "#b45309", border: "#fde68a" },
  "Tecnología":                  { bg: "#f0f9ff", text: "#0369a1", border: "#bae6fd" },
  "Educación Judía":             { bg: "#fefce8", text: "#854d0e", border: "#fef08a" },
  "Cultura Judía":               { bg: "#fffbeb", text: "#92400e", border: "#fde68a" },
  "Hebreo":                      { bg: "#f0fdf4", text: "#166534", border: "#bbf7d0" },
  "Ciencias Naturales":          { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
  "Ciencias Sociales":           { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
  "Formación Ética y Ciudadana": { bg: "#f5f3ff", text: "#6d28d9", border: "#ddd6fe" },
  "Economía":                    { bg: "#f0f9ff", text: "#0c4a6e", border: "#bae6fd" },
  "Filosofía":                   { bg: "#fdf4ff", text: "#7e22ce", border: "#f5d0fe" },
  "Marketing":                   { bg: "#fff1f2", text: "#9f1239", border: "#fecdd3" },
};

// ── Prueba Card ───────────────────────────────────────────────────────────────
function PruebaCard({ prueba }: { prueba: Prueba }) {
  const [saved, setSaved] = useState(false);
  const style = MATERIA_COLORS[prueba.materia] || { bg: "#f3f4f6", text: "#374151", border: "#e5e7eb" };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.09)" }}
      style={{
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "14px",
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        transition: "box-shadow 0.2s",
      }}
    >
      {/* Badge + Star */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
        <span style={{
          fontSize: "11px", fontWeight: 700,
          padding: "3px 10px", borderRadius: "999px",
          backgroundColor: style.bg, color: style.text,
          border: `1px solid ${style.border}`,
          whiteSpace: "nowrap", overflow: "hidden",
          textOverflow: "ellipsis", maxWidth: "160px",
        }}>
          {prueba.materia}
        </span>
        <motion.button
          whileHover={{ scale: 1.3 }} whileTap={{ scale: 0.85 }}
          onClick={() => setSaved(!saved)}
          style={{
            fontSize: "18px", background: "none", border: "none",
            cursor: "pointer", color: saved ? "#f59e0b" : "#d1d5db",
            lineHeight: 1, padding: 0, flexShrink: 0,
          }}
        >
          {saved ? "★" : "☆"}
        </motion.button>
      </div>

      {/* Content */}
      <div>
        <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#111", marginBottom: "4px", lineHeight: 1.35 }}>
          {prueba.tema}
        </h3>
        <p style={{ fontSize: "12px", color: "#9ca3af" }}>Prof. {prueba.profesor}</p>
      </div>

      {/* Footer */}
      <div style={{
        paddingTop: "10px", borderTop: "1px solid #f3f4f6",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {[prueba.escuela, prueba.año].map((tag) => (
            <span key={tag} style={{
              fontSize: "10px", color: "#6b7280",
              backgroundColor: "#f3f4f6", borderRadius: "5px",
              padding: "2px 7px", fontWeight: 500,
            }}>
              {tag}
            </span>
          ))}
        </div>
        <motion.button
          whileHover={{ x: 2 }}
          style={{
            fontSize: "12px", color: "#3b82f6", fontWeight: 700,
            background: "none", border: "none", cursor: "pointer", padding: 0,
          }}
        >
          Ver →
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [añoTab, setAñoTab] = useState("5to");
  const [escuela, setEscuela] = useState("ORT Almagro");
  const [materiaFiltro, setMateriaFiltro] = useState("Todas");

  const materiasDelAño = MATERIAS_POR_COLEGIO[escuela]?.[añoTab] ?? [];
  const sinMaterias = materiasDelAño.length === 0;
  const MATERIAS_FILTRO = ["Todas", ...materiasDelAño];

  // Si la materia seleccionada no existe en el nuevo año/colegio, resetear
  const materiaValida = MATERIAS_FILTRO.includes(materiaFiltro) ? materiaFiltro : "Todas";

  const q = search.toLowerCase();
  const filtered = MOCK_PRUEBAS.filter((p) => {
    const matchSearch =
      search === "" ||
      p.tema.toLowerCase().includes(q) ||
      p.materia.toLowerCase().includes(q) ||
      p.profesor.toLowerCase().includes(q);
    const matchAño = p.año === añoTab;
    const matchEscuela = p.escuela === escuela;
    const matchMateria = materiaValida === "Todas" || p.materia === materiaValida;
    return matchSearch && matchAño && matchEscuela && matchMateria;
  });

  const hasFilters = materiaValida !== "Todas" || search !== "";

  const handleCambioAño = (tab: string) => {
    setAñoTab(tab);
    setMateriaFiltro("Todas");
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 40,
        backgroundColor: "#fff", borderBottom: "1px solid #e5e7eb",
        padding: "0 48px",
      }}>
        <div style={{
          maxWidth: "1400px", margin: "0 auto",
          height: "60px", display: "flex",
          alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            <motion.button
              onClick={() => navigate("/")}
              whileHover={{ opacity: 0.7 }}
              style={{ fontSize: "16px", fontWeight: 900, color: "#111", background: "none", border: "none", cursor: "pointer", fontFamily: "'Syne', sans-serif" }}
            >
              tuspruebas
            </motion.button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button style={{ fontSize: "13px", color: "#6b7280", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
              Mi perfil
            </button>
            <motion.button
              whileHover={{ backgroundColor: "#1f2937" }}
              whileTap={{ scale: 0.98 }}
              style={{
                backgroundColor: "#111", color: "#fff",
                fontSize: "13px", fontWeight: 700,
                padding: "8px 20px", borderRadius: "8px",
                border: "none", cursor: "pointer",
              }}
            >
              + Subir prueba
            </motion.button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 48px" }}>

        {/* ── Header con colegio selector ── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 900, color: "#111", fontFamily: "'Syne', sans-serif", marginBottom: "4px" }}>
              Explorar pruebas
            </h1>
            <p style={{ fontSize: "13px", color: "#9ca3af" }}>
              {filtered.length} prueba{filtered.length !== 1 ? "s" : ""} encontrada{filtered.length !== 1 ? "s" : ""} · {escuela} · {añoTab}
            </p>
          </div>

          {/* Selector de colegio */}
          <div style={{ display: "flex", gap: "8px" }}>
            {ESCUELAS.map((col) => (
              <motion.button
                key={col}
                onClick={() => setEscuela(col)}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: "8px 18px",
                  borderRadius: "10px",
                  border: escuela === col ? "2px solid #111" : "2px solid #e5e7eb",
                  backgroundColor: escuela === col ? "#111" : "#fff",
                  color: escuela === col ? "#fff" : "#374151",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {col}
              </motion.button>
            ))}
          </div>
        </div>

        {/* ── Año tabs ── */}
        <div style={{
          display: "flex", gap: "6px", marginBottom: "20px",
          backgroundColor: "#f3f4f6", padding: "4px",
          borderRadius: "12px", width: "fit-content",
        }}>
          {AÑOS_TABS.map((tab) => (
            <motion.button
              key={tab}
              onClick={() => handleCambioAño(tab)}
              whileTap={{ scale: 0.96 }}
              style={{
                padding: "7px 22px", borderRadius: "8px",
                border: "none", cursor: "pointer",
                fontSize: "13px", fontWeight: tab === añoTab ? 700 : 500,
                color: tab === añoTab ? "#111" : "#6b7280",
                backgroundColor: tab === añoTab ? "#fff" : "transparent",
                boxShadow: tab === añoTab ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                transition: "all 0.15s",
              }}
            >
              {tab}
            </motion.button>
          ))}
        </div>

        {/* ── Materia chips ── */}
        {sinMaterias ? (
          <div style={{
            marginBottom: "28px",
            padding: "12px 16px",
            backgroundColor: "#fefce8",
            border: "1px solid #fde68a",
            borderRadius: "10px",
            fontSize: "13px",
            color: "#92400e",
          }}>
            ⚠️ Las materias de <strong>{escuela}</strong> todavía no están cargadas. Podés buscar por tema igual.
          </div>
        ) : (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
            {MATERIAS_FILTRO.map((m) => {
              const active = materiaValida === m;
              const colores = MATERIA_COLORS[m];
              return (
                <motion.button
                  key={m}
                  onClick={() => setMateriaFiltro(m)}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "999px",
                    border: active ? `1.5px solid ${colores?.text || "#111"}` : "1.5px solid #e5e7eb",
                    backgroundColor: active ? (colores?.bg || "#111") : "#fff",
                    color: active ? (colores?.text || "#fff") : "#6b7280",
                    fontSize: "12px",
                    fontWeight: active ? 700 : 500,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {m}
                </motion.button>
              );
            })}
          </div>
        )}

        {/* ── Search + Limpiar ── */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "28px" }}>
          <div style={{ position: "relative", flex: 1, maxWidth: "480px" }}>
            <span style={{
              position: "absolute", left: "14px",
              top: "50%", transform: "translateY(-50%)",
              fontSize: "14px", color: "#9ca3af",
            }}>
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por tema, profesor..."
              style={{
                width: "100%", padding: "10px 16px 10px 42px",
                border: "1px solid #e5e7eb", borderRadius: "10px",
                fontSize: "13px", color: "#111",
                backgroundColor: "#fff", outline: "none",
                boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#111")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
            />
          </div>

          <AnimatePresence>
            {hasFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => { setMateriaFiltro("Todas"); setSearch(""); }}
                style={{
                  padding: "10px 16px",
                  border: "1px solid #e5e7eb", borderRadius: "10px",
                  fontSize: "13px", color: "#6b7280",
                  backgroundColor: "#fff", cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                ✕ Limpiar
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* ── Grid ── */}
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div layout style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
              {filtered.map((p) => (
                <PruebaCard key={p.id} prueba={p} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                padding: "80px 0", gap: "12px",
              }}
            >
              <span style={{ fontSize: "56px" }}>📭</span>
              <p style={{ fontSize: "17px", fontWeight: 700, color: "#111" }}>
                No hay pruebas para {añoTab} en {escuela}
              </p>
              <p style={{ fontSize: "13px", color: "#9ca3af" }}>
                Todavía no se subieron pruebas de este año o materia
              </p>
              <motion.button
                whileHover={{ backgroundColor: "#1f2937" }}
                onClick={() => { setMateriaFiltro("Todas"); setSearch(""); }}
                style={{
                  marginTop: "8px", backgroundColor: "#111",
                  color: "#fff", fontWeight: 700, fontSize: "13px",
                  padding: "10px 24px", borderRadius: "10px",
                  border: "none", cursor: "pointer",
                }}
              >
                Limpiar filtros
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}