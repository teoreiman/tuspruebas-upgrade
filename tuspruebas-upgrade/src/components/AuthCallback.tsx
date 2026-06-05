import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveSession } from "../services/Auth";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token  = params.get("token");
    const nombre = params.get("nombre");
    const email  = params.get("email");
    const rol    = params.get("rol");
    const id     = params.get("id");

    if (token && nombre && email && id) {
      saveSession(token, {
        id:     Number(id),
        nombre: decodeURIComponent(nombre),
        email:  decodeURIComponent(email),
        rol:    rol || "usuario",
      });
      navigate("/home", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center",
      background: "#070b14", color: "#fff",
      fontFamily: "'DM Sans', sans-serif", fontSize: "14px",
    }}>
      Iniciando sesión...
    </div>
  );
}
