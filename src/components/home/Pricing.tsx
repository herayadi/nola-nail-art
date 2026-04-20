import Link from "next/link";
import { Check } from "lucide-react";
import styles from "./Pricing.module.css";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";

export default function Pricing() {
  const packages = [
    {
      id: "everyday",
      name: "Everyday Nails",
      price: "75.000",
      description: "Tampil bersih dan rapi untuk keseharianmu.",
      features: ["Basic Manicure", "Nail Shaping", "1 Warna Solid Gel Polish", "Vitamin Oil", "Pengerjaan 1 jam"],
      isPopular: false
    },
    {
      id: "signature",
      name: "Signature Nail Art",
      price: "150.000",
      description: "Lebih berekspresi dengan desain favoritmu.",
      features: ["Premium Manicure", "Free Custom Desain Dasar", "3+ Warna Gel Polish", "Aksesori / Chrome Standar", "Pengerjaan 1.5 - 2 jam"],
      isPopular: true
    },
    {
      id: "bridal",
      name: "Bridal Glam",
      price: "300.000",
      description: "Kuku showstopper untuk momen terindah.",
      features: ["Semua di Signature Package", "Premium 3D Accessories", "Swarovski / Mutiara", "Cuticle Spa Scrub", "Pengerjaan 3 jam"],
      isPopular: false
    }
  ];

  return (
    <section className={styles.section} id="harga">
      <div className={`container ${styles.container}`}>
        <ScrollReveal animation="slideUp" className={styles.header}>
          <span className={styles.eyebrow}>Paket & Harga</span>
          <h2 className={styles.title}>Transparan & Terjangkau</h2>
          <p className={styles.subtitle}>
            Tidak ada biaya tersembunyi. Pilih paket yang sesuai, atau konsultasikan style 
            tertentu secara langsung via WhatsApp.
          </p>
        </ScrollReveal>

        <div className={styles.grid}>
          {packages.map((pkg, index) => (
            <ScrollReveal 
              key={pkg.id} 
              animation="slideUp" 
              delay={index * 150}
              className={styles.cardWrapper}
            >
              <div className={`${styles.card} ${pkg.isPopular ? styles.popularCard : ""}`}>
                {pkg.isPopular && (
                  <div className={styles.popularBadge}>Paling Diminati</div>
                )}
                
                <h3 className={styles.pkgName}>{pkg.name}</h3>
                <p className={styles.pkgDesc}>{pkg.description}</p>
                
                <div className={styles.priceContainer}>
                  <span className={styles.currency}>Rp</span>
                  <span className={styles.amount}>{pkg.price}</span>
                </div>
                
                <div className={styles.divider}></div>
                
                <ul className={styles.featureList}>
                  {pkg.features.map((feat, i) => (
                    <li key={i}>
                      <Check size={18} className={styles.checkIcon} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                
                <div className={styles.cardFooter}>
                  <Link href="/booking" style={{ width: '100%' }}>
                    <Button 
                      fullWidth 
                      variant={pkg.isPopular ? "primary" : "ghost"}
                    >
                      Pilih Paket
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
