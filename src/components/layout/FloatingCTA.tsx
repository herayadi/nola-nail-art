"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Calendar } from "lucide-react";
import styles from "./FloatingCTA.module.css";
import { buildWhatsAppUrl, COMMON_MESSAGES } from "@/lib/whatsapp";

export default function FloatingCTA() {
  const pathname = usePathname();

  // Hide on login and admin pages
  if (pathname === "/login" || pathname?.startsWith("/admin")) {
    return null;
  }

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
