import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ScrollFloatProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  offset?: number;  // how many px to float (default 40)
}

export default function ScrollFloat({
  children,
  className = "",
  style,
  offset = 40,
}: ScrollFloatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y, opacity, ...style }}
    >
      {children}
    </motion.div>
  );
}