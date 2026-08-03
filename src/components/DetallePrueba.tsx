import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchPrueba, toggleFavorito, deletePrueba, type Prueba } from "../services/Pruebas";
import { getUser, isAdmin, isSuperAdmin } from "../services/Auth";
import Logo from "./logo";

const C = {
  bg: "#070b14", bgCard: "#0d1526", bgSection: "#080d18",
  border: "rgba(255,255,255,0.07)", blue: "#1063EF", blueHov: "#0050EF",
  white: "#ffffff", gray: "#8A8A9A", text: "#c8cdd8",
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
  "Filosofía":                   { bg: "rgba(139,92,246,0.15)", text: "#a78bfa", border: "rgba(167,139,250,0.3)" },
  "Marketing":                   { bg: "rgba(244,63,94,0.15)",  text: "#fb7185", border: "rgba(251,113,133,0.3)" },
};

// ── PDF Viewer ────────────────────────────────────────────────────────────────
function FileViewer({ url, nombre, tipo }: { url: string; nombre: string; tipo?: string }) {
  const [imgError, setImgError] = useState(false);
  const isPdf = tipo === "pdf" || nombre?.toLowerCase().endsWith(".pdf");
  const isImage = tipo === "image" || ["jpg","jpeg","png","gif","webp","heic","avif","bmp","tiff"].some((ext) => nombre?.toLowerCase().endsWith(ext));

  if (isPdf) {
    return (
      <div style={{ width: "100%", borderRadius: "12px", overflow: "hidden", border: `1px solid ${C.border}` }}>
        <iframe
          src={url}
          title={nombre}
          style={{ width: "100%", height: "600px", border: "none", backgroundColor: "#0a0e1a" }}
        />
      </div>
    );
  }

  if (isImage && !imgError) {
    return (
      <div style={{ width: "100%", borderRadius: "12px", overflow: "hidden", border: `1px solid ${C.border}`, backgroundColor: C.bgCard, display: "flex", justifyContent: "center", padding: "24px" }}>
        <img
          src={url}
          alt={nombre}
          onError={() => setImgError(true)}
          style={{ maxWidth: "100%", maxHeight: "600px", objectFit: "contain", borderRadius: "8px" }}
        />
      </div>
    );
  }

  if (isImage && imgError) {
    return (
      <div style={{ width: "100%", borderRadius: "12px", border: `1px solid ${C.border}`, backgroundColor: C.bgCard, padding: "48px 24px", textAlign: "center" }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={C.gray} strokeWidth="1.5" style={{ margin: "0 auto 16px", display: "block" }}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
        <p style={{ fontSize: "14px", color: C.gray, marginBottom: "4px" }}>
          No se pudo cargar la foto de esta prueba.
        </p>
        <p style={{ fontSize: "13px", color: C.gray }}>
          Puede haberse subido antes de que se habilitara la carga de fotos sin configuración externa. Probá volver a subir la prueba con la foto.
        </p>
      </div>
    );
  }

  // Fallback para DOC u otros
  return (
    <div style={{ width: "100%", borderRadius: "12px", border: `1px solid ${C.border}`, backgroundColor: C.bgCard, padding: "48px 24px", textAlign: "center" }}>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={C.gray} strokeWidth="1.5" style={{ margin: "0 auto 16px", display: "block" }}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
      <p style={{ fontSize: "14px", color: C.gray, marginBottom: "20px" }}>
        Este archivo no se puede previsualizar directamente.
      </p>
      <motion.a
        href={url}
        target="_blank"
        rel="noreferrer"
        whileHover={{ backgroundColor: C.blueHov }}
        style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          backgroundColor: C.blue, color: C.white,
          fontWeight: 700, fontSize: "14px",
          padding: "11px 24px", borderRadius: "10px",
          textDecoration: "none", transition: "background-color 0.2s",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        Descargar archivo
      </motion.a>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function DetallePrueba() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [prueba, setPrueba] = useState<Prueba | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [savingFav, setSavingFav] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const user = getUser();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");
    setPrueba(null);
    fetchPrueba(Number(id))
      .then((p) => {
        setPrueba(p);
        setSaved(p.favorito ?? false);
      })
      .catch(() => setError("No se encontró esta prueba"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleFavorito = async () => {
    if (!prueba || savingFav) return;
    setSavingFav(true);
    const prev = saved;
    setSaved(!prev);
    try {
      const actual = await toggleFavorito(prueba.id);
      setSaved(actual);
    } catch {
      setSaved(prev);
    } finally {
      setSavingFav(false);
    }
  };

  const handleEliminar = async () => {
    if (!prueba || deleting) return;
    if (!window.confirm("¿Seguro que querés eliminar esta prueba? Esta acción no se puede deshacer.")) return;
    setDeleting(true);
    try {
      await deletePrueba(prueba.id);
      navigate("/mis-pruebas");
    } catch {
      setDeleting(false);
    }
  };

  const puedeEliminar = !!prueba && !!user && (user.id === prueba.usuario_id || isAdmin() || isSuperAdmin());

  const s = prueba ? (MATERIA_COLORS[prueba.materia] || { bg: "rgba(255,255,255,0.05)", text: C.text, border: C.border }) : null;
  const fecha = prueba ? new Date(prueba.created_at).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" }) : "";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, fontFamily: "'DM Sans', sans-serif" }}>

      {/* Navbar */}
      <nav style={{ position: "sticky", top: 0, zIndex: 40, backgroundColor: "rgba(7,11,20,0.92)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.border}`, padding: "0 48px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo size="sm" onClick={() => navigate("/home")} />
          <motion.button onClick={() => navigate(-1)} whileHover={{ color: C.white }}
            style={{ fontSize: "13px", color: C.gray, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M5 12l7 7M5 12l7-7"/>
            </svg>
            Volver
          </motion.button>
        </div>
      </nav>

      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{ width: "32px", height: "32px", border: `3px solid ${C.border}`, borderTopColor: C.blue, borderRadius: "50%" }} />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: "16px" }}>
          <p style={{ fontSize: "18px", fontWeight: 700, color: C.white }}>{error}</p>
          <motion.button whileHover={{ backgroundColor: C.blueHov }} onClick={() => navigate("/home")}
            style={{ backgroundColor: C.blue, color: C.white, fontWeight: 700, fontSize: "14px", padding: "11px 24px", borderRadius: "10px", border: "none", cursor: "pointer" }}>
            Volver al inicio
          </motion.button>
        </div>
      )}

      {/* Content */}
      {prueba && !loading && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 48px" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "24px", marginBottom: "32px" }}>
            <div style={{ flex: 1 }}>
              {/* Materia badge */}
              <div style={{ marginBottom: "14px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, padding: "4px 12px", borderRadius: "999px", backgroundColor: s!.bg, color: s!.text, border: `1px solid ${s!.border}` }}>
                  {prueba.materia}
                </span>
                {prueba.estado !== "aprobada" && (
                  <span style={{
                    fontSize: "12px", fontWeight: 700, padding: "4px 12px", borderRadius: "999px",
                    backgroundColor: prueba.estado === "rechazada" ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)",
                    color: prueba.estado === "rechazada" ? "#f87171" : "#fbbf24",
                    border: `1px solid ${prueba.estado === "rechazada" ? "rgba(248,113,113,0.3)" : "rgba(251,191,36,0.3)"}`,
                  }}>
                    {prueba.estado === "rechazada" ? "Rechazada" : "Pendiente de aprobación"}
                  </span>
                )}
              </div>

              {/* Título */}
              <h1 style={{ fontSize: "32px", fontWeight: 900, color: C.white, fontFamily: "'Syne', sans-serif", marginBottom: "10px", lineHeight: 1.2 }}>
                {prueba.tema}
              </h1>

              {/* Meta */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
                {[
                  { icon: "🏫", text: prueba.escuela },
                  { icon: "📚", text: prueba.año },
                  { icon: "👤", text: `Prof. ${prueba.profesor}` },
                  { icon: "📅", text: fecha },
                ].map((m) => (
                  <div key={m.text} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "13px", color: C.gray }}>
                    <span>{m.icon}</span>
                    <span>{m.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Acciones */}
            <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
              {/* Favorito */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFavorito}
                disabled={savingFav}
                style={{
                  display: "flex", alignItems: "center", gap: "7px",
                  padding: "10px 18px", borderRadius: "10px",
                  border: `1.5px solid ${saved ? "rgba(245,158,11,0.4)" : C.border}`,
                  backgroundColor: saved ? "rgba(245,158,11,0.1)" : "transparent",
                  color: saved ? "#f59e0b" : C.gray,
                  fontWeight: 600, fontSize: "13px",
                  cursor: "pointer", transition: "all 0.2s",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <span style={{ fontSize: "16px" }}>{saved ? "★" : "☆"}</span>
                {saved ? "Guardado" : "Guardar"}
              </motion.button>

              {/* Descargar */}
              {prueba.archivo_url && (
                <motion.a
                  href={prueba.archivo_url}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ backgroundColor: C.blueHov }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "7px",
                    padding: "10px 18px", borderRadius: "10px",
                    backgroundColor: C.blue, color: C.white,
                    fontWeight: 700, fontSize: "13px",
                    textDecoration: "none", transition: "background-color 0.2s",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  Descargar
                </motion.a>
              )}

              {/* Eliminar */}
              {puedeEliminar && (
                <motion.button
                  whileHover={{ scale: 1.05, borderColor: "rgba(239,68,68,0.4)", color: "#f87171" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEliminar}
                  disabled={deleting}
                  title="Eliminar prueba"
                  style={{
                    display: "flex", alignItems: "center", gap: "7px",
                    padding: "10px 14px", borderRadius: "10px",
                    border: `1.5px solid ${C.border}`,
                    backgroundColor: "transparent",
                    color: C.gray,
                    fontWeight: 600, fontSize: "13px",
                    cursor: deleting ? "default" : "pointer", transition: "all 0.2s",
                    fontFamily: "'DM Sans', sans-serif",
                    opacity: deleting ? 0.5 : 1,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    <line x1="10" y1="11" x2="10" y2="17"/>
                    <line x1="14" y1="11" x2="14" y2="17"/>
                  </svg>
                  Eliminar
                </motion.button>
              )}
            </div>
          </div>

          <div style={{ height: "1px", backgroundColor: C.border, marginBottom: "32px" }} />

          {prueba.notas && (
            <div style={{ backgroundColor: C.bgCard, borderRadius: "12px", padding: "16px 20px", marginBottom: "28px", border: `1px solid ${C.border}` }}>
              <p style={{ fontSize: "11px", fontWeight: 700, color: C.gray, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                Notas del que subió
              </p>
              <p style={{ fontSize: "14px", color: C.text, lineHeight: 1.7 }}>{prueba.notas}</p>
            </div>
          )}

          {/* Subido por */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: C.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", color: C.white, fontWeight: 700, flexShrink: 0 }}>
              {prueba.usuario_nombre.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ fontSize: "12px", color: C.gray }}>Subida por</p>
              <p style={{ fontSize: "13px", fontWeight: 600, color: C.white }}>{prueba.usuario_nombre}</p>
            </div>
          </div>
          {prueba.preguntas && (
            <div style={{ backgroundColor: C.bgCard, borderRadius: "12px", padding: "20px 24px", marginBottom: "28px", border: `1px solid ${C.border}` }}>
              <p style={{ fontSize: "13px", fontWeight: 600, color: C.text, marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2">
                  <path d="M4 7V4h16v3"/>
                  <path d="M9 20h6"/>
                  <path d="M12 4v16"/>
                </svg>
                Preguntas de la prueba
              </p>
              <p style={{ fontSize: "14px", color: C.text, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{prueba.preguntas}</p>
            </div>
          )}

          {prueba.archivo_url ? (
            <div>
              <p style={{ fontSize: "13px", fontWeight: 600, color: C.text, marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                {prueba.archivo_nombre}
              </p>
              <FileViewer url={prueba.archivo_url} nombre={prueba.archivo_nombre || ""} tipo={prueba.archivo_tipo} />
            </div>
          ) : prueba.archivo_tipo ? (
            <div style={{ backgroundColor: C.bgCard, borderRadius: "12px", padding: "40px 24px", textAlign: "center", border: `1px solid ${C.border}` }}>
              <p style={{ fontSize: "14px", color: C.gray, marginBottom: "4px" }}>El archivo de esta prueba no está disponible.</p>
              <p style={{ fontSize: "13px", color: C.gray }}>Puede haberse subido antes de que se habilitara la carga de archivos sin configuración externa.</p>
            </div>
          ) : !prueba.preguntas ? (
            <div style={{ backgroundColor: C.bgCard, borderRadius: "12px", padding: "40px 24px", textAlign: "center", border: `1px solid ${C.border}` }}>
              <p style={{ fontSize: "14px", color: C.gray }}>Esta prueba no tiene archivo adjunto.</p>
            </div>
          ) : null}

          <div style={{ marginTop: "28px", backgroundColor: "rgba(16,99,239,0.06)", borderRadius: "12px", padding: "20px 24px", border: "1px solid rgba(16,99,239,0.2)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 700, color: C.white, marginBottom: "4px" }}>
                ✦ Resolver con IA
              </p>
              <p style={{ fontSize: "13px", color: C.gray }}>
                Usá la IA de tusPruebas para resolver ejercicios o explicarte los temas de esta prueba.
              </p>
            </div>
            <motion.button
              whileHover={{ backgroundColor: C.blueHov }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/ia?prueba=${prueba.id}&materia=${prueba.materia}&año=${prueba.año}`)}
              style={{ backgroundColor: C.blue, color: C.white, fontWeight: 700, fontSize: "13px", padding: "10px 20px", borderRadius: "9px", border: "none", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'DM Sans', sans-serif" }}
            >
              Abrir IA →
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}