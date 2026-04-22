"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import TopBar from "@/components/admin/TopBar";
import styles from "./admin-layout.module.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className={styles.adminWrapper}>
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      
      <div className={styles.mainContent}>
        <TopBar onMenuClick={toggleSidebar} />
        
        <main className={styles.contentArea}>
          {children}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 'var(--z-overlay)',
            backdropFilter: 'blur(4px)'
          }}
          onClick={closeSidebar}
        />
      )}
    </div>
  );
}
