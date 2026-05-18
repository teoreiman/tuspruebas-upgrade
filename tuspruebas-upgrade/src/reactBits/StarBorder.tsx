import { ReactNode, CSSProperties } from "react";

interface StarBorderProps {
  children: ReactNode;
  color?: string;
  speed?: string;
  className?: string;
  style?: CSSProperties;
  as?: keyof JSX.IntrinsicElements;
}

export default function StarBorder({
  children,
  color = "#1063EF",
  speed = "6s",
  style,
  className = "",
}: StarBorderProps) {
  const id = `star-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <>
      <style>{`
        @keyframes star-move-${id} {
          0%   { offset-distance: 0%; }
          100% { offset-distance: 100%; }
        }
        .star-border-${id} {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          display: inline-flex;
        }
        .star-border-${id}::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1.5px;
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            ${color} 60deg,
            transparent 120deg,
            transparent 240deg,
            ${color}88 300deg,
            transparent 360deg
          );
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: star-rotate-${id} ${speed} linear infinite;
        }
        @keyframes star-rotate-${id} {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div className={`star-border-${id} ${className}`} style={style}>
        {children}
      </div>
    </>
  );
}