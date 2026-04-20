"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import styles from "./Hero.module.css";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { buildWhatsAppUrl, COMMON_MESSAGES } from "@/lib/whatsapp";

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* Background Image Wrapper */}
      <div className={styles.bgWrapper}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          alt="Close up of elegant minimalist nail art on a woman's hand resting on soft cream fabric, soft warm editorial lighting" 
          className={styles.bgImage} 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5f77NZ9tx6Cd3vKxFb-Yo6qQlS4Ta5kQ5KP6GOJR9XFEafkRws-Ihy50QqrGjWW-H8cKGHtZKdgYtyOkF2NoGHNJMxXK12YRZcD4-D1qlsJygtjeAOiq0RXDwljldtdYHU4oJc_J9grc3OX_0mJ3NIydG1pg94ZiWB1Q_TZVv0sNvaBKIr76C9dn1r5447y0a0a8KMKpx_LhRtcB5bkSqBK2cd9D0ZG2njcdQr4IuGLGMhL3rcDKnr4eRD4cyoi_5zNNK0IkfrIqp"
        />
        <div className={styles.gradientT}></div>
        <div className={styles.gradientR}></div>
      </div>

      <div className={`container ${styles.contentWrapper}`}>
        <div className={styles.textContent}>
          <ScrollReveal animation="slideUp" delay={100}>
            <span className={styles.eyebrow}>Nola Atelier</span>
          </ScrollReveal>

          <ScrollReveal animation="slideUp" delay={200}>
            <h1 className={styles.title}>
              Bikin kuku kamu jadi detail kecil yang paling mencuri perhatian.
            </h1>
          </ScrollReveal>

          <ScrollReveal animation="slideUp" delay={300}>
            <p className={styles.description}>
              Lebih dari sekadar perawatan, kami menghadirkan seni dalam setiap sentuhan. 
              Nola Atelier meredefinisi kecantikan kuku dengan presisi, higienitas tingkat tinggi, 
              dan desain eksklusif yang memancarkan karakter Anda.
            </p>
          </ScrollReveal>

          <ScrollReveal animation="slideUp" delay={400}>
            <div className={styles.actions}>
              <Link href="/booking">
                <button className={styles.btnPrimary}>
                  <span style={{ position: "relative", zIndex: 10 }}>Book Your Slot</span>
                  <ArrowRight size={18} className={styles.arrowIcon} style={{ position: "relative", zIndex: 10 }} />
                  <div className={styles.btnHoverOverlay}></div>
                </button>
              </Link>
              
              <a 
                href={buildWhatsAppUrl(COMMON_MESSAGES.consultation)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className={styles.btnSecondary}>
                  <MessageCircle size={18} />
                  Chat WhatsApp
                </button>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
