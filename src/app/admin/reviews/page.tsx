import { prisma } from "@/lib/prisma";
import styles from "./reviews.module.css";
import ReviewList from "./ReviewList";
import { MessageSquare } from "lucide-react";

export default async function AdminReviewsPage() {
  const reviews = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Customer Voice</h1>
          <p className={styles.subtitle}>Moderate and highlight the best testimonials from your clients.</p>
        </div>
      </header>

      {reviews.length === 0 ? (
        <div className="py-20 text-center bg-admin-surface border border-dashed border-admin-border rounded-3xl">
          <MessageSquare size={48} className="mx-auto mb-4 opacity-10" />
          <h3 className="text-xl font-bold text-white mb-2">Silence is golden?</h3>
          <p className="text-gray-500 text-sm">No reviews have been submitted yet.</p>
        </div>
      ) : (
        <ReviewList initialReviews={reviews} />
      )}
    </div>
  );
}
