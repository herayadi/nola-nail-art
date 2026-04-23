export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import styles from "./faq.module.css";
import FAQManager from "./FAQManager";
import { HelpCircle } from "lucide-react";

export default async function AdminFAQPage() {
  const faqs = await prisma.faq.findMany({
    include: { service: { select: { id: true, name: true } } },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });

  const services = await prisma.service.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Knowledge Base</h1>
          <p className={styles.subtitle}>Curate the frequently asked questions to guide your clients.</p>
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          background: "var(--admin-accent-soft)",
          border: "1px solid rgba(201, 160, 74, 0.15)",
          borderRadius: "var(--radius-2xl)",
          padding: "16px 28px",
        }}>
          <HelpCircle size={24} style={{ color: "var(--admin-accent)" }} />
          <span style={{ color: "var(--admin-accent)", fontWeight: 900, fontSize: "1.125rem" }}>
            {faqs.length} Active Q&A
          </span>
        </div>
      </header>

      <FAQManager initialFaqs={faqs} services={services} />
    </div>
  );
}

