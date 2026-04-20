"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";
import { buildWhatsAppUrl, COMMON_MESSAGES } from "@/lib/whatsapp";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          NOLA
        </Link>
        
        <div className={styles.navLinks}>
          <Link 
            href="/#gallery" 
            className={pathname === "/gallery" ? styles.linkActive : styles.link}
          >
            Gallery
          </Link>
          <Link 
            href="/layanan" 
            className={pathname === "/layanan" ? styles.linkActive : styles.link}
          >
            Services
          </Link>
          <Link 
            href="/tentang" 
            className={pathname === "/tentang" ? styles.linkActive : styles.link}
          >
            Atelier
          </Link>
          <Link 
            href="/kontak" 
            className={pathname === "/kontak" ? styles.linkActive : styles.link}
          >
            Contact
          </Link>
        </div>

        <div className={styles.actions}>
          <a   
            href={buildWhatsAppUrl(COMMON_MESSAGES.general)} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.waBtn}
          >
            WhatsApp
          </a>
          <Link href="/booking" className={styles.bookBtn}>
            Book Now
          </Link>
        </div>
      </div>
    </nav>
  );
}
