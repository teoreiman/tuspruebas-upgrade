const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || "";
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "";
const TEMPLATE_ESTADO_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ESTADO_ID || "";
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || "";

export interface NotifyParams {
  usuario_nombre: string;
  usuario_email: string;
  colegio: string;
  año: string;
  materia: string;
  profesor: string;
  tema: string;
  notas: string;
  archivo_nombre: string;
}

export async function notifyAdminNewPrueba(params: NotifyParams): Promise<void> {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.info(
      "[TusPruebas] Notificación omitida — configurá VITE_EMAILJS_* en .env.local"
    );
    return;
  }

  const fecha = new Date().toLocaleDateString("es-AR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  try {
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id:  SERVICE_ID,
        template_id: TEMPLATE_ID,
        user_id:     PUBLIC_KEY,
        template_params: {
          to_name:        "Admin",
          to_email:       "admin@tuspruebas.com",
          usuario_nombre: params.usuario_nombre,
          usuario_email:  params.usuario_email,
          colegio:        params.colegio,
          año:            params.año,
          materia:        params.materia,
          profesor:       params.profesor || "—",
          tema:           params.tema    || "—",
          notas:          params.notas   || "—",
          archivo_nombre: params.archivo_nombre || "—",
          fecha,
          admin_link: `${window.location.origin}/admin`,
        },
      }),
    });
    if (!res.ok) console.error("[TusPruebas] EmailJS error:", await res.text());
  } catch (err) {
    console.error("[TusPruebas] Error de red al notificar:", err);
  }
}

export interface NotifyEstadoParams {
  usuario_nombre: string;
  usuario_email: string;
  colegio: string;
  año: string;
  materia: string;
  tema: string;
  estado: "aprobada" | "rechazada";
}

export async function notifyUserPruebaEstado(params: NotifyEstadoParams): Promise<void> {
  if (!SERVICE_ID || !TEMPLATE_ESTADO_ID || !PUBLIC_KEY) {
    console.info(
      "[TusPruebas] Notificación de estado omitida — configurá VITE_EMAILJS_TEMPLATE_ESTADO_ID en .env.local"
    );
    return;
  }
  if (!params.usuario_email) return;

  const fecha = new Date().toLocaleDateString("es-AR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  try {
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id:  SERVICE_ID,
        template_id: TEMPLATE_ESTADO_ID,
        user_id:     PUBLIC_KEY,
        template_params: {
          to_name:  params.usuario_nombre || "Estudiante",
          to_email: params.usuario_email,
          colegio:  params.colegio,
          año:      params.año,
          materia:  params.materia,
          tema:     params.tema || "—",
          estado:   params.estado,
          fecha,
          ver_link: `${window.location.origin}/mis-pruebas`,
        },
      }),
    });
    if (!res.ok) console.error("[TusPruebas] EmailJS error (estado):", await res.text());
  } catch (err) {
    console.error("[TusPruebas] Error de red al notificar estado:", err);
  }
}
