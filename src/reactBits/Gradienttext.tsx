import { ReactNode } from "react";
import { motion } from "framer-motion";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  colors?: string[];
  animationSpeed?: number; // seconds
}

export default function GradientText({
  children,
  className = "",
  style,
  colors = ["#6b7280", "#374151", "#9ca3af", "#374151", "#6b7280"],
  animationSpeed = 5,
}: GradientTextProps) {
  const gradient = `linear-gradient(90deg, ${colors.join(", ")})`;

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
      style={{
        backgroundImage: gradient,
        backgroundSize: "300% 100%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        display: "inline-block",
        animation: `gradientShift ${animationSpeed}s ease infinite`,
        ...style,
      }}
    >
      {children}
    </motion.span>
  );
}

// Inject keyframes once
if (typeof document !== "undefined") {
  const id = "gradient-text-keyframes";
  if (!document.getElementById(id)) {
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @keyframes gradientShift {
        0%   { background-position: 0% 50%; }
        50%  { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
    document.head.appendChild(style);
  }
}