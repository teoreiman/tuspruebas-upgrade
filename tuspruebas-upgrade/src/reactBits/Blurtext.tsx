import { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  animateBy?: "words" | "characters";
  style?: React.CSSProperties;
}

export default function BlurText({
  text,
  className = "",
  delay = 50,
  animateBy = "words",
  style,
}: BlurTextProps) {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

  return (
    <p
      ref={ref}
      className={className}
      style={{ display: "flex", flexWrap: "wrap", gap: "0.25em", ...style }}
    >
      {elements.map((el, i) => (
        <motion.span
          key={i}
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { filter: "blur(10px)", opacity: 0, y: -10 },
            visible: { filter: "blur(0px)", opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.5, delay: i * (delay / 1000), ease: "easeOut" }}
          style={{ display: "inline-block" }}
        >
          {el}
        </motion.span>
      ))}
    </p>
  );
}