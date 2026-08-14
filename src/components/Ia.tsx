import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { enviarMensajeIA } from "../services/Ia";
import { fetchPrueba, type Prueba } from "../services/Pruebas";
import {
  listarConversaciones, obtenerConversacion, eliminarConversacion,
  type ConversacionResumen,
} from "../services/Conversaciones";
import Logo from "./logo";

const C = {
  bg:       "#0a0e1a",
  bgCard:   "#111827",
  bgSection:"#0d1120",
  border:   "rgba(255,255,255,0.07)",
  borderMid:"rgba(255,255,255,0.12)",
  blue:     "#1063EF",
  blueHov:  "#0050EF",
  white:    "#ffffff",
  text:     "#E8E8E8",
  gray:     "#8A8A8A",
  grayDim:  "rgba(255,255,255,0.2)",
};

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

// Cuando se entra desde una prueba concreta, las sugerencias apuntan a resolverla.
const SUGERENCIAS_PRUEBA = [
  "Resolvé toda la prueba paso a paso",
  "Explicame la primera consigna",
  "¿Qué temas tengo que estudiar para esta prueba?",
  "Generame una prueba de práctica parecida",
];

// ── Subcomponents ─────────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: "5px", alignItems: "center", padding: "14px 16px" }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
          style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: C.gray }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

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
      style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: "16px" }}
    >
      {!isUser && (
        <div style={{
          width: "32px", height: "32px", borderRadius: "50%",
          backgroundColor: "rgba(16,99,239,0.15)",
          border: `1px solid rgba(16,99,239,0.3)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginRight: "10px", flexShrink: 0, marginTop: "2px",
          fontSize: "13px", color: C.blue,
        }}>
          ✦
        </div>
      )}

      <div style={{
        maxWidth: "72%",
        padding: "12px 16px",
        borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        backgroundColor: isUser ? C.blue : C.bgCard,
        color: C.white,
        border: isUser ? "none" : `1px solid ${C.border}`,
        fontSize: "14px",
        lineHeight: 1.65,
        boxShadow: isUser ? "0 4px 16px rgba(16,99,239,0.25)" : "none",
      }}>
        {parseContent(message.content)}
        <div style={{
          fontSize: "10px",
          color: isUser ? "rgba(255,255,255,0.5)" : C.gray,
          marginTop: "6px",
          textAlign: isUser ? "right" : "left",
        }}>
          {message.timestamp.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>

      {isUser && (
        <div style={{
          width: "32px", height: "32px", borderRadius: "50%",
          backgroundColor: C.bgCard,
          border: `1px solid ${C.border}`,
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
const MENSAJE_BIENVENIDA =
  "¡Hola! Soy la IA de tusPruebas. Puedo ayudarte a resolver ejercicios, explicar conceptos, resumir temas y prepararte para tus pruebas. Configurá el contexto de la izquierda para que pueda ayudarte mejor.";

export default function IA() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pruebaIdParam = Number(searchParams.get("prueba"));
  const pruebaId = Number.isInteger(pruebaIdParam) && pruebaIdParam > 0 ? pruebaIdParam : null;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: MENSAJE_BIENVENIDA,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [contexto, setContexto] = useState<Contexto>({
    colegio: "",
    año: searchParams.get("año") || "",
    materia: searchParams.get("materia") || "",
    profesor: "",
    tema: "",
  });
  const [prueba, setPrueba] = useState<Prueba | null>(null);
  const [cargandoPrueba, setCargandoPrueba] = useState(!!pruebaId);
  const [errorPrueba, setErrorPrueba] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ── Historial de chats (como Claude/ChatGPT): se guarda solo en el backend,
  // acá solo mantenemos la lista para mostrarla y saber cuál está abierto. ──
  const [historialOpen, setHistorialOpen] = useState(true);
  const [historial, setHistorial] = useState<ConversacionResumen[]>([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(true);
  const [conversacionId, setConversacionId] = useState<number | null>(null);
  const [cargandoConversacion, setCargandoConversacion] = useState(false);
  const [imagenAbierta, setImagenAbierta] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const materias = contexto.año ? MATERIAS_POR_AÑO[contexto.año] ?? [] : [];
  const sugerencias = prueba
    ? SUGERENCIAS_PRUEBA
    : SUGERENCIAS[contexto.materia] ?? SUGERENCIAS.default;

  // Si venimos desde una prueba ("Resolver con IA"), la cargamos para llenar el
  // contexto. El backend además le adjunta la foto y las preguntas al modelo.
  useEffect(() => {
    if (!pruebaId) {
      setPrueba(null);
      setCargandoPrueba(false);
      return;
    }
    let cancelado = false;
    setCargandoPrueba(true);
    setErrorPrueba("");
    fetchPrueba(pruebaId)
      .then((p) => {
        if (cancelado) return;
        setPrueba(p);
        setContexto({
          colegio: p.escuela || "",
          año: p.año || "",
          materia: p.materia || "",
          profesor: p.profesor || "",
          tema: p.tema || "",
        });
        setMessages([
          {
            id: "welcome-prueba",
            role: "assistant",
            content: `Ya tengo cargada la prueba de **${p.materia || "esta materia"}**${p.tema ? ` sobre **${p.tema}**` : ""}${p.profesor ? ` (Prof. ${p.profesor})` : ""}.\n\n${p.archivo_tipo === "image" ? "Puedo ver la foto de la prueba" : p.preguntas ? "Tengo las preguntas que subieron" : "Tengo los datos de la prueba"}, así que preguntame lo que quieras: te la resuelvo paso a paso, te explico un tema o te armo ejercicios de práctica.`,
            timestamp: new Date(),
          },
        ]);
      })
      .catch((e) => {
        if (cancelado) return;
        setErrorPrueba(e instanceof Error ? e.message : "No se pudo cargar la prueba");
      })
      .finally(() => {
        if (!cancelado) setCargandoPrueba(false);
      });
    return () => { cancelado = true; };
  }, [pruebaId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const refrescarHistorial = useCallback(async () => {
    try {
      const lista = await listarConversaciones();
      setHistorial(lista);
    } catch {
      // El historial es un extra, no algo que deba tirar abajo el chat si falla.
    }
  }, []);

  useEffect(() => {
    setCargandoHistorial(true);
    refrescarHistorial().finally(() => setCargandoHistorial(false));
  }, [refrescarHistorial]);

  // Arranca un chat en blanco. Si hay una prueba cargada (vinimos desde
  // "Abrir IA →"), la mantiene; si no, también borra ese contexto.
  const iniciarChatNuevo = (mantenerPrueba: boolean) => {
    setConversacionId(null);
    setImagenAbierta(false);
    if (mantenerPrueba && prueba) {
      setMessages([{
        id: "welcome-prueba",
        role: "assistant",
        content: `Segimos con la prueba de ${prueba.materia}${prueba.tema ? ` sobre ${prueba.tema}` : ""} cargada. ¿En qué te ayudo?`,
        timestamp: new Date(),
      }]);
    } else {
      setPrueba(null);
      setContexto({ colegio: "", año: "", materia: "", profesor: "", tema: "" });
      setMessages([{ id: "welcome-new", role: "assistant", content: MENSAJE_BIENVENIDA, timestamp: new Date() }]);
    }
  };

  const abrirConversacion = async (id: number) => {
    if (id === conversacionId || cargandoConversacion) return;
    setImagenAbierta(false);
    setCargandoConversacion(true);
    try {
      const conv = await obtenerConversacion(id);
      setConversacionId(conv.id);
      setContexto(conv.contexto);
      setMessages(
        conv.mensajes.length
          ? conv.mensajes.map((m) => ({
              id: `msg-${m.id}`,
              role: m.role,
              content: m.content,
              timestamp: new Date(m.createdAt),
            }))
          : [{ id: "welcome", role: "assistant", content: MENSAJE_BIENVENIDA, timestamp: new Date() }]
      );
      if (conv.pruebaId) {
        fetchPrueba(conv.pruebaId).then(setPrueba).catch(() => setPrueba(null));
      } else {
        setPrueba(null);
      }
    } catch (e) {
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: e instanceof Error ? e.message : "No se pudo abrir esa conversación.",
        timestamp: new Date(),
      }]);
    } finally {
      setCargandoConversacion(false);
    }
  };

  const borrarConversacion = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("¿Borrar esta conversación? No se puede deshacer.")) return;
    try {
      await eliminarConversacion(id);
      setHistorial((prev) => prev.filter((c) => c.id !== id));
      if (id === conversacionId) iniciarChatNuevo(false);
    } catch {
      // Si falla el borrado, el chat se queda en la lista tal como estaba: no
      // hace falta un manejo especial más allá de no romper la UI.
    }
  };

  const setCtx = (key: keyof Contexto, val: string) => {
    setContexto((prev) => {
      const updated = { ...prev, [key]: val };
      if (key === "año") updated.materia = "";
      return updated;
    });
  };

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading || cargandoConversacion) return;

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
      // El mensaje de bienvenida es de la interfaz, no parte de la conversación.
      const historialMensajes = [...messages, userMsg]
        .filter((m) => !m.id.startsWith("welcome"))
        .map((m) => ({ role: m.role, content: m.content }));

      const { reply, conversacionId: idDevuelto } = await enviarMensajeIA({
        mensajes: historialMensajes,
        contexto,
        pruebaId: prueba?.id ?? pruebaId,
        conversacionId,
      });

      if (idDevuelto && idDevuelto !== conversacionId) setConversacionId(idDevuelto);
      refrescarHistorial();

      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: reply,
        timestamp: new Date(),
      }]);
    } catch (e) {
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: e instanceof Error ? e.message : "Hubo un error al conectarme. Verificá tu conexión e intentá de nuevo.",
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

  const contextoCompleto = !!(contexto.colegio && contexto.año && contexto.materia);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", fontFamily: "'DM Sans', sans-serif", backgroundColor: C.bg }}>

      {/* ── Navbar ── */}
      <nav style={{
        backgroundColor: "rgba(10,14,26,0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.border}`,
        padding: "0 24px", flexShrink: 0, zIndex: 40,
        position: "sticky", top: 0,
      }}>
        <div style={{ height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Logo size="sm" onClick={() => navigate("/home")} />

            <div style={{ width: "1px", height: "20px", backgroundColor: C.border }} />

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "8px",
                backgroundColor: "rgba(16,99,239,0.15)",
                border: `1px solid rgba(16,99,239,0.3)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "13px", color: C.blue,
              }}>
                ✦
              </div>
              <span style={{ fontSize: "15px", fontWeight: 700, color: C.white, fontFamily: "'Syne', sans-serif" }}>
                IA tusPruebas
              </span>
            </div>

            {contextoCompleto && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  backgroundColor: "rgba(34,197,94,0.1)",
                  border: "1px solid rgba(34,197,94,0.25)",
                  borderRadius: "999px", padding: "3px 10px",
                }}
              >
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#22c55e" }} />
                <span style={{ fontSize: "11px", color: "#4ade80", fontWeight: 600 }}>
                  {contexto.materia} · {contexto.año} · {contexto.colegio}
                </span>
              </motion.div>
            )}
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            {prueba?.archivo_tipo === "image" && prueba?.archivo_url && (
              <motion.button
                whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                onClick={() => setImagenAbierta(true)}
                style={{
                  fontSize: "12px", color: C.gray, fontWeight: 500,
                  padding: "6px 12px", borderRadius: "8px",
                  border: `1px solid ${C.border}`, backgroundColor: "transparent",
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Ver prueba
              </motion.button>
            )}
            <motion.button
              whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              onClick={() => setHistorialOpen(!historialOpen)}
              style={{
                fontSize: "12px", color: C.gray, fontWeight: 500,
                padding: "6px 12px", borderRadius: "8px",
                border: `1px solid ${C.border}`, backgroundColor: "transparent",
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {historialOpen ? "Ocultar historial" : "Ver historial"}
            </motion.button>
            <motion.button
              whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              onClick={() => iniciarChatNuevo(true)}
              style={{
                fontSize: "12px", color: C.gray, fontWeight: 500,
                padding: "6px 12px", borderRadius: "8px",
                border: `1px solid ${C.border}`, backgroundColor: "transparent",
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Limpiar chat
            </motion.button>
            <motion.button
              whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                fontSize: "12px", color: C.gray, fontWeight: 500,
                padding: "6px 12px", borderRadius: "8px",
                border: `1px solid ${C.border}`, backgroundColor: "transparent",
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {sidebarOpen ? "Ocultar contexto" : "Ver contexto"}
            </motion.button>
          </div>
        </div>
      </nav>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* ── Historial de chats ── */}
        <AnimatePresence>
          {historialOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              style={{
                flexShrink: 0,
                backgroundColor: C.bgSection,
                borderRight: `1px solid ${C.border}`,
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <div style={{ padding: "16px 12px", minWidth: "236px" }}>
                <motion.button
                  whileHover={{ backgroundColor: "rgba(16,99,239,0.12)" }}
                  onClick={() => iniciarChatNuevo(false)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: "8px",
                    padding: "10px 12px", marginBottom: "14px",
                    borderRadius: "10px", border: `1px solid ${C.border}`,
                    backgroundColor: "transparent", color: C.white,
                    fontSize: "13px", fontWeight: 600, cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  <span style={{ fontSize: "15px", color: C.blue }}>＋</span> Nuevo chat
                </motion.button>

                <p style={{ fontSize: "10px", fontWeight: 700, color: C.gray, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "8px", paddingLeft: "4px" }}>
                  Historial
                </p>

                {cargandoHistorial && (
                  <p style={{ fontSize: "12px", color: C.gray, padding: "8px 4px" }}>Cargando...</p>
                )}
                {!cargandoHistorial && historial.length === 0 && (
                  <p style={{ fontSize: "12px", color: C.gray, padding: "8px 4px" }}>
                    Todavía no tenés chats guardados.
                  </p>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                  {historial.map((c) => {
                    const activo = c.id === conversacionId;
                    return (
                      <motion.div
                        key={c.id}
                        onClick={() => abrirConversacion(c.id)}
                        whileHover={{ backgroundColor: activo ? undefined : "rgba(255,255,255,0.04)" }}
                        style={{
                          display: "flex", alignItems: "center", gap: "6px",
                          padding: "9px 10px", borderRadius: "8px", cursor: "pointer",
                          backgroundColor: activo ? "rgba(16,99,239,0.15)" : "transparent",
                          border: activo ? "1px solid rgba(16,99,239,0.3)" : "1px solid transparent",
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{
                            fontSize: "12.5px", fontWeight: activo ? 700 : 500,
                            color: activo ? C.white : C.text,
                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                          }}>
                            {c.titulo}
                          </p>
                          {c.contexto.materia && (
                            <p style={{ fontSize: "10.5px", color: C.gray, marginTop: "1px" }}>
                              {c.contexto.materia}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={(e) => borrarConversacion(c.id, e)}
                          title="Borrar conversación"
                          style={{
                            flexShrink: 0, background: "none", border: "none", cursor: "pointer",
                            color: "rgba(255,255,255,0.2)", fontSize: "13px", padding: "2px 4px",
                          }}
                        >
                          ✕
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

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
                backgroundColor: C.bgCard,
                borderRight: `1px solid ${C.border}`,
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <div style={{ padding: "24px 20px", minWidth: "260px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: C.gray, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "20px" }}>
                  Contexto de estudio
                </p>

                {/* Prueba abierta desde "Resolver con IA" */}
                {cargandoPrueba && (
                  <div style={{ marginBottom: "16px", padding: "12px", borderRadius: "10px", border: `1px solid ${C.border}`, fontSize: "12px", color: C.gray }}>
                    Cargando la prueba...
                  </div>
                )}
                {errorPrueba && !cargandoPrueba && (
                  <div style={{ marginBottom: "16px", padding: "12px", borderRadius: "10px", border: "1px solid rgba(239,68,68,0.3)", backgroundColor: "rgba(239,68,68,0.08)", fontSize: "12px", color: "#f87171" }}>
                    {errorPrueba}
                  </div>
                )}
                {prueba && !cargandoPrueba && (
                  <div style={{ marginBottom: "20px", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(16,99,239,0.3)", backgroundColor: "rgba(16,99,239,0.08)" }}>
                    <p style={{ fontSize: "11px", fontWeight: 700, color: C.blue, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
                      Prueba cargada
                    </p>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: C.white, marginBottom: "2px" }}>
                      {prueba.tema || prueba.materia}
                    </p>
                    <p style={{ fontSize: "11px", color: C.gray, marginBottom: "8px" }}>
                      {prueba.archivo_tipo === "image"
                        ? "La IA puede ver la foto de la prueba"
                        : prueba.archivo_tipo === "pdf"
                        ? "La IA puede leer el PDF de la prueba"
                        : prueba.preguntas
                        ? "La IA tiene las preguntas escritas"
                        : "Sin archivo adjunto"}
                    </p>
                    <button
                      onClick={() => navigate(`/prueba/${prueba.id}`)}
                      style={{ fontSize: "11px", fontWeight: 700, color: C.blue, background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Ver la prueba →
                    </button>
                  </div>
                )}

                {/* Colegio */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: C.text, display: "block", marginBottom: "6px" }}>
                    Colegio
                  </label>
                  <select
                    value={contexto.colegio}
                    onChange={(e) => setCtx("colegio", e.target.value)}
                    style={{
                      width: "100%", padding: "9px 12px",
                      border: `1.5px solid ${C.border}`, borderRadius: "8px",
                      fontSize: "13px", color: contexto.colegio ? C.white : C.gray,
                      backgroundColor: C.bgSection, outline: "none",
                      cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    <option value="">Seleccioná colegio</option>
                    {COLEGIOS.map((c) => <option key={c} style={{ backgroundColor: C.bgCard }}>{c}</option>)}
                  </select>
                </div>

                {/* Año */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: C.text, display: "block", marginBottom: "6px" }}>
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
                          border: `1.5px solid ${contexto.año === a ? C.blue : C.border}`,
                          backgroundColor: contexto.año === a ? C.blue : "transparent",
                          color: contexto.año === a ? C.white : C.gray,
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
                  <label style={{ fontSize: "12px", fontWeight: 600, color: C.text, display: "block", marginBottom: "6px" }}>
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
                            border: `1.5px solid ${contexto.materia === m ? C.blue : C.border}`,
                            backgroundColor: contexto.materia === m ? "rgba(16,99,239,0.15)" : "transparent",
                            color: contexto.materia === m ? C.white : C.gray,
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
                    <p style={{ fontSize: "12px", color: C.gray }}>Seleccioná un año primero</p>
                  )}
                </div>

                {/* Profesor */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: C.text, display: "block", marginBottom: "6px" }}>
                    Profesor/a
                  </label>
                  <input
                    type="text"
                    value={contexto.profesor}
                    onChange={(e) => setCtx("profesor", e.target.value)}
                    placeholder="Nombre del profesor"
                    style={{
                      width: "100%", padding: "9px 12px",
                      border: `1.5px solid ${C.border}`, borderRadius: "8px",
                      fontSize: "13px", color: C.white,
                      backgroundColor: C.bgSection, outline: "none",
                      boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = C.blue)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
                  />
                </div>

                {/* Tema */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: C.text, display: "block", marginBottom: "6px" }}>
                    Tema de la prueba
                  </label>
                  <input
                    type="text"
                    value={contexto.tema}
                    onChange={(e) => setCtx("tema", e.target.value)}
                    placeholder="Ej: Integrales, Segunda Guerra..."
                    style={{
                      width: "100%", padding: "9px 12px",
                      border: `1.5px solid ${C.border}`, borderRadius: "8px",
                      fontSize: "13px", color: C.white,
                      backgroundColor: C.bgSection, outline: "none",
                      boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = C.blue)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
                  />
                </div>

                {/* Estado contexto */}
                <div style={{
                  padding: "12px",
                  borderRadius: "10px",
                  backgroundColor: contextoCompleto ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${contextoCompleto ? "rgba(34,197,94,0.25)" : C.border}`,
                }}>
                  <p style={{ fontSize: "11px", fontWeight: 600, color: contextoCompleto ? "#4ade80" : C.gray, marginBottom: "6px" }}>
                    {contextoCompleto ? "✓ Contexto configurado" : "⚪ Completá el contexto"}
                  </p>
                  {[
                    { label: "Colegio", val: contexto.colegio },
                    { label: "Año",     val: contexto.año },
                    { label: "Materia", val: contexto.materia },
                    { label: "Profesor",val: contexto.profesor },
                    { label: "Tema",    val: contexto.tema },
                  ].map((row) => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                      <span style={{ fontSize: "11px", color: C.gray }}>{row.label}</span>
                      <span style={{ fontSize: "11px", fontWeight: 600, color: row.val ? C.text : "rgba(255,255,255,0.15)" }}>
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
                <p style={{ fontSize: "12px", color: C.gray, marginBottom: "10px", fontWeight: 500 }}>
                  Sugerencias
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {sugerencias.map((s) => (
                    <motion.button
                      key={s}
                      whileHover={{ backgroundColor: "rgba(16,99,239,0.12)", borderColor: "rgba(16,99,239,0.35)" }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => sendMessage(s)}
                      style={{
                        padding: "8px 14px",
                        border: `1px solid ${C.border}`,
                        borderRadius: "999px",
                        backgroundColor: "transparent",
                        fontSize: "13px", color: C.text,
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
                    backgroundColor: "rgba(16,99,239,0.15)",
                    border: `1px solid rgba(16,99,239,0.3)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginRight: "10px", flexShrink: 0,
                    fontSize: "13px", color: C.blue,
                  }}>
                    ✦
                  </div>
                  <div style={{
                    backgroundColor: C.bgCard,
                    border: `1px solid ${C.border}`,
                    borderRadius: "18px 18px 18px 4px",
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
            borderTop: `1px solid ${C.border}`,
            backgroundColor: C.bgCard,
            padding: "16px 32px 20px",
          }}>
            {/* Sugerencias rápidas */}
            {messages.length > 1 && (
              <div style={{ display: "flex", gap: "6px", marginBottom: "12px", overflowX: "auto", paddingBottom: "4px" }}>
                {sugerencias.slice(0, 3).map((s) => (
                  <motion.button
                    key={s}
                    whileHover={{ backgroundColor: "rgba(16,99,239,0.1)", borderColor: "rgba(16,99,239,0.3)" }}
                    onClick={() => sendMessage(s)}
                    style={{
                      padding: "5px 12px",
                      border: `1px solid ${C.border}`,
                      borderRadius: "999px",
                      backgroundColor: "transparent",
                      fontSize: "12px", color: C.gray,
                      cursor: "pointer", whiteSpace: "nowrap",
                      fontFamily: "'DM Sans', sans-serif",
                      transition: "all 0.15s",
                    }}
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            )}

            <div style={{
              display: "flex", gap: "10px", alignItems: "flex-end",
              backgroundColor: C.bgSection,
              border: `1.5px solid ${C.border}`,
              borderRadius: "14px",
              padding: "10px 14px",
              transition: "border-color 0.2s",
            }}>
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
                  color: C.white,
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
                  backgroundColor: input.trim() && !loading ? C.blue : "rgba(255,255,255,0.08)",
                  border: "none",
                  cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                  transition: "background-color 0.15s",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={input.trim() && !loading ? C.white : C.gray} strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </motion.button>
            </div>

            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.15)", textAlign: "center", marginTop: "10px" }}>
              Enter para enviar · Shift+Enter para nueva línea
            </p>
          </div>
        </div>
      </div>

      {/* ── Lightbox: la foto de la prueba, a pedido, no metida en el chat ── */}
      <AnimatePresence>
        {imagenAbierta && prueba?.archivo_url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setImagenAbierta(false)}
            style={{
              position: "fixed", inset: 0, zIndex: 100,
              backgroundColor: "rgba(0,0,0,0.85)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "32px", cursor: "zoom-out",
            }}
          >
            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              src={prueba.archivo_url}
              alt={`Foto de la prueba de ${prueba.materia}`}
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: "100%", maxHeight: "100%",
                borderRadius: "10px", boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
                cursor: "default",
              }}
            />
            <button
              onClick={() => setImagenAbierta(false)}
              style={{
                position: "absolute", top: "20px", right: "24px",
                width: "36px", height: "36px", borderRadius: "50%",
                border: `1px solid ${C.border}`, backgroundColor: "rgba(255,255,255,0.08)",
                color: C.white, fontSize: "16px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
