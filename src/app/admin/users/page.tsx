export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import styles from "./users.module.css";
import UserManager from "./UserManager";
import { UserCog } from "lucide-react";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Access Control</h1>
          <p className={styles.subtitle}>
            Manage who has access to the Nola Admin Dashboard.
          </p>
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: "var(--admin-accent-soft)",
          border: "1px solid rgba(201, 160, 74, 0.15)",
          borderRadius: "var(--radius-xl)",
          padding: "14px 20px",
        }}>
          <UserCog size={20} style={{ color: "var(--admin-accent)" }} />
          <span style={{ color: "var(--admin-accent)", fontWeight: 800, fontSize: "0.875rem" }}>
            {users.length} Active {users.length === 1 ? "Admin" : "Admins"}
          </span>
        </div>
      </header>

      <UserManager initialUsers={users} />
    </div>
  );
}

