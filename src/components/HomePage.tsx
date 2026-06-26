import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getUser, isSuperAdmin } from "../services/Auth";
import { fetchAllPruebas, fetchPruebas, toggleFavorito, type Prueba } from "../services/Pruebas";
import Logo from "./logo";

const C = {
  bg:       "#0a0e1a",
  bgCard:   "#111827",
  bgSection:"#0d1120",
  border:   "rgba(255,255,255,0.07)",
  blue:     "#1063EF",
  blueHov:  "#0050EF",
  white:    "#ffffff",
  text:     "#E8E8E8",
  gray:     "#8A8A8A",
};

const AÑOS_TABS = ["7mo", "1ro", "2do", "3ro", "4to", "5to"];
const ESCUELAS  = ["ORT Almagro", "ORT Belgrano", "Martín Buber", "Tarbut"];

const ORT: Record<string, string[]> = {
  "7mo": ["Tecnología","Matemática","Lengua y Literatura","Inglés","Ciencias Sociales","Ciencias Naturales","Arte","Hebreo"],
  "1ro": ["Arte","Biología","Tecnología","Educación Judía","Formación Ética y Ciudadana","Geografía","Historia","Matemática","Lengua y Literatura","Inglés"],
  "2do": ["Arte","Biología","Educación Judía","Tecnología","Formación Ética y Ciudadana","Geografía","Historia","Matemática","Lengua y Literatura","Inglés"],
  "3ro": ["Biología","Cultura Judía","Economía","Educación Judía","Físico-Química","Formación Ética y Ciudadana","Geografía","Historia","Lengua y Literatura","Matemática","Inglés"],
  "4to": ["Cultura Judía","Educación Judía","Inglés","Geografía","Formación Ética y Ciudadana","Física","Historia","Lengua y Literatura","Matemática"],
  "5to": ["Cultura Judía","Educación Judía","Matemática","Filosofía","Lengua y Literatura","Química","Marketing"],
};

const MATERIAS_POR_COLEGIO: Record<string, Record<string, string[]>> = {
  "ORT Almagro":  ORT,
  "ORT Belgrano": ORT,
  "Martín Buber": {"7mo":[],"1ro":[],"2do":[],"3ro":[],"4to":[],"5to":[]},
  "Tarbut":       {"7mo":[],"1ro":[],"2do":[],"3ro":[],"4to":[],"5to":[]},
};

const MATERIA_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Matemática":                  { bg: "rgba(16,99,239,0.15)",  text: "#4782E5", border: "rgba(71,130,229,0.3)"  },
  "Física":                      { bg: "rgba(124,58,237,0.15)", text: "#a78bfa", border: "rgba(167,139,250,0.3)" },
  "Físico-Química":              { bg: "rgba(168,85,247,0.15)", text: "#c084fc", border: "rgba(192,132,252,0.3)" },
  "Química":                     { bg: "rgba(16,185,129,0.15)", text: "#34d399", border: "rgba(52,211,153,0.3)"  },
  "Biología":                    { bg: "rgba(5,150,105,0.15)",  text: "#6ee7b7", border: "rgba(110,231,183,0.3)" },
  "Historia":                    { bg: "rgba(245,158,11,0.15)", text: "#fbbf24", border: "rgba(251,191,36,0.3)"  },
  "Geografía":                   { bg: "rgba(234,179,8,0.15)",  text: "#fde047", border: "rgba(253,224,71,0.3)"  },
  "Inglés":                      { bg: "rgba(236,72,153,0.15)", text: "#f472b6", border: "rgba(244,114,182,0.3)" },
  "Lengua y Literatura":         { bg: "rgba(239,68,68,0.15)",  text: "#f87171", border: "rgba(248,113,113,0.3)" },
  "Arte":                        { bg: "rgba(249,115,22,0.15)", text: "#fb923c", border: "rgba(251,146,60,0.3)"  },
  "Tecnología":                  { bg: "rgba(6,182,212,0.15)",  text: "#22d3ee", border: "rgba(34,211,238,0.3)"  },
  "Educación Judía":             { bg: "rgba(245,158,11,0.12)", text: "#d97706", border: "rgba(217,119,6,0.3)"   },
  "Cultura Judía":               { bg: "rgba(217,119,6,0.15)",  text: "#f59e0b", border: "rgba(245,158,11,0.3)"  },
  "Hebreo":                      { bg: "rgba(16,185,129,0.12)", text: "#10b981", border: "rgba(16,185,129,0.3)"  },
  "Ciencias Naturales":          { bg: "rgba(52,211,153,0.12)", text: "#34d399", border: "rgba(52,211,153,0.3)"  },
  "Ciencias Sociales":           { bg: "rgba(245,158,11,0.12)", text: "#fbbf24", border: "rgba(251,191,36,0.3)"  },
  "Formación Ética y Ciudadana": { bg: "rgba(99,102,241,0.15)", text: "#818cf8", border: "rgba(129,140,248,0.3)" },
  "Economía":                    { bg: "rgba(14,165,233,0.15)", text: "#38bdf8", border: "rgba(56,189,248,0.3)"  },
  "Filosofía":                   { bg: "rgba(139,92,246,0.15)", text: "#a78bfa", border: "rgba(167,139,250,0.3)" },
  "Marketing":                   { bg: "rgba(244,63,94,0.15)",  text: "#fb7185", border: "rgba(251,113,133,0.3)" },
};

function PruebaCard({ prueba }: { prueba: Prueba }) {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(prueba.favorito ?? false);
  const s = MATERIA_COLORS[prueba.materia] || { bg: "rgba(255,255,255,0.05)", text: C.text, border: C.border };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      whileHover={{ y: -3, borderColor: "rgba(16,99,239,0.25)" }}
      onClick={() => navigate(`/prueba/${prueba.id}`)}
      style={{
        backgroundColor: C.bgCard, border: `1px solid ${C.border}`,
        borderRadius: "14px", padding: "18px 20px",
        display: "flex", flexDirection: "column", gap: "12px",
        transition: "border-color 0.2s", position: "relative", overflow: "hidden",
        cursor: "pointer",
      }}
    >
      {/* Left accent bar */}
      <div style={{
        position: "absolute", left: 0, top: "16px", bottom: "16px",
        width: "3px", borderRadius: "0 3px 3px 0",
        backgroundColor: s.text, opacity: 0.55,
      }} />

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", paddingLeft: "8px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "999px", backgroundColor: s.bg, color: s.text, border: `1px solid ${s.border}`, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "160px" }}>
          {prueba.materia}
        </span>
        <motion.button
          whileHover={{ scale: 1.3 }} whileTap={{ scale: 0.85 }}
          onClick={async (e) => {
            e.stopPropagation();
            const newState = await toggleFavorito(prueba.id);
            setSaved(newState);
          }}
          style={{ fontSize: "18px", background: "none", border: "none", cursor: "pointer", color: saved ? "#f59e0b" : "rgba(255,255,255,0.2)", lineHeight: 1, padding: 0, flexShrink: 0 }}>
          {saved ? "★" : "☆"}
        </motion.button>
      </div>

      {/* File preview */}
      {prueba.archivo_url && prueba.archivo_tipo === "image" && (
        <div style={{ paddingLeft: "8px", paddingRight: "0" }}>
          <img
            src={prueba.archivo_url}
            alt="Vista previa"
            style={{
              width: "100%", height: "110px", objectFit: "cover",
              borderRadius: "8px", border: `1px solid ${C.border}`,
              display: "block",
            }}
          />
        </div>
      )}
      {prueba.archivo_url && prueba.archivo_tipo === "pdf" && (
        <div style={{
          paddingLeft: "8px",
          display: "flex", alignItems: "center", gap: "8px",
          padding: "8px 12px", borderRadius: "8px",
          backgroundColor: "rgba(255,255,255,0.03)",
          border: `1px solid ${C.border}`,
          marginLeft: "8px",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.gray} strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <span style={{ fontSize: "11px", color: C.gray, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {prueba.archivo_nombre || "Archivo PDF adjunto"}
          </span>
        </div>
      )}

      <div style={{ paddingLeft: "8px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: 700, color: C.white, marginBottom: "4px", lineHeight: 1.35 }}>{prueba.tema}</h3>
        <p style={{ fontSize: "12px", color: C.gray }}>Prof. {prueba.profesor}</p>
      </div>

      <div style={{ paddingTop: "10px", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", paddingLeft: "8px" }}>
        <div style={{ display: "flex", gap: "4px" }}>
          {[prueba.escuela, prueba.año].map((tag) => (
            <span key={tag} style={{ fontSize: "10px", color: C.gray, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "5px", padding: "2px 7px", fontWeight: 500 }}>{tag}</span>
          ))}
        </div>
        <motion.button
          whileHover={{ x: 2 }}
          onClick={(e) => { e.stopPropagation(); navigate(`/prueba/${prueba.id}`); }}
          style={{ fontSize: "12px", color: C.blue, fontWeight: 700, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          Ver →
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const user = getUser();
  const [search, setSearch] = useState("");
  const [añoTab, setAñoTab] = useState("5to");
  const [escuela, setEscuela] = useState("ORT Almagro");
  const [materiaFiltro, setMateriaFiltro] = useState("Todas");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [pendientesCount, setPendientesCount] = useState(0);
  const [pruebas, setPruebas] = useState<Prueba[]>([]);
  const [loadingPruebas, setLoadingPruebas] = useState(true);
  const esSuperAdmin = isSuperAdmin();

  useEffect(() => {
    if (!esSuperAdmin) return;
    fetchAllPruebas("pendiente").then((p) => setPendientesCount(p.length)).catch(() => {});
  }, [esSuperAdmin]);

  useEffect(() => {
    setLoadingPruebas(true);
    fetchPruebas({ escuela, año: añoTab })
      .then(setPruebas)
      .catch(() => setPruebas([]))
      .finally(() => setLoadingPruebas(false));
  }, [escuela, añoTab]);

  const materiasDelAño = MATERIAS_POR_COLEGIO[escuela]?.[añoTab] ?? [];
  const sinMaterias = materiasDelAño.length === 0;
  const MATERIAS_FILTRO = ["Todas", ...materiasDelAño];
  const materiaValida = MATERIAS_FILTRO.includes(materiaFiltro) ? materiaFiltro : "Todas";

  const q = search.toLowerCase();
  const filtered = pruebas.filter((p) =>
    (search === "" || p.tema.toLowerCase().includes(q) || p.materia.toLowerCase().includes(q) || p.profesor.toLowerCase().includes(q)) &&
    (materiaValida === "Todas" || p.materia === materiaValida)
  );

  const hasFilters = materiaValida !== "Todas" || search !== "";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, fontFamily: "'DM Sans', sans-serif" }}>
      {/* Navbar */}
      <nav style={{ position: "sticky", top: 0, zIndex: 40, backgroundColor: "rgba(10,14,26,0.95)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}`, padding: "0 48px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo size="sm" onClick={() => navigate("/")} />

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {esSuperAdmin && (
              <motion.button
                whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate("/admin")}
                title="Pruebas pendientes de aprobación"
                style={{ position: "relative", width: "36px", height: "36px", borderRadius: "10px", border: `1px solid ${C.border}`, backgroundColor: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
                🔔
                {pendientesCount > 0 && (
                  <span style={{ position: "absolute", top: "-4px", right: "-4px", minWidth: "16px", height: "16px", padding: "0 4px", borderRadius: "999px", backgroundColor: "#dc2626", color: "#fff", fontSize: "10px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>
                    {pendientesCount}
                  </span>
                )}
              </motion.button>
            )}
            <motion.button whileHover={{ backgroundColor: "rgba(16,99,239,0.1)", borderColor: "rgba(16,99,239,0.3)" }} onClick={() => navigate("/ia")}
              style={{ fontSize: "13px", color: C.blue, fontWeight: 600, padding: "7px 14px", borderRadius: "8px", border: `1px solid rgba(16,99,239,0.2)`, backgroundColor: "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
              <span>✦</span> IA
            </motion.button>
            <motion.button whileHover={{ backgroundColor: C.blueHov }} whileTap={{ scale: 0.98 }} onClick={() => navigate("/subir")}
              style={{ backgroundColor: C.blue, color: C.white, fontSize: "13px", fontWeight: 700, padding: "8px 18px", borderRadius: "8px", border: "none", cursor: "pointer" }}>
              + Subir prueba
            </motion.button>

            <div style={{ position: "relative" }}>
              <motion.button onClick={() => setShowUserMenu(!showUserMenu)} whileHover={{ opacity: 0.85 }}
                style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: C.blue, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", color: C.white, fontWeight: 700 }}>
                {user?.nombre?.charAt(0).toUpperCase() ?? "U"}
              </motion.button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.97 }} transition={{ duration: 0.15 }}
                    style={{ position: "absolute", top: "44px", right: 0, backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.4)", minWidth: "180px", overflow: "hidden", zIndex: 100 }}>
                    <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
                      <p style={{ fontSize: "13px", fontWeight: 700, color: C.white }}>{user?.nombre}</p>
                      <p style={{ fontSize: "11px", color: C.gray }}>{user?.email}</p>
                    </div>
                    <div style={{ padding: "4px" }}>
                      {[{ label: "Mi perfil", path: "/perfil" }, { label: "Subir prueba", path: "/subir" }].map((item) => (
                        <motion.button key={item.label} whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                          onClick={() => { setShowUserMenu(false); navigate(item.path); }}
                          style={{ width: "100%", padding: "10px 14px", border: "none", backgroundColor: "transparent", cursor: "pointer", textAlign: "left", fontSize: "13px", color: C.text, fontWeight: 500, borderRadius: "8px", fontFamily: "'DM Sans', sans-serif" }}>
                          {item.label}
                        </motion.button>
                      ))}
                      {esSuperAdmin && (
                        <motion.button whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                          onClick={() => { setShowUserMenu(false); navigate("/admin"); }}
                          style={{ width: "100%", padding: "10px 14px", border: "none", backgroundColor: "transparent", cursor: "pointer", textAlign: "left", fontSize: "13px", color: C.text, fontWeight: 500, borderRadius: "8px", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span>Panel de moderación</span>
                          {pendientesCount > 0 && (
                            <span style={{ minWidth: "18px", height: "18px", padding: "0 5px", borderRadius: "999px", backgroundColor: "#dc2626", color: "#fff", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>
                              {pendientesCount}
                            </span>
                          )}
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 48px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 900, color: C.white, fontFamily: "'Syne', sans-serif", marginBottom: "4px" }}>Explorar pruebas</h1>
            <p style={{ fontSize: "13px", color: C.gray }}>{filtered.length} prueba{filtered.length !== 1 ? "s" : ""} · {escuela} · {añoTab}</p>
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" }}>
            {ESCUELAS.map((col) => (
              <motion.button key={col} onClick={() => { setEscuela(col); setMateriaFiltro("Todas"); }} whileTap={{ scale: 0.97 }}
                style={{ padding: "8px 16px", borderRadius: "10px", border: `1.5px solid ${escuela === col ? C.blue : C.border}`, backgroundColor: escuela === col ? C.blue : "transparent", color: escuela === col ? C.white : C.text, fontSize: "13px", fontWeight: 700, cursor: "pointer", transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif" }}>
                {col}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Año tabs */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "20px", backgroundColor: C.bgCard, padding: "4px", borderRadius: "12px", width: "fit-content", border: `1px solid ${C.border}` }}>
          {AÑOS_TABS.map((tab) => (
            <motion.button key={tab} onClick={() => { setAñoTab(tab); setMateriaFiltro("Todas"); }} whileTap={{ scale: 0.96 }}
              style={{ padding: "7px 22px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: tab === añoTab ? 700 : 500, color: tab === añoTab ? C.white : C.gray, backgroundColor: tab === añoTab ? C.blue : "transparent", transition: "all 0.15s" }}>
              {tab}
            </motion.button>
          ))}
        </div>

        {/* Materia chips */}
        {sinMaterias ? (
          <div style={{ marginBottom: "28px", padding: "12px 16px", backgroundColor: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "10px", fontSize: "13px", color: "#fbbf24" }}>
            Las materias de <strong>{escuela}</strong> todavía no están cargadas.
          </div>
        ) : (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
            {MATERIAS_FILTRO.map((m) => {
              const active = materiaValida === m;
              const colores = MATERIA_COLORS[m];
              return (
                <motion.button key={m} onClick={() => setMateriaFiltro(m)} whileHover={{ y: -1 }} whileTap={{ scale: 0.96 }}
                  style={{
                    padding: "6px 14px", borderRadius: "999px",
                    border: active ? `1.5px solid ${colores?.text || C.blue}` : `1.5px solid ${C.border}`,
                    backgroundColor: active ? (colores?.bg || "rgba(16,99,239,0.2)") : "transparent",
                    color: active ? (colores?.text || C.blue) : C.gray,
                    fontSize: "12px", fontWeight: active ? 700 : 500,
                    cursor: "pointer", transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif",
                  }}>
                  {m}
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Search */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "28px" }}>
          <div style={{ position: "relative", flex: 1, maxWidth: "480px" }}>
            <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "14px", color: C.gray }}>🔍</span>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por tema, materia, profesor..."
              style={{ width: "100%", padding: "10px 16px 10px 42px", border: `1px solid ${C.border}`, borderRadius: "10px", fontSize: "13px", color: C.white, backgroundColor: C.bgCard, outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = C.blue)}
              onBlur={(e) => (e.currentTarget.style.borderColor = C.border)} />
          </div>
          <AnimatePresence>
            {hasFilters && (
              <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => { setMateriaFiltro("Todas"); setSearch(""); }}
                style={{ padding: "10px 16px", border: `1px solid ${C.border}`, borderRadius: "10px", fontSize: "13px", color: C.gray, backgroundColor: "transparent", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                ✕ Limpiar
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          {loadingPruebas ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ width: "28px", height: "28px", border: `3px solid ${C.border}`, borderTopColor: C.blue, borderRadius: "50%" }} />
            </div>
          ) : filtered.length > 0 ? (
            <motion.div layout style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
              {filtered.map((p) => <PruebaCard key={p.id} prueba={p} />)}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: "12px" }}>
              <p style={{ fontSize: "17px", fontWeight: 700, color: C.white }}>No hay pruebas para {añoTab} en {escuela}</p>
              <p style={{ fontSize: "13px", color: C.gray }}>Todavía no se subieron pruebas de este año o materia</p>
              <motion.button whileHover={{ backgroundColor: C.blueHov }} onClick={() => { setMateriaFiltro("Todas"); setSearch(""); }}
                style={{ marginTop: "8px", backgroundColor: C.blue, color: C.white, fontWeight: 700, fontSize: "13px", padding: "10px 24px", borderRadius: "10px", border: "none", cursor: "pointer" }}>
                Limpiar filtros
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
