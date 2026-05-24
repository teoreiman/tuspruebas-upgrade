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
  bgCta:     "#0a1020",
  border:    "rgba(255,255,255,0.07)",
  blue:      "#1063EF",
  blueHov:   "#0050EF",
  blueLight: "#4782E5",
  white:     "#ffffff",
  gray:      "#8A8A9A",
  text:      "#c8cdd8",
};

// ── Laptop Mockup ─────────────────────────────────────────────────────────────
function LaptopMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50, y: 10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: "relative", width: "100%", maxWidth: "580px" }}
    >
      {/* Big blue glow */}
      <div style={{
        position: "absolute", top: "15%", left: "5%",
        width: "90%", height: "70%",
        background: "radial-gradient(ellipse, rgba(16,99,239,0.35) 0%, transparent 70%)",
        filter: "blur(40px)", zIndex: 0, pointerEvents: "none",
      }} />

      {/* Laptop */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Screen */}
        <div style={{
          backgroundColor: "#0d1728",
          borderRadius: "18px 18px 0 0",
          border: "2px solid rgba(255,255,255,0.13)",
          borderBottom: "none",
          padding: "10px 10px 0",
          boxShadow: "0 0 80px rgba(16,99,239,0.2)",
        }}>
          {/* Camera notch */}
          <div style={{ display: "flex", justifyContent: "center", paddingBottom: "8px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.15)" }} />
          </div>

          {/* Screen content */}
          <div style={{ backgroundColor: "#060e1c", borderRadius: "10px 10px 0 0", overflow: "hidden", minHeight: "300px" }}>
            {/* Topbar inside screen */}
            <div style={{ backgroundColor: "#0a1525", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "22px", height: "22px", borderRadius: "5px", backgroundColor: C.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8px", fontWeight: 900, color: "#fff" }}>TP</div>
                <span style={{ fontSize: "10px", fontWeight: 700, color: C.white }}>tusPruebas</span>
              </div>
              <div style={{ fontSize: "9px", color: C.gray }}>Bienvenido de nuevo, Tomás!</div>
              <div style={{ display: "flex", gap: "4px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#ef4444" }} />
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#f59e0b" }} />
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#22c55e" }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 0, minHeight: "260px" }}>
              {/* Sidebar */}
              <div style={{ backgroundColor: "#0a1422", borderRight: "1px solid rgba(255,255,255,0.05)", padding: "12px 10px" }}>
                <p style={{ fontSize: "8px", fontWeight: 700, color: C.gray, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>Materias</p>
                {[
                  { name: "Matemática", color: "#1063EF" },
                  { name: "Historia", color: "#f59e0b" },
                  { name: "Química", color: "#10b981" },
                  { name: "Inglés", color: "#ec4899" },
                  { name: "Física", color: "#8b5cf6" },
                  { name: "Biología", color: "#14b8a6" },
                ].map((m) => (
                  <div key={m.name} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "5px 6px", borderRadius: "6px", marginBottom: "3px", backgroundColor: m.name === "Matemática" ? "rgba(16,99,239,0.15)" : "transparent" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "2px", backgroundColor: m.color, flexShrink: 0 }} />
                    <span style={{ fontSize: "8px", color: m.name === "Matemática" ? C.white : C.gray, fontWeight: m.name === "Matemática" ? 700 : 400 }}>{m.name}</span>
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div style={{ padding: "12px", backgroundColor: "#060e1c" }}>
                <p style={{ fontSize: "9px", color: C.gray, marginBottom: "10px" }}>¿Qué pruebas estudiás hoy?</p>

                {/* Cards grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px", marginBottom: "12px" }}>
                  {[
                    { label: "Matemática", color: "#1063EF", sub: "5to · García" },
                    { label: "Historia", color: "#f59e0b", sub: "3ro · Levy" },
                    { label: "Química", color: "#10b981", sub: "5to · Rosenfeld" },
                    { label: "Inglés", color: "#ec4899", sub: "4to · Cohen" },
                    { label: "Física", color: "#8b5cf6", sub: "4to · Mizrahi" },
                    { label: "Biología", color: "#14b8a6", sub: "2do · Fernández" },
                  ].map((m) => (
                    <div key={m.label} style={{ backgroundColor: "rgba(255,255,255,0.03)", borderRadius: "8px", padding: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ width: "18px", height: "18px", borderRadius: "4px", backgroundColor: m.color + "25", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "5px" }}>
                        <div style={{ width: "7px", height: "7px", borderRadius: "1.5px", backgroundColor: m.color }} />
                      </div>
                      <p style={{ fontSize: "8px", fontWeight: 700, color: C.white, marginBottom: "1px" }}>{m.label}</p>
                      <p style={{ fontSize: "7px", color: C.gray }}>{m.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Progress / chart area */}
                <div style={{ backgroundColor: "rgba(16,99,239,0.06)", borderRadius: "8px", padding: "10px", border: "1px solid rgba(16,99,239,0.15)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <p style={{ fontSize: "8px", color: C.gray }}>Tu progreso esta semana</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <div style={{ width: "28px", height: "28px", borderRadius: "50%", border: `2px solid ${C.blue}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "7px", fontWeight: 900, color: C.blue }}>72%</div>
                    </div>
                  </div>
                  {/* Mini bar chart */}
                  <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "30px" }}>
                    {[40, 65, 45, 80, 55, 90, 72].map((h, i) => (
                      <motion.div key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: 1 + i * 0.08, duration: 0.5 }}
                        style={{ flex: 1, backgroundColor: i === 6 ? C.blue : "rgba(16,99,239,0.3)", borderRadius: "2px" }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Base */}
        <div style={{ backgroundColor: "#111d30", height: "16px", borderRadius: "0 0 6px 6px", border: "2px solid rgba(255,255,255,0.08)", borderTop: "none", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ width: "50px", height: "3px", borderRadius: "2px", backgroundColor: "rgba(255,255,255,0.06)" }} />
        </div>
        <div style={{ height: "6px", backgroundColor: "#0c1828", borderRadius: "0 0 10px 10px", border: "2px solid rgba(255,255,255,0.05)", borderTop: "none", boxShadow: "0 8px 32px rgba(16,99,239,0.2)" }} />
      </div>
    </motion.div>
  );
}

// ── Step ──────────────────────────────────────────────────────────────────────
function Step({ num, icon, title, desc, isLast }: { num: string; icon: React.ReactNode; title: string; desc: string; isLast?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", flex: 1, position: "relative" }}>
      {/* Dashed connector */}
      {!isLast && (
        <div style={{
          position: "absolute", top: "36px",
          left: "calc(50% + 38px)", right: "calc(-50% + 38px)",
          height: "1px",
          borderTop: `1.5px dashed rgba(16,99,239,0.4)`,
          zIndex: 0,
        }} />
      )}

      {/* Icon circle */}
      <div style={{
        width: "72px", height: "72px", borderRadius: "50%",
        backgroundColor: "rgba(16,99,239,0.1)",
        border: `1.5px solid rgba(16,99,239,0.4)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1, position: "relative", flexShrink: 0,
        boxShadow: "0 0 24px rgba(16,99,239,0.15)",
      }}>
        {icon}
      </div>

      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, color: C.blue, marginBottom: "6px" }}>{num}</p>
        <h3 style={{ fontSize: "15px", fontWeight: 700, color: C.white, marginBottom: "8px", fontFamily: "'Syne', sans-serif" }}>{title}</h3>
        <p style={{ fontSize: "12px", color: C.gray, lineHeight: 1.65, maxWidth: "180px", margin: "0 auto" }}>{desc}</p>
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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth="1.8">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
        </svg>
      ),
      title: "Pruebas personalizadas",
      desc: "Seleccioná el contenido y nivel de dificultad.",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth="1.8">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      ),
      title: "Seguimiento de proceso",
      desc: "Visualizá tus estadísticas y mejorá día a día.",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth="1.8">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      ),
      title: "Corrección inmediata",
      desc: "Obtené resultados al instante y entendé tus errores.",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth="1.8">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      title: "Guardá y repetí",
      desc: "Guardá tus pruebas y volvé a practicarlas cuando quieras.",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, fontFamily: "'DM Sans', sans-serif", overflowX: "hidden" }}>

      {/* ── NAVBAR ── */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          borderBottom: `1px solid ${C.border}`,
          backgroundColor: "rgba(7,11,20,0.95)",
          backdropFilter: "blur(16px)",
          position: "sticky", top: 0, zIndex: 50,
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo size="sm" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />

          <nav style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            {[
              { label: "Inicio",          id: "" },
              { label: "Características", id: "caracteristicas" },
              { label: "¿Cómo funciona?", id: "como-funciona" },
              { label: "Subir pruebas",   path: "/subir" },
            ].map((item) => (
              <motion.button key={item.label}
                onClick={() => "path" in item && item.path ? navigate(item.path) : item.id ? document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" }) : window.scrollTo({ top: 0, behavior: "smooth" })}
                whileHover={{ color: C.white }}
                style={{ fontSize: "13px", color: C.gray, fontWeight: 500, background: "none", border: "none", cursor: "pointer", transition: "color 0.15s", whiteSpace: "nowrap" }}>
                {item.label}
              </motion.button>
            ))}
          </nav>

          <ClickSpark sparkColor={C.blue} sparkCount={8}>
            <Magnet magnetStrength={0.35} padding={16}>
              <motion.button
                whileHover={{ backgroundColor: C.blueHov, boxShadow: "0 0 20px rgba(16,99,239,0.5)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/login")}
                style={{ fontSize: "13px", fontWeight: 700, color: C.white, backgroundColor: C.blue, padding: "9px 24px", borderRadius: "8px", border: "none", cursor: "pointer", transition: "all 0.2s" }}>
                Comenzar
              </motion.button>
            </Magnet>
          </ClickSpark>
        </div>
      </motion.header>

      {/* ── HERO ── */}
      <section style={{ position: "relative", overflow: "hidden", backgroundColor: C.bg, minHeight: "90vh", display: "flex", alignItems: "center" }}>
        <Aurora colorStops={["#1063EF", "#070b14", "#0050EF", "#4782E5"]} amplitude={1.0} speed={0.3} style={{ opacity: 0.5 }} />

        {/* Subtle grid */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.02, backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "52px 52px" }} />

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 40px 80px", display: "flex", alignItems: "center", gap: "48px", position: "relative", zIndex: 1, width: "100%" }}>

          {/* Left */}
          <div style={{ flex: "0 0 460px" }}>
            {/* Main headline — SplitText */}
            <div style={{ marginBottom: "16px" }}>
              <SplitText
                text="Estudiá mejor."
                splitBy="chars"
                delay={18}
                duration={0.45}
                ease={[0.22, 1, 0.36, 1]}
                style={{
                  fontSize: "58px",
                  fontWeight: 900,
                  color: C.white,
                  fontFamily: "'Syne', sans-serif",
                  lineHeight: 1.0,
                  justifyContent: "flex-start",
                  marginBottom: "2px",
                }}
              />
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontSize: "58px",
                  fontWeight: 900,
                  color: C.blue,
                  fontFamily: "'Syne', sans-serif",
                  lineHeight: 1.0,
                  margin: 0,
                }}
              >
                Rendí al máximo
              </motion.p>
            </div>

            {/* Subtitle */}
            <FadeContent delay={0.7}>
              <p style={{ fontSize: "15px", color: C.gray, lineHeight: 1.75, margin: "18px 0 32px", maxWidth: "380px" }}>
                <ShinyText speed={8} style={{ color: C.gray }}>
                  Tus pruebas, tus tiempos, tu forma. Practicá con test personalizados y seguí tu progreso.
                </ShinyText>
              </p>
            </FadeContent>

            {/* CTAs */}
            <FadeContent delay={0.85}>
              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <ClickSpark sparkColor={C.blue} sparkCount={10}>
                  <Magnet magnetStrength={0.35} padding={18}>
                    <motion.button
                      whileHover={{ backgroundColor: C.blueHov, boxShadow: "0 0 28px rgba(16,99,239,0.5)" }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate("/signup")}
                      style={{
                        backgroundColor: C.blue, color: C.white, fontWeight: 700, fontSize: "14px",
                        padding: "12px 28px", borderRadius: "9px", border: "none", cursor: "pointer",
                        transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: "8px",
                      }}>
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
                  style={{
                    backgroundColor: "transparent", color: C.text, fontWeight: 600, fontSize: "14px",
                    padding: "12px 20px", borderRadius: "9px", border: "none",
                    cursor: "pointer", transition: "color 0.2s",
                    display: "inline-flex", alignItems: "center", gap: "8px",
                  }}>
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    border: `1.5px solid ${C.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                  </div>
                  Ver como funciona
                </motion.button>
              </div>
            </FadeContent>
          </div>

          {/* Right — Laptop */}
          <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
            <LaptopMockup />
          </div>
        </div>
      </section>

      {/* ── CARACTERÍSTICAS ── */}
      <section id="caracteristicas" style={{ backgroundColor: C.bg, padding: "80px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <FadeContent delay={0}>
            <div style={{ marginBottom: "48px" }}>
              <p style={{ fontSize: "13px", fontWeight: 700, color: C.blue, marginBottom: "10px" }}>
                Características
              </p>
              <h2 style={{ fontSize: "32px", fontWeight: 900, color: C.white, fontFamily: "'Syne', sans-serif" }}>
                Todo lo que necesitás para estudiar mejor
              </h2>
            </div>
          </FadeContent>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
            {caracteristicas.map((c, i) => (
              <FadeContent key={c.title} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(16,99,239,0.15)" }}
                  style={{
                    padding: "28px 22px",
                    background: "linear-gradient(145deg, #1063EF 0%, #0a4fd4 60%, #0840b8 100%)",
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.12)",
                    position: "relative", overflow: "hidden",
                    transition: "all 0.3s",
                    minHeight: "180px",
                  }}
                >
                  {/* Glow top right */}
                  <div style={{ position: "absolute", top: "-10px", right: "-10px", width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.08)", filter: "blur(16px)", pointerEvents: "none" }} />

                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{
                      width: "44px", height: "44px", borderRadius: "12px",
                      backgroundColor: "rgba(255,255,255,0.15)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      marginBottom: "16px",
                    }}>
                      {c.icon}
                    </div>
                    <h3 style={{ fontSize: "14px", fontWeight: 700, color: C.white, marginBottom: "8px", fontFamily: "'Syne', sans-serif" }}>{c.title}</h3>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)", lineHeight: 1.65 }}>{c.desc}</p>
                  </div>
                </motion.div>
              </FadeContent>
            ))}
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ── */}
      <section id="como-funciona" style={{ backgroundColor: C.bgSection, padding: "80px 40px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <FadeContent delay={0}>
            <p style={{ fontSize: "13px", fontWeight: 700, color: C.blue, marginBottom: "10px" }}>
              ¿Cómo funciona?
            </p>
          </FadeContent>

          <FadeContent delay={0.05}>
            <div style={{ marginBottom: "64px" }}>
              <h2 style={{
                fontSize: "36px",
                fontWeight: 900,
                color: C.white,
                fontFamily: "'Syne', sans-serif",
                margin: 0,
              }}>
                Así de simple
              </h2>
            </div>
          </FadeContent>

          <FadeContent delay={0.1}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", alignItems: "flex-start" }}>
              <Step
                num="1. Elegí tu materia"
                icon={
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="1.6">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                }
                title="Elegí tu materia"
                desc="Seleccioná la materia que querés practicar y el tema."
              />
              <Step
                num="2. Realizá la prueba"
                icon={
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="1.6">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                }
                title="Realizá la prueba"
                desc="Responde las preguntas y ponete a prueba tus conocimientos."
              />
              <Step
                num="3. Revisá tus resultados"
                icon={
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="1.6">
                    <polyline points="22 11.08 22 12 12 22 2 12 2.12 11.08"/>
                    <polyline points="22 11.08 12 2 2 11.08"/>
                    <line x1="12" y1="2" x2="12" y2="22"/>
                  </svg>
                }
                title="Revisá tus resultados"
                desc="Obtené tu puntaje, revisá tus errores y seguí mejorando."
                isLast
              />
            </div>
          </FadeContent>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ backgroundColor: C.bgSection, padding: "60px 40px 80px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <FadeContent delay={0}>
            <div style={{
              background: "linear-gradient(135deg, #0d1a35 0%, #0a1428 50%, #0d1a35 100%)",
              borderRadius: "20px",
              border: "1px solid rgba(16,99,239,0.25)",
              padding: "56px 64px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "40px",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 0 60px rgba(16,99,239,0.08), inset 0 0 80px rgba(16,99,239,0.04)",
            }}>
              {/* Aurora inside card */}
              <Aurora colorStops={["#0a3abf", "#0a1428", "#1063EF"]} amplitude={0.7} speed={0.25} style={{ opacity: 0.4, borderRadius: "20px" }} />

              {/* Dots decoration */}
              <div style={{ position: "absolute", top: "20px", right: "260px", opacity: 0.3 }}>
                {[0,1,2].map((row) => (
                  <div key={row} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    {[0,1,2,3].map((col) => (
                      <div key={col} style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: C.blue }} />
                    ))}
                  </div>
                ))}
              </div>

              {/* Left text */}
              <div style={{ position: "relative", zIndex: 1, maxWidth: "480px" }}>
                <h2 style={{ fontSize: "36px", fontWeight: 900, color: C.white, fontFamily: "'Syne', sans-serif", marginBottom: "14px", lineHeight: 1.2 }}>
                  ¿Listo para mejorar tus resultados?
                </h2>
                <p style={{ fontSize: "15px", color: C.gray, lineHeight: 1.7, marginBottom: "32px" }}>
                  Sumate a miles de estudiantes que ya están estudiando de manera más inteligente.
                </p>
                <ClickSpark sparkColor={C.blue} sparkCount={10}>
                  <Magnet magnetStrength={0.3} padding={16}>
                    <motion.button
                      whileHover={{ backgroundColor: C.blueHov, boxShadow: "0 0 28px rgba(16,99,239,0.5)" }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate("/signup")}
                      style={{
                        backgroundColor: C.blue, color: C.white, fontWeight: 700, fontSize: "14px",
                        padding: "12px 28px", borderRadius: "9px", border: "none", cursor: "pointer",
                        transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: "8px",
                      }}>
                      Comenzar ahora
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </motion.button>
                  </Magnet>
                </ClickSpark>
              </div>

              {/* Right — 3D Check */}
              <div style={{ position: "relative", zIndex: 1, flexShrink: 0 }}>
                {/* Outer glow rings */}
                <div style={{ position: "absolute", inset: "-30px", borderRadius: "50%", background: "radial-gradient(circle, rgba(16,99,239,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
                <div style={{ position: "relative" }}>
                  {/* Orbiting dots */}
                  {[0, 1, 2, 3].map((i) => {
                    const angle = (i / 4) * 360;
                    const rad = (angle * Math.PI) / 180;
                    const r = 90;
                    return (
                      <motion.div
                        key={i}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
                        style={{
                          position: "absolute",
                          top: "50%", left: "50%",
                          width: `${r * 2}px`, height: `${r * 2}px`,
                          marginTop: `-${r}px`, marginLeft: `-${r}px`,
                          borderRadius: "50%",
                          border: "1px dashed rgba(16,99,239,0.2)",
                        }}
                      >
                        <div style={{
                          position: "absolute",
                          top: 0, left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: "6px", height: "6px",
                          borderRadius: "50%",
                          backgroundColor: C.blue,
                          boxShadow: `0 0 8px ${C.blue}`,
                        }} />
                      </motion.div>
                    );
                  })}

                  <StarBorder color={C.blue} speed="4s" style={{ borderRadius: "50%" }}>
                    <div style={{
                      width: "140px", height: "140px", borderRadius: "50%",
                      background: "linear-gradient(135deg, rgba(16,99,239,0.3) 0%, rgba(16,99,239,0.1) 100%)",
                      border: "2px solid rgba(16,99,239,0.4)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 0 40px rgba(16,99,239,0.3), inset 0 0 30px rgba(16,99,239,0.1)",
                    }}>
                      <motion.svg
                        width="70" height="70" viewBox="0 0 24 24" fill="none"
                        stroke={C.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.4, ease: "easeInOut" }}
                      >
                        <motion.polyline points="20 6 9 17 4 12" />
                      </motion.svg>
                    </div>
                  </StarBorder>
                </div>
              </div>
            </div>
          </FadeContent>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ backgroundColor: C.bg, borderTop: `1px solid ${C.border}`, padding: "16px 40px" }}>
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