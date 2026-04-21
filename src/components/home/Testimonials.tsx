"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./Testimonials.module.css";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function Testimonials({
  testimonials,
}: {
  testimonials: any[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide support
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((current) =>
        current === testimonials.length - 1 ? 0 : current + 1,
      );
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const handleNext = () => {
    setCurrentIndex((current) =>
      current === testimonials.length - 1 ? 0 : current + 1,
    );
  };

  const handlePrev = () => {
    setCurrentIndex((current) =>
      current === 0 ? testimonials.length - 1 : current - 1,
    );
  };

  return (
    <section className={styles.section}>
      <div className={`container ${styles.container}`}>
        <div className={styles.inner}>
          <ScrollReveal animation="fadeIn" className={styles.sliderContainer}>
            <button
              className={styles.navBtn}
              onClick={handlePrev}
              aria-label="Previous"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className={`${styles.navBtn} ${styles.nextBtn}`}
              onClick={handleNext}
              aria-label="Next"
            >
              <ChevronRight size={24} />
            </button>

            <div className={styles.slider}>
              {testimonials.map((testi, index) => (
                <div
                  key={testi.id}
                  className={`${styles.slide} ${index === currentIndex ? styles.active : ""}`}
                >
                  <div className={styles.stars}>
                    {[...Array(testi.rating)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        fill="var(--color-accent)"
                        color="var(--color-accent)"
                      />
                    ))}
                  </div>

                  <blockquote className={styles.quote}>
                    &ldquo; {testi.text} &rdquo;
                  </blockquote>

                  <div className={styles.author}>
                    <div className={styles.avatarWrap}>
                      <Image
                        src={
                          testi.imageUrl ||
                          "https://images.unsplash.com/photo-1527980965255-d4b50be63537?auto=format&fit=crop&q=80&w=150"
                        }
                        alt={testi.name}
                        fill
                        className={styles.avatar}
                        sizes="60px"
                      />
                    </div>
                    <div>
                      <div className={styles.authorName}>{testi.name}</div>
                      <div className={styles.authorService}>
                        {testi.service}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.dots}>
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ""}`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
