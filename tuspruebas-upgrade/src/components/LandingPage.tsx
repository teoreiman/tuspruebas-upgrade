import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BlurText from "../../reactBits/Blurtext";
import FadeContent from "../../reactBits/Fadecontent";

// ── Book Icon ─────────────────────────────────────────────────────────────────
function BookIcon({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

// ── File Icon ─────────────────────────────────────────────────────────────────
function FileIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

// ── Wave Background ───────────────────────────────────────────────────────────
function WaveBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute left-0 top-0 h-full opacity-25" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" style={{ width: "38%" }}>
        <defs>
          <linearGradient id="waveGradL" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#b0b0b0" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#b0b0b0" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M-50,50 Q100,150 -30,250 Q-100,330 50,400 Q150,450 80,500" stroke="url(#waveGradL)" strokeWidth="70" fill="none" />
        <path d="M-80,0 Q80,120 -50,230 Q-120,310 30,390 Q120,440 60,500" stroke="url(#waveGradL)" strokeWidth="45" fill="none" opacity="0.5" />
        <path d="M-30,80 Q120,180 0,280 Q-80,350 70,430" stroke="url(#waveGradL)" strokeWidth="28" fill="none" opacity="0.3" />
      </svg>

      <svg className="absolute right-0 top-0 h-full opacity-25" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" style={{ width: "38%" }}>
        <defs>
          <linearGradient id="waveGradR" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#b0b0b0" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#b0b0b0" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M350,50 Q200,150 330,250 Q400,330 250,400 Q150,450 220,500" stroke="url(#waveGradR)" strokeWidth="70" fill="none" />
        <path d="M380,0 Q220,120 350,230 Q420,310 270,390 Q180,440 240,500" stroke="url(#waveGradR)" strokeWidth="45" fill="none" opacity="0.5" />
        <path d="M330,80 Q180,180 300,280 Q380,350 230,430" stroke="url(#waveGradR)" strokeWidth="28" fill="none" opacity="0.3" />
      </svg>
    </div>
  );
}

// ── Year Card ─────────────────────────────────────────────────────────────────
function YearCard({ number, label, onClick }: { number: string; label: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        flex flex-col items-center justify-center gap-1.5
        border-2 rounded-2xl w-full
        transition-all duration-200
        ${hovered ? "border-gray-800 bg-gray-50 shadow-md scale-[1.03]" : "border-gray-300 bg-white shadow-sm"}
      `}
      style={{ paddingTop: "22px", paddingBottom: "22px" }}
    >
      <span className="text-4xl font-black text-gray-900 leading-none" style={{ fontFamily: "'Syne', sans-serif" }}>
        {number}
      </span>
      <span className="text-xs font-semibold text-gray-400 tracking-wide">
        {label}
      </span>
    </button>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();

  const years = [
    { number: "7", label: "7° grado" },
    { number: "1", label: "1° Año" },
    { number: "2", label: "2° Año" },
    { number: "3", label: "3° Año" },
    { number: "4", label: "4° Año" },
    { number: "5", label: "5° Año" },
  ];

  const navLinks = ["Inicio", "Materias", "Subir pruebas"];

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Navbar ── */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookIcon size={26} className="text-gray-900" />
            <span className="text-lg font-black text-gray-900 tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
              tuspruebas
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((item) => (
              <button
                key={item}
                onClick={() => item === "Subir pruebas" ? navigate("/home") : undefined}
                className="text-sm text-gray-700 hover:text-gray-900 font-medium transition-colors duration-150"
              >
                {item}
              </button>
            ))}
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-gray-700 hover:text-gray-900 font-medium transition-colors duration-150"
            >
              Iniciar sesión
            </button>
          </nav>

          <button
            className="md:hidden text-sm font-semibold text-gray-700 border border-gray-300 px-3 py-1.5 rounded-lg"
            onClick={() => navigate("/login")}
          >
            Iniciar sesión
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative bg-white py-14 px-6 text-center overflow-hidden border-b border-gray-100">
        <WaveBackground />
        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-3">
          <BookIcon size={52} className="text-gray-800 mb-1" />
          <BlurText
            text="Bienvenido a tusPruebas"
            className="text-4xl md:text-[2.8rem] font-black text-gray-900 leading-tight justify-center"
            animateBy="words"
            delay={80}
          />
          <p className="text-sm text-gray-500 font-medium">
            encontra todas las pruebas que necesites
          </p>
        </div>
      </section>

      {/* ── Year Selector ── */}
      <section className="py-12 px-6 bg-white border-b border-gray-100">
        <FadeContent className="max-w-lg mx-auto text-center">
          <h2 className="text-lg font-black text-gray-900 mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
            ¿De que año sos?
          </h2>
          <p className="text-xs text-gray-400 mb-8">
            Elige tu año para ver las pruebas disponibles
          </p>

          <div className="grid grid-cols-3 gap-3">
            {years.map((y) => (
              <YearCard
                key={y.number}
                number={y.number}
                label={y.label}
                onClick={() => navigate("/home")}
              />
            ))}
          </div>
        </FadeContent>
      </section>

      {/* ── About ── */}
      <section className="py-16 px-6 bg-white text-center flex-1">
        <FadeContent delay={0.1} className="max-w-md mx-auto flex flex-col items-center gap-6">
          <h2 className="text-xl font-black text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>
            ¿Que es tusPruebas?
          </h2>

          <p className="text-sm text-gray-500 leading-relaxed">
            Somos una plataforma donde estudiantes comparten exámenes reales de todas las
            materias y años de la secundaria, para ayudarte a estudiar mejor y practicar
          </p>

          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-3 text-white font-bold text-base px-10 py-4 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-lg w-full max-w-xs justify-center"
            style={{
              background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
              borderBottom: "3px solid #6366f1",
            }}
          >
            <FileIcon />
            Explorar pruebas
          </button>
        </FadeContent>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200 py-5 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-6 md:gap-14">
          {["Sobre nosotros", "Contactanos", "Preguntas frecuentes", "Terminos y condiciones"].map((item) => (
            <button
              key={item}
              className="text-xs text-gray-500 hover:text-gray-900 transition-colors duration-150"
            >
              {item}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}