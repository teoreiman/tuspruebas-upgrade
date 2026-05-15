import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { loginWithEmail, loginWithGoogle, saveSession } from "../services/Auth";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  border: "1.5px solid #e5e7eb",
  borderRadius: "10px",
  fontSize: "14px",
  color: "#111",
  backgroundColor: "#f9fafb",
  outline: "none",
  transition: "border-color 0.2s, background-color 0.2s",
  boxSizing: "border-box",
  fontFamily: "'DM Sans', sans-serif",
};

function Spinner() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      style={{
        width: "16px", height: "16px",
        border: "2px solid rgba(255,255,255,0.3)",
        borderTopColor: "#fff",
        borderRadius: "50%",
      }}
    />
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token, user } = await loginWithEmail(email, password);
      saveSession(token, user);
      navigate("/home");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'DM Sans', sans-serif" }}>

      {/* Panel izquierdo */}
      <div style={{
        width: "45%",
        background: "linear-gradient(145deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "60px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.05)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
        <div style={{ position: "absolute", width: "650px", height: "650px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.03)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
        <div style={{ position: "absolute", width: "220px", height: "220px", borderRadius: "50%", backgroundColor: "rgba(79,70,229,0.12)", filter: "blur(70px)", top: "18%", left: "18%" }} />
        <div style={{ position: "absolute", width: "220px", height: "220px", borderRadius: "50%", backgroundColor: "rgba(59,130,246,0.1)", filter: "blur(70px)", bottom: "18%", right: "18%" }} />

        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.2" style={{ margin: "0 auto 24px", display: "block" }}>
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          <h1 style={{ fontSize: "30px", fontWeight: 900, color: "#fff", fontFamily: "'Syne', sans-serif", marginBottom: "12px" }}>tuspruebas</h1>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.45)", lineHeight: 1.65, maxWidth: "260px" }}>
            Accedé a miles de exámenes de los colegios judíos de Buenos Aires
          </p>

          <div style={{ display: "flex", gap: "36px", marginTop: "52px" }}>
            {[{ num: "500+", label: "Pruebas" }, { num: "5", label: "Colegios" }, { num: "2k+", label: "Alumnos" }].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <p style={{ fontSize: "22px", fontWeight: 900, color: "#fff", fontFamily: "'Syne', sans-serif" }}>{s.num}</p>
                <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "1px", marginTop: "2px" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel derecho */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "60px", backgroundColor: "#fff" }}>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }} style={{ width: "100%", maxWidth: "400px" }}>

          <div style={{ marginBottom: "36px" }}>
            <h2 style={{ fontSize: "26px", fontWeight: 900, color: "#111", fontFamily: "'Syne', sans-serif", marginBottom: "6px" }}>
              Bienvenido de vuelta
            </h2>
            <p style={{ fontSize: "14px", color: "#9ca3af" }}>Iniciá sesión para continuar</p>
          </div>

          {/* Google */}
          <motion.button
            whileHover={{ backgroundColor: "#f9fafb" }}
            whileTap={{ scale: 0.99 }}
            onClick={loginWithGoogle}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
              padding: "12px 20px", border: "1.5px solid #e5e7eb", borderRadius: "10px",
              backgroundColor: "#fff", cursor: "pointer", fontSize: "14px",
              fontWeight: 600, color: "#374151", marginBottom: "24px",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.1 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.3 1 7.2 2.7l5.7-5.7C33.5 7.2 29 5 24 5 12.4 5 3 14.4 3 26s9.4 21 21 21 21-9.4 21-21c0-1.3-.1-2.7-.4-3.9z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.9 18.9 13 24 13c2.8 0 5.3 1 7.2 2.7l5.7-5.7C33.5 7.2 29 5 24 5 16.3 5 9.7 9 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 47c4.9 0 9.3-1.8 12.7-4.8l-5.9-5c-1.7 1.3-3.9 2-6.8 2-5.2 0-9.6-3.5-11.2-8.3l-6.5 5C9.5 43.3 16.3 47 24 47z"/>
              <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.5l5.9 5c-.4.4 6.1-4.5 6.1-13.5 0-1.3-.1-2.7-.4-3.9z"/>
            </svg>
            Continuar con Google
          </motion.button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#f3f4f6" }} />
            <span style={{ fontSize: "12px", color: "#d1d5db", fontWeight: 500 }}>o con tu email</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#f3f4f6" }} />
          </div>

          {/* Error */}
          {error && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} style={{ padding: "11px 14px", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "9px", fontSize: "13px", color: "#dc2626", marginBottom: "18px" }}>
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "7px" }}>Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com" required disabled={loading} style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#111"; e.currentTarget.style.backgroundColor = "#fff"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.backgroundColor = "#f9fafb"; }}
              />
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "7px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>Contraseña</label>
                <button type="button" style={{ fontSize: "12px", color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}>
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" required disabled={loading} style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#111"; e.currentTarget.style.backgroundColor = "#fff"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.backgroundColor = "#f9fafb"; }}
              />
            </div>

            <motion.button
              whileHover={{ backgroundColor: loading ? "#9ca3af" : "#1f2937" }}
              type="submit" disabled={loading}
              style={{
                width: "100%", padding: "13px",
                backgroundColor: loading ? "#9ca3af" : "#111",
                color: "#fff", fontWeight: 700, fontSize: "14px",
                borderRadius: "10px", border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                marginTop: "4px", fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {loading ? <><Spinner /> Iniciando sesión...</> : "Iniciar sesión"}
            </motion.button>
          </form>

          <p style={{ textAlign: "center", fontSize: "13px", color: "#9ca3af", marginTop: "28px" }}>
            ¿No tenés cuenta?{" "}
            <motion.button whileHover={{ opacity: 0.7 }} onClick={() => navigate("/signup")}
              style={{ fontWeight: 700, color: "#111", background: "none", border: "none", cursor: "pointer", fontSize: "13px" }}>
              Registrate gratis
            </motion.button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}