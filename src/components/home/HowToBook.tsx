import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./HowToBook.module.css";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";

export default function HowToBook() {
  const steps = [
    {
      num: "01",
      title: "Pilih Layanan",
      desc: "Tentukan treatment yang kamu butuhkan, mulai dari basic perawatan kuku sampai custom art."
    },
    {
      num: "02",
      title: "Pilih Jadwal",
      desc: "Pilih tanggal dan jam yang tersedia. Sangat disarankan booking dari jauh-jauh hari agar slot aman."
    },
    {
      num: "03",
      title: "Konfirmasi & DP",
      desc: "Lakukan konfirmasi pemesanan dan pembayaran down payment (DP) via WhatsApp resmi kami."
    }
  ];

  return (
    <section className={styles.section}>
      <div className={`container ${styles.container}`}>
        <ScrollReveal animation="slideUp" className={styles.header}>
          <span className={styles.eyebrow}>Cara Booking</span>
          <h2 className={styles.title}>Booking Gampang, Cuma 3 Langkah</h2>
          <p className={styles.subtitle}>
            Proses simpel tanpa ribet. Slot harian kami terbatas.
          </p>
        </ScrollReveal>

        <div className={styles.stepsContainer}>
          {steps.map((step, index) => (
            <ScrollReveal 
              key={index} 
              animation="fadeIn" 
              delay={index * 200}
              className={styles.stepItem}
            >
              <div className={styles.numberWrap}>
                <span className={styles.number}>{step.num}</span>
              </div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
              
              {/* Add line connector except for the last item */}
              {index < steps.length - 1 && (
                <div className={styles.connector}>
                  <ArrowRight size={24} className={styles.arrowIcon} />
                </div>
              )}
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal animation="slideUp" delay={600} className={styles.ctaWrapper}>
          <Link href="/booking">
            <Button size="lg" className={styles.btnShadow}>
              Mulai Booking Sekarang
              <ArrowRight size={18} />
            </Button>
          </Link>
          <p className={styles.urgencyText}>
            "Slot terbatas per hari. Booking lebih dulu untuk memastikan jadwal kamu aman."
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
