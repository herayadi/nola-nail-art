import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import styles from "./Services.module.css";
import Card from "@/components/ui/Card";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function Services({ services }: { services: any[] }) {
  return (
    <section className={styles.section} id="layanan">
      <div className={`container ${styles.container}`}>
        <ScrollReveal animation="slideUp" className={styles.header}>
          <span className={styles.eyebrow}>Layanan Kami</span>
          <h2 className={styles.title}>Perawatan Estetik Untukmu</h2>
          <p className={styles.subtitle}>
            Setiap pengerjaan dilakukan dengan teknik detail, higienis, dan
            menggunakan material premium untuk hasil yang tahan lama.
          </p>
        </ScrollReveal>

        <div className={styles.grid}>
          {services.map((service: any, index: number) => (
            <ScrollReveal
              key={service.id}
              animation="slideUp"
              delay={(index + 1) * 150}
            >
              <Card className={styles.card} elevated>
                <div className={styles.imageWrapper}>
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {service.isPopular && (
                    <div className={styles.popularBadge}>Populer</div>
                  )}
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.cardMeta}>
                    <span className={styles.category}>{service.category}</span>
                    <span className={styles.duration}>
                      <Clock size={14} /> {service.duration}
                    </span>
                  </div>

                  <h3 className={styles.cardTitle}>{service.name}</h3>
                  <p className={styles.cardDesc}>{service.description}</p>

                  <div className={styles.cardFooter}>
                    <div className={styles.price}>
                      <span className={styles.priceLabel}>Mulai dari</span>
                      <span className={styles.priceAmount}>
                        Rp {service.price.toLocaleString("id-ID")}
                      </span>
                    </div>

                    <Link
                      href={`/layanan/${service.id}`}
                      className={styles.link}
                    >
                      <ArrowRight size={20} />
                    </Link>
                  </div>
                </div>
              </Card>
            </ScrollReveal>
          ))}

          {/* Coming Soon Card */}
          <ScrollReveal animation="slideUp" delay={450}>
            <Card className={`${styles.card} ${styles.comingSoonCard}`}>
              <div className={styles.comingSoonContent}>
                <span className={styles.comingSoonBadge}>Segera Hadir</span>
                <h3 className={styles.cardTitle}>Makeup & Hair Do</h3>
                <p className={styles.cardDesc}>
                  Kami sedang menyiapkan layanan beauty menyeluruh untuk special
                  occasion kamu. Stay tuned!
                </p>
              </div>
            </Card>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
