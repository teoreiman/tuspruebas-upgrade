import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { saveSession } from "../services/Auth";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token  = searchParams.get("token");
    const nombre = searchParams.get("nombre");
    const email  = searchParams.get("email");
    const rol    = searchParams.get("rol");
    const id     = searchParams.get("id");
    console.log({ token, nombre, email, rol, id });

    if (token && nombre && email && id) {
      saveSession(token, {
        id:     Number(id),
        nombre: decodeURIComponent(nombre.replace(/\+/g, " ")),
        email:  decodeURIComponent(email),
        rol:    rol || "usuario",
      });
      navigate("/home", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate, searchParams]);

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