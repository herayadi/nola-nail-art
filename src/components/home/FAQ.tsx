"use client";

import { useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
import styles from "./FAQ.module.css";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";
import { buildWhatsAppUrl, COMMON_MESSAGES } from "@/lib/whatsapp";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export default function FAQ({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.section}>
      <div className={`container ${styles.container}`}>
        <div className={styles.grid}>
          <div className={styles.headerCol}>
            <ScrollReveal animation="slideUp">
              <span className={styles.eyebrow}>FAQ</span>
              <h2 className={styles.title}>Ada Pertanyaan?</h2>
              <p className={styles.subtitle}>
                Berikut beberapa pertanyaan yang sering diajukan oleh pelanggan
                kami.
              </p>

              <div className={styles.contactCard}>
                <h3>Belum yakin? Chat kami dulu.</h3>
                <p>
                  Tim admin kami siap membantu merencanakan desain kuku
                  impianmu.
                </p>
                <a
                  href={buildWhatsAppUrl(COMMON_MESSAGES.general)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="whatsapp">
                    <MessageCircle size={18} />
                    Tanya via WhatsApp
                  </Button>
                </a>
              </div>
            </ScrollReveal>
          </div>

          <div className={styles.accordionCol}>
            <div className={styles.accordion}>
              {faqs.map((faq: any, index: number) => {
                const isOpen = openIndex === index;

                return (
                  <ScrollReveal
                    key={index}
                    animation="slideUp"
                    delay={index * 100}
                  >
                    <div
                      className={`${styles.accordionItem} ${isOpen ? styles.open : ""}`}
                    >
                      <button
                        className={styles.accordionHeader}
                        onClick={() => toggleAccordion(index)}
                        aria-expanded={isOpen}
                      >
                        <span className={styles.question}>{faq.question}</span>
                        <ChevronDown
                          className={`${styles.icon} ${isOpen ? styles.iconOpen : ""}`}
                        />
                      </button>

                      <div
                        className={styles.accordionContent}
                        style={{
                          maxHeight: isOpen ? "200px" : "0px",
                          opacity: isOpen ? 1 : 0,
                        }}
                      >
                        <p className={styles.answer}>{faq.answer}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
