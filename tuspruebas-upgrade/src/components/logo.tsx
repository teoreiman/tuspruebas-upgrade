interface LogoProps {
    size?: "sm" | "md" | "lg";
    onClick?: () => void;
    style?: React.CSSProperties;
  }
  
  const sizes = {
    sm: { width: 140, height: 30, iconSize: 26, fontSize: 14, iconFontSize: 10, gap: 8 },
    md: { width: 200, height: 44, iconSize: 38, fontSize: 20, iconFontSize: 14, gap: 10 },
    lg: { width: 280, height: 60, iconSize: 52, fontSize: 28, iconFontSize: 20, gap: 14 },
  };
  
  export default function Logo({ size = "md", onClick, style }: LogoProps) {
    const s = sizes[size];
  
    return (
      <div
        onClick={onClick}
        style={{
          display: "flex",
          alignItems: "center",
          gap: `${s.gap}px`,
          cursor: onClick ? "pointer" : "default",
          ...style,
        }}
      >
        {/* Icono TP */}
        <svg
          width={s.iconSize}
          height={s.iconSize}
          viewBox="0 0 52 52"
          xmlns="http://www.w3.org/2000/svg"
          style={{ flexShrink: 0 }}
        >
          <rect x="1" y="1" width="50" height="50" rx="10" ry="10" fill="#1a1f2e" />
          <rect x="1" y="1" width="50" height="50" rx="10" ry="10" fill="none" stroke="#1063EF" strokeWidth="2" />
          <text
            x="26"
            y="34"
            fontFamily="'Arial Black', Arial, sans-serif"
            fontSize="18"
            fontWeight="900"
            fill="#4782E5"
            textAnchor="middle"
            letterSpacing="-1"
          >
            TP
          </text>
        </svg>
  
        {/* Texto tusPruebas */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "0px" }}>
          <span style={{ fontSize: `${s.fontSize}px`, fontWeight: 400, color: "#ffffff", fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.3px" }}>
            tus
          </span>
          <span style={{ fontSize: `${s.fontSize}px`, fontWeight: 900, color: "#1063EF", fontFamily: "'Syne', sans-serif", letterSpacing: "-0.3px" }}>
            Pruebas
          </span>
        </div>
      </div>
    );
  }