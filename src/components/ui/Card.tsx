import { ReactNode } from "react";
import styles from "./Card.module.css";

interface CardProps {
  children: ReactNode;
  className?: string;
  elevated?: boolean;
  glass?: boolean;
  style?: React.CSSProperties;
}

export default function Card({ 
  children, 
  className = "", 
  elevated = false,
  glass = false,
  style = {}
}: CardProps) {
  const elevatedClass = elevated ? styles.elevated : "";
  const glassClass = glass ? styles.glass : "";

  return (
    <div className={`${styles.card} ${elevatedClass} ${glassClass} ${className}`} style={style}>
      {children}
    </div>
  );
}
