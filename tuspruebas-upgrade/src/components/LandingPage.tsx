import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Animated Counter ──────────────────────────────────────────────────────────
function Counter({ end, label }: { end: number; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const duration = 1800;
          const step = Math.ceil(end / (duration / 16));
          const timer = setInterval(() => {
            start += step;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, 16);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-1">
      <span className="text-5xl font-black text-tp-yellow tabular-nums">
        {count.toLocaleString()}+
      </span>
      <span className="text-sm text-tp-gray uppercase tracking-widest">{label}</span>
    </div>
  );
}

// ── Floating pill ─────────────────────────────────────────────────────────────
function FloatingPill({
  text,
  delay,
  top,
  left,
  right,
}: {
  text: string;
  delay: string;
  top?: string;
  left?: string;
  right?: string;
}) {
  return (
    <div
      className="absolute hidden lg:flex items-center gap-2 bg-tp-card border border-white/10 rounded-full px-4 py-2 text-xs text-tp-gray shadow-lg animate-float"
      style={{ animationDelay: delay, top, left, right }}
    >
      <span className="w-2 h-2 rounded-full bg-tp-yellow inline-block" />
      {text}
    </div>
  );
}

// ── School Badge ──────────────────────────────────────────────────────────────
function SchoolBadge({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 bg-tp-card border border-white/8 rounded-lg px-4 py-3 text-sm text-white/70 hover:border-tp-yellow/40 hover:text-white transition-all duration-300 cursor-default">
      <span className="text-tp-yellow text-base">◆</span>
      {name}
    </div>
  );
}

// ── Feature Card ──────────────────────────────────────────────────────────────
function FeatureCard({
  title,
  desc,
  delay,
}: {
  title: string;
  desc: string;
  delay: string;
}) {
  return (
    <div
      className="group relative bg-tp-card border border-white/8 rounded-2xl p-6 hover:border-tp-yellow/30 transition-all duration-500 hover:-translate-y-1 animate-fade-up"
      style={{ animationDelay: delay }}
    >
      <div className="w-12 h-12 rounded-xl bg-tp-yellow/10 flex items-center justify-center text-2xl mb-4 group-hover:bg-tp-yellow/20 transition-colors duration-300">
      </div>
      <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
      <p className="text-tp-gray text-sm leading-relaxed">{desc}</p>
      <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-tp-yellow/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const schools = ["ORT Almagro", "ORT Belgrano", "Martín Buber", "Wolfson", "Tarbut"];

  const features = [
    {
      title: "Buscá por materia",
      desc: "Filtrá pruebas por escuela, año, materia y profesor en segundos.",
      delay: "0ms",
    },
    {
      title: "Subí tu prueba",
      desc: "Colaborá con la comunidad cargando exámenes que ya rendiste.",
      delay: "80ms",
    },
    {
      title: "IA integrada",
      desc: "Generá nuevas pruebas o resolvé ejercicios con inteligencia artificial contextualizada.",
      delay: "160ms",
    },
    {
      title: "Guardá favoritas",
      desc: "Marcá las pruebas que más te sirven y accedé a ellas desde tu perfil.",
      delay: "240ms",
    },
    {
      title: "5 colegios",
      desc: "Material organizado de ORT, Buber, Wolfson y Tarbut en un solo lugar.",
      delay: "320ms",
    },
    {
      title: "Contenido verificado",
      desc: "Cada prueba pasa por moderación antes de publicarse.",
      delay: "400ms",
    },
  ];

  return (
    <div className="min-h-screen bg-tp-bg text-white overflow-x-hidden">
      {/* ── Navbar ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-tp-bg/90 backdrop-blur-md border-b border-white/8 py-3"
            : "py-5"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-tp-yellow font-black text-xl tracking-tight">
              tus<span className="text-white">Pruebas</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="text-tp-gray hover:text-white text-sm transition-colors duration-200 px-4 py-2"
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="bg-tp-yellow text-tp-bg text-sm font-bold px-5 py-2 rounded-lg hover:bg-yellow-300 transition-colors duration-200"
            >
              Registrarse
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-tp-yellow/6 blur-[120px]" />
          <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] rounded-full bg-blue-500/4 blur-[100px]" />
        </div>

        {/* Grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Floating pills */}
        <FloatingPill text="Química · ORT Almagro" delay="0s" top="22%" left="5%" />
        <FloatingPill text="Historia · Tarbut" delay="0.4s" top="30%" right="4%" />
        <FloatingPill text="Matemática · Wolfson" delay="0.8s" top="65%" left="3%" />
        <FloatingPill text="Inglés · Martín Buber" delay="1.2s" top="70%" right="5%" />

        {/* Badge */}
        <div className="animate-fade-up mb-6 flex items-center gap-2 bg-tp-yellow/10 border border-tp-yellow/20 rounded-full px-4 py-1.5 text-xs text-tp-yellow font-semibold tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-tp-yellow animate-pulse" />
          BETA · Colegios judíos de Buenos Aires
        </div>

        {/* Headline */}
        <h1
          className="animate-fade-up text-center font-black leading-[1.05] mb-6 max-w-4xl"
          style={{ animationDelay: "80ms", fontSize: "clamp(2.8rem, 6vw, 5rem)" }}
        >
          Todas las pruebas.
          <br />
          <span className="text-tp-yellow">Un solo lugar.</span>
        </h1>

        {/* Subheadline */}
        <p
          className="animate-fade-up text-center text-tp-gray text-lg max-w-2xl mb-10 leading-relaxed"
          style={{ animationDelay: "160ms" }}
        >
          tusPruebas centraliza exámenes de años anteriores de los principales colegios judíos
          de Buenos Aires. Buscá, filtrá y preparate mejor para cada evaluación.
        </p>

        {/* CTA */}
        <div
          className="animate-fade-up flex flex-col sm:flex-row gap-4"
          style={{ animationDelay: "240ms" }}
        >
          <button
            onClick={() => navigate("/signup")}
            className="group relative bg-tp-yellow text-tp-bg font-black text-base px-8 py-4 rounded-xl hover:bg-yellow-300 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Empezar gratis
            <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform duration-200">→</span>
          </button>
          <button
            onClick={() => navigate("/home")}
            className="border border-white/15 text-white font-semibold text-base px-8 py-4 rounded-xl hover:border-white/30 hover:bg-white/5 transition-all duration-200"
          >
            Ver pruebas
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-xs text-tp-gray tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-tp-gray to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-20 px-6 border-y border-white/6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
          <Counter end={5} label="Colegios" />
          <Counter end={500} label="Pruebas" />
          <Counter end={12} label="Materias" />
          <Counter end={8} label="Años" />
        </div>
      </section>

      {/* ── Schools ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3">Colegios disponibles</h2>
            <p className="text-tp-gray">Material organizado por institución, año y materia.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {schools.map((s) => (
              <SchoolBadge key={s} name={s} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 px-6 bg-tp-card/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black mb-3">Todo lo que necesitás</h2>
            <p className="text-tp-gray">Diseñado para estudiantes que quieren prepararse en serio.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-tp-yellow/8 blur-[100px]" />
        </div>
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-5 leading-tight">
            ¿Listo para rendir<br />
            <span className="text-tp-yellow">con ventaja</span>?
          </h2>
          <p className="text-tp-gray mb-10 text-lg">
            Unite a la comunidad y accedé a cientos de pruebas al instante.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="bg-tp-yellow text-tp-bg font-black text-lg px-10 py-4 rounded-xl hover:bg-yellow-300 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Crear cuenta gratis →
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/8 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-tp-yellow font-black text-lg">
            tus<span className="text-white">Pruebas</span>
          </span>
          <p className="text-tp-gray text-sm">
            Hecho por Teo, Fede y Manu · 5to año 2026
          </p>
        </div>
      </footer>
    </div>
  );
}