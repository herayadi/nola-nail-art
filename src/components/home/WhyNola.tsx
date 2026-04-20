import { ShieldCheck, Palette, Sparkles, Gem } from "lucide-react";
import styles from "./WhyNola.module.css";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Card from "@/components/ui/Card";

export default function WhyNola() {
  const features = [
    {
      title: "Hygienic",
      desc: "Kebersihan dan sterilisasi alat sebelum & sesudah penggunaan adalah prioritas utama standar studio kami.",
      icon: <ShieldCheck size={28} />
    },
    {
      title: "Detail & Presisi",
      desc: "Setiap garis dan detail nail art dikerjakan sekecil mungkin menggunakan brush presisi oleh teknisi berpengalaman.",
      icon: <Sparkles size={28} />
    },
    {
      title: "Custom Design",
      desc: "Kebebasan untuk berkonsultasi dan memilih desain sesuai gambar inspirasi kamu sendiri.",
      icon: <Palette size={28} />
    },
    {
      title: "Premium Products",
      desc: "Hanya menggunakan cat kuku import, top coat berkualitas, dan aksesori berkilau agar manikur tahan lama.",
      icon: <Gem size={28} />
    }
  ];

  return (
    <section className={styles.section} id="tentang">
      <div className={`container ${styles.container}`}>
        <div className={styles.grid}>
          <div className={styles.contentCol}>
            <ScrollReveal animation="slideUp">
              <span className={styles.eyebrow}>Kenapa Pilih Nola?</span>
              <h2 className={styles.title}>Beauty in Every Detail</h2>
              <p className={styles.description}>
                Kami percaya kuku adalah kanvas terkecil yang bisa mengekspresikan karaktermu. 
                Di Nola Nail Art & Beauty, bukan sekadar layanan memoles kuku, tapi kami 
                menawarkan sesi bersantai sambil tanganmu dipercantik tanpa kompromi kualitas.
              </p>
              <ul className={styles.list}>
                <li>Konsultasi personal</li>
                <li>Studio yang wangi & menenangkan</li>
                <li>Pilihan puluhan warna eksklusif</li>
              </ul>
            </ScrollReveal>
          </div>
          
          <div className={styles.cardsCol}>
            <div className={styles.cardsGrid}>
              {features.map((feat, index) => (
                <ScrollReveal 
                  key={index}
                  animation="slideUp"
                  delay={index * 150}
                  className={styles.cardWrapper}
                >
                  <Card className={styles.card} elevated glass>
                    <div className={styles.iconBox}>{feat.icon}</div>
                    <h3 className={styles.featTitle}>{feat.title}</h3>
                    <p className={styles.featDesc}>{feat.desc}</p>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
