import { useEffect, useRef, ReactNode } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

type FadeContentProps = {
  children: ReactNode;
  blur?: boolean;
  duration?: number;
  easing?: string;
  initialOpacity?: number;
  delay?: number;
  className?: string;
};

export default function FadeContent({
  children,
  blur = false,
  duration = 0.6,
  easing = "ease-out",
  initialOpacity = 0,
  delay = 0,
  className = "",
}: FadeContentProps) {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [inView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: {
          opacity: initialOpacity,
          y: 20,
          filter: blur ? "blur(8px)" : "none",
        },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        },
      }}
      transition={{
        duration,
        ease: easing,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}