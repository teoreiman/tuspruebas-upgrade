import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getUser, clearSession } from "../services/Auth";
import Logo from "./logo";

const C = {
  bg: "#0a0e1a", bgCard: "#111827", border: "rgba(255,255,255,0.07)",
  blue: "#1063EF", blueHov: "#0050EF", white: "#ffffff", text: "#E8E8E8", gray: "#8A8A8A",
};

export default function Perfil() {
  const navigate = useNavigate();
  const user = getUser();

  if (!user) { navigate("/login"); return null; }

  const handleLogout = () => { clearSession(); navigate("/"); };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, fontFamily: "'DM Sans', sans-serif" }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 40, backgroundColor: "rgba(10,14,26,0.95)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}`, padding: "0 48px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo size="sm" onClick={() => navigate("/home")} />
          <motion.button onClick={() => navigate("/home")} whileHover={{ color: C.white }}
            style={{ fontSize: "13px", color: C.gray, background: "none", border: "none", cursor: "pointer" }}>
            ← Volver
          </motion.button>
        </div>
      </nav>

      <div style={{ maxWidth: "520px", margin: "0 auto", padding: "52px 24px" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Avatar */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: C.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", color: C.white, fontWeight: 900, margin: "0 auto 16px", fontFamily: "'Syne', sans-serif" }}>
              {user.nombre.charAt(0).toUpperCase()}
            </div>
            <h1 style={{ fontSize: "22px", fontWeight: 900, color: C.white, fontFamily: "'Syne', sans-serif", marginBottom: "4px" }}>{user.nombre}</h1>
            <p style={{ fontSize: "14px", color: C.gray }}>{user.email}</p>
          </div>

          {/* Info */}
          <div style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "16px", overflow: "hidden", marginBottom: "12px" }}>
            <div style={{ padding: "20px 24px" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, color: C.gray, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>Mi cuenta</p>
              {[{ label: "Nombre", val: user.nombre }, { label: "Email", val: user.email }, { label: "ID", val: `#${user.id}` }].map((row) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: "13px", color: C.gray }}>{row.label}</span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: C.white }}>{row.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Acciones */}
          <div style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "16px", overflow: "hidden", marginBottom: "12px" }}>
            <div style={{ padding: "4px" }}>
              {[
                { label: "Mis pruebas subidas", icon: "↑", path: "/mis-pruebas" },
                { label: "Pruebas favoritas",   icon: "★", path: "/favoritas"   },
                { label: "Subir prueba",         icon: "+", path: "/subir"       },
              ].map((item) => (
                <motion.button key={item.label} onClick={() => navigate(item.path)} whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", border: "none", backgroundColor: "transparent", cursor: "pointer", borderRadius: "12px", fontFamily: "'DM Sans', sans-serif" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "16px", color: C.blue }}>{item.icon}</span>
                    <span style={{ fontSize: "14px", fontWeight: 500, color: C.text }}>{item.label}</span>
                  </div>
                  <span style={{ fontSize: "14px", color: C.gray }}>→</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Cerrar sesión */}
          <div style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "16px", overflow: "hidden" }}>
            <div style={{ padding: "4px" }}>
              <motion.button onClick={handleLogout} whileHover={{ backgroundColor: "rgba(239,68,68,0.08)" }} whileTap={{ scale: 0.99 }}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", border: "none", backgroundColor: "transparent", cursor: "pointer", borderRadius: "12px", fontFamily: "'DM Sans', sans-serif" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#ef4444" }}>Cerrar sesión</span>
                </div>
                <span style={{ fontSize: "14px", color: "#ef4444" }}>→</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}