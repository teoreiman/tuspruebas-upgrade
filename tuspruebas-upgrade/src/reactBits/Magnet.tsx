import { useRef, useState, ReactNode, CSSProperties } from "react";

interface MagnetProps {
  children: ReactNode;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

export default function Magnet({
  children,
  padding = 60,
  disabled = false,
  magnetStrength = 0.4,
  className = "",
  style,
  onClick,
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    setPosition({ x: deltaX * magnetStrength, y: deltaY * magnetStrength });
  };

  const handleMouseEnter = () => {
    if (!disabled) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={ref}
      className={className}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        display: "inline-block",
        padding: `${padding}px`,
        margin: `-${padding}px`,
        cursor: "pointer",
        ...style,
      }}
    >
      <div
        style={{
          transform: isHovered
            ? `translate(${position.x}px, ${position.y}px)`
            : "translate(0, 0)",
          transition: isHovered
            ? "transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
            : "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        {children}
      </div>
    </div>
  );
}