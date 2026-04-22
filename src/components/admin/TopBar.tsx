"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { Search, Bell, Menu, User, LogOut, Settings, UserCircle } from "lucide-react";
import styles from "./TopBar.module.css";
import { useRouter } from "next/navigation";

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
            placeholder="Search bookings, services..."
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.right}>
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button 
            className={styles.iconBtn} 
            aria-label="Notifications"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
          >
            <Bell size={20} />
            <span className={styles.badge} />
          </button>

          {showNotifications && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownHeader}>
                <span className={styles.dropdownTitle}>Notifications</span>
                <span className="text-[10px] text-accent font-bold">3 NEW</span>
              </div>
              <div className={styles.dropdownList}>
                <div className={`${styles.dropdownItem} ${styles.notificationItem}`}>
                  <div className={styles.dot} />
                  <div className={styles.notifContent}>
                    <span className={styles.notifText}>New booking request</span>
                    <span className={styles.notifTime}>Just now</span>
                  </div>
                </div>
                <div className={`${styles.dropdownItem} ${styles.notificationItem}`}>
                  <div className={styles.dot} />
                  <div className={styles.notifContent}>
                    <span className={styles.notifText}>New customer review</span>
                    <span className={styles.notifTime}>2 hours ago</span>
                  </div>
                </div>
                <div className={`${styles.dropdownItem} ${styles.notificationItem}`}>
                  <div className={styles.dot} />
                  <div className={styles.notifContent}>
                    <span className={styles.notifText}>System update complete</span>
                    <span className={styles.notifTime}>Yesterday</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div 
          className={styles.userInfo} 
          style={{ position: 'relative', cursor: 'pointer' }}
          ref={userMenuRef}
          onClick={() => {
            setShowUserMenu(!showUserMenu);
            setShowNotifications(false);
          }}
        >
          <div style={{ textAlign: 'right', marginRight: '10px' }} className="hidden sm:block">
            <div className={styles.userName}>{session?.user?.name || "Nola Admin"}</div>
            <div className={styles.userRole}>{(session?.user as any)?.role || "Administrator"}</div>
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '14px',
            backgroundColor: 'var(--admin-surface-hover)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--admin-border)',
            transition: 'all 0.3s'
          }} className="hover:border-accent">
            <User size={20} color="var(--admin-accent)" />
          </div>

          {showUserMenu && (
            <div className={`${styles.dropdown} ${styles.userDropdown}`}>
              <div className={styles.dropdownHeader}>
                <span className={styles.dropdownTitle}>Account</span>
              </div>
              <div className={styles.dropdownList}>
                <button 
                  className={styles.dropdownItem}
                  onClick={() => {
                    setShowUserMenu(false);
                    router.push("/admin/profile");
                  }}
                >
                  <UserCircle size={18} />
                  <span>Profile Settings</span>
                </button>
                <button 
                  className={styles.dropdownItem}
                  onClick={() => {
                    setShowUserMenu(false);
                    router.push("/admin/settings");
                  }}
                >
                  <Settings size={18} />
                  <span>Preferences</span>
                </button>
                <button 
                  className={`${styles.dropdownItem} ${styles.logoutBtn}`}
                  onClick={() => signOut()}
                  style={{ borderTop: '1px solid var(--admin-border)', marginTop: '8px', paddingTop: '16px' }}
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header >
  );
}
