"use client";

import { useSession } from "next-auth/react";
import { Search, Bell, Menu, User } from "lucide-react";
import styles from "./TopBar.module.css";

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const { data: session } = useSession();

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <button className={styles.menuToggle} onClick={onMenuClick}>
          <Menu size={24} />
        </button>

        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} size={18} />
          <input
            type="text"
            placeholder="Cari booking, layanan..."
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.right}>
        <button className={styles.iconBtn} aria-label="Notifikasi">
          <Bell size={20} />
          <span className={styles.badge} />
        </button>

        <div className={styles.userInfo}>
          <div style={{ textAlign: 'right', marginRight: '10px' }}>
            <div className={styles.userName}>{session?.user?.name || "Admin"}</div>
            <div className={styles.userRole}>{(session?.user as any)?.role || "Administrator"}</div>
          </div>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'var(--admin-surface-hover)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--admin-border)'
          }}>
            <User size={20} color="var(--admin-accent)" />
          </div>
        </div>
      </div>
    </header >
  );
}
