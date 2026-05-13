import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface Prueba {
  id: number;
  materia: string;
  escuela: string;
  año: string;
  profesor: string;
  tema: string;
}

const MOCK_PRUEBAS: Prueba[] = [
  { id: 1, materia: "Matemática", escuela: "ORT Almagro", año: "5to", profesor: "García", tema: "Integrales" },
  { id: 2, materia: "Química", escuela: "ORT Belgrano", año: "4to", profesor: "Rosenfeld", tema: "Estequiometría" },
  { id: 3, materia: "Historia", escuela: "Martín Buber", año: "3ro", profesor: "Levy", tema: "Segunda Guerra Mundial" },
  { id: 4, materia: "Inglés", escuela: "Wolfson", año: "5to", profesor: "Cohen", tema: "Conditional sentences" },
  { id: 5, materia: "Física", escuela: "Tarbut", año: "4to", profesor: "Mizrahi", tema: "Cinemática" },
  { id: 6, materia: "Biología", escuela: "ORT Almagro", año: "3ro", profesor: "Fernández", tema: "Genética" },
  { id: 7, materia: "Matemática", escuela: "Tarbut", año: "2do", profesor: "Sznajder", tema: "Trigonometría" },
  { id: 8, materia: "Literatura", escuela: "Martín Buber", año: "5to", profesor: "Goldberg", tema: "El túnel" },
  { id: 9, materia: "Química", escuela: "Wolfson", año: "5to", profesor: "Perelman", tema: "Equilibrio químico" },
  { id: 10, materia: "Historia", escuela: "ORT Almagro", año: "4to", profesor: "García", tema: "Revolución Francesa" },
  { id: 11, materia: "Inglés", escuela: "Tarbut", año: "3ro", profesor: "Smith", tema: "Present Perfect" },
  { id: 12, materia: "Biología", escuela: "Wolfson", año: "5to", profesor: "López", tema: "Evolución" },
];

const ESCUELAS = ["Todas", "ORT Almagro", "ORT Belgrano", "Martín Buber", "Wolfson", "Tarbut"];
const MATERIAS = ["Todas", "Matemática", "Química", "Física", "Historia", "Inglés", "Biología", "Literatura"];
const AÑOS = ["Todos", "1ro", "2do", "3ro", "4to", "5to"];

function PruebaCard({ prueba }: { prueba: Prueba }) {
  const [saved, setSaved] = useState(false);

  const materiaColors: Record<string, string> = {
    Matemática: "bg-blue-50 text-blue-700 border-blue-200",
    Química: "bg-green-50 text-green-700 border-green-200",
    Física: "bg-purple-50 text-purple-700 border-purple-200",
    Historia: "bg-orange-50 text-orange-700 border-orange-200",
    Inglés: "bg-pink-50 text-pink-700 border-pink-200",
    Biología: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Literatura: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ y: -3 }}
      className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${materiaColors[prueba.materia] || "bg-gray-100 text-gray-700"}`}>
          {prueba.materia}
        </span>
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setSaved(!saved)}
          className={`text-lg transition-colors ${saved ? "text-yellow-400" : "text-gray-300 hover:text-gray-400"}`}
        >
          {saved ? "★" : "☆"}
        </motion.button>
      </div>

      <h3 className="text-gray-900 font-bold text-sm mb-2">{prueba.tema}</h3>
      <p className="text-gray-600 text-xs mb-4">{prueba.profesor}</p>

      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-500">{prueba.escuela} · {prueba.año}</span>
        <button className="text-xs text-blue-600 font-bold hover:underline">Ver →</button>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [escuela, setEscuela] = useState("Todas");
  const [materia, setMateria] = useState("Todas");
  const [año, setAño] = useState("Todos");

  const q = search.toLowerCase();
  const filtered = MOCK_PRUEBAS.filter(
    (p) =>
      (search === "" ||
        p.tema.toLowerCase().includes(q) ||
        p.materia.toLowerCase().includes(q) ||
        p.profesor.toLowerCase().includes(q)) &&
      (escuela === "Todas" || p.escuela === escuela) &&
      (materia === "Todas" || p.materia === materia) &&
      (año === "Todos" || p.año === año)
  );

  return (
    <div className="min-h-screen bg-gray-50 font-dm-sans">
      {/* Navbar sticky */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            <motion.button onClick={() => navigate("/")} className="text-base font-black text-gray-900 font-syne hover:opacity-80">
              tuspruebas
            </motion.button>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-sm text-gray-700 hover:text-gray-900 font-medium">Mi perfil</button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="bg-gray-900 text-white text-sm font-bold px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              + Subir prueba
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-gray-900 mb-2 font-syne">Explorar pruebas</h1>
          <p className="text-sm text-gray-600">
            {filtered.length} prueba{filtered.length !== 1 ? "s" : ""} encontrada{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-10">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por tema, materia o profesor..."
              className="w-full bg-white border border-gray-300 rounded-lg pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
            />
          </div>

          <select
            value={escuela}
            onChange={(e) => setEscuela(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm cursor-pointer focus:outline-none focus:border-gray-400"
          >
            {ESCUELAS.map((e) => (
              <option key={e}>{e}</option>
            ))}
          </select>

          <select
            value={materia}
            onChange={(e) => setMateria(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm cursor-pointer focus:outline-none focus:border-gray-400"
          >
            {MATERIAS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>

          <select
            value={año}
            onChange={(e) => setAño(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm cursor-pointer focus:outline-none focus:border-gray-400"
          >
            {AÑOS.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </div>

        {/* Grid de pruebas */}
        {filtered.length > 0 ? (
          <motion.div layout className="grid grid-cols-4 gap-4">
            {filtered.map((p) => (
              <PruebaCard key={p.id} prueba={p} />
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <span className="text-8xl">📭</span>
            <p className="text-gray-900 font-bold text-lg">No hay pruebas que coincidan</p>
            <p className="text-gray-600 text-sm">Probá con otros filtros o sé el primero en subir una</p>
          </div>
        )}
      </div>
    </div>
  );
}