import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getUser } from "../services/Auth";
import Logo from "./logo";

const C = {
  bg:        "#0a0e1a",
  bgCard:    "#111827",
  bgSection: "#0d1120",
  border:    "rgba(255,255,255,0.07)",
  blue:      "#1063EF",
  blueHov:   "#0050EF",
  white:     "#ffffff",
  text:      "#E8E8E8",
  gray:      "#8A8A8A",
};

interface Prueba { id: number; materia: string; escuela: string; año: string; profesor: string; tema: string; }

const MOCK_PRUEBAS: Prueba[] = [
  { id: 1,  materia: "Matemática",          escuela: "ORT Almagro",  año: "5to", profesor: "Carolina G. Pedraza",  tema: "Integrales" },
  { id: 2,  materia: "Química",             escuela: "ORT Belgrano", año: "5to", profesor: "Leila Rodriguez",      tema: "Estructura Atómica" },
  { id: 3,  materia: "Historia",            escuela: "ORT Almagro",  año: "3ro", profesor: "Hugo Olivencia",       tema: "Revolución Francesa" },
  { id: 4,  materia: "Inglés",              escuela: "ORT Belgrano", año: "4to", profesor: "Soña Graziano",        tema: "Conditionals" },
  { id: 5,  materia: "Físico-Química",      escuela: "ORT Almagro",  año: "3ro", profesor: "Paniagua",             tema: "Cinemática" },
  { id: 6,  materia: "Biología",            escuela: "ORT Almagro",  año: "2do", profesor: "Macaferro",            tema: "Herencia y Genética" },
  { id: 7,  materia: "Matemática",          escuela: "ORT Belgrano", año: "3ro", profesor: "Federico Bianco",      tema: "Trigonometría" },
  { id: 8,  materia: "Lengua y Literatura", escuela: "ORT Almagro",  año: "5to", profesor: "Ivan Fridman",         tema: "Operación Masacre" },
  { id: 9,  materia: "Filosofía",           escuela: "ORT Belgrano", año: "5to", profesor: "Juan P. Todaro",       tema: "Preguntas filosóficas" },
  { id: 10, materia: "Historia",            escuela: "ORT Almagro",  año: "4to", profesor: "Hugo Olivencia",       tema: "Revolución Francesa" },
  { id: 11, materia: "Inglés",              escuela: "ORT Belgrano", año: "1ro", profesor: "Gabriela Dadón",       tema: "Present Perfect" },
  { id: 12, materia: "Tecnología",          escuela: "ORT Almagro",  año: "7mo", profesor: "Clarisa Geler",        tema: "Diagrama de bloques" },
  { id: 13, materia: "Matemática",          escuela: "ORT Almagro",  año: "4to", profesor: "Martin Davila",        tema: "Funciones logarítmicas y exponenciales" },
  { id: 14, materia: "Geografía",           escuela: "ORT Belgrano", año: "2do", profesor: "Anahí Alvarado",       tema: "Procesos endógenos y exógenos" },
  { id: 15, materia: "Cultura Judía",       escuela: "ORT Almagro",  año: "5to", profesor: "Mariel Goisen",        tema: "Festividades judías" },
  { id: 16, materia: "Economía",            escuela: "ORT Almagro",  año: "3ro", profesor: "Gloria Liz",           tema: "Oferta y demanda" },
  { id: 17, materia: "Marketing",           escuela: "ORT Belgrano", año: "5to", profesor: "Julieta A.",           tema: "Estrategias digitales" },
  { id: 18, materia: "Ciencias Naturales",  escuela: "ORT Almagro",  año: "7mo", profesor: "Vanesa Rocío Puente",  tema: "Fotosíntesis" },
  { id: 19, materia: "Hebreo",              escuela: "ORT Belgrano", año: "7mo", profesor: "Deborah Suez",         tema: "Verbos" },
];

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
  "Martín Buber": { "7mo":[],"1ro":[],"2do":[],"3ro":[],"4to":[],"5to":[] },
  "Tarbut":       { "7mo":[],"1ro":[],"2do":[],"3ro":[],"4to":[],"5to":[] },
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

function PruebaCard({ prueba, index = 0 }: { prueba: Prueba; index?: number }) {
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();
  const s = MATERIA_COLORS[prueba.materia] || { bg: "rgba(255,255,255,0.05)", text: C.text, border: C.border };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5, boxShadow: `0 16px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(16,99,239,0.18)` }}
      style={{
        backgroundColor: C.bgCard,
        border: `1px solid ${C.border}`,
        borderRadius: "16px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "border-color 0.2s",
      }}
      onClick={() => navigate(`/prueba/${prueba.id}`)}
    >
      {/* Color accent bar */}
      <div style={{ height: "3px", background: `linear-gradient(90deg, ${s.text}, transparent)` }} />

      <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: "14px", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
          <span style={{
            fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "999px",
            backgroundColor: s.bg, color: s.text, border: `1px solid ${s.border}`,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "160px",
          }}>
            {prueba.materia}
          </span>
          <motion.button
            whileHover={{ scale: 1.25 }}
            whileTap={{ scale: 0.8 }}
            onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
            style={{ fontSize: "17px", background: "none", border: "none", cursor: "pointer", color: saved ? "#f59e0b" : "rgba(255,255,255,0.18)", lineHeight: 1, padding: 0, flexShrink: 0 }}
          >
            {saved ? "★" : "☆"}
          </motion.button>
        </div>

        <div>
          <h3 style={{ fontSize: "14px", fontWeight: 700, color: C.white, marginBottom: "5px", lineHeight: 1.4 }}>{prueba.tema}</h3>
          <p style={{ fontSize: "12px", color: C.gray }}>Prof. {prueba.profesor}</p>
        </div>

        <div style={{ paddingTop: "12px", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "4px" }}>
            {[prueba.escuela, prueba.año].map((tag) => (
              <span key={tag} style={{ fontSize: "10px", color: C.gray, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "5px", padding: "2px 7px", fontWeight: 500 }}>
                {tag}
              </span>
            ))}
          </div>
          <span style={{ fontSize: "12px", color: C.blue, fontWeight: 700 }}>Ver →</span>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ icon, value, label }: { icon: string; value: string | number; label: string }) {
  return (
    <div style={{
      backgroundColor: C.bgCard,
      border: `1px solid ${C.border}`,
      borderRadius: "14px",
      padding: "18px 22px",
      display: "flex",
      alignItems: "center",
      gap: "14px",
    }}>
      <div style={{
        width: "40px", height: "40px", borderRadius: "10px",
        backgroundColor: "rgba(16,99,239,0.12)",
        border: "1px solid rgba(16,99,239,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "18px", flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: "20px", fontWeight: 900, color: C.white, lineHeight: 1, fontFamily: "'Syne', sans-serif" }}>{value}</p>
        <p style={{ fontSize: "11px", color: C.gray, marginTop: "3px", fontWeight: 500 }}>{label}</p>
      </div>
    </div>
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
  const [savedTab, setSavedTab] = useState(false);

  const materiasDelAño = MATERIAS_POR_COLEGIO[escuela]?.[añoTab] ?? [];
  const sinMaterias = materiasDelAño.length === 0;
  const MATERIAS_FILTRO = ["Todas", ...materiasDelAño];
  const materiaValida = MATERIAS_FILTRO.includes(materiaFiltro) ? materiaFiltro : "Todas";

  const q = search.toLowerCase();
  const filtered = MOCK_PRUEBAS.filter((p) =>
    (search === "" || p.tema.toLowerCase().includes(q) || p.materia.toLowerCase().includes(q) || p.profesor.toLowerCase().includes(q)) &&
    p.año === añoTab && p.escuela === escuela &&
    (materiaValida === "Todas" || p.materia === materiaValida)
  );

  const hasFilters = materiaValida !== "Todas" || search !== "";

  const recentPruebas = [...MOCK_PRUEBAS].reverse().slice(0, 4);
  const totalMaterias = new Set(MOCK_PRUEBAS.map(p => p.materia)).size;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 40,
        backgroundColor: "rgba(10,14,26,0.96)",
        backdropFilter: "blur(14px)",
        borderBottom: `1px solid ${C.border}`,
        padding: "0 48px",
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo size="sm" onClick={() => navigate("/")} />

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <motion.button
              whileHover={{ backgroundColor: "rgba(16,99,239,0.1)", borderColor: "rgba(16,99,239,0.35)" }}
              onClick={() => navigate("/ia")}
              style={{ fontSize: "13px", color: C.blue, fontWeight: 600, padding: "7px 14px", borderRadius: "8px", border: `1px solid rgba(16,99,239,0.2)`, backgroundColor: "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
            >
              <span style={{ fontSize: "11px" }}>✦</span> IA
            </motion.button>
            <motion.button
              whileHover={{ backgroundColor: C.blueHov }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/subir")}
              style={{ backgroundColor: C.blue, color: C.white, fontSize: "13px", fontWeight: 700, padding: "8px 18px", borderRadius: "8px", border: "none", cursor: "pointer" }}
            >
              + Subir prueba
            </motion.button>

            <div style={{ position: "relative" }}>
              <motion.button
                onClick={() => setShowUserMenu(!showUserMenu)}
                whileHover={{ opacity: 0.85 }}
                style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: C.blue, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", color: C.white, fontWeight: 700 }}
              >
                {user?.nombre?.charAt(0).toUpperCase() ?? "U"}
              </motion.button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    style={{ position: "absolute", top: "44px", right: 0, backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.4)", minWidth: "180px", overflow: "hidden", zIndex: 100 }}
                  >
                    <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
                      <p style={{ fontSize: "13px", fontWeight: 700, color: C.white }}>{user?.nombre}</p>
                      <p style={{ fontSize: "11px", color: C.gray }}>{user?.email}</p>
                    </div>
                    <div style={{ padding: "4px" }}>
                      {[{ label: "Mi perfil", path: "/perfil" }, { label: "Subir prueba", path: "/subir" }].map((item) => (
                        <motion.button
                          key={item.label}
                          whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                          onClick={() => { setShowUserMenu(false); navigate(item.path); }}
                          style={{ width: "100%", padding: "10px 14px", border: "none", backgroundColor: "transparent", cursor: "pointer", textAlign: "left", fontSize: "13px", color: C.text, fontWeight: 500, borderRadius: "8px", fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {item.label}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      {/* ── WELCOME STRIP ── */}
      <div style={{ borderBottom: `1px solid ${C.border}`, backgroundColor: C.bgSection, padding: "0 48px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "28px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px" }}>

            {/* Greeting */}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                style={{ fontSize: "22px", fontWeight: 900, color: C.white, fontFamily: "'Syne', sans-serif", marginBottom: "4px" }}
              >
                Bienvenido, {user?.nombre?.split(" ")[0] ?? "estudiante"} 👋
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                style={{ fontSize: "13px", color: C.gray }}
              >
                Encontrá las pruebas que necesitás y empezá a estudiar.
              </motion.p>
            </div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: "flex", gap: "12px" }}
            >
              <StatCard icon="📄" value={MOCK_PRUEBAS.length} label="Pruebas disponibles" />
              <StatCard icon="📚" value={totalMaterias} label="Materias" />
              <StatCard icon="🏫" value="3" label="Colegios" />
              <StatCard icon="✦" value="IA" label="Asistente activo" />
            </motion.div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "36px 48px" }}>

        {/* ── RECIENTES ── */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "3px", height: "18px", borderRadius: "2px", backgroundColor: C.blue }} />
              <h2 style={{ fontSize: "15px", fontWeight: 700, color: C.white, fontFamily: "'Syne', sans-serif" }}>Subidas recientemente</h2>
            </div>
            <motion.button
              whileHover={{ color: C.white }}
              style={{ fontSize: "12px", color: C.gray, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
            >
              Ver todas →
            </motion.button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
            {recentPruebas.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
                whileHover={{ y: -3, borderColor: "rgba(16,99,239,0.3)" }}
                onClick={() => navigate(`/prueba/${p.id}`)}
                style={{
                  backgroundColor: C.bgCard,
                  border: `1px solid ${C.border}`,
                  borderRadius: "12px",
                  padding: "14px 16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  transition: "border-color 0.2s",
                }}
              >
                <div style={{
                  width: "36px", height: "36px", borderRadius: "9px", flexShrink: 0,
                  backgroundColor: (MATERIA_COLORS[p.materia]?.bg ?? "rgba(255,255,255,0.05)"),
                  border: `1px solid ${MATERIA_COLORS[p.materia]?.border ?? C.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "3px", backgroundColor: MATERIA_COLORS[p.materia]?.text ?? C.gray }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: "12px", fontWeight: 700, color: C.white, marginBottom: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.tema}</p>
                  <p style={{ fontSize: "11px", color: C.gray }}>{p.materia} · {p.año}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── EXPLORER HEADER ── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px", gap: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "3px", height: "18px", borderRadius: "2px", backgroundColor: C.blue }} />
            <div>
              <h2 style={{ fontSize: "15px", fontWeight: 700, color: C.white, fontFamily: "'Syne', sans-serif" }}>Explorar pruebas</h2>
              <p style={{ fontSize: "12px", color: C.gray, marginTop: "2px" }}>{filtered.length} resultado{filtered.length !== 1 ? "s" : ""} · {escuela} · {añoTab}</p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "flex-end" }}>
            {ESCUELAS.map((col) => (
              <motion.button
                key={col}
                onClick={() => { setEscuela(col); setMateriaFiltro("Todas"); }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: "7px 14px", borderRadius: "9px",
                  border: `1.5px solid ${escuela === col ? C.blue : C.border}`,
                  backgroundColor: escuela === col ? C.blue : "transparent",
                  color: escuela === col ? C.white : C.text,
                  fontSize: "12px", fontWeight: 700, cursor: "pointer",
                  transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {col}
              </motion.button>
            ))}
          </div>
        </div>

        {/* ── CONTROLS ROW ── */}
        <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "20px", flexWrap: "wrap" }}>
          {/* Año tabs */}
          <div style={{ display: "flex", gap: "3px", backgroundColor: C.bgCard, padding: "3px", borderRadius: "10px", border: `1px solid ${C.border}` }}>
            {AÑOS_TABS.map((tab) => (
              <motion.button
                key={tab}
                onClick={() => { setAñoTab(tab); setMateriaFiltro("Todas"); }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: "6px 18px", borderRadius: "7px", border: "none", cursor: "pointer",
                  fontSize: "12px", fontWeight: tab === añoTab ? 700 : 500,
                  color: tab === añoTab ? C.white : C.gray,
                  backgroundColor: tab === añoTab ? C.blue : "transparent",
                  transition: "all 0.15s",
                }}
              >
                {tab}
              </motion.button>
            ))}
          </div>

          {/* Divider */}
          <div style={{ width: "1px", height: "28px", backgroundColor: C.border }} />

          {/* Search */}
          <div style={{ position: "relative", flex: 1, maxWidth: "360px" }}>
            <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "13px", color: C.gray, pointerEvents: "none" }}>🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por tema, profesor..."
              style={{ width: "100%", padding: "8px 14px 8px 36px", border: `1px solid ${C.border}`, borderRadius: "9px", fontSize: "12px", color: C.white, backgroundColor: C.bgCard, outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.15s" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = C.blue)}
              onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
            />
          </div>

          <AnimatePresence>
            {hasFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => { setMateriaFiltro("Todas"); setSearch(""); }}
                style={{ padding: "8px 14px", border: `1px solid ${C.border}`, borderRadius: "9px", fontSize: "12px", color: C.gray, backgroundColor: "transparent", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}
              >
                ✕ Limpiar
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* ── MATERIA CHIPS ── */}
        {sinMaterias ? (
          <div style={{ marginBottom: "24px", padding: "12px 16px", backgroundColor: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: "10px", fontSize: "13px", color: "#fbbf24" }}>
            Las materias de <strong>{escuela}</strong> todavía no están cargadas.
          </div>
        ) : (
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "24px" }}>
            {MATERIAS_FILTRO.map((m) => {
              const active = materiaValida === m;
              const colores = MATERIA_COLORS[m];
              return (
                <motion.button
                  key={m}
                  onClick={() => setMateriaFiltro(m)}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: "5px 12px", borderRadius: "999px",
                    border: active ? `1.5px solid ${colores?.text || C.blue}` : `1.5px solid ${C.border}`,
                    backgroundColor: active ? (colores?.bg || "rgba(16,99,239,0.2)") : "transparent",
                    color: active ? (colores?.text || C.blue) : C.gray,
                    fontSize: "12px", fontWeight: active ? 700 : 500,
                    cursor: "pointer", transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {m}
                </motion.button>
              );
            })}
          </div>
        )}

        {/* ── GRID ── */}
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div layout style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
              {filtered.map((p, i) => <PruebaCard key={p.id} prueba={p} index={i} />)}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: "12px" }}
            >
              <div style={{ fontSize: "40px", marginBottom: "4px" }}>🔍</div>
              <p style={{ fontSize: "16px", fontWeight: 700, color: C.white }}>No hay pruebas para {añoTab} en {escuela}</p>
              <p style={{ fontSize: "13px", color: C.gray }}>Todavía no se subieron pruebas de este año o materia</p>
              <motion.button
                whileHover={{ backgroundColor: C.blueHov }}
                onClick={() => { setMateriaFiltro("Todas"); setSearch(""); }}
                style={{ marginTop: "8px", backgroundColor: C.blue, color: C.white, fontWeight: 700, fontSize: "13px", padding: "10px 24px", borderRadius: "10px", border: "none", cursor: "pointer" }}
              >
                Limpiar filtros
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── IA BANNER ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => navigate("/ia")}
          style={{
            marginTop: "48px",
            background: "linear-gradient(135deg, rgba(16,99,239,0.18) 0%, rgba(16,99,239,0.06) 100%)",
            border: "1px solid rgba(16,99,239,0.25)",
            borderRadius: "16px",
            padding: "28px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
            cursor: "pointer",
            transition: "border-color 0.2s",
          }}
          whileHover={{ borderColor: "rgba(16,99,239,0.5)" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "14px",
              backgroundColor: "rgba(16,99,239,0.2)",
              border: "1px solid rgba(16,99,239,0.35)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "22px", flexShrink: 0,
            }}>
              ✦
            </div>
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: C.white, fontFamily: "'Syne', sans-serif", marginBottom: "4px" }}>
                ¿Necesitás ayuda con algún tema?
              </h3>
              <p style={{ fontSize: "13px", color: C.gray }}>El asistente de IA puede explicarte conceptos, resolver ejercicios y más.</p>
            </div>
          </div>
          <motion.div
            whileHover={{ x: 4 }}
            style={{ fontSize: "13px", fontWeight: 700, color: C.blue, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "6px" }}
          >
            Abrir IA <span>→</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
