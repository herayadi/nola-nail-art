"use client";

import { useEffect, useState, useRef } from "react";
import { Star, MapPin, ShieldCheck, Heart } from "lucide-react";
import styles from "./SocialProof.module.css";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// Animated counter component
function Counter({ end, duration = 2000, suffix = "" }: { end: number, duration?: number, suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useScrollReveal({ triggerOnce: true });

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(easeProgress * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, isVisible]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function SocialProof() {
  return (
    <section className={styles.section}>
      <div className={`container ${styles.container}`}>
        <ScrollReveal animation="slideUp" delay={100} className={styles.item}>
          <div className={styles.iconContainer}>
            <Star className={styles.icon} fill="currentColor" />
          </div>
          <div className={styles.info}>
            <h4 className={styles.number}><Counter end={4} suffix=".9" /></h4>
            <p className={styles.label}>Google Rating</p>
          </div>
        </ScrollReveal>

        <div className={styles.divider}></div>

        <ScrollReveal animation="slideUp" delay={200} className={styles.item}>
          <div className={styles.iconContainer}>
            <Heart className={styles.icon} />
          </div>
          <div className={styles.info}>
            <h4 className={styles.number}><Counter end={500} suffix="+" /></h4>
            <p className={styles.label}>Happy Customers</p>
          </div>
        </ScrollReveal>

        <div className={styles.divider}></div>

        <ScrollReveal animation="slideUp" delay={300} className={styles.item}>
          <div className={styles.iconContainer}>
            <MapPin className={styles.icon} />
          </div>
          <div className={styles.info}>
            <h4 className={styles.number}>Jak-Sel</h4>
            <p className={styles.label}>Area Layanan</p>
          </div>
        </ScrollReveal>

        <div className={styles.divider}></div>

        <ScrollReveal animation="slideUp" delay={400} className={styles.item}>
          <div className={styles.iconContainer}>
            <ShieldCheck className={styles.icon} />
          </div>
          <div className={styles.info}>
            <h4 className={styles.number}>100%</h4>
            <p className={styles.label}>Hygienic & Safe</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
