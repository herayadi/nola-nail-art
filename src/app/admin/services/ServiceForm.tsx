"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Loader2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";

interface ServiceFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function ServiceForm({ initialData, isEditing = false }: ServiceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    category: initialData?.category || "Nail Art",
    price: initialData?.price || "",
    duration: initialData?.duration || "",
    shortDescription: initialData?.shortDescription || "",
    description: initialData?.description || "",
    image: initialData?.image || "",
    isActive: initialData?.isActive ?? true,
    isPopular: initialData?.isPopular ?? false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing 
        ? `/api/admin/services/${initialData.id}` 
        : "/api/admin/services";
      
      const res = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/services");
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
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <Link href="/admin/services" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={16} /> Kembali
        </Link>
        <Button type="submit" disabled={loading} className="min-w-[150px]">
          {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
          {isEditing ? "Simpan Perubahan" : "Tambah Layanan"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-border p-6 rounded-xl space-y-4">
            <h3 className="font-bold text-lg mb-4">Informasi Dasar</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Nama Layanan</label>
              <input 
                type="text" 
                className="w-full bg-dark border border-border rounded-lg p-3 text-white outline-none focus:border-accent"
                placeholder="Cth: Gel Manicure Premium"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Kategori</label>
                <select 
                  className="w-full bg-dark border border-border rounded-lg p-3 text-white outline-none focus:border-accent"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option>Nail Art</option>
                  <option>Manicure</option>
                  <option>Pedicure</option>
                  <option>Makeup</option>
                  <option>Hair Do</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Status</label>
                <div className="flex gap-4 p-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    /> 
                    <span className="text-sm">Aktif</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.isPopular}
                      onChange={(e) => setFormData({...formData, isPopular: e.target.checked})}
                    /> 
                    <span className="text-sm">Populer (Star)</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Deskripsi Singkat (Preview)</label>
              <input 
                type="text" 
                className="w-full bg-dark border border-border rounded-lg p-3 text-white outline-none focus:border-accent"
                placeholder="Deskripsi 1 kalimat untuk tampilan kartu..."
                value={formData.shortDescription}
                onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Deskripsi Lengkap</label>
              <textarea 
                className="w-full bg-dark border border-border rounded-lg p-3 text-white outline-none focus:border-accent min-h-[150px]"
                placeholder="Jelaskan detail layanan, apa saja yang didapat, dll..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>
          </div>
        </div>

        {/* Media & Price */}
        <div className="space-y-6">
          <div className="bg-surface border border-border p-6 rounded-xl space-y-4">
            <h3 className="font-bold text-lg mb-4">Harga & Waktu</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Harga (Rp)</label>
              <input 
                type="number" 
                className="w-full bg-dark border border-border rounded-lg p-3 text-white outline-none focus:border-accent"
                placeholder="150000"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Durasi (Cth: 60 Menit)</label>
              <input 
                type="text" 
                className="w-full bg-dark border border-border rounded-lg p-3 text-white outline-none focus:border-accent"
                placeholder="60-90 Menit"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="bg-surface border border-border p-6 rounded-xl space-y-4">
            <h3 className="font-bold text-lg mb-4">Media Utama</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">URL Gambar</label>
              <input 
                type="text" 
                className="w-full bg-dark border border-border rounded-lg p-3 text-white outline-none focus:border-accent text-xs"
                placeholder="https://..."
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
              />
            </div>
            <div className="aspect-video bg-dark rounded-lg border border-dashed border-border flex items-center justify-center overflow-hidden">
              {formData.image ? (
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-gray-500 text-sm flex flex-col items-center gap-2">
                  <ImageIcon size={32} />
                  <span>Preview Gambar</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
