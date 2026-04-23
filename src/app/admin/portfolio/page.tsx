export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import {
  Plus,
  Edit2,
  Trash2,
  Star,
  Image as ImageIcon,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import styles from "./portfolio.module.css";
import Button from "@/components/ui/Button";

export default async function AdminPortfolioPage() {
  const portfolioItems = await prisma.portfolio.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Artistic Portfolio</h1>
          <p className={styles.subtitle}>
            Curating the finest moments of beauty and precision.
          </p>
        </div>
        <Link href="/admin/portfolio/new">
          <Button variant="primary" className="flex items-center gap-2 group">
            <Plus
              size={18}
              className="group-hover:rotate-90 transition-transform"
            />
            Add New Masterpiece
          </Button>
        </Link>
      </header>

      <div className={styles.grid}>
        {portfolioItems.length === 0 ? (
          <div className={styles.emptyState}>
            <ImageIcon className={styles.emptyIcon} />
            <h3 className="text-xl font-semibold mb-2 text-white">
              Your gallery is quiet
            </h3>
            <p className="text-gray-500">
              Start showcasing your work to the world.
            </p>
          </div>
        ) : (
          portfolioItems.map((item: any) => (
            <article key={item.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className={styles.image}
                />

                {item.isFeatured && (
                  <div className={styles.featuredBadge}>
                    <Star size={12} fill="currentColor" />
                    <span>FEATURED</span>
                  </div>
                )}

                <div className={styles.overlay}>
                  <div className="flex justify-center gap-4">
                    <Link href={`/admin/portfolio/${item.id}`}>
                      <button
                        className={`${styles.actionBtn} ${styles.editBtn}`}
                        title="Edit Detail"
                      >
                        <Edit2 size={18} />
                      </button>
                    </Link>
                    <button
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      title="Remove from Gallery"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.cardInfo}>
                <div className={styles.cardMeta}>
                  <span className={styles.categoryBadge}>{item.category}</span>
                  <span className="text-[10px] text-gray-500 font-mono">
                    #{item.id.slice(-4).toUpperCase()}
                  </span>
                </div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                  <span className="text-[10px] text-gray-500 flex items-center gap-1">
                    ORDER:{" "}
                    <span className="text-accent font-bold">
                      {item.sortOrder}
                    </span>
                  </span>
                  <Link
                    href={`/admin/portfolio/${item.id}`}
                    className="text-accent hover:underline text-[10px] font-bold flex items-center gap-1"
                  >
                    DETAILS <ArrowUpRight size={10} />
                  </Link>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

