"use client";

import { ReactNode } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface ScrollRevealProps {
  children: ReactNode;
  animation?: "slideUp" | "fadeIn" | "scaleUp" | "stagger";
  delay?: number;
  duration?: number;
  className?: string;
  triggerOnce?: boolean;
  style?: React.CSSProperties;
}

export default function ScrollReveal({
  children,
  animation = "slideUp",
  delay = 0,
  duration = 800,
  className = "",
  triggerOnce = true,
  style = {},
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal({ triggerOnce });

  // CSS transform logic based on animation prop
  const getTransform = () => {
    if (isVisible) return "translate(0, 0) scale(1)";
    switch (animation) {
      case "slideUp":
        return "translate(0, 30px)";
      case "scaleUp":
        return "scale(0.95)";
      case "stagger":
        return "translate(0, 20px)";
      default:
        return "translate(0, 0)";
    }
  };

  const inlineStyle: React.CSSProperties = {
    ...style,
    opacity: isVisible ? 1 : 0,
    transform: getTransform(),
    transition: `opacity ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms, transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`,
    willChange: "opacity, transform",
  };

  return (
    <div ref={ref} style={inlineStyle} className={className}>
      {children}
    </div>
  );
}
