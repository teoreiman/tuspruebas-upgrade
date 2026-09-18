import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getUser } from "../services/Auth";
import {
  fetchNotificaciones, marcarNotificacionLeida, marcarTodasLasNotificacionesLeidas,
  type Notificacion,
} from "../services/Notificaciones";

const C = {
  bgCard: "#111827",
  border: "rgba(255,255,255,0.07)",
  blue: "#1063EF",
  white: "#ffffff",
  text: "#c8cdd8",
  gray: "#8A8A8A",
};

// Cada cuánto revisamos si hay notificaciones nuevas mientras la pestaña está
// abierta. No hace falta algo instantáneo (websockets, etc.): que se aprobó
// o rechazó una prueba no es tan urgente como para justificar esa complejidad.
const INTERVALO_MS = 60_000;

function tiempoRelativo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60_000);
  if (min < 1) return "ahora";
  if (min < 60) return `hace ${min} min`;
  const horas = Math.floor(min / 60);
  if (horas < 24) return `hace ${horas}h`;
  const dias = Math.floor(horas / 24);
  if (dias < 7) return `hace ${dias}d`;
  return new Date(iso).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" });
}

export default function NotificacionesBell() {
  const navigate = useNavigate();
  const user = getUser();
  const [abierto, setAbierto] = useState(false);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [noLeidas, setNoLeidas] = useState(0);
  const [cargando, setCargando] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const cargar = useCallback(() => {
    if (!user) return;
    fetchNotificaciones()
      .then(({ notificaciones, noLeidas }) => { setNotificaciones(notificaciones); setNoLeidas(noLeidas); })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!user) return;
    cargar();
    const id = setInterval(cargar, INTERVALO_MS);
    return () => clearInterval(id);
  }, [user, cargar]);

  // Cerrar el dropdown al hacer clic afuera.
  useEffect(() => {
    if (!abierto) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setAbierto(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [abierto]);

  if (!user) return null;

  const abrir = () => {
    setAbierto((v) => !v);
    if (!abierto) cargar();
  };

  const irA = async (n: Notificacion) => {
    if (!n.leida) {
      setNotificaciones((prev) => prev.map((x) => (x.id === n.id ? { ...x, leida: true } : x)));
      setNoLeidas((c) => Math.max(0, c - 1));
      marcarNotificacionLeida(n.id).catch(() => {});
    }
    setAbierto(false);
    if (n.prueba_id) navigate(`/prueba/${n.prueba_id}`);
  };

  const marcarTodas = async () => {
    if (noLeidas === 0) return;
    setCargando(true);
    setNotificaciones((prev) => prev.map((x) => ({ ...x, leida: true })));
    setNoLeidas(0);
    try {
      await marcarTodasLasNotificacionesLeidas();
    } catch {
      cargar(); // si falló, volvemos a pedir el estado real
    } finally {
      setCargando(false);
    }
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <motion.button
        whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
        whileTap={{ scale: 0.96 }}
        onClick={abrir}
        title="Notificaciones"
        style={{
          position: "relative", width: "36px", height: "36px", borderRadius: "10px",
          border: `1px solid ${C.border}`, backgroundColor: "transparent", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px",
        }}>
        🔔
        {noLeidas > 0 && (
          <span style={{
            position: "absolute", top: "-4px", right: "-4px", minWidth: "16px", height: "16px",
            padding: "0 4px", borderRadius: "999px", backgroundColor: "#dc2626", color: "#fff",
            fontSize: "10px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1,
          }}>
            {noLeidas > 9 ? "9+" : noLeidas}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {abierto && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute", top: "44px", right: 0, backgroundColor: C.bgCard, border: `1px solid ${C.border}`,
              borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.4)", width: "320px", maxHeight: "420px",
              overflowY: "auto", zIndex: 100,
            }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, backgroundColor: C.bgCard }}>
              <p style={{ fontSize: "13px", fontWeight: 700, color: C.white }}>Notificaciones</p>
              {noLeidas > 0 && (
                <button onClick={marcarTodas} disabled={cargando}
                  style={{ fontSize: "11px", color: C.blue, background: "none", border: "none", cursor: cargando ? "default" : "pointer", fontWeight: 600 }}>
                  Marcar todas leídas
                </button>
              )}
            </div>

            {notificaciones.length === 0 ? (
              <div style={{ padding: "28px 16px", textAlign: "center" }}>
                <p style={{ fontSize: "13px", color: C.gray }}>No tenés notificaciones todavía</p>
              </div>
            ) : (
              <div style={{ padding: "4px" }}>
                {notificaciones.map((n) => (
                  <motion.button key={n.id} whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                    onClick={() => irA(n)}
                    style={{
                      width: "100%", padding: "10px 12px", border: "none", borderRadius: "8px",
                      backgroundColor: n.leida ? "transparent" : "rgba(16,99,239,0.08)", cursor: "pointer",
                      textAlign: "left", display: "flex", gap: "8px", alignItems: "flex-start",
                      fontFamily: "'DM Sans', sans-serif",
                    }}>
                    {!n.leida && (
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: C.blue, marginTop: "6px", flexShrink: 0 }} />
                    )}
                    <div style={{ flex: 1, marginLeft: n.leida ? "14px" : 0 }}>
                      <p style={{ fontSize: "12.5px", color: n.leida ? C.gray : C.text, lineHeight: 1.5 }}>{n.mensaje}</p>
                      <p style={{ fontSize: "10.5px", color: C.gray, marginTop: "3px" }}>{tiempoRelativo(n.created_at)}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
