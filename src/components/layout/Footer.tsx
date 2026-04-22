"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Phone, Clock } from "lucide-react";
import styles from "./Footer.module.css";

const InstagramIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Hide footer on login and admin pages
  if (pathname === "/login" || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        {/* Brand Area */}
        <div className={styles.brandCol}>
          <div className={styles.logo}>🌸 Nola Nail Art</div>
          <p className={styles.tagline}>"Beauty in every detail."</p>
          <div className={styles.address}>
            <MapPin size={16} />
            <span>Jl. Kecantikan No. 123, Jakarta Selatan</span>
          </div>
          <div className={styles.contactInfo}>
            <Phone size={16} />
            <span>+62 851-6169-9605</span>
          </div>
          <div className={styles.hours}>
            <Clock size={16} />
            <span>09:00 - 18:00 (Selasa - Minggu)</span>
          </div>
        </div>

        {/* Links Navigation */}
        <div className={styles.linksCol}>
          <h4 className={styles.colTitle}>Navigasi</h4>
          <ul className={styles.linkList}>
            <li><Link href="/">Beranda</Link></li>
            <li><Link href="/layanan">Layanan</Link></li>
            <li><Link href="/gallery">Gallery</Link></li>
            <li><Link href="/tentang">Tentang</Link></li>
            <li><Link href="/kontak">Kontak</Link></li>
          </ul>
        </div>

        {/* Services Navigation */}
        <div className={styles.linksCol}>
          <h4 className={styles.colTitle}>Layanan</h4>
          <ul className={styles.linkList}>
            <li><Link href="/layanan/nail-art">Nail Art</Link></li>
            <li><Link href="/layanan/classic-manicure">Classic Manicure</Link></li>
          </ul>
        </div>

        {/* Social */}
        <div className={styles.linksCol}>
          <h4 className={styles.colTitle}>Follow Us</h4>
          <div className={styles.socialLinks}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
              <InstagramIcon size={20} />
              Instagram
            </a>
          </div>
          <div className={styles.policy}>
            <Link href="/kebijakan">Kebijakan Booking</Link>
          </div>
        </div>
      </div>
      
      <div className={styles.bottomBar}>
        <div className={`container ${styles.bottomContent}`}>
          <p>© {currentYear} Nola Nail Art and Beauty. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
