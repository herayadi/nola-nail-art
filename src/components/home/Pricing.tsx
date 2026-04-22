import Link from "next/link";
import { Check } from "lucide-react";
import styles from "./Pricing.module.css";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";

export default function Pricing({ services }: { services: any[] }) {
  // We'll take the top 3 services to show as "Packages" on the homepage
  // or just show all if there are only few.
  const displayServices = services.slice(0, 3);

  return (
    <section className={styles.section} id="harga">
      <div className={`container ${styles.container}`}>
        <ScrollReveal animation="slideUp" className={styles.header}>
          <span className={styles.eyebrow}>Paket & Harga</span>
          <h2 className={styles.title}>Transparan & Terjangkau</h2>
          <p className={styles.subtitle}>
            Tidak ada biaya tersembunyi. Pilih paket yang sesuai, atau
            konsultasikan style tertentu secara langsung via WhatsApp.
          </p>
        </ScrollReveal>

        <div className={styles.grid}>
          {displayServices.map((service: any, index: number) => (
            <ScrollReveal
              key={service.id}
              animation="slideUp"
              delay={index * 150}
              className={styles.cardWrapper}
            >
              <div
                className={`${styles.card} ${service.isPopular ? styles.popularCard : ""}`}
              >
                {service.isPopular && (
                  <div className={styles.popularBadge}>Paling Diminati</div>
                )}

                <h3 className={styles.pkgName}>{service.name}</h3>
                <p className={styles.pkgDesc}>{service.description}</p>

                <div className={styles.priceContainer}>
                  <span className={styles.currency}>Rp</span>
                  <span className={styles.amount}>
                    {service.price.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className={styles.divider}></div>

                <ul className={styles.featureList}>
                  {/* Since we don't have features array in DB, we use shortDescription or duration */}
                  <li>
                    <Check size={18} className={styles.checkIcon} />
                    <span>Estimasi {service.duration}</span>
                  </li>
                  {service.shortDescription && (
                    <li>
                      <Check size={18} className={styles.checkIcon} />
                      <span>{service.shortDescription}</span>
                    </li>
                  )}
                  <li>
                    <Check size={18} className={styles.checkIcon} />
                    <span>Bahan Premium & Higienis</span>
                  </li>
                </ul>

                <div className={styles.cardFooter}>
                  <Link
                    href={`/layanan/${service.id}`}
                    style={{ width: "100%" }}
                  >
                    <Button
                      fullWidth
                      variant={service.isPopular ? "primary" : "ghost"}
                    >
                      Lihat Detail
                    </Button>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
