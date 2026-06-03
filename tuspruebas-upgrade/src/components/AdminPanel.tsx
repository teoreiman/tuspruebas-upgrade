import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getUser } from "../services/Auth";
import {
  fetchAllPruebas,
  updatePruebaEstado,
  Prueba,
  PruebaEstado,
} from "../services/Pruebas";

// ── Badge estado ──────────────────────────────────────────────────────────────
function EstadoBadge({ estado }: { estado: string }) {
  const styles: Record<string, { bg: string; color: string; label: string }> = {
    pendiente: { bg: "#fffbeb", color: "#92400e", label: "Pendiente" },
    aprobada:  { bg: "#f0fdf4", color: "#15803d", label: "Aprobada"  },
    rechazada: { bg: "#fef2f2", color: "#dc2626", label: "Rechazada" },
  };
  const s = styles[estado] ?? styles.pendiente;
  return (
    <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "999px", backgroundColor: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

// ── Prueba Card ───────────────────────────────────────────────────────────────
function PruebaCard({
  prueba,
  onAprobar,
  onRechazar,
}: {
  prueba: Prueba;
  onAprobar: (id: number) => void;
  onRechazar: (id: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const fecha = new Date(prueba.created_at).toLocaleDateString("es-AR", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "14px", overflow: "hidden" }}
    >
      {/* Header */}
      <div onClick={() => setExpanded(!expanded)}
        style={{ padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1, minWidth: 0 }}>
          {/* Avatar */}
          <div style={{
            width: "38px", height: "38px", borderRadius: "50%",
            backgroundColor: "#111", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "14px", color: "#fff",
            fontWeight: 700, flexShrink: 0,
          }}>
            {prueba.usuario_nombre.charAt(0).toUpperCase()}
          </div>

          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#111" }}>
                {prueba.materia} · {prueba.año}
              </span>
              <EstadoBadge estado={prueba.estado} />
            </div>
            <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>
              {prueba.escuela} · Subido por <strong style={{ color: "#6b7280" }}>{prueba.usuario_nombre}</strong> · {fecha}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          {prueba.estado === "pendiente" && (
            <>
              <motion.button
                whileHover={{ backgroundColor: "#f0fdf4" }}
                whileTap={{ scale: 0.97 }}
                onClick={(e) => { e.stopPropagation(); onAprobar(prueba.id); }}
                style={{
                  padding: "7px 14px", borderRadius: "8px",
                  border: "1.5px solid #86efac", backgroundColor: "#fff",
                  color: "#15803d", fontWeight: 700, fontSize: "12px",
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Aprobar
              </motion.button>
              <motion.button
                whileHover={{ backgroundColor: "#fef2f2" }}
                whileTap={{ scale: 0.97 }}
                onClick={(e) => { e.stopPropagation(); onRechazar(prueba.id); }}
                style={{
                  padding: "7px 14px", borderRadius: "8px",
                  border: "1.5px solid #fecaca", backgroundColor: "#fff",
                  color: "#dc2626", fontWeight: 700, fontSize: "12px",
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Rechazar
              </motion.button>
            </>
          )}
          <motion.span animate={{ rotate: expanded ? 180 : 0 }} style={{ fontSize: "16px", color: "#9ca3af" }}>
            ↓
          </motion.span>
        </div>
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: "hidden", borderTop: "1px solid #f3f4f6" }}
          >
            <div style={{ padding: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              {/* Info */}
              <div>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>
                  Detalle
                </p>
                {[
                  { label: "Colegio",  val: prueba.escuela         },
                  { label: "Año",      val: prueba.año             },
                  { label: "Materia",  val: prueba.materia         },
                  { label: "Profesor", val: prueba.profesor || "—" },
                  { label: "Tema",     val: prueba.tema    || "—"  },
                  { label: "Notas",    val: prueba.notas   || "—"  },
                ].map((r) => (
                  <div key={r.label} style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                    <span style={{ fontSize: "12px", color: "#9ca3af", minWidth: "70px" }}>{r.label}</span>
                    <span style={{ fontSize: "12px", color: "#111", fontWeight: 500 }}>{r.val}</span>
                  </div>
                ))}
              </div>

              {/* Usuario y archivo */}
              <div>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>
                  Usuario
                </p>
                {[
                  { label: "Nombre", val: prueba.usuario_nombre        },
                  { label: "Email",  val: prueba.usuario_email || "—"  },
                  { label: "ID",     val: String(prueba.usuario_id)    },
                ].map((r) => (
                  <div key={r.label} style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                    <span style={{ fontSize: "12px", color: "#9ca3af", minWidth: "70px" }}>{r.label}</span>
                    <span style={{ fontSize: "12px", color: "#111", fontWeight: 500 }}>{r.val}</span>
                  </div>
                ))}

                {prueba.archivo_url && prueba.archivo_url !== "#" && (
                  <div style={{ marginTop: "16px" }}>
                    <p style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                      Archivo
                    </p>
                    <a
                      href={prueba.archivo_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-flex", alignItems: "center", gap: "6px",
                        padding: "8px 14px", borderRadius: "8px",
                        border: "1px solid #e5e7eb", backgroundColor: "#f9fafb",
                        fontSize: "12px", color: "#374151", fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                      {prueba.archivo_nombre || "Ver archivo"}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
type Filtro = PruebaEstado | "todas";

export default function AdminPanel() {
  const navigate = useNavigate();
  const [pruebas, setPruebas] = useState<Prueba[]>([]);
  const [filtro, setFiltro] = useState<Filtro>("pendiente");
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);

  const user = getUser();

  useEffect(() => {
    fetchAllPruebas(filtro).then(setPruebas).catch(console.error);
  }, [filtro]);

  const showToast = (msg: string, type: "ok" | "err") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAprobar = async (id: number) => {
    setLoadingId(id);
    try {
      await updatePruebaEstado(id, "aprobada");
      setPruebas((prev) => prev.map((p) => (p.id === id ? { ...p, estado: "aprobada" } : p)));
      showToast("Prueba aprobada ✓", "ok");
    } catch {
      showToast("Error al aprobar", "err");
    } finally {
      setLoadingId(null);
    }
  };

  const handleRechazar = async (id: number) => {
    setLoadingId(id);
    try {
      await updatePruebaEstado(id, "rechazada");
      setPruebas((prev) => prev.map((p) => (p.id === id ? { ...p, estado: "rechazada" } : p)));
      showToast("Prueba rechazada", "err");
    } catch {
      showToast("Error al rechazar", "err");
    } finally {
      setLoadingId(null);
    }
  };

  const shown = pruebas.filter((p) => filtro === "todas" || p.estado === filtro);
  const counts = {
    pendiente: pruebas.filter((p) => p.estado === "pendiente").length,
    aprobada:  pruebas.filter((p) => p.estado === "aprobada" ).length,
    rechazada: pruebas.filter((p) => p.estado === "rechazada").length,
    todas:     pruebas.length,
  };

  const tabs: { key: Filtro; label: string }[] = [
    { key: "pendiente", label: "Pendientes" },
    { key: "aprobada",  label: "Aprobadas"  },
    { key: "rechazada", label: "Rechazadas" },
    { key: "todas",     label: "Todas"      },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", fontFamily: "'DM Sans', sans-serif" }}>

      {/* Navbar */}
      <nav style={{ position: "sticky", top: 0, zIndex: 40, backgroundColor: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 48px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            <span style={{ fontSize: "16px", fontWeight: 900, color: "#111", fontFamily: "'Syne', sans-serif" }}>tuspruebas</span>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#fff", backgroundColor: "#111", padding: "2px 8px", borderRadius: "999px" }}>ADMIN</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            {user && <span style={{ fontSize: "13px", color: "#6b7280" }}>{user.nombre}</span>}
            <motion.button onClick={() => navigate("/home")} whileHover={{ color: "#111" }}
              style={{ fontSize: "13px", color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}>
              Ir a la plataforma →
            </motion.button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 24px" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: 900, color: "#111", fontFamily: "'Syne', sans-serif", marginBottom: "4px" }}>
            Panel de moderación
          </h1>
          <p style={{ fontSize: "14px", color: "#9ca3af" }}>
            Revisá y aprobá las pruebas enviadas por los estudiantes
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "28px" }}>
          {[
            { label: "Pendientes", count: counts.pendiente, color: "#92400e", bg: "#fffbeb", border: "#fde68a" },
            { label: "Aprobadas",  count: counts.aprobada,  color: "#15803d", bg: "#f0fdf4", border: "#86efac" },
            { label: "Rechazadas", count: counts.rechazada, color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
          ].map((s) => (
            <div key={s.label} style={{ padding: "16px 20px", backgroundColor: s.bg, border: `1px solid ${s.border}`, borderRadius: "12px" }}>
              <p style={{ fontSize: "28px", fontWeight: 900, color: s.color, fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>{s.count}</p>
              <p style={{ fontSize: "12px", color: s.color, marginTop: "4px", fontWeight: 600 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "20px", backgroundColor: "#f3f4f6", padding: "4px", borderRadius: "10px", width: "fit-content" }}>
          {tabs.map((tab) => (
            <motion.button
              key={tab.key}
              onClick={() => setFiltro(tab.key)}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: "7px 16px", borderRadius: "7px",
                border: "none", cursor: "pointer",
                fontSize: "13px", fontWeight: filtro === tab.key ? 700 : 500,
                color: filtro === tab.key ? "#111" : "#6b7280",
                backgroundColor: filtro === tab.key ? "#fff" : "transparent",
                boxShadow: filtro === tab.key ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {tab.label}{" "}
              <span style={{ fontSize: "11px", color: "#9ca3af", marginLeft: "4px" }}>
                ({counts[tab.key]})
              </span>
            </motion.button>
          ))}
        </div>

        {/* Lista */}
        <AnimatePresence mode="popLayout">
          {shown.length > 0 ? (
            <motion.div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {shown.map((p) => (
                <PruebaCard
                  key={p.id}
                  prueba={p}
                  onAprobar={loadingId === p.id ? () => {} : handleAprobar}
                  onRechazar={loadingId === p.id ? () => {} : handleRechazar}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ fontSize: "16px", fontWeight: 700, color: "#111", marginBottom: "6px" }}>
                No hay pruebas {filtro !== "todas" ? filtro + "s" : ""}
              </p>
              <p style={{ fontSize: "13px", color: "#9ca3af" }}>
                {filtro === "pendiente" ? "Todas las pruebas fueron revisadas" : "No hay nada acá todavía"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
              position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)",
              padding: "12px 24px", borderRadius: "10px",
              backgroundColor: toast.type === "ok" ? "#111" : "#dc2626",
              color: "#fff", fontSize: "14px", fontWeight: 600,
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              zIndex: 100,
            }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
