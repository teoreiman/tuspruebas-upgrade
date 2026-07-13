import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { fetchFavoritos, toggleFavorito, type Prueba } from "../services/Pruebas";
import Logo from "./logo";

const C = {
  bg:      "#0a0e1a",
  bgCard:  "#111827",
  border:  "rgba(255,255,255,0.07)",
  blue:    "#1063EF",
  blueHov: "#0050EF",
  white:   "#ffffff",
  text:    "#E8E8E8",
  gray:    "#8A8A8A",
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

function PruebaCard({
  prueba,
  onUnfavorite,
}: {
  prueba: Prueba;
  onUnfavorite: (id: number) => void;
}) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const s = MATERIA_COLORS[prueba.materia] || { bg: "rgba(255,255,255,0.05)", text: C.text, border: C.border };

  const handleUnfav = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    try {
      await toggleFavorito(prueba.id);
      onUnfavorite(prueba.id);
    } catch {
      setBusy(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.18 } }}
      whileHover={{ y: -3, borderColor: "rgba(16,99,239,0.25)" }}
      onClick={() => navigate(`/prueba/${prueba.id}`)}
      style={{
        backgroundColor: C.bgCard,
        border: `1px solid ${C.border}`,
        borderRadius: "14px",
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        transition: "border-color 0.2s",
      }}
    >
      {/* Barra de color lateral */}
      <div style={{
        position: "absolute", left: 0, top: "16px", bottom: "16px",
        width: "3px", borderRadius: "0 3px 3px 0",
        backgroundColor: s.text, opacity: 0.55,
      }} />

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", paddingLeft: "8px" }}>
        <span style={{
          fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "999px",
          backgroundColor: s.bg, color: s.text, border: `1px solid ${s.border}`,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "160px",
        }}>
          {prueba.materia}
        </span>
        <motion.button
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.85 }}
          onClick={handleUnfav}
          title="Quitar de favoritos"
          style={{
            fontSize: "18px", background: "none", border: "none", cursor: "pointer",
            color: "#f59e0b", lineHeight: 1, padding: 0, flexShrink: 0,
            opacity: busy ? 0.5 : 1,
          }}
        >
          ★
        </motion.button>
      </div>

      {/* Preview imagen */}
      {prueba.archivo_url && prueba.archivo_tipo === "image" && (
        <div style={{ paddingLeft: "8px" }}>
          <img
            src={prueba.archivo_url}
            alt="Vista previa"
            style={{
              width: "100%", height: "110px", objectFit: "cover",
              borderRadius: "8px", border: `1px solid ${C.border}`, display: "block",
            }}
          />
        </div>
      )}
      {/* Imagen guardada como base64: URL no está en el listado, mostrar indicador */}
      {!prueba.archivo_url && prueba.archivo_tipo === "image" && (
        <div style={{
          paddingLeft: "8px", display: "flex", alignItems: "center", gap: "8px",
          padding: "8px 12px", borderRadius: "8px",
          backgroundColor: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`,
          marginLeft: "8px",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.gray} strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <span style={{ fontSize: "11px", color: C.gray }}>Foto adjunta — ver detalle</span>
        </div>
      )}
      {prueba.archivo_url && prueba.archivo_tipo === "pdf" && (
        <div style={{
          paddingLeft: "8px", display: "flex", alignItems: "center", gap: "8px",
          padding: "8px 12px", borderRadius: "8px",
          backgroundColor: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`,
          marginLeft: "8px",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.gray} strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <span style={{ fontSize: "11px", color: C.gray, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {prueba.archivo_nombre || "Archivo PDF"}
          </span>
        </div>
      )}

      <div style={{ paddingLeft: "8px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: 700, color: C.white, marginBottom: "4px", lineHeight: 1.35 }}>
          {prueba.tema || "Sin título"}
        </h3>
        <p style={{ fontSize: "12px", color: C.gray }}>Prof. {prueba.profesor || "—"}</p>
      </div>

      <div style={{
        paddingTop: "10px", borderTop: `1px solid ${C.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between", paddingLeft: "8px",
      }}>
        <div style={{ display: "flex", gap: "4px" }}>
          {[prueba.escuela, prueba.año].map((tag) => (
            <span key={tag} style={{
              fontSize: "10px", color: C.gray,
              backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "5px",
              padding: "2px 7px", fontWeight: 500,
            }}>
              {tag}
            </span>
          ))}
        </div>
        <motion.button
          whileHover={{ x: 2 }}
          onClick={(e) => { e.stopPropagation(); navigate(`/prueba/${prueba.id}`); }}
          style={{ fontSize: "12px", color: C.blue, fontWeight: 700, background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          Ver →
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function Favoritas() {
  const navigate = useNavigate();
  const [pruebas, setPruebas]   = useState<Prueba[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search,  setSearch]    = useState("");

  useEffect(() => {
    fetchFavoritos()
      .then(setPruebas)
      .catch(() => setPruebas([]))
      .finally(() => setLoading(false));
  }, []);

  const handleUnfavorite = (id: number) => {
    setPruebas((prev) => prev.filter((p) => p.id !== id));
  };

  const q        = search.toLowerCase();
  const filtered = search
    ? pruebas.filter((p) =>
        p.tema.toLowerCase().includes(q) ||
        p.materia.toLowerCase().includes(q) ||
        p.profesor.toLowerCase().includes(q)
      )
    : pruebas;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, fontFamily: "'DM Sans', sans-serif" }}>

      {/* Navbar */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 40,
        backgroundColor: "rgba(10,14,26,0.95)", backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.border}`, padding: "0 48px",
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo size="sm" onClick={() => navigate("/home")} />
          <motion.button
            onClick={() => navigate("/perfil")}
            whileHover={{ color: C.white }}
            style={{ fontSize: "13px", color: C.gray, background: "none", border: "none", cursor: "pointer" }}
          >
            ← Volver
          </motion.button>
        </div>
      </nav>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 48px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "32px" }}>
          <div>
            <h1 style={{
              fontSize: "28px", fontWeight: 900, color: C.white,
              fontFamily: "'Syne', sans-serif", marginBottom: "4px",
            }}>
              Pruebas guardadas
            </h1>
            <p style={{ fontSize: "13px", color: C.gray }}>
              {loading ? "Cargando..." : `${pruebas.length} prueba${pruebas.length !== 1 ? "s" : ""} guardada${pruebas.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <motion.button
            whileHover={{ backgroundColor: "rgba(16,99,239,0.1)", borderColor: "rgba(16,99,239,0.3)" }}
            onClick={() => navigate("/home")}
            style={{
              fontSize: "13px", color: C.blue, fontWeight: 600,
              padding: "8px 18px", borderRadius: "8px",
              border: `1px solid rgba(16,99,239,0.2)`, backgroundColor: "transparent",
              cursor: "pointer",
            }}
          >
            Explorar más →
          </motion.button>
        </div>

        {/* Buscador */}
        <AnimatePresence>
          {!loading && pruebas.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginBottom: "28px", maxWidth: "480px" }}
            >
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "14px", color: C.gray }}>
                  🔍
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por tema, materia, profesor..."
                  style={{
                    width: "100%", padding: "10px 16px 10px 42px",
                    border: `1px solid ${C.border}`, borderRadius: "10px",
                    fontSize: "13px", color: C.white, backgroundColor: C.bgCard,
                    outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif",
                  }}
                  onFocus={(e)  => (e.currentTarget.style.borderColor = C.blue)}
                  onBlur={(e)   => (e.currentTarget.style.borderColor = C.border)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contenido */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{ width: "28px", height: "28px", border: `3px solid ${C.border}`, borderTopColor: C.blue, borderRadius: "50%" }}
            />
          </div>
        ) : filtered.length > 0 ? (
          <AnimatePresence mode="popLayout">
            <motion.div layout style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
              {filtered.map((p) => (
                <PruebaCard key={p.id} prueba={p} onUnfavorite={handleUnfavorite} />
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: "12px" }}
          >
            <div style={{ fontSize: "52px", marginBottom: "8px", opacity: 0.4 }}>☆</div>
            <p style={{ fontSize: "17px", fontWeight: 700, color: C.white }}>
              {search ? "No hay resultados" : "No guardaste ninguna prueba todavía"}
            </p>
            <p style={{ fontSize: "13px", color: C.gray }}>
              {search
                ? "Probá con otro término de búsqueda"
                : "Tocá la estrella ★ en cualquier prueba para guardarla acá"}
            </p>
            {!search && (
              <motion.button
                whileHover={{ backgroundColor: C.blueHov }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/home")}
                style={{
                  marginTop: "8px", backgroundColor: C.blue, color: C.white,
                  fontWeight: 700, fontSize: "13px", padding: "10px 24px",
                  borderRadius: "10px", border: "none", cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Explorar pruebas
              </motion.button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
