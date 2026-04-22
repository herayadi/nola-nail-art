"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  ArrowLeft,
  Loader2,
  Image as ImageIcon,
  Star,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import styles from "./portfolio.module.css";

interface PortfolioFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function PortfolioForm({
  initialData,
  isEditing = false,
}: PortfolioFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    category: initialData?.category || "Nail Art",
    imageUrl: initialData?.imageUrl || "",
    beforeImage: initialData?.beforeImage || "",
    isFeatured: initialData?.isFeatured ?? false,
    sortOrder: initialData?.sortOrder ?? 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing
        ? `/api/admin/portfolio/${initialData.id}`
        : "/api/admin/portfolio";

      const res = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/portfolio");
        router.refresh();
      } else {
        alert("Terjadi kesalahan saat menyimpan.");
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-fade-in max-w-6xl mx-auto pb-20"
    >
      <div className="flex justify-between items-center mb-10">
        <Link
          href="/admin/portfolio"
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-all group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Gallery
        </Link>
        <Button
          type="submit"
          disabled={loading}
          className="min-w-[180px] shadow-lg shadow-accent/20"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
          {isEditing ? "Update Masterpiece" : "Publish to Gallery"}
        </Button>
      </div>

      <div className={styles.formGrid}>
        {/* Basic Info */}
        <div className="space-y-8">
          <div className={styles.formSection}>
            <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
              <Sparkles size={20} className="text-accent" />
              Creative Details
            </h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className={styles.formLabel}>Masterpiece Title</label>
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="e.g., Midnight Velvet Marble"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={styles.formLabel}>Art Category</label>
                  <select
                    className={styles.inputField}
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option>Nail Art</option>
                    <option>Manicure</option>
                    <option>Pedicure</option>
                    <option>Makeup</option>
                    <option>Hair Do</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className={styles.formLabel}>Display Order</label>
                  <input
                    type="number"
                    className={styles.inputField}
                    value={formData.sortOrder}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sortOrder: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="pt-4">
                <label className="flex items-center gap-4 p-4 bg-admin-bg/50 border border-admin-border rounded-xl cursor-pointer hover:border-accent transition-all group">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-accent"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      setFormData({ ...formData, isFeatured: e.target.checked })
                    }
                  />
                  <div>
                    <span className="text-sm font-bold flex items-center gap-2 text-white">
                      <Star
                        size={14}
                        className={
                          formData.isFeatured
                            ? "text-accent fill-accent"
                            : "text-gray-500"
                        }
                      />
                      FEATURE ON HOMEPAGE
                    </span>
                    <p className="text-[10px] text-gray-500 uppercase mt-0.5">
                      Showcase this piece in the main landing page gallery
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
              <ImageIcon size={20} className="text-accent" />
              Source Assets
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className={styles.formLabel}>Primary Image URL</label>
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label className={styles.formLabel}>
                  Before Transformation URL (Optional)
                </label>
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="https://images.unsplash.com/..."
                  value={formData.beforeImage}
                  onChange={(e) =>
                    setFormData({ ...formData, beforeImage: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Previews */}
        <div className="space-y-8">
          <div className={`${styles.formSection} !p-4`}>
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center mb-4">
              Masterpiece Preview
            </h3>
            <div className="aspect-[4/5] bg-admin-bg rounded-xl border border-dashed border-admin-border flex items-center justify-center overflow-hidden relative shadow-inner">
              {formData.imageUrl ? (
                <>
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[10px] text-accent font-bold uppercase tracking-wider">
                      {formData.category}
                    </span>
                    <h4 className="text-white font-semibold truncate">
                      {formData.title || "Untitled Masterpiece"}
                    </h4>
                  </div>
                </>
              ) : (
                <div className="text-gray-600 text-sm flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-admin-bg border border-admin-border flex items-center justify-center">
                    <ImageIcon size={32} />
                  </div>
                  <span className="font-medium">No Image Provided</span>
                </div>
              )}
            </div>
          </div>

          {formData.beforeImage && (
            <div className={`${styles.formSection} !p-4 opacity-70`}>
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center mb-4">
                Before State
              </h3>
              <div className="aspect-[4/5] bg-admin-bg rounded-xl border border-admin-border flex items-center justify-center overflow-hidden">
                <img
                  src={formData.beforeImage}
                  alt="Before Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
