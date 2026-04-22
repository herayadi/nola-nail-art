"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  X,
  Loader2,
  HelpCircle,
  Hash,
  Tag,
} from "lucide-react";
import styles from "./faq.module.css";
import { useRouter } from "next/navigation";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  serviceId: string | null;
  service?: { id: string; name: string };
}

interface Service {
  id: string;
  name: string;
}

interface FAQManagerProps {
  initialFaqs: FAQ[];
  services: Service[];
}

export default function FAQManager({ initialFaqs, services }: FAQManagerProps) {
  const router = useRouter();
  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editFaq, setEditFaq] = useState<FAQ | null>(null);
  const [form, setForm] = useState({
    question: "",
    answer: "",
    sortOrder: "0",
    serviceId: "",
  });

  const openAddModal = () => {
    setEditFaq(null);
    setForm({ question: "", answer: "", sortOrder: "0", serviceId: "" });
    setShowModal(true);
  };

  const openEditModal = (faq: FAQ) => {
    setEditFaq(faq);
    setForm({
      question: faq.question,
      answer: faq.answer,
      sortOrder: faq.sortOrder.toString(),
      serviceId: faq.serviceId || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditFaq(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingId("form");

    try {
      const payload = {
        ...form,
        sortOrder: parseInt(form.sortOrder),
        serviceId: form.serviceId || null,
      };

      let res: Response;
      if (editFaq) {
        res = await fetch(`/api/admin/faq/${editFaq.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/faq", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        const updated = await res.json();
        if (editFaq) {
          setFaqs(faqs.map((f) => (f.id === updated.id ? updated : f)));
        } else {
          setFaqs([...faqs, updated].sort((a, b) => a.sortOrder - b.sortOrder));
        }
        closeModal();
        router.refresh();
      }
    } catch (err) {
      alert("Gagal menyimpan FAQ.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus FAQ ini?")) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/faq/${id}`, { method: "DELETE" });
      if (res.ok) {
        setFaqs(faqs.filter((f) => f.id !== id));
        router.refresh();
      }
    } catch {
      alert("Gagal menghapus FAQ.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <>
      <div className={styles.list}>
        {faqs.length === 0 ? (
          <div className={styles.emptyState}>
            <HelpCircle size={64} className="mx-auto mb-6 opacity-20" />
            <p className="text-xl font-bold">Belum ada FAQ.</p>
          </div>
        ) : (
          faqs.map((faq: any) => (
            <div key={faq.id} className={styles.faqItem}>
              <div className={styles.faqHeader}>
                <h3 className={styles.question}>{faq.question}</h3>
                <div className={styles.actions}>
                  <button
                    onClick={() => openEditModal(faq)}
                    className={styles.actionBtn}
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                    disabled={loadingId === faq.id}
                  >
                    {loadingId === faq.id ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>
              </div>
              <p className={styles.answer}>{faq.answer}</p>
              <div className={styles.meta}>
                <div className="flex gap-4">
                  {(faq.service && (
                    <span className={styles.serviceTag}>
                      <Tag size={12} /> {faq.service.name}
                    </span>
                  )) || (
                    <span
                      className={styles.serviceTag}
                      style={{ opacity: 0.5 }}
                    >
                      <Tag size={12} /> General
                    </span>
                  )}
                  <span className={styles.sortOrder}>
                    <Hash size={12} className="inline mr-1" /> Order:{" "}
                    {faq.sortOrder}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={openAddModal}
        className={styles.addBtn}
        style={{
          position: "fixed",
          bottom: "40px",
          right: "40px",
          zIndex: 100,
        }}
      >
        <Plus size={24} /> <span>Create FAQ</span>
      </button>

      {showModal && (
        <div className={styles.overlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModal} onClick={closeModal}>
              <X size={24} />
            </button>
            <h2 className={styles.modalTitle}>
              {editFaq ? "Refine FAQ" : "New FAQ Entry"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Question</label>
                <input
                  type="text"
                  value={form.question}
                  onChange={(e) =>
                    setForm({ ...form, question: e.target.value })
                  }
                  className={styles.formInput}
                  placeholder="What is your policy on...?"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Answer</label>
                <textarea
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  className={styles.formTextarea}
                  placeholder="Explain clearly here..."
                  required
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "24px",
                }}
              >
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Link to Service (Optional)
                  </label>
                  <select
                    value={form.serviceId}
                    onChange={(e) =>
                      setForm({ ...form, serviceId: e.target.value })
                    }
                    className={styles.formSelect}
                  >
                    <option value="">General (No specific service)</option>
                    {services.map((s: any) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Sort Order</label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) =>
                      setForm({ ...form, sortOrder: e.target.value })
                    }
                    className={styles.formInput}
                  />
                </div>
              </div>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={closeModal}
                  className={styles.cancelBtn}
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={loadingId === "form"}
                >
                  {loadingId === "form" ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    "Publish Entry"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
