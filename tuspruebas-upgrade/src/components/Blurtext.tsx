import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

type BlurTextProps = {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "characters";
  direction?: "top" | "bottom";
  onAnimationComplete?: () => void;
};

export default function BlurText({
  text,
  delay = 50,
  className = "",
  animateBy = "words",
  direction = "top",
  onAnimationComplete,
}: BlurTextProps) {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [inView, controls]);

  const variants = {
    hidden: {
      filter: "blur(10px)",
      opacity: 0,
      y: direction === "top" ? -20 : 20,
    },
    visible: {
      filter: "blur(0px)",
      opacity: 1,
      y: 0,
    },
  };

  return (
    <p ref={ref} className={`flex flex-wrap gap-x-[0.25em] ${className}`}>
      {elements.map((el, i) => (
        <motion.span
          key={i}
          initial="hidden"
          animate={controls}
          variants={variants}
          transition={{
            duration: 0.5,
            delay: i * (delay / 1000),
            ease: [0.2, 0.65, 0.3, 0.9],
          }}
          onAnimationComplete={i === elements.length - 1 ? onAnimationComplete : undefined}
          style={{ display: "inline-block" }}
        >
          {el}
        </motion.span>
      ))}
    </p>
  );
}