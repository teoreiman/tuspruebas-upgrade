import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SplitText from "../reactBits/Splittext";
import GradientText from "../reactBits/Gradienttext";
import FadeContent from "../reactBits/Fadecontent";
import ScrollFloat from "../reactBits/Scrollfloat";

export default function LandingPage() {
  const navigate = useNavigate();
  const [hoveredYear, setHoveredYear] = useState<string | null>(null);

  const years = [
    { num: "7", label: "7° grado" },
    { num: "1", label: "1° Año" },
    { num: "2", label: "2° Año" },
    { num: "3", label: "3° Año" },
    { num: "4", label: "4° Año" },
    { num: "5", label: "5° Año" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#fff",
      fontFamily: "'DM Sans', sans-serif",
      overflowX: "hidden",
    }}>

      {/* ── NAVBAR ── */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          borderBottom: "1px solid #f3f4f6",
          backgroundColor: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(8px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "15px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            <span style={{ fontSize: "16px", fontWeight: 900, color: "#111", fontFamily: "'Syne', sans-serif" }}>
              tuspruebas
            </span>
          </div>

          <nav style={{ display: "flex", alignItems: "center", gap: "36px" }}>
            {[
              { label: "Materias", action: () => document.getElementById("años")?.scrollIntoView({ behavior: "smooth" }) },
              { label: "Subir pruebas", action: () => navigate("/subir") },
            ].map((item) => (
              <motion.button
                key={item.label}
                onClick={item.action}
                whileHover={{ color: "#111" }}
                style={{ fontSize: "14px", color: "#9ca3af", fontWeight: 500, background: "none", border: "none", cursor: "pointer", transition: "color 0.15s" }}
              >
                {item.label}
              </motion.button>
            ))}
            <motion.button
              whileHover={{ backgroundColor: "#1f2937" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/login")}
              style={{
                fontSize: "13px", fontWeight: 700,
                color: "#fff", backgroundColor: "#111",
                padding: "9px 22px", borderRadius: "9px",
                border: "none", cursor: "pointer",
              }}
            >
              Iniciar sesión
            </motion.button>
          </nav>
        </div>
      </motion.header>

      {/* ── HERO ── */}
      <section style={{
        position: "relative",
        backgroundColor: "#fff",
        padding: "120px 40px 100px",
        textAlign: "center",
        borderBottom: "1px solid #f3f4f6",
        overflow: "hidden",
      }}>
        {/* Ondas laterales */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.15 }}>
          <svg style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "36%" }} viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="wL" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#888" stopOpacity="1" />
                <stop offset="100%" stopColor="#888" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M-50,30 Q120,130 -30,230 Q-100,320 80,420" stroke="url(#wL)" strokeWidth="90" fill="none" />
            <path d="M-90,0 Q70,110 -60,220 Q-130,310 20,400" stroke="url(#wL)" strokeWidth="55" fill="none" opacity="0.5" />
            <path d="M-20,80 Q90,180 -15,280" stroke="url(#wL)" strokeWidth="32" fill="none" opacity="0.25" />
          </svg>
          <svg style={{ position: "absolute", right: 0, top: 0, height: "100%", width: "36%" }} viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="wR" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#888" stopOpacity="1" />
                <stop offset="100%" stopColor="#888" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M350,30 Q180,130 330,230 Q400,320 220,420" stroke="url(#wR)" strokeWidth="90" fill="none" />
            <path d="M390,0 Q230,110 360,220 Q430,310 280,400" stroke="url(#wR)" strokeWidth="55" fill="none" opacity="0.5" />
            <path d="M320,80 Q210,180 315,280" stroke="url(#wR)" strokeWidth="32" fill="none" opacity="0.25" />
          </svg>
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: "780px", margin: "0 auto" }}>
          {/* Ícono libro */}
          <FadeContent delay={0.1}>
            <svg
              width="48" height="48" viewBox="0 0 24 24"
              fill="none" stroke="#111" strokeWidth="1.2"
              style={{ margin: "0 auto 32px", display: "block" }}
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </FadeContent>

          {/* SplitText — título letra por letra con spring */}
          <SplitText
            text="Bienvenido a tusPruebas"
            splitBy="chars"
            delay={22}
            duration={0.55}
            ease={[0.22, 1, 0.36, 1]}
            style={{
              fontSize: "clamp(38px, 4.8vw, 58px)",
              fontWeight: 900,
              color: "#111",
              fontFamily: "'Syne', sans-serif",
              lineHeight: 1.08,
              justifyContent: "center",
              marginBottom: "0",
            }}
          />

          {/* GradientText — subtítulo con gradiente animado */}
          <div style={{ marginTop: "20px", marginBottom: "40px" }}>
            <GradientText
              colors={["#9ca3af", "#6b7280", "#374151", "#6b7280", "#9ca3af"]}
              animationSpeed={6}
              style={{ fontSize: "17px", fontWeight: 500 }}
            >
              encontrá todas las pruebas que necesités
            </GradientText>
          </div>

          {/* CTAs */}
          <FadeContent delay={1.2}>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <motion.button
                whileHover={{ scale: 1.03, backgroundColor: "#1f2937" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/login")}
                style={{
                  backgroundColor: "#111", color: "#fff",
                  fontWeight: 700, fontSize: "14px",
                  padding: "12px 32px", borderRadius: "10px",
                  border: "none", borderBottom: "3px solid #4f46e5",
                  cursor: "pointer",
                  display: "inline-flex", alignItems: "center", gap: "8px",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                Explorar pruebas
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, borderColor: "#9ca3af" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/signup")}
                style={{
                  backgroundColor: "#fff", color: "#374151",
                  fontWeight: 600, fontSize: "14px",
                  padding: "12px 32px", borderRadius: "10px",
                  border: "1.5px solid #e5e7eb", cursor: "pointer",
                }}
              >
                Crear cuenta
              </motion.button>
            </div>
          </FadeContent>
        </div>
      </section>

      {/* ── SELECTOR DE AÑO ── */}
      <section id="años" style={{ backgroundColor: "#fff", padding: "80px 40px", borderBottom: "1px solid #f3f4f6" }}>
        {/* ScrollFloat en el header de la sección */}
        <ScrollFloat offset={30} style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ fontSize: "26px", fontWeight: 900, color: "#111", fontFamily: "'Syne', sans-serif", marginBottom: "8px" }}>
            ¿De qué año sos?
          </h2>
          <p style={{ fontSize: "14px", color: "#9ca3af" }}>
            Elegí tu año para ver las pruebas disponibles
          </p>
        </ScrollFloat>

        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "12px" }}>
            {years.map((year, i) => (
              <motion.button
                key={year.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -5, boxShadow: "0 10px 28px rgba(0,0,0,0.09)", borderColor: "#111" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/login")}
                onHoverStart={() => setHoveredYear(year.num)}
                onHoverEnd={() => setHoveredYear(null)}
                style={{
                  border: `1.5px solid ${hoveredYear === year.num ? "#111" : "#e5e7eb"}`,
                  borderRadius: "16px",
                  backgroundColor: "#fff",
                  padding: "36px 12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  transition: "border-color 0.2s",
                }}
              >
                <span style={{ fontSize: "42px", fontWeight: 900, color: "#111", fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>
                  {year.num}
                </span>
                <span style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600, letterSpacing: "0.2px" }}>
                  {year.label}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section style={{ backgroundColor: "#fff", padding: "90px 40px" }}>
        <ScrollFloat offset={25} style={{ maxWidth: "560px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 900, color: "#111", fontFamily: "'Syne', sans-serif", marginBottom: "16px" }}>
            ¿Qué es tusPruebas?
          </h2>
          <p style={{ fontSize: "16px", color: "#6b7280", lineHeight: 1.8, marginBottom: "36px" }}>
            Somos una plataforma donde estudiantes comparten exámenes reales de todas las materias y años de la secundaria, para ayudarte a estudiar mejor y practicar
          </p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: "#1f2937" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/login")}
              style={{
                backgroundColor: "#111", color: "#fff",
                fontWeight: 700, fontSize: "14px",
                padding: "12px 32px", borderRadius: "10px",
                border: "none", borderBottom: "3px solid #4f46e5",
                cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: "8px",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Explorar pruebas
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, borderColor: "#9ca3af" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/subir")}
              style={{
                backgroundColor: "#fff", color: "#374151",
                fontWeight: 600, fontSize: "14px",
                padding: "12px 28px", borderRadius: "10px",
                border: "1.5px solid #e5e7eb", cursor: "pointer",
              }}
            >
              Subir prueba
            </motion.button>
          </div>
        </ScrollFloat>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid #f3f4f6", backgroundColor: "#fff", padding: "22px 40px" }}>
        <div style={{
          maxWidth: "1100px", margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontSize: "13px", color: "#d1d5db", fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>
            tuspruebas
          </span>
          <div style={{ display: "flex", gap: "32px" }}>
            {["Sobre nosotros", "Contactanos", "Preguntas frecuentes", "Términos y condiciones"].map((item) => (
              <motion.button
                key={item}
                whileHover={{ color: "#374151" }}
                style={{ fontSize: "12px", color: "#9ca3af", background: "none", border: "none", cursor: "pointer", transition: "color 0.15s" }}
              >
                {item}
              </motion.button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}