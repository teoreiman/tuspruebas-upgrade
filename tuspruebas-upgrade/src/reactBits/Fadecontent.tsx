import { useEffect, useRef, ReactNode } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

type FadeContentProps = {
  children: ReactNode;
  blur?: boolean;
  duration?: number;
  delay?: number;
  className?: string;
};

export default function FadeContent({
  children,
  blur = false,
  duration = 0.6,
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
          opacity: 0,
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
        ease: "easeOut",
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}