import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getToken, getUser } from "../services/Auth";

// ── Data ───────────────────────────────────────────────────────────────────────
const COLEGIOS = ["ORT Almagro", "ORT Belgrano", "Martín Buber", "Wolfson", "Tarbut"];
const AÑOS = ["7mo", "1ro", "2do", "3ro", "4to", "5to"];

const MATERIAS_POR_COLEGIO_Y_AÑO: Record<string, Record<string, string[]>> = {
  "ORT Almagro": {
    "7mo": ["Tecnología", "Matemática", "Lengua y Literatura", "Inglés", "Ciencias Sociales", "Ciencias Naturales", "Arte", "Hebreo"],
    "1ro": ["Arte", "Biología", "Tecnología", "Educación Judía", "Formación Ética y Ciudadana", "Geografía", "Historia", "Matemática", "Lengua y Literatura", "Inglés"],
    "2do": ["Arte", "Biología", "Educación Judía", "Tecnología", "Formación Ética y Ciudadana", "Geografía", "Historia", "Matemática", "Lengua y Literatura", "Inglés"],
    "3ro": ["Biología", "Cultura Judía", "Economía", "Educación Judía", "Físico-Química", "Formación Ética y Ciudadana", "Geografía", "Historia", "Lengua y Literatura", "Matemática", "Inglés"],
    "4to": ["Cultura Judía", "Educación Judía", "Inglés", "Geografía", "Formación Ética y Ciudadana", "Física", "Historia", "Lengua y Literatura", "Matemática"],
    "5to": ["Cultura Judía", "Educación Judía", "Matemática", "Filosofía", "Lengua y Literatura", "Química", "Marketing"],
  },
  "ORT Belgrano": {
    "7mo": ["Tecnología", "Matemática", "Lengua y Literatura", "Inglés", "Ciencias Sociales", "Ciencias Naturales", "Arte", "Hebreo"],
    "1ro": ["Arte", "Biología", "Tecnología", "Educación Judía", "Formación Ética y Ciudadana", "Geografía", "Historia", "Matemática", "Lengua y Literatura", "Inglés"],
    "2do": ["Arte", "Biología", "Educación Judía", "Tecnología", "Formación Ética y Ciudadana", "Geografía", "Historia", "Matemática", "Lengua y Literatura", "Inglés"],
    "3ro": ["Biología", "Cultura Judía", "Economía", "Educación Judía", "Físico-Química", "Formación Ética y Ciudadana", "Geografía", "Historia", "Lengua y Literatura", "Matemática", "Inglés"],
    "4to": ["Cultura Judía", "Educación Judía", "Inglés", "Geografía", "Formación Ética y Ciudadana", "Física", "Historia", "Lengua y Literatura", "Matemática"],
    "5to": ["Cultura Judía", "Educación Judía", "Matemática", "Filosofía", "Lengua y Literatura", "Química", "Marketing"],
  },
  "Martín Buber": { "7mo": [], "1ro": [], "2do": [], "3ro": [], "4to": [], "5to": [] },
  "Wolfson":      { "7mo": [], "1ro": [], "2do": [], "3ro": [], "4to": [], "5to": [] },
  "Tarbut":       { "7mo": [], "1ro": [], "2do": [], "3ro": [], "4to": [], "5to": [] },
};

// ── API ────────────────────────────────────────────────────────────────────────
const API_URL = "http://localhost:3000";

async function subirPrueba(formData: FormData): Promise<void> {
  const token = getToken();
  const res = await fetch(`${API_URL}/pruebas`, {
    method: "POST",
    headers: {
      // No pongas Content-Type con FormData, el browser lo hace solo
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Error al subir la prueba" }));
    throw new Error(err.message ?? "Error al subir la prueba");
  }
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  border: "1.5px solid #e5e7eb",
  borderRadius: "10px",
  fontSize: "14px",
  color: "#111",
  backgroundColor: "#f9fafb",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "'DM Sans', sans-serif",
  transition: "border-color 0.2s, background-color 0.2s",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
  appearance: "none" as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 14px center",
  paddingRight: "36px",
};

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>
        {label}{required && <span style={{ color: "#ef4444", marginLeft: "2px" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function StepIndicator({ current, total, labels }: { current: number; total: number; labels: string[] }) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
            <motion.div
              animate={{ backgroundColor: i <= current ? "#111" : "#e5e7eb" }}
              style={{
                width: "28px", height: "28px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "12px", fontWeight: 700,
                color: i <= current ? "#fff" : "#9ca3af",
              }}
            >
              {i < current ? "✓" : i + 1}
            </motion.div>
            <span style={{ fontSize: "11px", color: i === current ? "#111" : "#9ca3af", fontWeight: i === current ? 600 : 400, whiteSpace: "nowrap" }}>
              {labels[i]}
            </span>
          </div>
          {i < total - 1 && (
            <div style={{ width: "72px", height: "1.5px", margin: "0 4px", marginBottom: "18px", backgroundColor: i < current ? "#111" : "#e5e7eb", transition: "background-color 0.3s" }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function SubirPrueba() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const user = getUser();

  const [form, setForm] = useState({
    colegio: "",
    año: "",
    materia: "",
    profesor: "",
    tema: "",
    archivo: null as File | null,
    notas: "",
  });

  const set = (key: string, val: string | File | null) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const materias = form.colegio && form.año
    ? MATERIAS_POR_COLEGIO_Y_AÑO[form.colegio]?.[form.año] ?? []
    : [];
  const sinMaterias = materias.length === 0 && form.colegio !== "" && form.año !== "";

  const stepValid = [
    form.colegio !== "" && form.año !== "",
    form.materia !== "" || sinMaterias,
    form.archivo !== null,
  ];

  const handleSubmit = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("colegio", form.colegio);
      fd.append("año", form.año);
      fd.append("materia", form.materia);
      fd.append("profesor", form.profesor);
      fd.append("tema", form.tema);
      fd.append("notas", form.notas);
      fd.append("estado", "pendiente"); // siempre pendiente hasta que admin apruebe
      fd.append("usuario_nombre", user.nombre);
      fd.append("usuario_id", String(user.id));
      if (form.archivo) fd.append("archivo", form.archivo);

      await subirPrueba(fd);
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al subir la prueba");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSubmitted(false);
    setStep(0);
    setError("");
    setForm({ colegio: "", año: "", materia: "", profesor: "", tema: "", archivo: null, notas: "" });
  };

  // ── Pantalla de éxito ────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#fff", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", maxWidth: "420px", padding: "40px" }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 180 }}
            style={{
              width: "72px", height: "72px", borderRadius: "50%",
              backgroundColor: "#f0fdf4", border: "1.5px solid #86efac",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "28px", margin: "0 auto 24px",
            }}
          >
            ✓
          </motion.div>
          <h2 style={{ fontSize: "24px", fontWeight: 900, color: "#111", fontFamily: "'Syne', sans-serif", marginBottom: "12px" }}>
            Prueba enviada
          </h2>
          <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: 1.7, marginBottom: "8px" }}>
            Tu prueba fue enviada correctamente y está en revisión.
          </p>
          <p style={{ fontSize: "13px", color: "#9ca3af", lineHeight: 1.6, marginBottom: "32px" }}>
            El equipo de tusPruebas va a revisarla y, una vez aprobada, va a aparecer disponible para todos los estudiantes.
          </p>

          {/* Info de quién subió */}
          <div style={{
            backgroundColor: "#f9fafb", border: "1px solid #e5e7eb",
            borderRadius: "12px", padding: "14px 18px",
            marginBottom: "28px", textAlign: "left",
          }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
              Subida por
            </p>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#111" }}>{user?.nombre}</p>
            <p style={{ fontSize: "12px", color: "#9ca3af" }}>{user?.email}</p>
          </div>

          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <motion.button
              whileHover={{ backgroundColor: "#1f2937" }}
              onClick={() => navigate("/home")}
              style={{ backgroundColor: "#111", color: "#fff", fontWeight: 700, fontSize: "14px", padding: "11px 24px", borderRadius: "10px", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
            >
              Ver pruebas
            </motion.button>
            <motion.button
              whileHover={{ borderColor: "#111" }}
              onClick={reset}
              style={{ backgroundColor: "#fff", color: "#111", fontWeight: 600, fontSize: "14px", padding: "11px 24px", borderRadius: "10px", border: "1.5px solid #e5e7eb", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
            >
              Subir otra
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", fontFamily: "'DM Sans', sans-serif" }}>

      {/* Navbar */}
      <nav style={{ position: "sticky", top: 0, zIndex: 40, backgroundColor: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 48px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            <motion.button onClick={() => navigate("/")} whileHover={{ opacity: 0.7 }}
              style={{ fontSize: "16px", fontWeight: 900, color: "#111", background: "none", border: "none", cursor: "pointer", fontFamily: "'Syne', sans-serif" }}>
              tuspruebas
            </motion.button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {user && (
              <span style={{ fontSize: "13px", color: "#6b7280" }}>
                Subiendo como <strong style={{ color: "#111" }}>{user.nombre}</strong>
              </span>
            )}
            <motion.button onClick={() => navigate("/home")} whileHover={{ color: "#111" }}
              style={{ fontSize: "13px", color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}>
              ← Volver
            </motion.button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "52px 24px" }}>

        {/* Header */}
        <div style={{ marginBottom: "36px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: 900, color: "#111", fontFamily: "'Syne', sans-serif", marginBottom: "6px" }}>
            Subir prueba
          </h1>
          <p style={{ fontSize: "14px", color: "#9ca3af" }}>
            El contenido pasa por revisión antes de publicarse
          </p>
        </div>

        {/* User info */}
        {user && (
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "12px 16px",
            backgroundColor: "#f9fafb", border: "1px solid #e5e7eb",
            borderRadius: "10px", marginBottom: "28px",
          }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "50%",
              backgroundColor: "#111", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "14px", color: "#fff", fontWeight: 700,
            }}>
              {user.nombre.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "#111" }}>{user.nombre}</p>
              <p style={{ fontSize: "11px", color: "#9ca3af" }}>La prueba quedará asociada a tu cuenta</p>
            </div>
          </div>
        )}

        {/* Aviso de moderación */}
        <div style={{
          padding: "12px 16px",
          backgroundColor: "#fffbeb", border: "1px solid #fde68a",
          borderRadius: "10px", marginBottom: "28px",
          fontSize: "13px", color: "#92400e", lineHeight: 1.6,
        }}>
          <strong>Revisión obligatoria:</strong> Todas las pruebas son revisadas por el equipo antes de publicarse. El contenido inapropiado será rechazado y puede resultar en la suspensión de la cuenta.
        </div>

        {/* Steps */}
        <div style={{ marginBottom: "32px" }}>
          <StepIndicator current={step} total={3} labels={["Colegio y año", "Materia", "Archivo"]} />
        </div>

        {/* Card */}
        <div style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "18px", padding: "32px", marginBottom: "16px" }}>
          <AnimatePresence mode="wait">

            {/* STEP 0 */}
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <Field label="Colegio" required>
                  <select value={form.colegio} onChange={(e) => { set("colegio", e.target.value); set("materia", ""); }} style={selectStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#111"; e.currentTarget.style.backgroundColor = "#fff"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.backgroundColor = "#f9fafb"; }}>
                    <option value="">Seleccioná el colegio</option>
                    {COLEGIOS.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Field>

                <Field label="Año" required>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                    {AÑOS.map((a) => (
                      <motion.button key={a} whileTap={{ scale: 0.97 }} onClick={() => { set("año", a); set("materia", ""); }}
                        style={{
                          padding: "14px", borderRadius: "10px",
                          border: `1.5px solid ${form.año === a ? "#111" : "#e5e7eb"}`,
                          backgroundColor: form.año === a ? "#111" : "#fff",
                          color: form.año === a ? "#fff" : "#374151",
                          fontWeight: 700, fontSize: "15px", cursor: "pointer",
                          fontFamily: "'Syne', sans-serif", transition: "all 0.15s",
                        }}>
                        {a}
                      </motion.button>
                    ))}
                  </div>
                </Field>
              </motion.div>
            )}

            {/* STEP 1 */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {sinMaterias ? (
                  <div style={{ padding: "16px", borderRadius: "10px", backgroundColor: "#fffbeb", border: "1px solid #fde68a", fontSize: "13px", color: "#92400e", lineHeight: 1.6 }}>
                    Las materias de <strong>{form.colegio}</strong> todavía no están cargadas. Podés escribirla en las notas.
                  </div>
                ) : (
                  <Field label="Materia" required>
                    <select value={form.materia} onChange={(e) => set("materia", e.target.value)} style={selectStyle}
                      onFocus={(e) => { e.currentTarget.style.borderColor = "#111"; e.currentTarget.style.backgroundColor = "#fff"; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.backgroundColor = "#f9fafb"; }}>
                      <option value="">Seleccioná la materia</option>
                      {materias.map((m) => <option key={m}>{m}</option>)}
                    </select>
                  </Field>
                )}

                <Field label="Profesor">
                  <input type="text" value={form.profesor} onChange={(e) => set("profesor", e.target.value)} placeholder="Nombre del profesor" style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#111"; e.currentTarget.style.backgroundColor = "#fff"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.backgroundColor = "#f9fafb"; }} />
                </Field>

                <Field label="Tema">
                  <input type="text" value={form.tema} onChange={(e) => set("tema", e.target.value)} placeholder="Ej: Integrales, Segunda Guerra Mundial..." style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#111"; e.currentTarget.style.backgroundColor = "#fff"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.backgroundColor = "#f9fafb"; }} />
                </Field>
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <Field label="Archivo de la prueba" required>
                  <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={(e) => set("archivo", e.target.files?.[0] ?? null)} style={{ display: "none" }} />
                  <motion.button whileHover={{ borderColor: "#111" }} whileTap={{ scale: 0.99 }} onClick={() => fileRef.current?.click()}
                    style={{
                      width: "100%", padding: "44px 24px",
                      border: `2px dashed ${form.archivo ? "#111" : "#d1d5db"}`,
                      borderRadius: "14px", backgroundColor: "#fff",
                      cursor: "pointer", display: "flex", flexDirection: "column",
                      alignItems: "center", gap: "10px", transition: "border-color 0.2s",
                    }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={form.archivo ? "#111" : "#9ca3af"} strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: form.archivo ? "#111" : "#6b7280", margin: 0 }}>
                      {form.archivo ? form.archivo.name : "Hacé clic para subir un archivo"}
                    </p>
                    <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>
                      {form.archivo ? `${(form.archivo.size / 1024 / 1024).toFixed(2)} MB` : "PDF, JPG, PNG, DOC — hasta 10MB"}
                    </p>
                  </motion.button>
                </Field>

                <Field label="Notas adicionales">
                  <textarea value={form.notas} onChange={(e) => set("notas", e.target.value)} placeholder="Información extra (opcional)" rows={3}
                    style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#111"; e.currentTarget.style.backgroundColor = "#fff"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.backgroundColor = "#f9fafb"; }} />
                </Field>

                {/* Resumen */}
                <div style={{ backgroundColor: "#f9fafb", borderRadius: "12px", padding: "16px 18px", border: "1px solid #f3f4f6" }}>
                  <p style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Resumen</p>
                  {[
                    { label: "Subido por", val: user?.nombre ?? "—" },
                    { label: "Colegio", val: form.colegio },
                    { label: "Año", val: form.año },
                    { label: "Materia", val: form.materia || "—" },
                    { label: "Profesor", val: form.profesor || "—" },
                    { label: "Tema", val: form.tema || "—" },
                  ].map((row) => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #f3f4f6" }}>
                      <span style={{ fontSize: "12px", color: "#9ca3af" }}>{row.label}</span>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "#111" }}>{row.val}</span>
                    </div>
                  ))}
                </div>

                {/* Error */}
                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: "11px 14px", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "9px", fontSize: "13px", color: "#dc2626" }}>
                    {error}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
          {step > 0 ? (
            <motion.button whileHover={{ borderColor: "#111" }} onClick={() => setStep((s) => s - 1)}
              style={{ padding: "11px 22px", borderRadius: "10px", border: "1.5px solid #e5e7eb", backgroundColor: "#fff", color: "#374151", fontWeight: 600, fontSize: "14px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              ← Anterior
            </motion.button>
          ) : <div />}

          {step < 2 ? (
            <motion.button whileTap={{ scale: stepValid[step] ? 0.98 : 1 }} onClick={() => stepValid[step] && setStep((s) => s + 1)}
              style={{
                padding: "11px 28px", borderRadius: "10px",
                backgroundColor: stepValid[step] ? "#111" : "#e5e7eb",
                color: stepValid[step] ? "#fff" : "#9ca3af",
                fontWeight: 700, fontSize: "14px", border: "none",
                cursor: stepValid[step] ? "pointer" : "not-allowed",
                fontFamily: "'DM Sans', sans-serif", transition: "background-color 0.2s",
              }}>
              Siguiente →
            </motion.button>
          ) : (
            <motion.button whileTap={{ scale: stepValid[2] && !loading ? 0.98 : 1 }} onClick={handleSubmit}
              disabled={!stepValid[2] || loading}
              style={{
                padding: "11px 28px", borderRadius: "10px",
                backgroundColor: stepValid[2] && !loading ? "#111" : "#e5e7eb",
                color: stepValid[2] && !loading ? "#fff" : "#9ca3af",
                fontWeight: 700, fontSize: "14px", border: "none",
                borderBottom: stepValid[2] && !loading ? "3px solid #4f46e5" : "none",
                cursor: stepValid[2] && !loading ? "pointer" : "not-allowed",
                fontFamily: "'DM Sans', sans-serif",
                display: "flex", alignItems: "center", gap: "8px",
              }}>
              {loading ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%" }} />
                  Enviando...
                </>
              ) : "Enviar prueba ✓"}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}