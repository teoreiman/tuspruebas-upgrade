import { CSSProperties, ReactNode } from "react";

interface ShinyTextProps {
  text?: string;
  children?: ReactNode;
  disabled?: boolean;
  speed?: number;
  className?: string;
  style?: CSSProperties;
}

export default function ShinyText({
  text,
  children,
  disabled = false,
  speed = 5,
  className = "",
  style,
}: ShinyTextProps) {
  const content = children ?? text ?? "";

  return (
    <>
      <style>{`
        @keyframes shinyTextSweep {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
      <span
        className={className}
        style={{
          display: "inline-block",
          color: "inherit",
          ...(disabled ? {} : {
            backgroundImage: "linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.6) 50%, transparent 60%)",
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            animation: `shinyTextSweep ${speed}s linear infinite`,
          }),
          ...style,
        }}
      >
        {content}
      </span>
    </>
  );
}