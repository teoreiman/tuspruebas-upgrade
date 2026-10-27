import { useState } from "react";

export default function Avatar({ nombre, foto, tamaño, fondo = "#1063EF", style }: {
  nombre?: string;
  foto?: string | null;
  tamaño: number;
  fondo?: string;
  style?: React.CSSProperties;
}) {
  const [fotoRota, setFotoRota] = useState<string | null>(null);
  const base: React.CSSProperties = {
    width: `${tamaño}px`, height: `${tamaño}px`, borderRadius: "50%", flexShrink: 0,
  };

  if (foto && foto !== fotoRota) {
    return (
      <img src={foto} alt={nombre ? `Foto de ${nombre}` : "Foto de perfil"} onError={() => setFotoRota(foto)}
        style={{ ...base, objectFit: "cover", display: "block", ...style }} />
    );
  }

  return (
    <div style={{
      ...base, backgroundColor: fondo, display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: `${Math.round(tamaño * 0.4)}px`, color: "#ffffff", fontWeight: 700, ...style,
    }}>
      {nombre?.trim().charAt(0).toUpperCase() || "U"}
    </div>
  );
}
