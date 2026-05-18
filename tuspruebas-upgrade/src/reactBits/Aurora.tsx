import { useEffect, useRef, CSSProperties } from "react";

interface AuroraProps {
  colorStops?: string[];
  amplitude?: number;
  speed?: number;
  className?: string;
  style?: CSSProperties;
}

export default function Aurora({
  colorStops = ["#1063EF", "#0a0e1a", "#4782E5"],
  amplitude = 1.0,
  speed = 0.5,
  className = "",
  style,
}: AuroraProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      timeRef.current += speed * 0.008;
      const t = timeRef.current;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Draw 3 aurora waves
      for (let layer = 0; layer < 3; layer++) {
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        const c = colorStops[layer % colorStops.length];
        grad.addColorStop(0, "transparent");
        grad.addColorStop(0.3 + layer * 0.15, c + "40");
        grad.addColorStop(0.5 + layer * 0.1, c + "80");
        grad.addColorStop(0.7 + layer * 0.05, c + "40");
        grad.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.moveTo(0, h);

        const phaseOffset = layer * 1.2;
        const yBase = h * (0.3 + layer * 0.15);
        const waveH = h * 0.18 * amplitude;

        for (let x = 0; x <= w; x += 4) {
          const progress = x / w;
          const y =
            yBase +
            Math.sin(progress * 3 + t + phaseOffset) * waveH +
            Math.sin(progress * 5 - t * 1.3 + phaseOffset) * (waveH * 0.5) +
            Math.sin(progress * 7 + t * 0.7) * (waveH * 0.25);
          ctx.lineTo(x, y);
        }

        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [colorStops, amplitude, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}