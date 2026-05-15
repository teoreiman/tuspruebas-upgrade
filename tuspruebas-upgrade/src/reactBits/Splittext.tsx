import { useEffect, useRef, ReactNode } from "react";
import { motion, useAnimation, useInView, Variants } from "framer-motion";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;       // ms entre cada letra
  duration?: number;    // duración de cada letra en segundos
  ease?: string | number[];
  splitBy?: "chars" | "words";
  style?: React.CSSProperties;
  onLetterAnimationComplete?: () => void;
}

export default function SplitText({
  text,
  className = "",
  delay = 30,
  duration = 0.6,
  ease = [0.22, 1, 0.36, 1],
  splitBy = "chars",
  style,
  onLetterAnimationComplete,
}: SplitTextProps) {
  const elements = splitBy === "chars" ? text.split("") : text.split(" ");
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [inView, controls]);

  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: 40,
      rotateX: -20,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
    },
  };

  return (
    <p
      ref={ref}
      className={className}
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: splitBy === "words" ? "0.3em" : "0",
        perspective: "600px",
        ...style,
      }}
    >
      {elements.map((el, i) => (
        <motion.span
          key={i}
          initial="hidden"
          animate={controls}
          variants={variants}
          transition={{
            duration,
            delay: i * (delay / 1000),
            ease,
          }}
          onAnimationComplete={
            i === elements.length - 1 ? onLetterAnimationComplete : undefined
          }
          style={{ display: "inline-block", whiteSpace: el === " " ? "pre" : "normal" }}
        >
          {el === " " ? "\u00A0" : el}
        </motion.span>
      ))}
    </p>
  );
}