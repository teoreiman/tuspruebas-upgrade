import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Contexto {
  colegio: string;
  año: string;
  materia: string;
  profesor: string;
  tema: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const COLEGIOS = ["ORT Almagro", "ORT Belgrano", "Martín Buber", "Wolfson", "Tarbut"];
const AÑOS = ["7mo", "1ro", "2do", "3ro", "4to", "5to"];

const MATERIAS_POR_AÑO: Record<string, string[]> = {
  "7mo": ["Tecnología", "Matemática", "Lengua y Literatura", "Inglés", "Ciencias Sociales", "Ciencias Naturales", "Arte", "Hebreo"],
  "1ro": ["Arte", "Biología", "Tecnología", "Educación Judía", "Formación Ética y Ciudadana", "Geografía", "Historia", "Matemática", "Lengua y Literatura", "Inglés"],
  "2do": ["Arte", "Biología", "Educación Judía", "Tecnología", "Formación Ética y Ciudadana", "Geografía", "Historia", "Matemática", "Lengua y Literatura", "Inglés"],
  "3ro": ["Biología", "Cultura Judía", "Economía", "Educación Judía", "Físico-Química", "Formación Ética y Ciudadana", "Geografía", "Historia", "Lengua y Literatura", "Matemática", "Inglés"],
  "4to": ["Cultura Judía", "Educación Judía", "Inglés", "Geografía", "Formación Ética y Ciudadana", "Física", "Historia", "Lengua y Literatura", "Matemática"],
  "5to": ["Cultura Judía", "Educación Judía", "Matemática", "Filosofía", "Lengua y Literatura", "Química", "Marketing"],
};

const SUGERENCIAS: Record<string, string[]> = {
  default: [
    "Explicame este ejercicio paso a paso",
    "¿Qué temas entran en esta prueba?",
    "Haceme un resumen de los conceptos clave",
    "Generame ejercicios de práctica",
  ],
  Matemática: [
    "Resolvé este ejercicio paso a paso",
    "Explicame el concepto con un ejemplo",
    "Generame 5 ejercicios de práctica",
    "¿Cuáles son los errores más comunes?",
  ],
  Historia: [
    "Haceme una línea de tiempo",
    "Explicame las causas y consecuencias",
    "¿Qué personajes clave entran?",
    "Resumí este período histórico",
  ],
  Física: [
    "Resolvé este problema con fórmulas",
    "Explicame la teoría detrás de esto",
    "¿Qué unidades se usan?",
    "Generame ejercicios de práctica",
  ],
  Química: [
    "Balanceá esta ecuación química",
    "Explicame este proceso químico",
    "¿Qué elementos están involucrados?",
    "Resolvé este problema de estequiometría",
  ],
  Inglés: [
    "Corregí este texto en inglés",
    "Explicame esta estructura gramatical",
    "Traducí y analizá este párrafo",
    "Generame ejercicios de gramática",
  ],
};

// ── Gemini API call ────────────────────────────────────────────────────────────
// TODO: Manu conecta la API key real acá
async function callGeminiAPI(
  messages: Message[],
  contexto: Contexto,
  _apiKey: string = "YOUR_GEMINI_API_KEY"
): Promise<string> {
  const systemPrompt = `Sos un asistente educativo especializado para estudiantes de colegios judíos de Buenos Aires.

CONTEXTO DEL ESTUDIANTE:
- Colegio: ${contexto.colegio || "No especificado"}
- Año: ${contexto.año || "No especificado"}
- Materia: ${contexto.materia || "No especificada"}
- Profesor/a: ${contexto.profesor || "No especificado"}
- Tema: ${contexto.tema || "No especificado"}

TU ROL:
- Ayudás a resolver ejercicios de pruebas y exámenes
- Explicás conceptos de forma clara y adaptada al nivel del año
- Analizás y resumís contenido académico
- Generás ejercicios de práctica similares a los de las pruebas reales
- Siempre respondés en español argentino (usás "vos", "te", etc.)
- Cuando resolvés ejercicios, explicás el razonamiento paso a paso
- Adaptás el nivel de complejidad al año escolar del estudiante

IMPORTANTE:
- Si el estudiante comparte el texto de una prueba, la analizás en detalle
- Si pedís que generes ejercicios, los hacés similares al estilo de ${contexto.colegio}
- Siempre sos alentador y paciente
- Si no tenés contexto suficiente, pedí más información al estudiante`;

  // Simulación de respuesta — Manu reemplaza esto con la llamada real a Gemini
  // const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
  // const body = { contents: [...], systemInstruction: { parts: [{ text: systemPrompt }] } }
  // const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  // const data = await res.json();
  // return data.candidates[0].content.parts[0].text;

  // MOCK — eliminar cuando se conecte la API real
  await new Promise((r) => setTimeout(r, 1200));
  const lastMsg = messages[messages.length - 1].content.toLowerCase();

  if (lastMsg.includes("ejercicio") || lastMsg.includes("resolvé") || lastMsg.includes("resolver")) {
    return `Claro, te ayudo con eso${contexto.materia ? ` de ${contexto.materia}` : ""}.\n\n**Paso 1:** Primero identificamos los datos del problema...\n\n**Paso 2:** Aplicamos el concepto principal...\n\n**Paso 3:** Llegamos al resultado.\n\n¿Querés que profundice en algún paso en particular?`;
  }
  if (lastMsg.includes("resumen") || lastMsg.includes("resumí")) {
    return `Acá te hago un resumen de **${contexto.tema || "este tema"}**:\n\n• Concepto clave 1\n• Concepto clave 2\n• Concepto clave 3\n\nLos temas más importantes para la prueba suelen ser... ¿Querés que genere ejercicios de práctica?`;
  }
  if (lastMsg.includes("ejercicios") || lastMsg.includes("práctica")) {
    return `Te genero 3 ejercicios de práctica${contexto.materia ? ` de ${contexto.materia}` : ""}:\n\n**Ejercicio 1:** ...\n\n**Ejercicio 2:** ...\n\n**Ejercicio 3:** ...\n\n¿Querés que los resuelva o que genere más?`;
  }
  return `Entendido. Estoy listo para ayudarte${contexto.materia ? ` con ${contexto.materia}` : ""}${contexto.año ? ` de ${contexto.año}` : ""}. ¿Qué necesitás?`;
}

// ── Subcomponents ─────────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: "5px", alignItems: "center", padding: "14px 16px" }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
          style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#9ca3af" }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  // Simple markdown parser for bold (**text**)
  const parseContent = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      if (part.includes("\n")) {
        return (
          <span key={i}>
            {part.split("\n").map((line, j) => (
              <span key={j}>
                {line}
                {j < part.split("\n").length - 1 && <br />}
              </span>
            ))}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "16px",
      }}
    >
      {!isUser && (
        <div style={{
          width: "32px", height: "32px", borderRadius: "50%",
          backgroundColor: "#111",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginRight: "10px", flexShrink: 0, marginTop: "2px",
          fontSize: "14px",
        }}>
          ✦
        </div>
      )}

      <div style={{
        maxWidth: "72%",
        padding: "12px 16px",
        borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        backgroundColor: isUser ? "#111" : "#fff",
        color: isUser ? "#fff" : "#111",
        border: isUser ? "none" : "1px solid #e5e7eb",
        fontSize: "14px",
        lineHeight: 1.65,
        boxShadow: isUser ? "none" : "0 1px 4px rgba(0,0,0,0.05)",
      }}>
        {parseContent(message.content)}
        <div style={{
          fontSize: "10px",
          color: isUser ? "rgba(255,255,255,0.45)" : "#9ca3af",
          marginTop: "6px",
          textAlign: isUser ? "right" : "left",
        }}>
          {message.timestamp.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>

      {isUser && (
        <div style={{
          width: "32px", height: "32px", borderRadius: "50%",
          backgroundColor: "#f3f4f6",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginLeft: "10px", flexShrink: 0, marginTop: "2px",
          fontSize: "14px",
        }}>
          👤
        </div>
      )}
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function IA() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "¡Hola! Soy la IA de tusPruebas. Puedo ayudarte a resolver ejercicios, explicar conceptos, resumir temas y prepararte para tus pruebas. Configurá el contexto de la izquierda para que pueda ayudarte mejor.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [contexto, setContexto] = useState<Contexto>({
    colegio: "", año: "", materia: "", profesor: "", tema: "",
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const materias = contexto.año ? MATERIAS_POR_AÑO[contexto.año] ?? [] : [];
  const sugerencias = SUGERENCIAS[contexto.materia] ?? SUGERENCIAS.default;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const setCtx = (key: keyof Contexto, val: string) => {
    setContexto((prev) => {
      const updated = { ...prev, [key]: val };
      if (key === "año") updated.materia = "";
      return updated;
    });
  };

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      const response = await callGeminiAPI([...messages, userMsg], contexto);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Hubo un error al conectarme. Verificá tu conexión e intentá de nuevo.",
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
  };

  const clearChat = () => {
    setMessages([{
      id: "welcome-new",
      role: "assistant",
      content: "Chat limpiado. ¿En qué te puedo ayudar?",
      timestamp: new Date(),
    }]);
  };

  const contextoCompleto = contexto.colegio && contexto.año && contexto.materia;

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", fontFamily: "'DM Sans', sans-serif", backgroundColor: "#f9fafb" }}>

      {/* ── Navbar ── */}
      <nav style={{
        backgroundColor: "#fff", borderBottom: "1px solid #e5e7eb",
        padding: "0 24px", flexShrink: 0, zIndex: 40,
        position: "sticky", top: 0,
      }}>
        <div style={{ height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <motion.button
              onClick={() => navigate("/home")}
              whileHover={{ color: "#111" }}
              style={{ fontSize: "13px", color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}
            >
              ←
            </motion.button>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "8px",
                backgroundColor: "#111",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "13px", color: "#fff",
              }}>
                ✦
              </div>
              <span style={{ fontSize: "15px", fontWeight: 700, color: "#111", fontFamily: "'Syne', sans-serif" }}>
                IA tusPruebas
              </span>
            </div>
            {contextoCompleto && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0",
                  borderRadius: "999px", padding: "3px 10px",
                }}
              >
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#22c55e" }} />
                <span style={{ fontSize: "11px", color: "#15803d", fontWeight: 600 }}>
                  {contexto.materia} · {contexto.año} · {contexto.colegio}
                </span>
              </motion.div>
            )}
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <motion.button
              whileHover={{ backgroundColor: "#f3f4f6" }}
              onClick={clearChat}
              style={{
                fontSize: "12px", color: "#6b7280", fontWeight: 500,
                padding: "6px 12px", borderRadius: "8px",
                border: "1px solid #e5e7eb", backgroundColor: "#fff",
                cursor: "pointer",
              }}
            >
              Limpiar chat
            </motion.button>
            <motion.button
              whileHover={{ backgroundColor: "#f3f4f6" }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                fontSize: "12px", color: "#6b7280", fontWeight: 500,
                padding: "6px 12px", borderRadius: "8px",
                border: "1px solid #e5e7eb", backgroundColor: "#fff",
                cursor: "pointer",
              }}
            >
              {sidebarOpen ? "Ocultar contexto" : "Ver contexto"}
            </motion.button>
          </div>
        </div>
      </nav>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* ── Sidebar contexto ── */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              style={{
                flexShrink: 0,
                backgroundColor: "#fff",
                borderRight: "1px solid #e5e7eb",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <div style={{ padding: "24px 20px", minWidth: "260px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "20px" }}>
                  Contexto de estudio
                </p>

                {/* Colegio */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
                    Colegio
                  </label>
                  <select
                    value={contexto.colegio}
                    onChange={(e) => setCtx("colegio", e.target.value)}
                    style={{
                      width: "100%", padding: "9px 12px",
                      border: "1.5px solid #e5e7eb", borderRadius: "8px",
                      fontSize: "13px", color: contexto.colegio ? "#111" : "#9ca3af",
                      backgroundColor: "#fff", outline: "none",
                      cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    <option value="">Seleccioná colegio</option>
                    {COLEGIOS.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>

                {/* Año */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
                    Año
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
                    {AÑOS.map((a) => (
                      <motion.button
                        key={a}
                        onClick={() => setCtx("año", a)}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          padding: "8px 4px",
                          borderRadius: "8px",
                          border: `1.5px solid ${contexto.año === a ? "#111" : "#e5e7eb"}`,
                          backgroundColor: contexto.año === a ? "#111" : "#fff",
                          color: contexto.año === a ? "#fff" : "#374151",
                          fontSize: "12px", fontWeight: 600,
                          cursor: "pointer", transition: "all 0.15s",
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        {a}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Materia */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
                    Materia
                  </label>
                  {contexto.año ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      {materias.map((m) => (
                        <motion.button
                          key={m}
                          onClick={() => setCtx("materia", m)}
                          whileTap={{ scale: 0.98 }}
                          style={{
                            padding: "8px 12px",
                            borderRadius: "8px",
                            border: `1.5px solid ${contexto.materia === m ? "#111" : "#f3f4f6"}`,
                            backgroundColor: contexto.materia === m ? "#111" : "#f9fafb",
                            color: contexto.materia === m ? "#fff" : "#374151",
                            fontSize: "12px", fontWeight: contexto.materia === m ? 700 : 400,
                            cursor: "pointer", transition: "all 0.15s",
                            textAlign: "left", fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          {m}
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: "12px", color: "#9ca3af" }}>
                      Seleccioná un año primero
                    </p>
                  )}
                </div>

                {/* Profesor */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
                    Profesor/a
                  </label>
                  <input
                    type="text"
                    value={contexto.profesor}
                    onChange={(e) => setCtx("profesor", e.target.value)}
                    placeholder="Nombre del profesor"
                    style={{
                      width: "100%", padding: "9px 12px",
                      border: "1.5px solid #e5e7eb", borderRadius: "8px",
                      fontSize: "13px", color: "#111",
                      backgroundColor: "#fff", outline: "none",
                      boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#111")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
                  />
                </div>

                {/* Tema */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
                    Tema de la prueba
                  </label>
                  <input
                    type="text"
                    value={contexto.tema}
                    onChange={(e) => setCtx("tema", e.target.value)}
                    placeholder="Ej: Integrales, Segunda Guerra..."
                    style={{
                      width: "100%", padding: "9px 12px",
                      border: "1.5px solid #e5e7eb", borderRadius: "8px",
                      fontSize: "13px", color: "#111",
                      backgroundColor: "#fff", outline: "none",
                      boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#111")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
                  />
                </div>

                {/* Estado contexto */}
                <div style={{
                  padding: "12px",
                  borderRadius: "10px",
                  backgroundColor: contextoCompleto ? "#f0fdf4" : "#fafafa",
                  border: `1px solid ${contextoCompleto ? "#bbf7d0" : "#f3f4f6"}`,
                }}>
                  <p style={{ fontSize: "11px", fontWeight: 600, color: contextoCompleto ? "#15803d" : "#9ca3af", marginBottom: "6px" }}>
                    {contextoCompleto ? "✓ Contexto configurado" : "⚪ Completá el contexto"}
                  </p>
                  {[
                    { label: "Colegio", val: contexto.colegio },
                    { label: "Año", val: contexto.año },
                    { label: "Materia", val: contexto.materia },
                    { label: "Profesor", val: contexto.profesor },
                    { label: "Tema", val: contexto.tema },
                  ].map((row) => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                      <span style={{ fontSize: "11px", color: "#9ca3af" }}>{row.label}</span>
                      <span style={{ fontSize: "11px", fontWeight: 600, color: row.val ? "#374151" : "#d1d5db" }}>
                        {row.val || "—"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ── Chat area ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>

            {/* Sugerencias iniciales */}
            {messages.length === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{ marginBottom: "24px" }}
              >
                <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "10px", fontWeight: 500 }}>
                  Sugerencias
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {sugerencias.map((s) => (
                    <motion.button
                      key={s}
                      whileHover={{ backgroundColor: "#f3f4f6", borderColor: "#d1d5db" }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => sendMessage(s)}
                      style={{
                        padding: "8px 14px",
                        border: "1px solid #e5e7eb",
                        borderRadius: "999px",
                        backgroundColor: "#fff",
                        fontSize: "13px", color: "#374151",
                        cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                        transition: "all 0.15s",
                      }}
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Messages */}
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {/* Typing indicator */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ display: "flex", alignItems: "flex-start", marginBottom: "16px" }}
                >
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "50%",
                    backgroundColor: "#111",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginRight: "10px", flexShrink: 0,
                    fontSize: "14px", color: "#fff",
                  }}>
                    ✦
                  </div>
                  <div style={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "18px 18px 18px 4px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                  }}>
                    <TypingIndicator />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>

          {/* ── Input area ── */}
          <div style={{
            borderTop: "1px solid #e5e7eb",
            backgroundColor: "#fff",
            padding: "16px 32px 20px",
          }}>
            {/* Sugerencias rápidas en el chat */}
            {messages.length > 1 && (
              <div style={{ display: "flex", gap: "6px", marginBottom: "12px", overflowX: "auto", paddingBottom: "4px" }}>
                {sugerencias.slice(0, 3).map((s) => (
                  <motion.button
                    key={s}
                    whileHover={{ backgroundColor: "#f3f4f6" }}
                    onClick={() => sendMessage(s)}
                    style={{
                      padding: "5px 12px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "999px",
                      backgroundColor: "#fff",
                      fontSize: "12px", color: "#6b7280",
                      cursor: "pointer", whiteSpace: "nowrap",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            )}

            <div style={{
              display: "flex", gap: "10px", alignItems: "flex-end",
              backgroundColor: "#f9fafb",
              border: "1.5px solid #e5e7eb",
              borderRadius: "14px",
              padding: "10px 14px",
              transition: "border-color 0.2s",
            }}
              onFocus={() => {}}
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder={contextoCompleto
                  ? `Preguntá sobre ${contexto.materia}...`
                  : "Pegá el texto de tu prueba o hacé una pregunta..."}
                rows={1}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  resize: "none",
                  fontSize: "14px",
                  color: "#111",
                  backgroundColor: "transparent",
                  fontFamily: "'DM Sans', sans-serif",
                  lineHeight: 1.6,
                  maxHeight: "140px",
                }}
              />

              <motion.button
                whileHover={{ scale: input.trim() ? 1.05 : 1 }}
                whileTap={{ scale: input.trim() ? 0.95 : 1 }}
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                style={{
                  width: "36px", height: "36px",
                  borderRadius: "10px",
                  backgroundColor: input.trim() && !loading ? "#111" : "#e5e7eb",
                  border: "none",
                  cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                  transition: "background-color 0.15s",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={input.trim() && !loading ? "#fff" : "#9ca3af"} strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </motion.button>
            </div>

            <p style={{ fontSize: "11px", color: "#d1d5db", textAlign: "center", marginTop: "10px" }}>
              Enter para enviar · Shift+Enter para nueva línea
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}