import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getUser, clearSession, isSuperAdmin, type User } from "../services/Auth";
import { actualizarPerfil, comprimirAvatar, fetchPerfil, type CambiosPerfil, type Perfil as DatosPerfil } from "../services/Perfil";
import Logo from "./logo";
import NotificacionesBell from "./NotificacionesBell";
import Avatar from "./Avatar";

const C = {
  bg: "#0a0e1a", bgCard: "#111827", border: "rgba(255,255,255,0.07)",
  blue: "#1063EF", blueHov: "#0050EF", white: "#ffffff", text: "#E8E8E8", gray: "#8A8A8A",
};

const MAX_NOMBRE = 60;
const MIN_PASSWORD = 6;
const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 14px",
  border: `1.5px solid ${C.border}`, borderRadius: "10px",
  fontSize: "14px", color: C.white, backgroundColor: "rgba(255,255,255,0.04)",
  outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif",
  transition: "border-color 0.2s",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "16px",
  padding: "20px 24px", marginBottom: "12px", display: "flex", flexDirection: "column", gap: "16px",
};

const tituloStyle: React.CSSProperties = {
  fontSize: "11px", fontWeight: 700, color: C.gray, textTransform: "uppercase", letterSpacing: "0.5px",
};

const botonSecundarioStyle: React.CSSProperties = {
  fontSize: "12px", fontWeight: 600, padding: "7px 14px", borderRadius: "8px",
  border: `1px solid ${C.border}`, backgroundColor: "transparent", cursor: "pointer",
  fontFamily: "'DM Sans', sans-serif",
};

type Aviso = { tipo: "ok" | "error"; texto: string } | null;

function mensajeDe(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <span style={{ fontSize: "13px", fontWeight: 600, color: C.text }}>{label}</span>
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props}
      style={{ ...inputStyle, ...(props.disabled ? { opacity: 0.6, cursor: "not-allowed" } : {}) }}
      onFocus={(e) => (e.currentTarget.style.borderColor = C.blue)}
      onBlur={(e) => (e.currentTarget.style.borderColor = C.border)} />
  );
}

function MensajeAviso({ aviso }: { aviso: Aviso }) {
  if (!aviso) return null;
  const ok = aviso.tipo === "ok";
  return (
    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
      style={{
        padding: "10px 14px", borderRadius: "9px", fontSize: "13px", textAlign: "left",
        backgroundColor: ok ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
        border: `1px solid ${ok ? "rgba(52,211,153,0.3)" : "rgba(239,68,68,0.3)"}`,
        color: ok ? "#34d399" : "#f87171",
      }}>
      {aviso.texto}
    </motion.div>
  );
}

function BotonGuardar({ deshabilitado, guardando }: { deshabilitado: boolean; guardando: boolean }) {
  const inactivo = deshabilitado || guardando;
  return (
    <motion.button type="submit" disabled={inactivo}
      whileHover={inactivo ? undefined : { backgroundColor: C.blueHov }}
      whileTap={inactivo ? undefined : { scale: 0.98 }}
      style={{
        alignSelf: "flex-start", backgroundColor: C.blue, color: C.white, fontSize: "13px", fontWeight: 700,
        padding: "10px 20px", borderRadius: "10px", border: "none", fontFamily: "'DM Sans', sans-serif",
        cursor: inactivo ? "not-allowed" : "pointer", opacity: inactivo ? 0.5 : 1,
      }}>
      {guardando ? "Guardando..." : "Guardar cambios"}
    </motion.button>
  );
}

export default function Perfil() {
  const navigate = useNavigate();
  const fotoRef = useRef<HTMLInputElement>(null);
  const esSuperAdmin = isSuperAdmin();

  const [user, setUser] = useState<User | null>(() => getUser());
  const [tienePassword, setTienePassword] = useState(true);

  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [avisoFoto, setAvisoFoto] = useState<Aviso>(null);

  const [nombre, setNombre] = useState(user?.nombre ?? "");
  const [guardandoNombre, setGuardandoNombre] = useState(false);
  const [avisoNombre, setAvisoNombre] = useState<Aviso>(null);

  const [email, setEmail] = useState(user?.email ?? "");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [passwordRepetida, setPasswordRepetida] = useState("");
  const [passwordActual, setPasswordActual] = useState("");
  const [guardandoCuenta, setGuardandoCuenta] = useState(false);
  const [avisoCuenta, setAvisoCuenta] = useState<Aviso>(null);

  useEffect(() => {
    const local = getUser();
    fetchPerfil()
      .then(({ usuario, tiene_password }) => {
        setUser(usuario);
        setTienePassword(tiene_password);
        setNombre((actual) => (actual === (local?.nombre ?? "") ? usuario.nombre : actual));
        setEmail((actual) => (actual === (local?.email ?? "") ? usuario.email : actual));
      })
      .catch(() => {});
  }, []);

  if (!user) return <Navigate to="/login" replace />;

  const aplicar = (perfil: DatosPerfil) => {
    setUser(perfil.usuario);
    setTienePassword(perfil.tiene_password);
  };

  const handleLogout = () => { clearSession(); navigate("/"); };

  const cambiarFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    e.target.value = "";
    if (!archivo) return;
    setSubiendoFoto(true);
    setAvisoFoto(null);
    try {
      aplicar(await actualizarPerfil({ avatar: await comprimirAvatar(archivo) }));
      setAvisoFoto({ tipo: "ok", texto: "Foto de perfil actualizada" });
    } catch (err) {
      setAvisoFoto({ tipo: "error", texto: mensajeDe(err, "No se pudo cambiar la foto") });
    } finally {
      setSubiendoFoto(false);
    }
  };

  const quitarFoto = async () => {
    setSubiendoFoto(true);
    setAvisoFoto(null);
    try {
      aplicar(await actualizarPerfil({ avatar: null }));
      setAvisoFoto({ tipo: "ok", texto: "Quitaste tu foto de perfil" });
    } catch (err) {
      setAvisoFoto({ tipo: "error", texto: mensajeDe(err, "No se pudo quitar la foto") });
    } finally {
      setSubiendoFoto(false);
    }
  };

  const nombreLimpio = nombre.trim();
  const nombreCambio = nombreLimpio !== "" && nombreLimpio !== user.nombre;

  const guardarNombre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreCambio) return;
    setGuardandoNombre(true);
    setAvisoNombre(null);
    try {
      const perfil = await actualizarPerfil({ nombre: nombreLimpio });
      aplicar(perfil);
      setNombre(perfil.usuario.nombre);
      setAvisoNombre({ tipo: "ok", texto: "Datos del perfil guardados" });
    } catch (err) {
      setAvisoNombre({ tipo: "error", texto: mensajeDe(err, "No se pudo guardar el nombre") });
    } finally {
      setGuardandoNombre(false);
    }
  };

  const emailLimpio = email.trim();
  const emailCambio = !esSuperAdmin && emailLimpio !== user.email;
  const passwordCambio = passwordNueva !== "";
  const pideActual = tienePassword && (emailCambio || passwordCambio);

  const guardarCuenta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailCambio && !passwordCambio) return;
    const error =
      emailCambio && !EMAIL_VALIDO.test(emailLimpio) ? "El email no es válido" :
      passwordCambio && passwordNueva.length < MIN_PASSWORD ? `La contraseña nueva debe tener al menos ${MIN_PASSWORD} caracteres` :
      passwordCambio && passwordNueva !== passwordRepetida ? "Las contraseñas nuevas no coinciden" :
      pideActual && !passwordActual ? "Escribí tu contraseña actual para confirmar los cambios" : "";
    if (error) { setAvisoCuenta({ tipo: "error", texto: error }); return; }

    const cambios: CambiosPerfil = {};
    if (emailCambio) cambios.email = emailLimpio;
    if (passwordCambio) cambios.password_nueva = passwordNueva;
    if (pideActual) cambios.password_actual = passwordActual;

    setGuardandoCuenta(true);
    setAvisoCuenta(null);
    try {
      const perfil = await actualizarPerfil(cambios);
      aplicar(perfil);
      setEmail(perfil.usuario.email);
      setPasswordNueva("");
      setPasswordRepetida("");
      setPasswordActual("");
      setAvisoCuenta({
        tipo: "ok",
        texto: emailCambio && passwordCambio ? "Actualizaste tu email y tu contraseña"
          : emailCambio ? "Actualizaste tu email" : "Actualizaste tu contraseña",
      });
    } catch (err) {
      setAvisoCuenta({ tipo: "error", texto: mensajeDe(err, "No se pudieron guardar los cambios") });
    } finally {
      setGuardandoCuenta(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, fontFamily: "'DM Sans', sans-serif" }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 40, backgroundColor: "rgba(10,14,26,0.95)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}`, padding: "0 48px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo size="sm" onClick={() => navigate("/home")} />
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <NotificacionesBell />
            <motion.button onClick={() => navigate("/home")} whileHover={{ color: C.white }}
              style={{ fontSize: "13px", color: C.gray, background: "none", border: "none", cursor: "pointer" }}>
              ← Volver
            </motion.button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: "520px", margin: "0 auto", padding: "52px 24px" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ position: "relative", width: "96px", height: "96px", margin: "0 auto 16px" }}>
              <Avatar nombre={user.nombre} foto={user.avatar} tamaño={96} fondo={C.blue}
                style={{ fontWeight: 900, fontFamily: "'Syne', sans-serif", opacity: subiendoFoto ? 0.5 : 1, transition: "opacity 0.2s" }} />
              <motion.button type="button" onClick={() => fotoRef.current?.click()} disabled={subiendoFoto}
                whileHover={subiendoFoto ? undefined : { scale: 1.08 }} whileTap={subiendoFoto ? undefined : { scale: 0.95 }}
                title="Cambiar foto de perfil"
                style={{ position: "absolute", right: "-2px", bottom: "-2px", width: "32px", height: "32px", borderRadius: "50%", border: `3px solid ${C.bg}`, backgroundColor: C.blue, color: C.white, cursor: subiendoFoto ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </motion.button>
              <input ref={fotoRef} type="file" accept="image/*" onChange={cambiarFoto} style={{ display: "none" }} />
            </div>
            <h1 style={{ fontSize: "22px", fontWeight: 900, color: C.white, fontFamily: "'Syne', sans-serif", marginBottom: "4px" }}>{user.nombre}</h1>
            <p style={{ fontSize: "14px", color: C.gray }}>{user.email}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "16px" }}>
              <motion.button type="button" onClick={() => fotoRef.current?.click()} disabled={subiendoFoto}
                whileHover={subiendoFoto ? undefined : { borderColor: C.blue }}
                style={{ ...botonSecundarioStyle, color: C.text, cursor: subiendoFoto ? "default" : "pointer" }}>
                {subiendoFoto ? "Guardando..." : user.avatar ? "Cambiar foto" : "Subir foto"}
              </motion.button>
              {user.avatar && (
                <motion.button type="button" onClick={quitarFoto} disabled={subiendoFoto}
                  whileHover={subiendoFoto ? undefined : { backgroundColor: "rgba(239,68,68,0.08)" }}
                  style={{ ...botonSecundarioStyle, color: "#ef4444", cursor: subiendoFoto ? "default" : "pointer" }}>
                  Quitar foto
                </motion.button>
              )}
            </div>
            {avisoFoto && (
              <div style={{ maxWidth: "340px", margin: "14px auto 0" }}>
                <MensajeAviso aviso={avisoFoto} />
              </div>
            )}
          </div>

          <form onSubmit={guardarNombre} noValidate style={cardStyle}>
            <p style={tituloStyle}>Datos del perfil</p>
            <Campo label="Nombre">
              <Input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
                maxLength={MAX_NOMBRE} autoComplete="name" placeholder="Tu nombre" />
            </Campo>
            <p style={{ fontSize: "12px", color: C.gray, marginTop: "-8px" }}>
              Es el nombre que ven los demás en las pruebas que subís.
            </p>
            <MensajeAviso aviso={avisoNombre} />
            <BotonGuardar deshabilitado={!nombreCambio} guardando={guardandoNombre} />
          </form>

          <form onSubmit={guardarCuenta} noValidate style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={tituloStyle}>Datos de la cuenta</p>
              <span style={{ fontSize: "12px", color: C.gray }}>ID #{user.id}</span>
            </div>
            <Campo label="Email">
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                autoComplete="email" disabled={esSuperAdmin} />
            </Campo>
            {esSuperAdmin && (
              <p style={{ fontSize: "12px", color: C.gray, marginTop: "-8px" }}>
                El email de la cuenta de administración no se puede cambiar.
              </p>
            )}
            <Campo label="Contraseña nueva">
              <Input type="password" value={passwordNueva} onChange={(e) => setPasswordNueva(e.target.value)}
                autoComplete="new-password" placeholder="Dejala vacía para no cambiarla" />
            </Campo>
            {passwordCambio && (
              <Campo label="Repetí la contraseña nueva">
                <Input type="password" value={passwordRepetida} onChange={(e) => setPasswordRepetida(e.target.value)}
                  autoComplete="new-password" />
              </Campo>
            )}
            {pideActual && (
              <Campo label="Contraseña actual">
                <Input type="password" value={passwordActual} onChange={(e) => setPasswordActual(e.target.value)}
                  autoComplete="current-password" placeholder="Para confirmar que sos vos" />
              </Campo>
            )}
            <MensajeAviso aviso={avisoCuenta} />
            <BotonGuardar deshabilitado={!emailCambio && !passwordCambio} guardando={guardandoCuenta} />
          </form>

          <div style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "16px", overflow: "hidden", marginBottom: "12px" }}>
            <div style={{ padding: "4px" }}>
              {[
                { label: "Mis pruebas subidas", icon: "↑", path: "/mis-pruebas" },
                { label: "Pruebas favoritas",   icon: "★", path: "/favoritas"   },
                { label: "Subir prueba",         icon: "+", path: "/subir"       },
              ].map((item) => (
                <motion.button key={item.label} onClick={() => navigate(item.path)} whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", border: "none", backgroundColor: "transparent", cursor: "pointer", borderRadius: "12px", fontFamily: "'DM Sans', sans-serif" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "16px", color: C.blue }}>{item.icon}</span>
                    <span style={{ fontSize: "14px", fontWeight: 500, color: C.text }}>{item.label}</span>
                  </div>
                  <span style={{ fontSize: "14px", color: C.gray }}>→</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "16px", overflow: "hidden" }}>
            <div style={{ padding: "4px" }}>
              <motion.button onClick={handleLogout} whileHover={{ backgroundColor: "rgba(239,68,68,0.08)" }} whileTap={{ scale: 0.99 }}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", border: "none", backgroundColor: "transparent", cursor: "pointer", borderRadius: "12px", fontFamily: "'DM Sans', sans-serif" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#ef4444" }}>Cerrar sesión</span>
                </div>
                <span style={{ fontSize: "14px", color: "#ef4444" }}>→</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
