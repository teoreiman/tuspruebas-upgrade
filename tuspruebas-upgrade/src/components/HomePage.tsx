import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Prueba {
  id: number;
  materia: string;
  escuela: string;
  año: string;
  profesor: string;
  tema: string;
  año_lectivo: number;
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_PRUEBAS: Prueba[] = [
  { id: 1, materia: "Matemática", escuela: "ORT Almagro", año: "5to", profesor: "García", tema: "Integrales", año_lectivo: 2024 },
  { id: 2, materia: "Química", escuela: "ORT Belgrano", año: "4to", profesor: "Rosenfeld", tema: "Estequiometría", año_lectivo: 2024 },
  { id: 3, materia: "Historia", escuela: "Martín Buber", año: "3ro", profesor: "Levy", tema: "Segunda Guerra Mundial", año_lectivo: 2023 },
  { id: 4, materia: "Inglés", escuela: "Wolfson", año: "5to", profesor: "Cohen", tema: "Conditional sentences", año_lectivo: 2024 },
  { id: 5, materia: "Física", escuela: "Tarbut", año: "4to", profesor: "Mizrahi", tema: "Cinemática", año_lectivo: 2023 },
  { id: 6, materia: "Biología", escuela: "ORT Almagro", año: "3ro", profesor: "Fernández", tema: "Genética", año_lectivo: 2024 },
  { id: 7, materia: "Matemática", escuela: "Tarbut", año: "2do", profesor: "Sznajder", tema: "Trigonometría", año_lectivo: 2023 },
  { id: 8, materia: "Literatura", escuela: "Martín Buber", año: "5to", profesor: "Goldberg", tema: "El túnel", año_lectivo: 2024 },
  { id: 9, materia: "Química", escuela: "Wolfson", año: "5to", profesor: "Perelman", tema: "Equilibrio químico", año_lectivo: 2023 },
];

const ESCUELAS = ["Todas", "ORT Almagro", "ORT Belgrano", "Martín Buber", "Wolfson", "Tarbut"];
const MATERIAS = ["Todas", "Matemática", "Química", "Física", "Historia", "Inglés", "Biología", "Literatura"];
const AÑOS = ["Todos", "7mo", "1ro", "2do", "3ro", "4to", "5to"];

// ── Prueba Card ───────────────────────────────────────────────────────────────
function PruebaCard({ prueba }: { prueba: Prueba }) {
  const [saved, setSaved] = useState(false);

  const materiaColors: Record<string, string> = {
    Matemática: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Química: "bg-green-500/10 text-green-400 border-green-500/20",
    Física: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    Historia: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    Inglés: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    Biología: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Literatura: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };

  const colorClass = materiaColors[prueba.materia] ?? "bg-tp-yellow/10 text-tp-yellow border-tp-yellow/20";

  return (
    <div className="group bg-tp-card border border-white/8 rounded-2xl p-5 hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${colorClass}`}>
          {prueba.materia}
        </span>
        <button
          onClick={() => setSaved((s) => !s)}
          className={`text-lg transition-all duration-200 hover:scale-110 ${saved ? "text-tp-yellow" : "text-white/20 hover:text-white/50"}`}
          title={saved ? "Quitar de favoritos" : "Guardar"}
        >
          {saved ? "★" : "☆"}
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5">
        <h3 className="text-white font-bold text-base leading-snug">{prueba.tema}</h3>
        <p className="text-tp-gray text-sm">{prueba.profesor}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-white/6">
        <div className="flex items-center gap-2 text-xs text-white/40">
          <span>{prueba.escuela}</span>
          <span>·</span>
          <span>{prueba.año}</span>
          <span>·</span>
          <span>{prueba.año_lectivo}</span>
        </div>
        <button className="text-xs text-tp-yellow font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:underline">
          Ver →
        </button>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [escuela, setEscuela] = useState("Todas");
  const [materia, setMateria] = useState("Todas");
  const [año, setAño] = useState("Todos");

  const filtered = MOCK_PRUEBAS.filter((p) => {
    const matchSearch =
      search === "" ||
      p.tema.toLowerCase().includes(search.toLowerCase()) ||
      p.materia.toLowerCase().includes(search.toLowerCase()) ||
      p.profesor.toLowerCase().includes(search.toLowerCase());
    const matchEscuela = escuela === "Todas" || p.escuela === escuela;
    const matchMateria = materia === "Todas" || p.materia === materia;
    const matchAño = año === "Todos" || p.año === año;
    return matchSearch && matchEscuela && matchMateria && matchAño;
  });

  const selectClass =
    "bg-tp-card border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 focus:outline-none focus:border-tp-yellow/40 transition-colors duration-200 cursor-pointer";

  return (
    <div className="min-h-screen bg-tp-bg text-white">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-40 bg-tp-bg/90 backdrop-blur-md border-b border-white/8 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="text-tp-yellow font-black text-xl tracking-tight"
          >
            tus<span className="text-white">Pruebas</span>
          </button>

          <div className="flex items-center gap-3">
            <button className="text-tp-gray hover:text-white text-sm transition-colors duration-200 px-3 py-1.5 rounded-lg hover:bg-white/5">
              Mi perfil
            </button>
            <button className="bg-tp-yellow text-tp-bg text-sm font-bold px-4 py-1.5 rounded-lg hover:bg-yellow-300 transition-colors duration-200">
              + Subir prueba
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* ── Header ── */}
        <div className="mb-10">
          <h1 className="text-3xl font-black mb-1">Explorar pruebas</h1>
          <p className="text-tp-gray text-sm">
            {filtered.length} prueba{filtered.length !== 1 ? "s" : ""} encontrada{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por tema, materia o profesor..."
              className="w-full bg-tp-card border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-tp-yellow/40 transition-colors duration-200"
            />
          </div>

          {/* Selects */}
          <select value={escuela} onChange={(e) => setEscuela(e.target.value)} className={selectClass}>
            {ESCUELAS.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>

          <select value={materia} onChange={(e) => setMateria(e.target.value)} className={selectClass}>
            {MATERIAS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>

          <select value={año} onChange={(e) => setAño(e.target.value)} className={selectClass}>
            {AÑOS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        {/* ── Grid ── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <PruebaCard key={p.id} prueba={p} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <span className="text-5xl">📭</span>
            <p className="text-white font-bold text-lg">No hay pruebas que coincidan</p>
            <p className="text-tp-gray text-sm">Probá con otros filtros o sé el primero en subir una.</p>
            <button className="mt-2 bg-tp-yellow text-tp-bg font-bold text-sm px-6 py-2.5 rounded-lg hover:bg-yellow-300 transition-colors duration-200">
              + Subir prueba
            </button>
          </div>
        )}
      </div>
    </div>
  );
}