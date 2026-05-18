import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SplitText from "../reactBits/Splittext";
import FadeContent from "../reactBits/Fadecontent";
import CountUp from "../reactBits/CountUp";
import Magnet from "../reactBits/Magnet";
import ShinyText from "../reactBits/ShinyText";
import Aurora from "../reactBits/Aurora";
import TrueFocus from "../reactBits/TrueFocus";
import StarBorder from "../reactBits/StarBorder";
import ClickSpark from "../reactBits/ClicksPark";
import Logo from "./logo";

const C = {
  bg:        "#0a0e1a",
  bgCard:    "#0f1523",
  bgSection: "#080c16",
  border:    "rgba(255,255,255,0.06)",
  borderHov: "rgba(16,99,239,0.5)",
  blue:      "#1063EF",
  blueHov:   "#0050EF",
  blueLight: "#4782E5",
  white:     "#ffffff",
  gray:      "#8A8A8A",
  text:      "#c8cdd8",
};

function Divider() {
  return <div style={{ width: "100%", height: "1px", backgroundColor: C.border }} />;
}

function FeatureCard({ number, title, desc, delay }: { number: string; title: string; desc: string; delay: number }) {
  return (
    <FadeContent delay={delay}>
      <motion.div
        whileHover={{ y: -4, borderColor: "rgba(16,99,239,0.35)" }}
        style={{
          padding: "32px",
          backgroundColor: C.bgCard,
          border: `1px solid ${C.border}`,
          borderRadius: "16px",
          height: "100%",
          transition: "border-color 0.3s, box-shadow 0.3s",
          cursor: "default",
        }}
        onHoverStart={(e) => { (e.target as HTMLElement).closest?.(".feat-card")?.setAttribute("style", "box-shadow: 0 0 40px rgba(16,99,239,0.08)"); }}
      >
        <div style={{
          width: "40px", height: "40px", borderRadius: "10px",
          backgroundColor: "rgba(16,99,239,0.12)",
          border: "1px solid rgba(16,99,239,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "13px", fontWeight: 800, color: C.blue,
          fontFamily: "'Syne', sans-serif",
          marginBottom: "20px",
        }}>
          {number}
        </div>
        <h3 style={{ fontSize: "17px", fontWeight: 800, color: C.white, fontFamily: "'Syne', sans-serif", marginBottom: "10px" }}>
          {title}
        </h3>
        <p style={{ fontSize: "14px", color: C.gray, lineHeight: 1.75 }}>{desc}</p>
      </motion.div>
    </FadeContent>
  );
}

function FAQ({ q, a, delay }: { q: string; a: string; delay: number }) {
  const [open, setOpen] = useState(false);
  return (
    <FadeContent delay={delay}>
      <div onClick={() => setOpen(!open)} style={{ padding: "22px 0", borderBottom: `1px solid ${C.border}`, cursor: "pointer" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "15px", fontWeight: 600, color: C.white }}>{q}</span>
          <motion.span animate={{ rotate: open ? 45 : 0 }} style={{ fontSize: "22px", color: C.blue, flexShrink: 0, lineHeight: 1 }}>+</motion.span>
        </div>
        {open && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            style={{ fontSize: "14px", color: C.gray, lineHeight: 1.7, marginTop: "12px" }}>
            {a}
          </motion.p>
        )}
      </div>
    </FadeContent>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  const schools = ["ORT Almagro", "ORT Belgrano", "Tarbut"];

  const features = [
    { number: "01", title: "Buscá en segundos", desc: "Filtrá por colegio, año, materia y profesor. Sin depender de grupos de WhatsApp o carpetas físicas." },
    { number: "02", title: "Subí y compartí", desc: "Colaborá con la comunidad. Cada prueba pasa por revisión antes de publicarse para garantizar calidad." },
    { number: "03", title: "IA integrada", desc: "Resolvé ejercicios, explicate conceptos y generá práctica personalizada con inteligencia artificial contextualizada." },
    { number: "04", title: "Guardá favoritas", desc: "Armá tu banco personal de pruebas y accedé a ellas desde tu perfil en cualquier momento." },
  ];

  const faqs = [
    { q: "¿tusPruebas es gratuita?", a: "Sí, completamente gratuita para todos los estudiantes. Podés acceder a todas las pruebas sin pagar nada." },
    { q: "¿De qué colegios hay pruebas?", a: "Tenemos pruebas de ORT Almagro, ORT Belgrano y Tarbut. Estamos agregando más colegios." },
    { q: "¿Cómo puedo subir una prueba?", a: "Entrá a tu cuenta, hacé clic en Subir prueba, completá los datos y subí el archivo. Lo revisamos antes de publicarlo." },
    { q: "¿Las pruebas son verificadas?", a: "Sí. Cada prueba pasa por moderación antes de aparecer en la plataforma para garantizar calidad y contenido apropiado." },
    { q: "¿La IA funciona para todas las materias?", a: "Sí. Podés pedirle que explique conceptos, resuelva ejercicios o genere práctica similar a las pruebas reales del colegio." },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, fontFamily: "'DM Sans', sans-serif", overflowX: "hidden" }}>

      {/* ── NAVBAR ── */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          borderBottom: `1px solid ${C.border}`,
          backgroundColor: "rgba(8,12,22,0.9)",
          backdropFilter: "blur(16px)",
          position: "sticky", top: 0, zIndex: 50,
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "14px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo size="sm" onClick={() => navigate("/")} />

          <nav style={{ display: "flex", alignItems: "center", gap: "36px" }}>
            {[
              { label: "Cómo funciona", id: "como-funciona" },
              { label: "Colegios", id: "colegios" },
              { label: "Subir pruebas", path: "/subir" },
            ].map((item) => (
              <motion.button key={item.label}
                onClick={() => item.id ? document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" }) : navigate(item.path!)}
                whileHover={{ color: C.white }}
                style={{ fontSize: "14px", color: C.gray, fontWeight: 500, background: "none", border: "none", cursor: "pointer", transition: "color 0.15s" }}>
                {item.label}
              </motion.button>
            ))}
            <Magnet magnetStrength={0.3} padding={20}>
              <ClickSpark sparkColor={C.blue} sparkCount={6} sparkSize={6}>
                <motion.button
                  whileHover={{ backgroundColor: C.blueHov, boxShadow: "0 0 20px rgba(16,99,239,0.4)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/login")}
                  style={{ fontSize: "13px", fontWeight: 700, color: C.white, backgroundColor: C.blue, padding: "9px 22px", borderRadius: "9px", border: "none", cursor: "pointer", transition: "all 0.2s" }}>
                  Iniciar sesión
                </motion.button>
              </ClickSpark>
            </Magnet>
          </nav>
        </div>
      </motion.header>

      {/* ── HERO ── */}
      <section style={{ position: "relative", backgroundColor: C.bg, padding: "140px 40px 120px", textAlign: "center", overflow: "hidden", minHeight: "85vh", display: "flex", alignItems: "center" }}>
        {/* Aurora background animado */}
        <Aurora
          colorStops={["#1063EF", "#0a0e1a", "#4782E5", "#0050EF"]}
          amplitude={1.2}
          speed={0.4}
          style={{ opacity: 0.5 }}
        />

        {/* Grid sutil */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.03,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        {/* Glow central */}
        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: "700px", height: "300px", borderRadius: "50%", backgroundColor: "rgba(16,99,239,0.08)", filter: "blur(100px)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "900px", margin: "0 auto", width: "100%" }}>
          {/* Badge */}
          <FadeContent delay={0.1}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
              <StarBorder color={C.blue} speed="4s" style={{ borderRadius: "999px" }}>
                <div style={{ padding: "6px 20px", backgroundColor: "rgba(16,99,239,0.08)", borderRadius: "999px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: C.blueLight, letterSpacing: "0.5px" }}>
                    ✦ Plataforma de exámenes para colegios judíos
                  </span>
                </div>
              </StarBorder>
            </div>
          </FadeContent>

          {/* Logo grande */}
          <FadeContent delay={0.2}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "40px" }}>
              <Logo size="lg" />
            </div>
          </FadeContent>

          {/* TrueFocus headline */}
          <FadeContent delay={0.35}>
            <TrueFocus
              sentence="Todas las pruebas un solo lugar"
              borderColor={C.blue}
              glowColor="rgba(16,99,239,0.35)"
              animationDuration={0.5}
              pauseBetweenAnimations={1400}
              style={{
                fontSize: "clamp(36px, 4.5vw, 58px)",
                fontWeight: 900,
                color: C.white,
                fontFamily: "'Syne', sans-serif",
                lineHeight: 1.08,
                justifyContent: "center",
                marginBottom: "0",
              }}
            />
          </FadeContent>

          {/* Subtítulo ShinyText */}
          <div style={{ marginTop: "28px", marginBottom: "52px" }}>
            <FadeContent delay={0.5}>
              <p style={{ fontSize: "18px", color: C.gray, lineHeight: 1.6 }}>
                <ShinyText speed={8} style={{ color: C.gray }}>
                  encontrá todos los exámenes que necesités, cuando los necesités
                </ShinyText>
              </p>
            </FadeContent>
          </div>

          {/* CTAs */}
          <FadeContent delay={0.65}>
            <div style={{ display: "flex", gap: "14px", justifyContent: "center", alignItems: "center" }}>
              <Magnet magnetStrength={0.4} padding={24}>
                <ClickSpark sparkColor={C.blue} sparkCount={10}>
                  <motion.button
                    whileHover={{ backgroundColor: C.blueHov, boxShadow: "0 0 30px rgba(16,99,239,0.5)" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate("/login")}
                    style={{
                      backgroundColor: C.blue, color: C.white, fontWeight: 700, fontSize: "15px",
                      padding: "14px 40px", borderRadius: "12px", border: "none",
                      cursor: "pointer", transition: "all 0.2s",
                      display: "inline-flex", alignItems: "center", gap: "8px",
                    }}>
                    Explorar pruebas
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                </ClickSpark>
              </Magnet>

              <Magnet magnetStrength={0.4} padding={24}>
                <motion.button
                  whileHover={{ borderColor: C.blueLight, color: C.white }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/signup")}
                  style={{
                    backgroundColor: "transparent", color: C.text, fontWeight: 600, fontSize: "15px",
                    padding: "14px 40px", borderRadius: "12px", border: `1.5px solid ${C.border}`,
                    cursor: "pointer", transition: "all 0.2s",
                  }}>
                  Crear cuenta gratis
                </motion.button>
              </Magnet>
            </div>
          </FadeContent>

          {/* Scroll hint */}
          <FadeContent delay={1}>
            <div style={{ marginTop: "64px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}
              >
                <div style={{ width: "1px", height: "24px", background: `linear-gradient(to bottom, transparent, ${C.border})` }} />
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.gray} strokeWidth="1.5">
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </div>
          </FadeContent>
        </div>
      </section>

      <Divider />

      {/* ── STATS ── */}
      <section style={{ backgroundColor: C.bgSection, padding: "72px 40px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", backgroundColor: C.border, borderRadius: "20px", overflow: "hidden" }}>
          {[
            { to: 500, suffix: "+", label: "Pruebas" },
            { to: 3, suffix: "", label: "Colegios" },
            { to: 8, suffix: "", label: "Años" },
            { to: 2000, suffix: "+", label: "Estudiantes" },
          ].map((s, i) => (
            <FadeContent key={s.label} delay={i * 0.1}>
              <div style={{ textAlign: "center", padding: "40px 16px", backgroundColor: C.bgSection }}>
                <p style={{ fontSize: "46px", fontWeight: 900, color: C.blue, fontFamily: "'Syne', sans-serif", lineHeight: 1, marginBottom: "8px" }}>
                  <CountUp to={s.to} suffix={s.suffix} duration={2.2} />
                </p>
                <p style={{ fontSize: "11px", color: C.gray, textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 600 }}>{s.label}</p>
              </div>
            </FadeContent>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── CÓMO FUNCIONA ── */}
      <section id="como-funciona" style={{ backgroundColor: C.bg, padding: "100px 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <FadeContent delay={0}>
            <div style={{ marginBottom: "64px", maxWidth: "560px" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: C.blue, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>
                Cómo funciona
              </p>
              <h2 style={{ fontSize: "36px", fontWeight: 900, color: C.white, fontFamily: "'Syne', sans-serif", marginBottom: "14px", lineHeight: 1.15 }}>
                Todo lo que necesitás para rendir bien
              </h2>
              <p style={{ fontSize: "16px", color: C.gray, lineHeight: 1.7 }}>
                Una plataforma pensada desde el primer día para estudiantes de colegios judíos de Buenos Aires.
              </p>
            </div>
          </FadeContent>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
            {features.map((f, i) => <FeatureCard key={f.number} {...f} delay={i * 0.08} />)}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── COLEGIOS ── */}
      <section id="colegios" style={{ backgroundColor: C.bgSection, padding: "100px 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <FadeContent delay={0}>
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: C.blue, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px" }}>Colegios</p>
              <h2 style={{ fontSize: "36px", fontWeight: 900, color: C.white, fontFamily: "'Syne', sans-serif", marginBottom: "12px" }}>
                Disponible en {schools.length} colegios
              </h2>
              <p style={{ fontSize: "15px", color: C.gray }}>Material organizado por institución, año y materia</p>
            </div>
          </FadeContent>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
            {schools.map((s, i) => (
              <FadeContent key={s} delay={i * 0.1}>
                <StarBorder color={C.blue} speed={`${5 + i}s`}>
                  <motion.div
                    whileHover={{ backgroundColor: "rgba(16,99,239,0.08)" }}
                    style={{
                      padding: "16px 32px",
                      backgroundColor: C.bgCard,
                      borderRadius: "10px",
                      fontSize: "15px",
                      fontWeight: 600,
                      color: C.white,
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      cursor: "default",
                      transition: "background-color 0.2s",
                    }}
                  >
                    <div style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: C.blue, boxShadow: `0 0 8px ${C.blue}` }} />
                    {s}
                  </motion.div>
                </StarBorder>
              </FadeContent>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── SOBRE TUSPRUEBAS ── */}
      <section style={{ backgroundColor: C.bg, padding: "100px 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
          <FadeContent delay={0}>
            <p style={{ fontSize: "12px", fontWeight: 700, color: C.blue, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px" }}>Sobre tusPruebas</p>
            <h2 style={{ fontSize: "36px", fontWeight: 900, color: C.white, fontFamily: "'Syne', sans-serif", marginBottom: "20px", lineHeight: 1.2 }}>
              ¿Qué es tusPruebas?
            </h2>
            <p style={{ fontSize: "16px", color: C.gray, lineHeight: 1.8, marginBottom: "36px" }}>
              Somos una plataforma donde estudiantes comparten exámenes reales de todas las materias y años de la secundaria, para ayudarte a estudiar mejor y practicar sin depender de contactos.
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <ClickSpark sparkColor={C.blue} sparkCount={8}>
                <Magnet magnetStrength={0.3} padding={18}>
                  <motion.button whileHover={{ backgroundColor: C.blueHov, boxShadow: "0 0 24px rgba(16,99,239,0.4)" }} whileTap={{ scale: 0.97 }} onClick={() => navigate("/login")}
                    style={{ backgroundColor: C.blue, color: C.white, fontWeight: 700, fontSize: "14px", padding: "12px 28px", borderRadius: "10px", border: "none", cursor: "pointer", transition: "all 0.2s" }}>
                    Explorar pruebas
                  </motion.button>
                </Magnet>
              </ClickSpark>
              <motion.button whileHover={{ borderColor: C.blueLight, color: C.white }} whileTap={{ scale: 0.97 }} onClick={() => navigate("/subir")}
                style={{ backgroundColor: "transparent", color: C.text, fontWeight: 600, fontSize: "14px", padding: "12px 24px", borderRadius: "10px", border: `1.5px solid ${C.border}`, cursor: "pointer", transition: "all 0.2s" }}>
                Subir prueba
              </motion.button>
            </div>
          </FadeContent>

          <FadeContent delay={0.2}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { label: "Contenido verificado", desc: "Cada prueba pasa por moderación antes de publicarse" },
                { label: "Colaborativa", desc: "Construida entre todos los estudiantes de la comunidad" },
                { label: "Con IA", desc: "Inteligencia artificial para resolver dudas y generar práctica" },
                { label: "Gratuita para siempre", desc: "Sin costo para todos los estudiantes, siempre" },
              ].map((item, i) => (
                <motion.div key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  whileHover={{ borderColor: "rgba(16,99,239,0.3)", x: 4 }}
                  style={{ display: "flex", gap: "16px", padding: "18px 20px", backgroundColor: C.bgCard, borderRadius: "12px", border: `1px solid ${C.border}`, transition: "all 0.2s" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: C.blue, boxShadow: `0 0 8px ${C.blue}`, marginTop: "5px", flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 700, color: C.white, marginBottom: "3px" }}>{item.label}</p>
                    <p style={{ fontSize: "13px", color: C.gray }}>{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </FadeContent>
        </div>
      </section>

      <Divider />

      {/* ── FAQ ── */}
      <section style={{ backgroundColor: C.bgSection, padding: "100px 40px" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <FadeContent delay={0}>
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: C.blue, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px" }}>FAQ</p>
              <h2 style={{ fontSize: "36px", fontWeight: 900, color: C.white, fontFamily: "'Syne', sans-serif" }}>
                Preguntas frecuentes
              </h2>
            </div>
          </FadeContent>
          {faqs.map((faq, i) => <FAQ key={faq.q} {...faq} delay={i * 0.06} />)}
        </div>
      </section>

      <Divider />

      {/* ── CTA FINAL ── */}
      <section style={{ backgroundColor: C.bg, padding: "130px 40px", position: "relative", overflow: "hidden" }}>
        <Aurora colorStops={["#0050EF", "#0a0e1a", "#1063EF"]} amplitude={0.8} speed={0.3} style={{ opacity: 0.4 }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "600px", height: "200px", borderRadius: "50%", backgroundColor: "rgba(16,99,239,0.07)", filter: "blur(80px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <FadeContent delay={0}>
            <p style={{ fontSize: "12px", fontWeight: 700, color: C.blue, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "24px" }}>
              Empezá ahora
            </p>
            <SplitText
              text="Estudiá mejor, rendí mejor"
              splitBy="words"
              delay={70}
              duration={0.55}
              style={{
                fontSize: "clamp(30px, 4vw, 50px)",
                fontWeight: 900,
                color: C.white,
                fontFamily: "'Syne', sans-serif",
                justifyContent: "center",
              }}
            />
            <div style={{ marginTop: "20px", marginBottom: "48px" }}>
              <p style={{ fontSize: "17px", color: C.gray }}>Gratis. Sin complicaciones. Empezá en segundos.</p>
            </div>
            <ClickSpark sparkColor={C.blue} sparkCount={12}>
              <Magnet magnetStrength={0.35} padding={28}>
                <motion.button
                  whileHover={{ backgroundColor: C.blueHov, boxShadow: "0 0 40px rgba(16,99,239,0.5)", scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/signup")}
                  style={{
                    backgroundColor: C.blue, color: C.white, fontWeight: 700, fontSize: "16px",
                    padding: "16px 56px", borderRadius: "14px", border: "none", cursor: "pointer",
                    transition: "all 0.2s",
                    display: "inline-flex", alignItems: "center", gap: "10px",
                  }}>
                  Crear cuenta gratis
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </Magnet>
            </ClickSpark>
          </FadeContent>
        </div>
      </section>

      <Divider />

      {/* ── FOOTER ── */}
      <footer style={{ backgroundColor: C.bgSection, padding: "32px 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo size="sm" />
          <div style={{ display: "flex", gap: "32px" }}>
            {["Sobre nosotros", "Contactanos", "Términos y condiciones"].map((item) => (
              <motion.button key={item} whileHover={{ color: C.text }}
                style={{ fontSize: "12px", color: C.gray, background: "none", border: "none", cursor: "pointer", transition: "color 0.15s" }}>
                {item}
              </motion.button>
            ))}
          </div>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.15)" }}>© 2026 tusPruebas</p>
        </div>
      </footer>
    </div>
  );
}