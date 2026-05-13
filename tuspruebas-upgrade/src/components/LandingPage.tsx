import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BlurText from "../reactBits/Blurtext";

export default function LandingPage() {
  const navigate = useNavigate();

  const years = [
    { num: "7", label: "7° grado" },
    { num: "1", label: "1° Año" },
    { num: "2", label: "2° Año" },
    { num: "3", label: "3° Año" },
    { num: "4", label: "4° Año" },
    { num: "5", label: "5° Año" },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff", fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── NAVBAR ── */}
      <header style={{
        borderBottom: "1px solid #e5e7eb",
        backgroundColor: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "16px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            <span style={{ fontSize: "18px", fontWeight: 900, color: "#111", fontFamily: "'Syne', sans-serif" }}>
              tuspruebas
            </span>
          </div>

          {/* Nav links */}
          <nav style={{ display: "flex", alignItems: "center", gap: "48px" }}>
            {["Inicio", "Materias", "Subir pruebas"].map((item) => (
              <button key={item} style={{
                fontSize: "14px",
                color: "#374151",
                fontWeight: 500,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}>
                {item}
              </button>
            ))}
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate("/login")}
              style={{
                fontSize: "14px",
                color: "#374151",
                fontWeight: 500,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Iniciar sesión
            </motion.button>
          </nav>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{
        position: "relative",
        backgroundColor: "#fff",
        padding: "80px 40px",
        textAlign: "center",
        borderBottom: "1px solid #f3f4f6",
        overflow: "hidden",
      }}>
        {/* Ondas */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.2, pointerEvents: "none" }}>
          <svg style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "40%" }} viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="wL" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#999" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#999" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M-50,30 Q120,130 -30,230 Q-100,320 80,420" stroke="url(#wL)" strokeWidth="80" fill="none" />
            <path d="M-90,0 Q70,110 -60,220 Q-130,310 20,400" stroke="url(#wL)" strokeWidth="50" fill="none" opacity="0.5" />
          </svg>
          <svg style={{ position: "absolute", right: 0, top: 0, height: "100%", width: "40%" }} viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="wR" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#999" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#999" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M350,30 Q180,130 330,230 Q400,320 220,420" stroke="url(#wR)" strokeWidth="80" fill="none" />
            <path d="M390,0 Q230,110 360,220 Q430,310 280,400" stroke="url(#wR)" strokeWidth="50" fill="none" opacity="0.5" />
          </svg>
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: "800px", margin: "0 auto" }}>

          <BlurText
            text="Bienvenido a tusPruebas"
            delay={70}
            className="font-syne"
            style={{
              fontSize: "56px",
              fontWeight: 900,
              color: "#111",
              lineHeight: 1.1,
              justifyContent: "center",
              marginBottom: "16px",
              fontFamily: "'Syne', sans-serif",
            }}
          />

        </div>
      </section>

      {/* ── SELECTOR DE AÑO ── */}
      <section style={{
        backgroundColor: "#fff",
        padding: "72px 40px",
        borderBottom: "1px solid #f3f4f6",
      }}>
       
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <h2 style={{ fontSize: "28px", fontWeight: 900, color: "#111", fontFamily: "'Syne', sans-serif", marginBottom: "8px" }}>
                ¿De qué año sos?
              </h2>
              <p style={{ fontSize: "14px", color: "#9ca3af" }}>
                Elige tu año para ver las pruebas disponibles
              </p>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: "16px",
            }}>
              {years.map((year) => (
                <motion.button
                  key={year.num}
                  whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/home")}
                  style={{
                    border: "2px solid #d1d5db",
                    borderRadius: "16px",
                    backgroundColor: "#fff",
                    padding: "32px 16px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    cursor: "pointer",
                    transition: "border-color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#111")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
                >
                  <span style={{ fontSize: "40px", fontWeight: 900, color: "#111", fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>
                    {year.num}
                  </span>
                  <span style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 600 }}>
                    {year.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
      </section>

      {/* ── ABOUT ── */}
      <section style={{ backgroundColor: "#fff", padding: "80px 40px" }}>
    
          <div style={{ maxWidth: "680px", margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontSize: "36px", fontWeight: 900, color: "#111", fontFamily: "'Syne', sans-serif", marginBottom: "24px" }}>
              ¿Qué es tusPruebas?
            </h2>
            <p style={{ fontSize: "17px", color: "#6b7280", lineHeight: 1.7, marginBottom: "40px" }}>
              Somos una plataforma donde estudiantes comparten exámenes reales de todas las materias y años de la secundaria, para ayudarte a estudiar mejor y practicar
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/home")}
              style={{
                backgroundColor: "#111",
                color: "#fff",
                fontWeight: 700,
                fontSize: "16px",
                padding: "14px 48px",
                borderRadius: "12px",
                border: "none",
                borderBottom: "3px solid #4f46e5",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Explorar pruebas
            </motion.button>
          </div>

      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: "1px solid #e5e7eb",
        backgroundColor: "#fff",
        padding: "28px 40px",
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "center",
          gap: "56px",
        }}>
          {["Sobre nosotros", "Contactanos", "Preguntas frecuentes", "Términos y condiciones"].map((item) => (
            <button key={item} style={{
              fontSize: "13px",
              color: "#6b7280",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}>
              {item}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}