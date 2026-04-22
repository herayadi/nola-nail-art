"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Sparkles, 
  Image as ImageIcon, 
  Users, 
  Star, 
  Tag, 
  HelpCircle, 
  Settings, 
  UserCog,
  LogOut,
  X
} from "lucide-react";
import styles from "./Sidebar.module.css";

const MENU_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Bookings", icon: CalendarCheck, href: "/admin/bookings" },
  { label: "Services", icon: Sparkles, href: "/admin/services" },
  { label: "Portfolio", icon: ImageIcon, href: "/admin/portfolio" },
  { label: "Customers", icon: Users, href: "/admin/customers" },
  { label: "Reviews", icon: Star, href: "/admin/reviews" },
  { label: "Promotions", icon: Tag, href: "/admin/promotions" },
  { label: "FAQ", icon: HelpCircle, href: "/admin/faq" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
  { label: "Users", icon: UserCog, href: "/admin/users" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
      <div className={styles.header}>
        <span className={styles.logo}>NOLA</span>
        <button className={styles.mobileClose} onClick={onClose} aria-label="Close sidebar">
          <X size={20} />
        </button>
      </div>

      <nav className={styles.nav}>
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`${styles.menuItem} ${isActive ? styles.activeItem : ""}`}
              onClick={() => {
                if (window.innerWidth < 768) onClose();
              }}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <button 
          className={styles.logoutBtn} 
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut size={20} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
