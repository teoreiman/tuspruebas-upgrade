import { useState } from "react";

const C = { gold: "#f59e0b", empty: "rgba(255,255,255,0.18)", gray: "#8A8A8A" };

// Estrellas de 1 a 5. En modo lectura (sin onCalificar) solo muestra el
// promedio. En modo interactivo, click califica; click de nuevo en la misma
// estrella que ya tenías puesta la saca (null).
export default function EstrellasCalificacion({
  promedio, cantidad, miCalificacion = null, onCalificar, tamaño = "md",
}: {
  promedio: number | null;
  cantidad: number;
  miCalificacion?: number | null;
  onCalificar?: (puntaje: number | null) => void;
  tamaño?: "sm" | "md";
}) {
  const [hover, setHover] = useState<number | null>(null);
  const [guardando, setGuardando] = useState(false);
  const interactivo = !!onCalificar;
  const fontSize = tamaño === "sm" ? "13px" : "17px";

  const valorMostrado = interactivo ? hover ?? miCalificacion ?? 0 : Math.round(promedio ?? 0);

  const click = async (puntaje: number) => {
    if (!onCalificar || guardando) return;
    setGuardando(true);
    try {
      await onCalificar(miCalificacion === puntaje ? null : puntaje);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <div
        style={{ display: "flex", gap: "1px", cursor: interactivo ? (guardando ? "default" : "pointer") : "default", opacity: guardando ? 0.6 : 1 }}
        onMouseLeave={() => interactivo && setHover(null)}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            onMouseEnter={() => interactivo && setHover(i)}
            onClick={() => click(i)}
            style={{ fontSize, color: i <= valorMostrado ? C.gold : C.empty, lineHeight: 1 }}
          >
            {i <= valorMostrado ? "★" : "☆"}
          </span>
        ))}
      </div>
      {cantidad > 0 ? (
        <span style={{ fontSize: tamaño === "sm" ? "11px" : "12px", color: C.gray }}>
          {promedio?.toFixed(1)} ({cantidad})
        </span>
      ) : interactivo ? (
        <span style={{ fontSize: "11px", color: C.gray }}>Sé el primero en calificar</span>
      ) : (
        <span style={{ fontSize: "11px", color: C.gray }}>Sin calificaciones</span>
      )}
    </div>
  );
}
