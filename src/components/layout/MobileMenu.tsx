import Link from "next/link";
import { X, MessageCircle, MapPin } from "lucide-react";
import styles from "./MobileMenu.module.css";
import { buildWhatsAppUrl, COMMON_MESSAGES } from "@/lib/whatsapp";

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

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.logo}>🌸 Nola Nail Art</span>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close menu">
            <X size={28} />
          </button>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.links}>
            <li className={styles.linkItem} style={{ animationDelay: "0.1s" }}>
              <Link href="/" onClick={onClose}>Beranda</Link>
            </li>
            <li className={styles.linkItem} style={{ animationDelay: "0.15s" }}>
              <Link href="/layanan" onClick={onClose}>Layanan</Link>
            </li>
            <li className={styles.linkItem} style={{ animationDelay: "0.2s" }}>
              <Link href="/gallery" onClick={onClose}>Gallery</Link>
            </li>
            <li className={styles.linkItem} style={{ animationDelay: "0.25s" }}>
              <Link href="/tentang" onClick={onClose}>Tentang Kami</Link>
            </li>
            <li className={styles.linkItem} style={{ animationDelay: "0.3s" }}>
              <Link href="/kontak" onClick={onClose}>Kontak</Link>
            </li>
          </ul>
        </nav>

        <div className={styles.actions} style={{ animationDelay: "0.4s" }}>
          <Link href="/booking" className={styles.bookBtn} onClick={onClose}>
            Book Now
          </Link>
          <a 
            href={buildWhatsAppUrl(COMMON_MESSAGES.general)} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.waBtn}
          >
            <MessageCircle size={20} />
            <span>Chat WhatsApp</span>
          </a>
        </div>

        <div className={styles.footer} style={{ animationDelay: "0.5s" }}>
          <a href="https://instagram.com/nolanailart.contoh" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
            <InstagramIcon size={18} /> @nolanailart
          </a>
          <div className={styles.location}>
            <MapPin size={18} /> Jakarta Selatan
          </div>
        </div>
      </div>
    </div>
  );
}
