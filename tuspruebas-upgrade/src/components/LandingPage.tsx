import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import FadeContent from "../reactBits/Fadecontent";
import CountUp from "../reactBits/CountUp";
import Magnet from "../reactBits/Magnet";
import ShinyText from "../reactBits/ShinyText";
import Aurora from "../reactBits/Aurora";
import StarBorder from "../reactBits/StarBorder";
import ClickSpark from "../reactBits/ClickSpark";
import SplitText from "../reactBits/Splittext";
import Logo from "./logo";

const C = {
  bg:        "#070b14",
  bgCard:    "#0d1526",
  bgSection: "#080d18",
  border:    "rgba(255,255,255,0.07)",
  blue:      "#1063EF",
  blueHov:   "#0050EF",
  blueLight: "#4782E5",
  white:     "#ffffff",
  gray:      "#8A8A9A",
  text:      "#c8cdd8",
};

function LaptopMockup() {
  const materias = [
    { label: "Matemática", color: "#1063EF" },
    { label: "Marketing",   color: "#f59e0b" },
    { label: "Química",    color: "#10b981" },
    { label: "Inglés",     color: "#ec4899" },
    { label: "Lengua y Literatura",     color: "#8b5cf6" },
    { label: "Educación Judia",   color: "#14b8a6" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: "relative", width: "100%", maxWidth: "560px" }}
    >
      <div style={{
        position: "absolute", top: "20%", left: "10%",
        width: "80%", height: "60%",
        backgroundColor: "rgba(16,99,239,0.2)",
        filter: "blur(60px)", borderRadius: "50%", zIndex: 0,
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{
          backgroundColor: "#0f1923",
          borderRadius: "16px 16px 0 0",
          border: "2px solid rgba(255,255,255,0.12)",
          borderBottom: "none",
          padding: "12px",
          boxShadow: "0 0 60px rgba(16,99,239,0.15), inset 0 0 40px rgba(0,0,0,0.5)",
        }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
            <div style={{ width: "60px", height: "6px", borderRadius: "3px", backgroundColor: "rgba(255,255,255,0.06)" }} />
          </div>

          <div style={{
            backgroundColor: "#0a1020",
            borderRadius: "8px",
            padding: "16px",
            minHeight: "280px",
            border: "1px solid rgba(255,255,255,0.05)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "6px", backgroundColor: C.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 900, color: "#fff" }}>TP</div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: C.white }}>tusPruebas</span>
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                <div style={{ width: "28px", height: "16px", borderRadius: "4px", backgroundColor: "rgba(255,255,255,0.06)" }} />
                <div style={{ width: "28px", height: "16px", borderRadius: "4px", backgroundColor: "rgba(255,255,255,0.06)" }} />
              </div>
            </div>

            <div style={{ backgroundColor: "rgba(255,255,255,0.04)", borderRadius: "6px", padding: "7px 12px", marginBottom: "14px", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "9px", color: C.gray }}>🔍</span>
              <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)" }}>Buscar prueba, materia, profesor...</span>
            </div>

            <div style={{ display: "flex", gap: "6px", marginBottom: "14px", flexWrap: "wrap" }}>
              {["5to año", "ORT", "Matemática"].map((chip, i) => (
                <div key={chip} style={{ padding: "3px 8px", borderRadius: "999px", backgroundColor: i === 0 ? "rgba(16,99,239,0.3)" : "rgba(255,255,255,0.05)", border: `1px solid ${i === 0 ? "rgba(16,99,239,0.5)" : "rgba(255,255,255,0.08)"}`, fontSize: "9px", color: i === 0 ? C.blueLight : C.gray, fontWeight: i === 0 ? 700 : 400 }}>
                  {chip}
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
              {materias.map((m) => (
                <motion.div key={m.label} whileHover={{ scale: 1.03 }}
                  style={{ backgroundColor: "rgba(255,255,255,0.04)", borderRadius: "8px", padding: "10px 8px", border: "1px solid rgba(255,255,255,0.06)", cursor: "default" }}>
                  <div style={{ width: "20px", height: "20px", borderRadius: "5px", backgroundColor: m.color + "22", border: `1px solid ${m.color}44`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "6px" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "2px", backgroundColor: m.color }} />
                  </div>
                  <p style={{ fontSize: "9px", fontWeight: 700, color: C.white, marginBottom: "2px" }}>{m.label}</p>
                  <p style={{ fontSize: "8px", color: C.gray }}>ORT · 5to</p>
                </motion.div>
              ))}
            </div>

            <div style={{ marginTop: "12px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
              <div style={{ width: "40px", height: "4px", borderRadius: "2px", backgroundColor: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
              </div>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: "#131d2e", height: "18px", borderRadius: "0 0 8px 8px", border: "2px solid rgba(255,255,255,0.08)", borderTop: "none", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ width: "60px", height: "3px", borderRadius: "2px", backgroundColor: "rgba(255,255,255,0.06)" }} />
        </div>
        <div style={{ height: "8px", backgroundColor: "#0d1624", borderRadius: "0 0 12px 12px", border: "2px solid rgba(255,255,255,0.06)", borderTop: "none" }} />
      </div>
    </motion.div>
  );
}

// ── Step ──────────────────────────────────────────────────────────────────────
function Step({ num, title, desc, isLast }: { num: string; title: string; desc: string; isLast?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", flex: 1, position: "relative" }}>
      {!isLast && (
        <div style={{
          position: "absolute", top: "28px",
          left: "calc(50% + 28px)", right: "calc(-50% + 28px)",
          height: "1px",
          background: `linear-gradient(to right, ${C.blue}80, rgba(16,99,239,0.1))`,
          zIndex: 0,
        }} />
      )}
      <div style={{
        width: "56px", height: "56px", borderRadius: "50%",
        backgroundColor: "rgba(16,99,239,0.12)", border: `2px solid ${C.blue}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "18px", fontWeight: 900, color: C.blue,
        fontFamily: "'Syne', sans-serif",
        boxShadow: `0 0 20px rgba(16,99,239,0.25)`,
        zIndex: 1, flexShrink: 0, position: "relative",
      }}>
        {num}
      </div>
      <div style={{ textAlign: "center" }}>
        <h3 style={{ fontSize: "15px", fontWeight: 700, color: C.white, marginBottom: "8px", fontFamily: "'Syne', sans-serif" }}>{title}</h3>
        <p style={{ fontSize: "13px", color: C.gray, lineHeight: 1.65 }}>{desc}</p>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();

  const caracteristicas = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth="1.8">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      ),
      title: "Pruebas personalizadas",
      desc: "Filtrá por materia, año, colegio y profesor y encontrá exactamente lo que necesitás.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth="1.8">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      title: "Seguimiento de progreso",
      desc: "Guardá tus pruebas favoritas y llevá un registro de todo tu material de estudio.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth="1.8">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      title: "Con todos tus amigos",
      desc: "Colaborá con la comunidad subiendo tus propios exámenes y ayudá a otros.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth="1.8">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <line x1="3" y1="9" x2="21" y2="9"/>
          <line x1="9" y1="21" x2="9" y2="9"/>
        </svg>
      ),
      title: "Nosotros y el apoyo",
      desc: "Revisamos cada prueba antes de publicarla y respondemos dudas del contenido.",
    },
  ];

  // Colores de fondo para las cards — mezcla azules como en el diseño de Fede
  const cardBgs = [
    { bg: "#1063EF", glow: "rgba(16,99,239,0.4)" },
    { bg: "#0d4fd4", glow: "rgba(13,79,212,0.4)" },
    { bg: "#1557d4", glow: "rgba(21,87,212,0.4)" },
    { bg: "#0a3fb8", glow: "rgba(10,63,184,0.4)" },
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
          backgroundColor: "rgba(7,11,20,0.92)",
          backdropFilter: "blur(16px)",
          position: "sticky", top: 0, zIndex: 50,
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "14px 48px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo size="sm" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />

          <nav style={{ display: "flex", alignItems: "center", gap: "36px" }}>
            {[
              { label: "Inicio",          id: "",               path: "" },
              { label: "Características", id: "caracteristicas",path: "" },
              { label: "¿Cómo funciona?", id: "como-funciona",  path: "" },
              { label: "Subir pruebas",   id: "",               path: "/subir" },
            ].map((item) => (
              <motion.button key={item.label}
                onClick={() => item.path ? navigate(item.path) : item.id ? document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" }) : window.scrollTo({ top: 0, behavior: "smooth" })}
                whileHover={{ color: C.white }}
                style={{ fontSize: "13px", color: C.gray, fontWeight: 500, background: "none", border: "none", cursor: "pointer", transition: "color 0.15s", whiteSpace: "nowrap" }}>
                {item.label}
              </motion.button>
            ))}
          </nav>

          <ClickSpark sparkColor={C.blue} sparkCount={8}>
            <Magnet magnetStrength={0.35} padding={20}>
              <motion.button
                whileHover={{ backgroundColor: C.blueHov, boxShadow: "0 0 20px rgba(16,99,239,0.4)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/login")}
                style={{ fontSize: "13px", fontWeight: 700, color: C.white, backgroundColor: C.blue, padding: "9px 24px", borderRadius: "9px", border: "none", cursor: "pointer", transition: "all 0.2s" }}>
                Comenzar
              </motion.button>
            </Magnet>
          </ClickSpark>
        </div>
      </motion.header>

      {/* ── HERO ── */}
      <section style={{ position: "relative", overflow: "hidden", backgroundColor: C.bg }}>
        <Aurora colorStops={["#1063EF", "#070b14", "#4782E5", "#0050EF"]} amplitude={1.1} speed={0.35} style={{ opacity: 0.45 }} />
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.025, backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 48px 100px", display: "flex", alignItems: "center", gap: "64px", position: "relative", zIndex: 1 }}>
          {/* Left */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Reviews badge */}
            <FadeContent delay={0.1}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
                <div style={{ display: "flex" }}>
                  {[1, 2, 3].map((i) => (
                    <div key={i} style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: ["#1063EF","#4782E5","#0050EF"][i-1], border: "2px solid rgba(255,255,255,0.15)", marginLeft: i > 1 ? "-8px" : 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "#fff", fontWeight: 700 }}>
                      {["T","F","M"][i-1]}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ display: "flex", gap: "2px" }}>
                    {[1,2,3,4,5].map((i) => <span key={i} style={{ color: "#f59e0b", fontSize: "11px" }}>★</span>)}
                  </div>
                  <p style={{ fontSize: "11px", color: C.gray, marginTop: "1px" }}>1,000+ estudiantes confían en nosotros</p>
                </div>
              </div>
            </FadeContent>

            {/* Headline — SplitText letra por letra */}
            <div style={{ marginBottom: "0" }}>
              <SplitText
                text="Estudiá mejor."
                splitBy="chars"
                delay={20}
                duration={0.45}
                ease={[0.22, 1, 0.36, 1]}
                style={{
                  fontSize: "clamp(42px, 5vw, 62px)",
                  fontWeight: 900,
                  color: C.white,
                  fontFamily: "'Syne', sans-serif",
                  lineHeight: 1.05,
                  justifyContent: "flex-start",
                  marginBottom: "4px",
                }}
              />
              <SplitText
                text="Rendí al máximo"
                splitBy="words"
                delay={120}
                duration={0.45}
                ease={[0.22, 1, 0.36, 1]}
                style={{
                  fontSize: "clamp(42px, 5vw, 62px)",
                  fontWeight: 900,
                  color: C.blue,
                  fontFamily: "'Syne', sans-serif",
                  lineHeight: 1.05,
                  justifyContent: "flex-start",
                }}
              />
            </div>

            {/* Subtitle */}
            <FadeContent delay={0.6}>
              <p style={{ fontSize: "16px", color: C.gray, lineHeight: 1.7, margin: "20px 0 36px", maxWidth: "440px" }}>
                <ShinyText speed={7} style={{ color: C.gray }}>
                  Tus pruebas, tu tiempo, tu forma. Practicá con material personalizado y seguí tu progreso.
                </ShinyText>
              </p>
            </FadeContent>

            {/* CTAs */}
            <FadeContent delay={0.75}>
              <div style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap" }}>
                <ClickSpark sparkColor={C.blue} sparkCount={10}>
                  <Magnet magnetStrength={0.35} padding={22}>
                    <motion.button
                      whileHover={{ backgroundColor: C.blueHov, boxShadow: "0 0 32px rgba(16,99,239,0.5)" }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate("/signup")}
                      style={{ backgroundColor: C.blue, color: C.white, fontWeight: 700, fontSize: "14px", padding: "13px 32px", borderRadius: "10px", border: "none", cursor: "pointer", transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                      Comenzar ahora
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </motion.button>
                  </Magnet>
                </ClickSpark>

                <motion.button
                  whileHover={{ color: C.white }}
                  onClick={() => document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" })}
                  style={{ backgroundColor: "transparent", color: C.text, fontWeight: 600, fontSize: "14px", padding: "13px 24px", borderRadius: "10px", border: `1px solid ${C.border}`, cursor: "pointer", transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polygon points="10 8 16 12 10 16 10 8"/>
                  </svg>
                  Ver cómo funciona
                </motion.button>
              </div>
            </FadeContent>
          </div>

          {/* Right — Laptop Mockup */}
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <LaptopMockup />
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div style={{ backgroundColor: C.bgSection, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 48px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", backgroundColor: C.border, gap: "1px" }}>
          {[
            { to: 500, suffix: "+", label: "Pruebas" },
            { to: 3, suffix: "", label: "Colegios" },
            { to: 8, suffix: "", label: "Años" },
            { to: 2000, suffix: "+", label: "Estudiantes" },
          ].map((s, i) => (
            <FadeContent key={s.label} delay={i * 0.08}>
              <div style={{ textAlign: "center", padding: "32px 16px", backgroundColor: C.bgSection }}>
                <p style={{ fontSize: "38px", fontWeight: 900, color: C.blue, fontFamily: "'Syne', sans-serif", lineHeight: 1, marginBottom: "6px" }}>
                  <CountUp to={s.to} suffix={s.suffix} duration={2} />
                </p>
                <p style={{ fontSize: "11px", color: C.gray, textTransform: "uppercase", letterSpacing: "0.7px", fontWeight: 600 }}>{s.label}</p>
              </div>
            </FadeContent>
          ))}
        </div>
      </div>

      {/* ── CARACTERÍSTICAS — cards con fondo azul sólido ── */}
      <section id="caracteristicas" style={{ backgroundColor: C.bg, padding: "96px 48px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <FadeContent delay={0}>
            <div style={{ marginBottom: "56px" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: C.blue, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "14px" }}>
                Características
              </p>
              <h2 style={{ fontSize: "36px", fontWeight: 900, color: C.white, fontFamily: "'Syne', sans-serif" }}>
                Todo lo que necesitás para estudiar mejor
              </h2>
            </div>
          </FadeContent>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            {caracteristicas.map((c, i) => (
              <FadeContent key={c.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -6, boxShadow: `0 24px 48px ${cardBgs[i].glow}` }}
                  style={{
                    padding: "28px 24px",
                    background: `linear-gradient(135deg, ${cardBgs[i].bg} 0%, ${cardBgs[i].bg}cc 100%)`,
                    borderRadius: "16px",
                    height: "100%",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.3s",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  {/* Glow interno */}
                  <div style={{
                    position: "absolute", top: "-20px", right: "-20px",
                    width: "100px", height: "100px", borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.08)",
                    filter: "blur(20px)",
                    pointerEvents: "none",
                  }} />

                  {/* Noise texture sutil */}
                  <div style={{
                    position: "absolute", inset: 0, borderRadius: "16px",
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
                    pointerEvents: "none",
                  }} />

                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{
                      width: "44px", height: "44px", borderRadius: "12px",
                      backgroundColor: "rgba(255,255,255,0.15)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      marginBottom: "18px",
                    }}>
                      {c.icon}
                    </div>
                    <h3 style={{ fontSize: "15px", fontWeight: 700, color: C.white, marginBottom: "10px", fontFamily: "'Syne', sans-serif" }}>{c.title}</h3>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>{c.desc}</p>
                  </div>
                </motion.div>
              </FadeContent>
            ))}
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ── */}
      <section id="como-funciona" style={{ backgroundColor: C.bgSection, padding: "96px 48px", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <FadeContent delay={0}>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: C.blue, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "14px" }}>
                ¿Cómo funciona?
              </p>
            </div>
          </FadeContent>

          <FadeContent delay={0.05}>
            <div style={{ textAlign: "center", marginBottom: "64px" }}>
              <h2 style={{ fontSize: "36px", fontWeight: 900, color: C.white, fontFamily: "'Syne', sans-serif", margin: 0 }}>
                Así de simple
              </h2>
            </div>
          </FadeContent>

          <FadeContent delay={0.1}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px", alignItems: "flex-start" }}>
              <Step num="1" title="Elegí tu material" desc="Seleccioná tu colegio, año y materia. Encontrás pruebas y exámenes organizados para vos." />
              <Step num="2" title="Estudiá las pruebas" desc="Accedé a pruebas reales, practicá con los exámenes anteriores y usá la IA para resolver dudas." />
              <Step num="3" title="Revisá tus resultados" desc="Guardá tus pruebas favoritas y hacé seguimiento de tu progreso antes de cada evaluación." isLast />
            </div>
          </FadeContent>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ backgroundColor: C.bg, padding: "100px 48px", position: "relative", overflow: "hidden" }}>
        <Aurora colorStops={["#0050EF", "#070b14", "#1063EF"]} amplitude={0.9} speed={0.3} style={{ opacity: 0.4 }} />

        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{
            backgroundColor: C.bgCard,
            borderRadius: "24px",
            border: `1px solid rgba(16,99,239,0.25)`,
            padding: "64px 80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "48px",
            boxShadow: "0 0 80px rgba(16,99,239,0.08)",
          }}>
            <FadeContent delay={0}>
              <div style={{ maxWidth: "500px" }}>
                <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 900, color: C.white, fontFamily: "'Syne', sans-serif", marginBottom: "16px", lineHeight: 1.2 }}>
                  ¿Nos ponemos en marcha?
                </h2>
                <p style={{ fontSize: "16px", color: C.gray, lineHeight: 1.7, marginBottom: "36px" }}>
                  Sumate a los estudiantes que ya están estudiando de forma más inteligente.
                </p>
                <ClickSpark sparkColor={C.blue} sparkCount={10}>
                  <Magnet magnetStrength={0.35} padding={20}>
                    <motion.button
                      whileHover={{ backgroundColor: C.blueHov, boxShadow: "0 0 30px rgba(16,99,239,0.45)" }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate("/signup")}
                      style={{ backgroundColor: C.blue, color: C.white, fontWeight: 700, fontSize: "15px", padding: "14px 40px", borderRadius: "12px", border: "none", cursor: "pointer", transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                      Comenzar ahora
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </motion.button>
                  </Magnet>
                </ClickSpark>
              </div>
            </FadeContent>

            <FadeContent delay={0.2}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{ position: "absolute", inset: "-20px", backgroundColor: "rgba(16,99,239,0.12)", filter: "blur(30px)", borderRadius: "50%" }} />
                <StarBorder color={C.blue} speed="3s" style={{ borderRadius: "50%" }}>
                  <div style={{
                    width: "140px", height: "140px", borderRadius: "50%",
                    backgroundColor: "rgba(16,99,239,0.15)",
                    border: `2px solid rgba(16,99,239,0.3)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative",
                  }}>
                    <motion.svg
                      width="64" height="64" viewBox="0 0 24 24" fill="none"
                      stroke={C.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
                    >
                      <motion.polyline points="20 6 9 17 4 12" />
                    </motion.svg>
                  </div>
                </StarBorder>
              </div>
            </FadeContent>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ backgroundColor: C.bgSection, borderTop: `1px solid ${C.border}`, padding: "24px 48px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo size="sm" />
          <nav style={{ display: "flex", gap: "28px" }}>
            {["Inicio", "Características", "¿Cómo funciona?", "Subir pruebas"].map((item) => (
              <motion.button key={item} whileHover={{ color: C.white }}
                style={{ fontSize: "12px", color: C.gray, background: "none", border: "none", cursor: "pointer", transition: "color 0.15s" }}>
                {item}
              </motion.button>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}