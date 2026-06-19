import { ReactNode, useRef, CSSProperties } from "react";

interface Spark {
  id: number;
  x: number;
  y: number;
  angle: number;
}

interface ClickSparkProps {
  children: ReactNode;
  sparkColor?: string;
  sparkSize?: number;
  sparkCount?: number;
  duration?: number;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

export default function ClickSpark({
  children,
  sparkColor = "#1063EF",
  sparkSize = 8,
  sparkCount = 8,
  duration = 600,
  className = "",
  style,
  onClick,
}: ClickSparkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sparksRef = useRef<HTMLDivElement>(null);

  const createSparks = (x: number, y: number) => {
    if (!sparksRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const localX = x - rect.left;
    const localY = y - rect.top;

    for (let i = 0; i < sparkCount; i++) {
      const angle = (360 / sparkCount) * i;
      const spark = document.createElement("div");
      const distance = 30 + Math.random() * 20;
      const rad = (angle * Math.PI) / 180;
      const tx = Math.cos(rad) * distance;
      const ty = Math.sin(rad) * distance;

      spark.style.cssText = `
        position: absolute;
        width: ${sparkSize}px;
        height: ${sparkSize}px;
        border-radius: 50%;
        background: ${sparkColor};
        left: ${localX - sparkSize / 2}px;
        top: ${localY - sparkSize / 2}px;
        pointer-events: none;
        box-shadow: 0 0 6px ${sparkColor};
        animation: spark-fly-${i} ${duration}ms ease-out forwards;
      `;

      const styleEl = document.createElement("style");
      styleEl.textContent = `
        @keyframes spark-fly-${i} {
          0%   { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(${tx}px, ${ty}px) scale(0); opacity: 0; }
        }
      `;
      document.head.appendChild(styleEl);
      sparksRef.current.appendChild(spark);

      setTimeout(() => {
        spark.remove();
        styleEl.remove();
      }, duration + 50);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    createSparks(e.clientX, e.clientY);
    onClick?.();
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "relative", display: "inline-block", ...style }}
      onClick={handleClick}
    >
      {children}
      <div
        ref={sparksRef}
        style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible", zIndex: 100 }}
      />
    </div>
  );
}