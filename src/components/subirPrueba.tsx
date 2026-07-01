import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getUser } from "../services/Auth";
import { uploadPrueba } from "../services/Pruebas";
import { notifyAdminNewPrueba } from "../services/Email";
import Logo from "./logo";

const C = {
  bg: "#070b14", bgCard: "#0d1526",
  border: "rgba(255,255,255,0.07)", blue: "#1063EF", blueHov: "#0050EF",
  white: "#ffffff", text: "#c8cdd8", gray: "#8A8A9A",
};

const COLEGIOS = ["ORT Almagro", "ORT Belgrano", "Tarbut"];
const AÑOS = ["7mo", "1ro", "2do", "3ro", "4to", "5to"];

const MATERIAS: Record<string, Record<string, string[]>> = {
  "ORT Almagro": {
    "7mo": ["Tecnología","Matemática","Lengua y Literatura","Inglés","Ciencias Sociales","Ciencias Naturales","Arte","Hebreo"],
    "1ro": ["Arte","Biología","Tecnología","Educación Judía","Formación Ética y Ciudadana","Geografía","Historia","Matemática","Lengua y Literatura","Inglés"],
    "2do": ["Arte","Biología","Educación Judía","Tecnología","Formación Ética y Ciudadana","Geografía","Historia","Matemática","Lengua y Literatura","Inglés"],
    "3ro": ["Biología","Cultura Judía","Economía","Educación Judía","Físico-Química","Formación Ética y Ciudadana","Geografía","Historia","Lengua y Literatura","Matemática","Inglés"],
    "4to": ["Cultura Judía","Educación Judía","Inglés","Geografía","Formación Ética y Ciudadana","Física","Historia","Lengua y Literatura","Matemática"],
    "5to": ["Cultura Judía","Educación Judía","Matemática","Filosofía","Lengua y Literatura","Química","Marketing"],
  },
  "ORT Belgrano": {
    "7mo": ["Tecnología","Matemática","Lengua y Literatura","Inglés","Ciencias Sociales","Ciencias Naturales","Arte","Hebreo"],
    "1ro": ["Arte","Biología","Tecnología","Educación Judía","Formación Ética y Ciudadana","Geografía","Historia","Matemática","Lengua y Literatura","Inglés"],
    "2do": ["Arte","Biología","Educación Judía","Tecnología","Formación Ética y Ciudadana","Geografía","Historia","Matemática","Lengua y Literatura","Inglés"],
    "3ro": ["Biología","Cultura Judía","Economía","Educación Judía","Físico-Química","Formación Ética y Ciudadana","Geografía","Historia","Lengua y Literatura","Matemática","Inglés"],
    "4to": ["Cultura Judía","Educación Judía","Inglés","Geografía","Formación Ética y Ciudadana","Física","Historia","Lengua y Literatura","Matemática"],
    "5to": ["Cultura Judía","Educación Judía","Matemática","Filosofía","Lengua y Literatura","Química","Marketing"],
  },
  "Tarbut": { "7mo":[],"1ro":[],"2do":[],"3ro":[],"4to":[],"5to":[] },
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 14px",
  border: `1.5px solid rgba(255,255,255,0.07)`, borderRadius: "10px",
  fontSize: "14px", color: C.white, backgroundColor: "rgba(255,255,255,0.04)",
  outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif",
  transition: "border-color 0.2s",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle, cursor: "pointer",
  appearance: "none" as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238A8A9A' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: "36px",
};

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <label style={{ fontSize: "13px", fontWeight: 600, color: C.text }}>
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
            <motion.div animate={{ backgroundColor: i <= current ? C.blue : "rgba(255,255,255,0.08)" }}
              style={{ width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: i <= current ? C.white : C.gray }}>
              {i < current ? "✓" : i + 1}
            </motion.div>
            <span style={{ fontSize: "11px", color: i === current ? C.white : C.gray, fontWeight: i === current ? 600 : 400, whiteSpace: "nowrap" }}>{labels[i]}</span>
          </div>
          {i < total - 1 && <div style={{ width: "72px", height: "1.5px", margin: "0 4px", marginBottom: "18px", backgroundColor: i < current ? C.blue : C.border, transition: "background-color 0.3s" }} />}
        </div>
      ))}
    </div>
  );
}

export default function SubirPrueba() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [pruebaId, setPruebaId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Enviando...");
  const [error, setError] = useState("");
  const user = getUser();

  const [form, setForm] = useState({
    colegio: "", año: "", materia: "",
    profesor: "", tema: "",
    archivo: null as File | null,
    notas: "",
  });

  const set = (key: string, val: string | File | null) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const materias = form.colegio && form.año ? MATERIAS[form.colegio]?.[form.año] ?? [] : [];
  const sinMaterias = materias.length === 0 && form.colegio !== "" && form.año !== "";
  const stepValid = [
    form.colegio !== "" && form.año !== "",
    form.materia !== "" || sinMaterias,
    true,
  ];

  const handleSubmit = async () => {
    if (!user) { navigate("/login"); return; }
    setLoading(true); setError("");
    setLoadingMsg(form.archivo ? "Subiendo archivo..." : "Enviando...");
    try {
      const fd = new FormData();
      fd.append("colegio", form.colegio);
      fd.append("año", form.año);
      fd.append("materia", form.materia);
      fd.append("profesor", form.profesor);
      fd.append("tema", form.tema);
      fd.append("notas", form.notas);
      fd.append("estado", "pendiente");
      fd.append("usuario_nombre", user.nombre);
      fd.append("usuario_email", user.email);
      fd.append("usuario_id", String(user.id));
      if (form.archivo) fd.append("archivo", form.archivo);

      setLoadingMsg("Guardando prueba...");
      const nueva = await uploadPrueba(fd);
      setPruebaId(nueva.id);
      setSubmitted(true);

      // Notificar al admin por email (no bloquea si falla)
      notifyAdminNewPrueba({
        usuario_nombre: user.nombre,
        usuario_email:  user.email,
        colegio:        form.colegio,
        año:            form.año,
        materia:        form.materia,
        profesor:       form.profesor,
        tema:           form.tema,
        notas:          form.notas,
        archivo_nombre: form.archivo?.name ?? "",
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al subir");
    } finally { setLoading(false); }
  };

  const reset = () => {
    setSubmitted(false); setPruebaId(null); setStep(0); setError("");
    setForm({ colegio: "", año: "", materia: "", profesor: "", tema: "", archivo: null, notas: "" });
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: C.bg, fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", maxWidth: "420px", padding: "40px" }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 180 }}
            style={{ width: "72px", height: "72px", borderRadius: "50%", backgroundColor: "rgba(16,185,129,0.12)", border: "1.5px solid rgba(52,211,153,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", margin: "0 auto 24px" }}>
            ✓
          </motion.div>
          <h2 style={{ fontSize: "24px", fontWeight: 900, color: C.white, fontFamily: "'Syne', sans-serif", marginBottom: "12px" }}>Prueba enviada</h2>
          <p style={{ fontSize: "14px", color: C.gray, lineHeight: 1.7, marginBottom: "8px" }}>
            Tu prueba fue enviada y está en revisión.
          </p>
          <p style={{ fontSize: "13px", color: C.gray, lineHeight: 1.6, marginBottom: "32px" }}>
            Una vez aprobada va a aparecer disponible para todos los estudiantes.
          </p>
          <div style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "14px 18px", marginBottom: "28px", textAlign: "left" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: C.gray, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Subida por</p>
            <p style={{ fontSize: "14px", fontWeight: 600, color: C.white }}>{user?.nombre}</p>
            <p style={{ fontSize: "12px", color: C.gray }}>{user?.email}</p>
          </div>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <motion.button whileHover={{ backgroundColor: C.blueHov }} onClick={() => navigate("/home")}
              style={{ backgroundColor: C.blue, color: C.white, fontWeight: 700, fontSize: "14px", padding: "11px 24px", borderRadius: "10px", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Ver pruebas
            </motion.button>
            <motion.button whileHover={{ borderColor: C.blue }} onClick={reset}
              style={{ backgroundColor: "transparent", color: C.text, fontWeight: 600, fontSize: "14px", padding: "11px 24px", borderRadius: "10px", border: `1.5px solid ${C.border}`, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Subir otra
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, fontFamily: "'DM Sans', sans-serif" }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 40, backgroundColor: "rgba(7,11,20,0.92)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.border}`, padding: "0 48px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo size="sm" onClick={() => navigate("/")} />
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {user && <span style={{ fontSize: "13px", color: C.gray }}>Subiendo como <strong style={{ color: C.white }}>{user.nombre}</strong></span>}
            <motion.button onClick={() => navigate("/home")} whileHover={{ color: C.white }}
              style={{ fontSize: "13px", color: C.gray, background: "none", border: "none", cursor: "pointer" }}>
              ← Volver
            </motion.button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "52px 24px" }}>
        <div style={{ marginBottom: "36px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: 900, color: C.white, fontFamily: "'Syne', sans-serif", marginBottom: "6px" }}>Subir prueba</h1>
          <p style={{ fontSize: "14px", color: C.gray }}>El contenido pasa por revisión antes de publicarse</p>
        </div>

        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "10px", marginBottom: "20px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: C.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", color: C.white, fontWeight: 700 }}>
              {user.nombre.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 600, color: C.white }}>{user.nombre}</p>
              <p style={{ fontSize: "11px", color: C.gray }}>La prueba quedará asociada a tu cuenta</p>
            </div>
          </div>
        )}

        <div style={{ padding: "12px 16px", backgroundColor: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "10px", marginBottom: "28px", fontSize: "13px", color: "#fbbf24", lineHeight: 1.6 }}>
          <strong>Revisión obligatoria:</strong> Revisamos todo antes de publicar.
        </div>

        <div style={{ marginBottom: "32px" }}>
          <StepIndicator current={step} total={3} labels={["Colegio y año", "Materia", "Archivo"]} />
        </div>

        <div style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "18px", padding: "32px", marginBottom: "16px" }}>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <Field label="Colegio" required>
                  <select value={form.colegio} onChange={(e) => { set("colegio", e.target.value); set("materia", ""); }} style={selectStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = C.blue)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}>
                    <option value="" style={{ backgroundColor: C.bgCard }}>Seleccioná el colegio</option>
                    {COLEGIOS.map((c) => <option key={c} style={{ backgroundColor: C.bgCard }}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Año" required>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                    {AÑOS.map((a) => (
                      <motion.button key={a} whileTap={{ scale: 0.97 }} onClick={() => { set("año", a); set("materia", ""); }}
                        style={{ padding: "14px", borderRadius: "10px", border: `1.5px solid ${form.año === a ? C.blue : C.border}`, backgroundColor: form.año === a ? C.blue : "transparent", color: form.año === a ? C.white : C.text, fontWeight: 700, fontSize: "15px", cursor: "pointer", fontFamily: "'Syne', sans-serif", transition: "all 0.15s" }}>
                        {a}
                      </motion.button>
                    ))}
                  </div>
                </Field>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {sinMaterias ? (
                  <div style={{ padding: "16px", borderRadius: "10px", backgroundColor: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)", fontSize: "13px", color: "#fbbf24", lineHeight: 1.6 }}>
                    Las materias de <strong>{form.colegio}</strong> no están cargadas todavía. Podés escribirla en notas.
                  </div>
                ) : (
                  <Field label="Materia" required>
                    <select value={form.materia} onChange={(e) => set("materia", e.target.value)} style={selectStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = C.blue)}
                      onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}>
                      <option value="" style={{ backgroundColor: C.bgCard }}>Seleccioná la materia</option>
                      {materias.map((m) => <option key={m} style={{ backgroundColor: C.bgCard }}>{m}</option>)}
                    </select>
                  </Field>
                )}
                <Field label="Profesor">
                  <input type="text" value={form.profesor} onChange={(e) => set("profesor", e.target.value)} placeholder="Nombre del profesor" style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = C.blue)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = C.border)} />
                </Field>
                <Field label="Tema">
                  <input type="text" value={form.tema} onChange={(e) => set("tema", e.target.value)} placeholder="Ej: Integrales, Segunda Guerra Mundial..." style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = C.blue)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = C.border)} />
                </Field>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <Field label="Archivo de la prueba (opcional)">
                  <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => {
                      const f = e.target.files?.[0] ?? null;
                      if (f && f.size > 10 * 1024 * 1024) {
                        setError("El archivo no puede superar 10 MB.");
                        e.target.value = "";
                        return;
                      }
                      setError("");
                      set("archivo", f);
                    }}
                    style={{ display: "none" }} />
                  <motion.button whileHover={{ borderColor: C.blue }} whileTap={{ scale: 0.99 }} onClick={() => fileRef.current?.click()}
                    style={{ width: "100%", padding: "44px 24px", border: `2px dashed ${form.archivo ? C.blue : C.border}`, borderRadius: "14px", backgroundColor: "transparent", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", transition: "border-color 0.2s" }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={form.archivo ? C.blue : C.gray} strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: form.archivo ? C.white : C.gray, margin: 0 }}>
                      {form.archivo ? form.archivo.name : "Hacé clic para subir"}
                    </p>
                    <p style={{ fontSize: "12px", color: C.gray, margin: 0 }}>
                      {form.archivo
                        ? `${(form.archivo.size / 1024 / 1024).toFixed(2)} MB`
                        : "Fotos JPG, PNG (se comprimen automáticamente) · PDF hasta 10 MB"}
                    </p>
                  </motion.button>
                </Field>
                <Field label="Notas adicionales">
                  <textarea value={form.notas} onChange={(e) => set("notas", e.target.value)} placeholder="Información extra (opcional)" rows={3}
                    style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = C.blue)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = C.border)} />
                </Field>

                {/* Resumen */}
                <div style={{ backgroundColor: "rgba(255,255,255,0.02)", borderRadius: "12px", padding: "16px 18px", border: `1px solid ${C.border}` }}>
                  <p style={{ fontSize: "11px", fontWeight: 700, color: C.gray, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Resumen</p>
                  {[
                    { label: "Subido por", val: user?.nombre ?? "—" },
                    { label: "Colegio", val: form.colegio },
                    { label: "Año", val: form.año },
                    { label: "Materia", val: form.materia || "—" },
                    { label: "Profesor", val: form.profesor || "—" },
                    { label: "Tema", val: form.tema || "—" },
                  ].map((row) => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${C.border}` }}>
                      <span style={{ fontSize: "12px", color: C.gray }}>{row.label}</span>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: C.white }}>{row.val}</span>
                    </div>
                  ))}
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ padding: "11px 14px", backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "9px", fontSize: "13px", color: "#f87171" }}>
                    {error}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
          {step > 0 ? (
            <motion.button whileHover={{ borderColor: C.blue }} onClick={() => setStep((s) => s - 1)}
              style={{ padding: "11px 22px", borderRadius: "10px", border: `1.5px solid ${C.border}`, backgroundColor: "transparent", color: C.text, fontWeight: 600, fontSize: "14px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              ← Anterior
            </motion.button>
          ) : <div />}

          {step < 2 ? (
            <motion.button whileTap={{ scale: stepValid[step] ? 0.98 : 1 }} onClick={() => stepValid[step] && setStep((s) => s + 1)}
              style={{ padding: "11px 28px", borderRadius: "10px", backgroundColor: stepValid[step] ? C.blue : "rgba(255,255,255,0.05)", color: stepValid[step] ? C.white : C.gray, fontWeight: 700, fontSize: "14px", border: "none", cursor: stepValid[step] ? "pointer" : "not-allowed", fontFamily: "'DM Sans', sans-serif", transition: "background-color 0.2s" }}>
              Siguiente →
            </motion.button>
          ) : (
            <motion.button whileTap={{ scale: stepValid[2] && !loading ? 0.98 : 1 }} onClick={handleSubmit} disabled={!stepValid[2] || loading}
              style={{ padding: "11px 28px", borderRadius: "10px", backgroundColor: stepValid[2] && !loading ? C.blue : "rgba(255,255,255,0.05)", color: stepValid[2] && !loading ? C.white : C.gray, fontWeight: 700, fontSize: "14px", border: "none", cursor: stepValid[2] && !loading ? "pointer" : "not-allowed", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: "8px" }}>
              {loading ? (
                <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: C.white, borderRadius: "50%" }} />{loadingMsg}</>
              ) : "Enviar prueba ✓"}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}