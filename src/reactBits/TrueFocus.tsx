import { useEffect, useRef, useState, CSSProperties } from "react";

interface TrueFocusProps {
  sentence: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
  className?: string;
  style?: CSSProperties;
}

export default function TrueFocus({
  sentence = "True Focus",
  manualMode = false,
  blurAmount = 4,
  borderColor = "#1063EF",
  glowColor = "rgba(16,99,239,0.4)",
  animationDuration = 0.45,
  pauseBetweenAnimations = 1200,
  className = "",
  style,
}: TrueFocusProps) {
  const words = sentence.split(" ");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, w: 0, h: 0 });

  useEffect(() => {
    if (manualMode) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        setLastActiveIndex(prev);
        return (prev + 1) % words.length;
      });
    }, (animationDuration * 1000) + pauseBetweenAnimations);
    return () => clearInterval(interval);
  }, [manualMode, words.length, animationDuration, pauseBetweenAnimations]);

  useEffect(() => {
    if (!containerRef.current || !wordRefs.current[currentIndex]) return;
    const parent = containerRef.current.getBoundingClientRect();
    const word = wordRefs.current[currentIndex]!.getBoundingClientRect();
    setFocusRect({
      x: word.left - parent.left - 8,
      y: word.top - parent.top - 4,
      w: word.width + 16,
      h: word.height + 8,
    });
  }, [currentIndex]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "relative", display: "inline-flex", flexWrap: "wrap", gap: "0.3em", ...style }}
    >
      {words.map((word, i) => {
        const isActive = i === currentIndex;
        const wasActive = i === lastActiveIndex;

        return (
          <span
            key={i}
            ref={(el) => { wordRefs.current[i] = el; }}
            style={{
              display: "inline-block",
              cursor: manualMode ? "pointer" : "default",
              filter: isActive
                ? "blur(0px)"
                : `blur(${blurAmount}px)`,
              opacity: isActive ? 1 : 0.4,
              transition: `filter ${animationDuration}s ease, opacity ${animationDuration}s ease`,
              color: "inherit",
              fontFamily: "inherit",
              fontSize: "inherit",
              fontWeight: "inherit",
            }}
            onClick={() => {
              if (manualMode) {
                setLastActiveIndex(currentIndex);
                setCurrentIndex(i);
              }
            }}
          >
            {word}
          </span>
        );
      })}

      {/* Focus border box */}
      <div
        style={{
          position: "absolute",
          top: focusRect.y,
          left: focusRect.x,
          width: focusRect.w,
          height: focusRect.h,
          border: `2px solid ${borderColor}`,
          borderRadius: "6px",
          boxShadow: `0 0 12px ${glowColor}, inset 0 0 8px ${glowColor}`,
          pointerEvents: "none",
          transition: `all ${animationDuration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
        }}
      />
    </div>
  );
}