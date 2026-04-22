"use client";

import { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import styles from "./Portfolio.module.css";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function Portfolio({ portfolio }: { portfolio: any[] }) {
  const categories = [
    "All",
    ...Array.from(new Set(portfolio.map((item) => item.category))),
  ];
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredItems =
    activeFilter === "All"
      ? portfolio
      : portfolio.filter((item) => item.category === activeFilter);

  return (
    <section className={styles.section} id="gallery">
      <div className={`container ${styles.container}`}>
        <ScrollReveal animation="slideUp" className={styles.header}>
          <span className={styles.eyebrow}>Gallery</span>
          <h2 className={styles.title}>Hasil Karya Kami</h2>
          <p className={styles.subtitle}>
            Eksplorasi gaya nail art favoritmu. Setiap desain dikerjakan dengan
            hati dan pendekatan personal bagi setiap pelanggan.
          </p>
        </ScrollReveal>

        {/* Filters */}
        <ScrollReveal animation="fadeIn" delay={150}>
          <div className={styles.filters}>
            {categories.map((category: any) => (
              <button
                key={category}
                className={`${styles.filterBtn} ${activeFilter === category ? styles.active : ""}`}
                onClick={() => setActiveFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Grid/Masonry Layout */}
        <div className={styles.grid}>
          {filteredItems.map((item, index) => (
            <ScrollReveal
              key={item.id}
              animation="slideUp"
              delay={(index % 3) * 100} // stager effect
              className={styles.gridItem}
            >
              <div className={styles.imageContainer}>
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className={styles.image}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                <div className={styles.overlay}>
                  <div className={styles.overlayContent}>
                    <span className={styles.itemCategory}>{item.category}</span>
                    <h4 className={styles.itemTitle}>{item.title}</h4>
                  </div>
                  <button className={styles.viewBtn}>
                    <Search size={18} />
                  </button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
