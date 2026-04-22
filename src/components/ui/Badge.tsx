import { ReactNode } from "react";
import styles from "./Badge.module.css";

interface BadgeProps {
  children: ReactNode;
  variant?:
    | "neutral"
    | "accent"
    | "outline"
    | "warning"
    | "info"
    | "success"
    | "error";
  className?: string;
}

export default function Badge({
  children,
  variant = "neutral",
  className,
}: BadgeProps) {
  return (
    <span
      className={`${styles.badge} ${styles[variant]}${className ? ` ${className}` : ""}`}
    >
      {children}
    </span>
  );
}
