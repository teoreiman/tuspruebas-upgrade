import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SplitText from "../reactBits/Splittext";
import FadeContent from "../reactBits/Fadecontent";
import ShinyText from "../reactBits/ShinyText";
import CountUp from "../reactBits/CountUp";
import Magnet from "../reactBits/Magnet";

function Divider() {
  return <div style={{ width: "100%", height: "1px", backgroundColor: "#f3f4f6" }} />;
}

function FeatureCard({ number, title, desc, delay }: { number: string; title: string; desc: string; delay: number }) {
  return (
    <FadeContent delay={delay}>
      <motion.div
        whileHover={{ y: -4 }}
        style={{
          padding: "36px 32px",
          backgroundColor: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "20px",
          transition: "box-shadow 0.3s",
        }}
        onHoverStart={(e) => { (e.target as HTMLElement).style.boxShadow = "0 16px 40px rgba(0,0,0,0.07)"; }}
        onHoverEnd={(e) => { (e.target as HTMLElement).style.boxShadow = "none"; }}
      >
        <p style={{ fontSize: "11px", fontWeight: 700, color: "#d1d5db", fontFamily: "'Syne', sans-serif", marginBottom: "20px", letterSpacing: "0.5px" }}>
          {number}
        </p>
        <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#111", fontFamily: "'Syne', sans-serif", marginBottom: "10px" }}>
          {title}
        </h3>
        <p style={{ fontSize: "14px", color: "#9ca3af", lineHeight: 1.7 }}>
          {desc}
        </p>
      </motion.div>
    </FadeContent>
  );
}

function SchoolBadge({ name, delay }: { name: string; delay: number }) {
  return (
    <FadeContent delay={delay}>
      <motion.div
        whileHover={{ y: -3 }}
        style={{
          padding: "14px 24px",
          backgroundColor: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          fontSize: "14px",
          fontWeight: 600,
          color: "#374151",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: "default",
        }}
      >
        <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#111" }} />
        {name}
      </motion.div>
    </FadeContent>
  );
}

function FAQ({ q, a, delay }: { q: string; a: string; delay: number }) {
  const [open, setOpen] = useState(false);
  return (
    <FadeContent delay={delay}>
      <div
        onClick={() => setOpen(!open)}
        style={{ padding: "22px 0", borderBottom: "1px solid #f3f4f6", cursor: "pointer" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "15px", fontWeight: 600, color: "#111" }}>{q}</span>
          <motion.span animate={{ rotate: open ? 45 : 0 }} style={{ fontSize: "20px", color: "#9ca3af", flexShrink: 0, lineHeight: 1 }}>+</motion.span>
        </div>
        {open && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            style={{ fontSize: "14px", color: "#6b7280", lineHeight: 1.7, marginTop: "12px" }}
          >
            {a}
          </motion.p>
        )}
      </div>
    </FadeContent>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  const schools = ["ORT Almagro", "ORT Belgrano", "Martín Buber", "Wolfson", "Tarbut"];

  const features = [
    { number: "01", title: "Buscá en segundos", desc: "Filtrá por colegio, año, materia y profesor. Encontrá exactamente la prueba que necesitás sin depender de grupos de WhatsApp." },
    { number: "02", title: "Subí y compartí", desc: "Colaborá con la comunidad. Subí los exámenes que ya rendiste y ayudá a otros estudiantes a prepararse mejor." },
    { number: "03", title: "IA integrada", desc: "Resolvé ejercicios, explicate conceptos y generá práctica personalizada con inteligencia artificial contextualizada a tu materia." },
    { number: "04", title: "Guardá favoritas", desc: "Marcá las pruebas que más te sirven y accedé a ellas desde tu perfil en cualquier momento." },
  ];

  const faqs = [
    { q: "¿tusPruebas es gratuita?", a: "Sí, completamente gratuita para todos los estudiantes. Podés acceder a todas las pruebas sin pagar nada." },
    { q: "¿De qué colegios hay pruebas?", a: "Tenemos pruebas de ORT Almagro, ORT Belgrano, Martín Buber, Wolfson y Tarbut. Estamos agregando más colegios." },
    { q: "¿Cómo puedo subir una prueba?", a: "Entrá a tu cuenta, hacé clic en Subir prueba, completá los datos y subí el archivo. Lo revisamos antes de publicarlo." },
    { q: "¿Las pruebas son verificadas?", a: "Sí. Cada prueba pasa por moderación antes de aparecer en la plataforma para garantizar calidad." },
    { q: "¿La IA funciona para todas las materias?", a: "Sí. Podés pedirle que explique conceptos, resuelva ejercicios o genere práctica similar a las pruebas reales." },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff", fontFamily: "'DM Sans', sans-serif", overflowX: "hidden" }}>

      {/* ── NAVBAR ── */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          borderBottom: "1px solid #f3f4f6",
          backgroundColor: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(8px)",
          position: "sticky", top: 0, zIndex: 50,
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "14px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            <span style={{ fontSize: "16px", fontWeight: 900, color: "#111", fontFamily: "'Syne', sans-serif" }}>tuspruebas</span>
          </div>

          <nav style={{ display: "flex", alignItems: "center", gap: "36px" }}>
            {[
              { label: "Cómo funciona", id: "como-funciona" },
              { label: "Colegios", id: "colegios" },
            ].map((item) => (
              <motion.button
                key={item.label}
                onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" })}
                whileHover={{ color: "#111" }}
                style={{ fontSize: "14px", color: "#9ca3af", fontWeight: 500, background: "none", border: "none", cursor: "pointer" }}
              >
                {item.label}
              </motion.button>
            ))}
            <motion.button
              onClick={() => navigate("/subir")}
              whileHover={{ color: "#111" }}
              style={{ fontSize: "14px", color: "#9ca3af", fontWeight: 500, background: "none", border: "none", cursor: "pointer" }}
            >
              Subir pruebas
            </motion.button>
            <Magnet magnetStrength={0.3} padding={20}>
              <motion.button
                whileHover={{ backgroundColor: "#1f2937" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/login")}
                style={{ fontSize: "13px", fontWeight: 700, color: "#fff", backgroundColor: "#111", padding: "9px 22px", borderRadius: "9px", border: "none", cursor: "pointer" }}
              >
                Iniciar sesión
              </motion.button>
            </Magnet>
          </nav>
        </div>
      </motion.header>

      {/* ── HERO ── */}
      <section style={{ position: "relative", backgroundColor: "#fff", padding: "130px 40px 110px", textAlign: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.13 }}>
          <svg style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "36%" }} viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice">
            <defs><linearGradient id="wL" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#888" stopOpacity="1"/><stop offset="100%" stopColor="#888" stopOpacity="0"/></linearGradient></defs>
            <path d="M-50,30 Q120,130 -30,230 Q-100,320 80,420" stroke="url(#wL)" strokeWidth="90" fill="none"/>
            <path d="M-90,0 Q70,110 -60,220 Q-130,310 20,400" stroke="url(#wL)" strokeWidth="55" fill="none" opacity="0.5"/>
            <path d="M-20,80 Q90,180 -15,280" stroke="url(#wL)" strokeWidth="32" fill="none" opacity="0.25"/>
          </svg>
          <svg style={{ position: "absolute", right: 0, top: 0, height: "100%", width: "36%" }} viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice">
            <defs><linearGradient id="wR" x1="100%" y1="0%" x2="0%" y2="0%"><stop offset="0%" stopColor="#888" stopOpacity="1"/><stop offset="100%" stopColor="#888" stopOpacity="0"/></linearGradient></defs>
            <path d="M350,30 Q180,130 330,230 Q400,320 220,420" stroke="url(#wR)" strokeWidth="90" fill="none"/>
            <path d="M390,0 Q230,110 360,220 Q430,310 280,400" stroke="url(#wR)" strokeWidth="55" fill="none" opacity="0.5"/>
            <path d="M320,80 Q210,180 315,280" stroke="url(#wR)" strokeWidth="32" fill="none" opacity="0.25"/>
          </svg>
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: "820px", margin: "0 auto" }}>
          <FadeContent delay={0.1}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.2" style={{ margin: "0 auto 32px", display: "block" }}>
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </FadeContent>

          <SplitText
            text="Bienvenido a tusPruebas"
            splitBy="chars"
            delay={18}
            duration={0.5}
            ease={[0.22, 1, 0.36, 1]}
            style={{
              fontSize: "clamp(40px, 5.2vw, 62px)",
              fontWeight: 900,
              color: "#111",
              fontFamily: "'Syne', sans-serif",
              lineHeight: 1.06,
              justifyContent: "center",
            }}
          />

          <div style={{ marginTop: "24px", marginBottom: "48px" }}>
            <FadeContent delay={0.9}>
              <p style={{ fontSize: "18px", color: "#9ca3af", lineHeight: 1.6 }}>
                <ShinyText speed={8}>encontrá todas las pruebas que necesités</ShinyText>
              </p>
            </FadeContent>
          </div>

          <FadeContent delay={1.1}>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <Magnet magnetStrength={0.3} padding={22}>
                <motion.button
                  whileHover={{ backgroundColor: "#1f2937" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/login")}
                  style={{
                    backgroundColor: "#111", color: "#fff", fontWeight: 700, fontSize: "15px",
                    padding: "13px 36px", borderRadius: "11px",
                    border: "none", borderBottom: "3px solid #4f46e5",
                    cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  Explorar pruebas
                </motion.button>
              </Magnet>
              <Magnet magnetStrength={0.3} padding={22}>
                <motion.button
                  whileHover={{ borderColor: "#9ca3af" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/signup")}
                  style={{ backgroundColor: "#fff", color: "#374151", fontWeight: 600, fontSize: "15px", padding: "13px 36px", borderRadius: "11px", border: "1.5px solid #e5e7eb", cursor: "pointer" }}
                >
                  Crear cuenta gratis
                </motion.button>
              </Magnet>
            </div>
          </FadeContent>
        </div>
      </section>

      <Divider />

      {/* ── STATS ── */}
      <section style={{ backgroundColor: "#fafafa", padding: "64px 40px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          {[
            { to: 500, suffix: "+", label: "Pruebas" },
            { to: 5, suffix: "", label: "Colegios" },
            { to: 8, suffix: "", label: "Años" },
            { to: 2000, suffix: "+", label: "Estudiantes" },
          ].map((s, i) => (
            <FadeContent key={s.label} delay={i * 0.1}>
              <div style={{ textAlign: "center", padding: "16px" }}>
                <p style={{ fontSize: "44px", fontWeight: 900, color: "#111", fontFamily: "'Syne', sans-serif", lineHeight: 1, marginBottom: "8px" }}>
                  <CountUp to={s.to} suffix={s.suffix} duration={2} />
                </p>
                <p style={{ fontSize: "11px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.6px", fontWeight: 600 }}>
                  {s.label}
                </p>
              </div>
            </FadeContent>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── CÓMO FUNCIONA ── */}
      <section id="como-funciona" style={{ backgroundColor: "#fff", padding: "96px 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <FadeContent delay={0}>
            <div style={{ marginBottom: "56px" }}>
              <h2 style={{ fontSize: "32px", fontWeight: 900, color: "#111", fontFamily: "'Syne', sans-serif", marginBottom: "10px" }}>
                Cómo funciona
              </h2>
              <p style={{ fontSize: "15px", color: "#9ca3af" }}>
                Una plataforma hecha por estudiantes, para estudiantes
              </p>
            </div>
          </FadeContent>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
            {features.map((f, i) => (
              <FeatureCard key={f.number} {...f} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── COLEGIOS ── */}
      <section id="colegios" style={{ backgroundColor: "#fafafa", padding: "96px 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <FadeContent delay={0}>
            <div style={{ textAlign: "center", marginBottom: "52px" }}>
              <h2 style={{ fontSize: "32px", fontWeight: 900, color: "#111", fontFamily: "'Syne', sans-serif", marginBottom: "10px" }}>
                Colegios disponibles
              </h2>
              <p style={{ fontSize: "15px", color: "#9ca3af" }}>
                Material organizado por institución, año y materia
              </p>
            </div>
          </FadeContent>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
            {schools.map((s, i) => <SchoolBadge key={s} name={s} delay={i * 0.08} />)}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── SOBRE TUSPRUEBAS ── */}
      <section style={{ backgroundColor: "#fff", padding: "96px 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
          <FadeContent delay={0}>
            <h2 style={{ fontSize: "36px", fontWeight: 900, color: "#111", fontFamily: "'Syne', sans-serif", marginBottom: "20px", lineHeight: 1.2 }}>
              ¿Qué es tusPruebas?
            </h2>
            <p style={{ fontSize: "16px", color: "#6b7280", lineHeight: 1.8, marginBottom: "36px" }}>
              Somos una plataforma donde estudiantes comparten exámenes reales de todas las materias y años de la secundaria, para ayudarte a estudiar mejor y practicar sin depender de contactos.
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <Magnet magnetStrength={0.3} padding={18}>
                <motion.button
                  whileHover={{ backgroundColor: "#1f2937" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/login")}
                  style={{ backgroundColor: "#111", color: "#fff", fontWeight: 700, fontSize: "14px", padding: "12px 28px", borderRadius: "10px", border: "none", borderBottom: "3px solid #4f46e5", cursor: "pointer" }}
                >
                  Explorar pruebas
                </motion.button>
              </Magnet>
              <motion.button
                whileHover={{ borderColor: "#9ca3af" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/subir")}
                style={{ backgroundColor: "#fff", color: "#374151", fontWeight: 600, fontSize: "14px", padding: "12px 24px", borderRadius: "10px", border: "1.5px solid #e5e7eb", cursor: "pointer" }}
              >
                Subir prueba
              </motion.button>
            </div>
          </FadeContent>

          <FadeContent delay={0.2}>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { label: "Contenido verificado", desc: "Cada prueba pasa por moderación antes de publicarse" },
                { label: "Colaborativa", desc: "Construida entre todos los estudiantes de la comunidad" },
                { label: "Con IA", desc: "Inteligencia artificial integrada para resolver dudas" },
                { label: "Gratuita", desc: "Sin costo para siempre para todos los estudiantes" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  style={{ display: "flex", gap: "16px", padding: "18px 20px", backgroundColor: "#fafafa", borderRadius: "12px", border: "1px solid #f3f4f6" }}
                >
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#111", marginTop: "5px", flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 700, color: "#111", marginBottom: "3px" }}>{item.label}</p>
                    <p style={{ fontSize: "13px", color: "#9ca3af" }}>{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </FadeContent>
        </div>
      </section>

      <Divider />

      {/* ── FAQ ── */}
      <section style={{ backgroundColor: "#fafafa", padding: "96px 40px" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <FadeContent delay={0}>
            <h2 style={{ fontSize: "32px", fontWeight: 900, color: "#111", fontFamily: "'Syne', sans-serif", marginBottom: "48px", textAlign: "center" }}>
              Preguntas frecuentes
            </h2>
          </FadeContent>
          {faqs.map((faq, i) => <FAQ key={faq.q} {...faq} delay={i * 0.06} />)}
        </div>
      </section>

      <Divider />

      {/* ── CTA FINAL ── */}
      <section style={{ backgroundColor: "#fff", padding: "120px 40px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <FadeContent delay={0}>
            <SplitText
              text="Empezá a estudiar mejor hoy"
              splitBy="words"
              delay={60}
              duration={0.5}
              style={{
                fontSize: "clamp(28px, 3.5vw, 46px)",
                fontWeight: 900,
                color: "#111",
                fontFamily: "'Syne', sans-serif",
                justifyContent: "center",
              }}
            />
            <div style={{ marginTop: "18px", marginBottom: "44px" }}>
              <p style={{ fontSize: "16px", color: "#9ca3af" }}>Gratis. Sin registros complicados. Empezá en segundos.</p>
            </div>
            <Magnet magnetStrength={0.3} padding={24}>
              <motion.button
                whileHover={{ backgroundColor: "#1f2937" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/signup")}
                style={{ backgroundColor: "#111", color: "#fff", fontWeight: 700, fontSize: "16px", padding: "15px 52px", borderRadius: "12px", border: "none", borderBottom: "3px solid #4f46e5", cursor: "pointer" }}
              >
                Crear cuenta gratis →
              </motion.button>
            </Magnet>
          </FadeContent>
        </div>
      </section>

      <Divider />

      {/* ── FOOTER ── */}
      <footer style={{ backgroundColor: "#fff", padding: "28px 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            <span style={{ fontSize: "13px", color: "#9ca3af", fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>tuspruebas</span>
          </div>
          <div style={{ display: "flex", gap: "32px" }}>
            {["Sobre nosotros", "Contactanos", "Términos y condiciones"].map((item) => (
              <motion.button key={item} whileHover={{ color: "#374151" }} style={{ fontSize: "12px", color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}>
                {item}
              </motion.button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}