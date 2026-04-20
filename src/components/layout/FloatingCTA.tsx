"use client";

import Link from "next/link";
import { MessageCircle, Calendar } from "lucide-react";
import styles from "./FloatingCTA.module.css";
import { buildWhatsAppUrl, COMMON_MESSAGES } from "@/lib/whatsapp";

export default function FloatingCTA() {
  return (
    <nav className={styles.floatingNav}>
      <a 
        href={buildWhatsAppUrl(COMMON_MESSAGES.general)} 
        target="_blank" 
        rel="noopener noreferrer"
        className={`${styles.btn} ${styles.waBtn}`}
      >
        <MessageCircle size={16} />
        WhatsApp
      </a>
      
      <Link href="/booking" className={`${styles.btn} ${styles.bookBtn}`}>
        <Calendar size={16} />
        Book Now
      </Link>
    </nav>
  );
}
