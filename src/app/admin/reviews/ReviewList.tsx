"use client";

import { useState } from "react";
import { Star, Check, X, Trash2, Quote, Award } from "lucide-react";
import styles from "./reviews.module.css";
import { useRouter } from "next/navigation";

interface ReviewListProps {
  initialReviews: any[];
}

export default function ReviewList({ initialReviews }: ReviewListProps) {
  const router = useRouter();
  const [reviews, setReviews] = useState(initialReviews);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAction = async (id: string, action: 'approve' | 'reject' | 'highlight' | 'delete') => {
    setLoadingId(id);
    try {
      if (action === 'delete') {
        const res = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setReviews(reviews.filter(r => r.id !== id));
        }
      } else {
        const review = reviews.find(r => r.id === id);
        const data = {
          isApproved: action === 'approve' ? true : action === 'reject' ? false : review.isApproved,
          isHighlight: action === 'highlight' ? !review.isHighlight : review.isHighlight,
        };

        const res = await fetch(`/api/admin/reviews/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          const updated = await res.json();
          setReviews(reviews.map(r => r.id === id ? updated : r));
        }
      }
      router.refresh();
    } catch (err) {
      alert("Gagal memproses aksi.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className={styles.grid}>
      {reviews.map((review) => (
        <div key={review.id} className={styles.reviewCard}>
          <div 
            className={styles.statusBadge} 
            style={{ 
              backgroundColor: review.isApproved ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              color: review.isApproved ? '#22C55E' : '#EF4444'
            }}
          >
            {review.isApproved ? 'Approved' : 'Pending'}
          </div>

          <div className={styles.cardHeader}>
            <div className={styles.userInfo}>
              <div className={styles.avatar}>
                {review.name.charAt(0)}
              </div>
              <div>
                <div className={styles.userName}>{review.name}</div>
                <div className={styles.serviceName}>{review.service}</div>
              </div>
            </div>
            <div className={styles.rating}>
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={14} 
                  fill={i < review.rating ? "currentColor" : "none"} 
                  className={i < review.rating ? "" : "text-gray-700"}
                />
              ))}
            </div>
          </div>

          <div className={styles.content}>
            <Quote size={16} className="text-accent/20 mb-2" />
            {review.text}
          </div>

          <div className={styles.cardFooter}>
            <span className={styles.date}>
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
            
            <div className={styles.actions}>
              {!review.isApproved ? (
                <button 
                  onClick={() => handleAction(review.id, 'approve')}
                  className={styles.btnApprove}
                  disabled={loadingId === review.id}
                >
                  Approve
                </button>
              ) : (
                <button 
                  onClick={() => handleAction(review.id, 'reject')}
                  className={styles.btnReject}
                  disabled={loadingId === review.id}
                >
                  Reject
                </button>
              )}
              
              <button 
                onClick={() => handleAction(review.id, 'highlight')}
                className={`${styles.actionBtn} ${review.isHighlight ? styles.editBtn : ''}`}
                style={{ backgroundColor: review.isHighlight ? 'var(--admin-accent)' : '', color: review.isHighlight ? 'var(--admin-bg)' : '' }}
                title="Highlight to Home"
              >
                <Award size={16} />
              </button>

              <button 
                onClick={() => handleAction(review.id, 'delete')}
                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                title="Delete Permanent"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
