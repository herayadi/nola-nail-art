"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  MessageCircle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  CreditCard,
  Calendar,
  User,
  Phone,
  FileText,
  Save,
  Loader2,
  Sparkles,
  Copy,
  Plus
} from "lucide-react";
import Link from "next/link";
import styles from "../bookings.module.css";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface BookingDetailClientProps {
  booking: any;
}

export default function BookingDetailClient({ booking }: BookingDetailClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [internalNotes, setInternalNotes] = useState(booking.internalNotes || "");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [copied, setCopied] = useState(false);

  const updateStatus = async (newStatus: string) => {
    setLoading(newStatus);
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(`Error: ${data.error || "Gagal memperbarui status."}`);
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(null);
    }
  };

  const updatePayment = async (newPaymentStatus: string) => {
    setLoading("payment");
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: newPaymentStatus }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(`Error: ${data.error || "Gagal memperbarui status pembayaran."}`);
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(null);
    }
  };

  const saveNotes = async () => {
    setIsSavingNotes(true);
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internalNotes }),
      });
      if (res.ok) alert("Catatan tersimpan.");
    } catch (err) {
      alert("Gagal menyimpan catatan.");
    } finally {
      setIsSavingNotes(false);
    }
  };

  const copyPhone = () => {
    navigator.clipboard.writeText(booking.customerPhone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const waMessage = `Halo ${booking.customerName}, konfirmasi booking Anda di Nola Nail Art untuk tanggal ${new Date(booking.selectedDate).toLocaleDateString()} jam ${booking.timeSlot} sudah kami terima. Silakan melakukan deposit...`;

  // Parse addon IDs and find their records
  const selectedAddonIds = JSON.parse(booking.addonIds || "[]");
  const selectedAddons = booking.service.addons?.filter((a: any) => selectedAddonIds.includes(a.id)) || [];

  return (
    <div className={styles.container}>
      <Link href="/admin/bookings" className="flex items-center gap-2 text-gray-400 hover:text-accent mb-8 transition-colors text-sm font-bold uppercase tracking-widest">
        <ArrowLeft size={16} /> Kembali ke Daftar
      </Link>

      <div className={styles.detailGrid}>
        {/* Main Info */}
        <div className="space-y-8">
          <div className={styles.card}>
            <div className="flex justify-between items-start mb-10">
              <div>
                <h1 className={styles.title} style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
                  Booking #{booking.id.slice(-6).toUpperCase()}
                </h1>
                <p className={styles.valueMuted}>Pemesanan diterima pada {new Date(booking.createdAt).toLocaleString()}</p>
              </div>
              <Badge 
                variant={
                  booking.status === "PENDING" ? "warning" : 
                  booking.status === "CONFIRMED" ? "info" : 
                  booking.status === "COMPLETED" ? "success" : "neutral"
                }
                className="text-sm px-8 py-3 rounded-full font-black uppercase tracking-widest"
              >
                {booking.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className={styles.infoSection}>
                <span className={styles.label}>Data Customer</span>
                <p className={styles.value} style={{ fontSize: '1.75rem', marginBottom: '8px' }}>{booking.customerName}</p>
                <div className="flex items-center gap-4">
                  <p className="text-accent flex items-center gap-2 font-bold text-lg">
                    <Phone size={18} /> {booking.customerPhone}
                  </p>
                  <button onClick={copyPhone} className={styles.copyBtn}>
                    {copied ? "Copied!" : <><Copy size={12} className="inline mr-1" /> Copy</>}
                  </button>
                </div>
              </div>

              <div className={styles.infoSection}>
                <span className={styles.label}>Jadwal Kedatangan</span>
                <p className={styles.value} style={{ fontSize: '1.75rem', marginBottom: '8px' }}>{booking.timeSlot}</p>
                <p className={styles.value} style={{ opacity: 0.8 }}>
                  <Calendar size={18} className="inline mr-2 text-accent" />
                  {new Date(booking.selectedDate).toLocaleDateString("id-ID", {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.infoSection}>
              <span className={styles.label}>Detail Layanan & Add-ons</span>
              <div className="mt-6 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className={styles.value} style={{ fontSize: '1.5rem' }}>{booking.service.name}</p>
                    <p className={styles.valueMuted} style={{ fontSize: '1rem' }}>{booking.service.duration} Session</p>
                  </div>
                  <p className={styles.value}>Rp {booking.service.price.toLocaleString("id-ID")}</p>
                </div>

                {selectedAddons.length > 0 && (
                  <div className="space-y-3 pt-2">
                    {selectedAddons.map((addon: any) => (
                      <div key={addon.id} className="flex justify-between items-center">
                        <span className={styles.addonTag}>
                          <Plus size={12} /> {addon.name}
                        </span>
                        <span className={styles.valueMuted}>+ Rp {addon.price.toLocaleString("id-ID")}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className={styles.divider} style={{ margin: '24px 0' }} />

                <div className="flex justify-between items-end">
                  <div>
                    <span className={styles.label}>Total Estimasi</span>
                    <p className={styles.priceHighlight}>Rp {booking.totalPrice.toLocaleString("id-ID")}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={booking.paymentStatus === "PAID" ? "success" : "error"} className="px-6 py-2 rounded-lg font-bold">
                      {booking.paymentStatus === "PAID" ? "LUNAS" : "BELUM DIBAYAR"}
                    </Badge>
                  </div>
                </div>
              </div>

              {booking.customerNotes && (
                <div className={styles.customerNote}>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={16} className="text-accent" />
                    <span className={styles.label} style={{ color: 'var(--admin-accent)', marginBottom: 0 }}>Catatan Khusus Pelanggan</span>
                  </div>
                  <p className={styles.noteText}>"{booking.customerNotes}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Booking History / Timeline */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <Clock size={18} /> Booking Timeline
            </h3>
            <div className={styles.timeline}>
              <div className={`${styles.timelineItem} ${styles.timelineItemActive}`}>
                <div className={styles.stepIcon}><Plus size={18} /></div>
                <div className={styles.stepContent}>
                  <p className={styles.stepTitle}>Pemesanan Diterima</p>
                  <span className={styles.stepTime}>{new Date(booking.createdAt).toLocaleString()}</span>
                </div>
              </div>
              
              <div className={`${styles.timelineItem} ${booking.status !== "PENDING" ? styles.timelineItemActive : ""}`}>
                <div className={styles.stepIcon}><CheckCircle size={18} /></div>
                <div className={styles.stepContent}>
                  <p className={styles.stepTitle}>Konfirmasi Admin</p>
                  <span className={styles.stepTime}>
                    {booking.status === "PENDING" ? "Menunggu tindakan..." : `Dikonfirmasi pada ${new Date(booking.updatedAt).toLocaleString()}`}
                  </span>
                </div>
              </div>

              {booking.status === "COMPLETED" && (
                <div className={`${styles.timelineItem} ${styles.timelineItemActive}`}>
                  <div className={styles.stepIcon}><Sparkles size={18} /></div>
                  <div className={styles.stepContent}>
                    <p className={styles.stepTitle}>Layanan Selesai</p>
                    <span className={styles.stepTime}>Perawatan telah selesai dilakukan</span>
                  </div>
                </div>
              )}

              {booking.status === "CANCELLED" && (
                <div className={`${styles.timelineItem} ${styles.timelineItemActive}`} style={{ color: 'var(--color-error)' }}>
                  <div className={styles.stepIcon} style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }}><XCircle size={18} /></div>
                  <div className={styles.stepContent}>
                    <p className={styles.stepTitle}>Pemesanan Dibatalkan</p>
                    <span className={styles.stepTime}>Dibatalkan oleh sistem/admin</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-8">
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <Save size={18} /> Aksi Cepat
            </h3>
            
            <div className={styles.actionStack}>
              {booking.status === "PENDING" && (
                <Button 
                  fullWidth 
                  onClick={() => updateStatus("CONFIRMED")}
                  disabled={loading !== null}
                  className={styles.btnConfirm}
                  style={{ height: '60px', borderRadius: '18px', fontSize: '1rem' }}
                >
                  {loading === "CONFIRMED" ? <Loader2 className="animate-spin" /> : <CheckCircle size={20} />}
                  Konfirmasi Sekarang
                </Button>
              )}
              
              {booking.status === "CONFIRMED" && (
                <Button 
                  fullWidth 
                  onClick={() => updateStatus("COMPLETED")}
                  disabled={loading !== null}
                  className={styles.btnConfirm}
                  style={{ height: '60px', borderRadius: '18px', fontSize: '1rem' }}
                >
                  {loading === "COMPLETED" ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                  Tandai Selesai
                </Button>
              )}

              <a 
                href={buildWhatsAppUrl(waMessage)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <Button 
                  fullWidth 
                  className={styles.btnWhatsApp}
                  style={{ height: '60px', borderRadius: '18px' }}
                >
                  <MessageCircle size={20} /> Hubungi via WA
                </Button>
              </a>

              {booking.status !== "CANCELLED" && booking.status !== "COMPLETED" && (
                <Button 
                  variant="ghost" 
                  fullWidth 
                  className={styles.btnCancel}
                  onClick={() => updateStatus("CANCELLED")}
                  disabled={loading !== null}
                  style={{ height: '56px', borderRadius: '16px', marginTop: '12px' }}
                >
                  <XCircle size={18} /> Batalkan Booking
                </Button>
              )}
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <CreditCard size={18} /> Verifikasi Bayar
            </h3>
            <div className="space-y-6">
              <Button 
                fullWidth 
                onClick={() => updatePayment(booking.paymentStatus === "PAID" ? "UNPAID" : "PAID")}
                disabled={loading === "payment"}
                className={styles.btnPayment}
                style={{ height: '56px', borderRadius: '16px' }}
              >
                {loading === "payment" ? <Loader2 className="animate-spin" /> : <CreditCard size={18} />}
                {booking.paymentStatus === "PAID" ? "Set Belum Bayar" : "Konfirmasi Lunas"}
              </Button>
              <p className={styles.valueMuted} style={{ fontSize: '0.75rem', textAlign: 'center' }}>
                Pastikan Anda telah mengecek mutasi rekening sebelum melakukan konfirmasi lunas.
              </p>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <FileText size={18} /> Internal Notes
            </h3>
            <textarea 
              className={styles.notesArea}
              placeholder="Tambahkan catatan rahasia pengelola..."
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
            />
            <Button 
              variant="ghost" 
              fullWidth 
              size="sm" 
              className="mt-4"
              onClick={saveNotes}
              disabled={isSavingNotes}
              style={{ borderRadius: '12px', border: '1px solid var(--admin-border)' }}
            >
              {isSavingNotes ? <Loader2 className="animate-spin" /> : <Save size={16} />}
              Simpan Perubahan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
