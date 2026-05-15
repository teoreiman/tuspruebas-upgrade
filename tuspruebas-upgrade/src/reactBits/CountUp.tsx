import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface CountUpProps {
  from?: number;
  to: number;
  separator?: string;
  direction?: "up" | "down";
  duration?: number; // seconds
  className?: string;
  suffix?: string;
  prefix?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

export default function CountUp({
  from = 0,
  to,
  separator = "",
  direction = "up",
  duration = 2,
  className = "",
  suffix = "",
  prefix = "",
  onStart,
  onEnd,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [value, setValue] = useState(direction === "up" ? from : to);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!inView || startedRef.current) return;
    startedRef.current = true;

    onStart?.();

    const startTime = performance.now();
    const startVal = direction === "up" ? from : to;
    const endVal = direction === "up" ? to : from;
    const totalChange = endVal - startVal;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const frame = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = Math.round(startVal + totalChange * eased);
      setValue(current);
      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        onEnd?.();
      }
    };

    requestAnimationFrame(frame);
  }, [inView, from, to, direction, duration, onStart, onEnd]);

  const formatted = separator
    ? value.toLocaleString("es-AR")
    : String(value);

  return (
    <span ref={ref} className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
}