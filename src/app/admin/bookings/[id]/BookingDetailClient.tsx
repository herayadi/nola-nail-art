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
  Loader2
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

  const updateStatus = async (newStatus: string) => {
    setLoading(newStatus);
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) router.refresh();
    } catch (err) {
      alert("Gagal memperbarui status.");
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
      if (res.ok) router.refresh();
    } catch (err) {
      alert("Gagal memperbarui status pembayaran.");
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

  const waMessage = `Halo ${booking.customerName}, konfirmasi booking Anda di Nola Nail Art untuk tanggal ${new Date(booking.selectedDate).toLocaleDateString()} jam ${booking.timeSlot} sudah kami terima. Silakan melakukan deposit...`;

  return (
    <div className="animate-fade-in">
      <Link href="/admin/bookings" className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft size={16} /> Kembali ke Daftar
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Col: Info */}
        <div className="flex-1 space-y-6">
          <div className="bg-surface border border-border p-6 rounded-xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-semibold mb-1">Booking #{booking.id.slice(-6).toUpperCase()}</h1>
                <p className="text-gray-400 text-sm">Dibuat pada {new Date(booking.createdAt).toLocaleString()}</p>
              </div>
              <Badge 
                variant={
                  booking.status === "PENDING" ? "warning" : 
                  booking.status === "CONFIRMED" ? "info" : 
                  booking.status === "COMPLETED" ? "success" : "neutral"
                }
                className="text-sm px-4 py-1"
              >
                {booking.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-accent text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <User size={14} /> Data Customer
                </h3>
                <div>
                  <p className="font-semibold text-lg">{booking.customerName}</p>
                  <p className="text-gray-400 flex items-center gap-2 mt-1">
                    <Phone size={14} /> {booking.customerPhone}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-accent text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <Calendar size={14} /> Jadwal Kedatangan
                </h3>
                <div>
                  <p className="font-semibold text-lg">{booking.timeSlot}</p>
                  <p className="text-gray-400">
                    {new Date(booking.selectedDate).toLocaleDateString("id-ID", {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border p-6 rounded-xl">
            <h3 className="text-accent text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles size={14} /> Detail Layanan
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">{booking.service.name}</span>
                <span>Rp {booking.service.price.toLocaleString("id-ID")}</span>
              </div>
              {/* Add-ons placeholder if needed */}
              <div className="border-t border-border pt-3 mt-3 flex justify-between items-center font-bold text-lg">
                <span>Total Estimasi</span>
                <span className="text-accent">Rp {booking.totalPrice.toLocaleString("id-ID")}</span>
              </div>
            </div>
            {booking.customerNotes && (
              <div className="mt-6 p-4 bg-dark/50 border-l-4 border-accent rounded-r-lg">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Catatan Customer:</p>
                <p className="italic text-sm">"{booking.customerNotes}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Actions */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-surface border border-border p-6 rounded-xl">
            <h3 className="text-sm font-bold mb-4">Aksi Pengelola</h3>
            
            <div className="space-y-3">
              {booking.status === "PENDING" && (
                <Button 
                  fullWidth 
                  onClick={() => updateStatus("CONFIRMED")}
                  disabled={loading !== null}
                >
                  {loading === "CONFIRMED" ? <Loader2 className="animate-spin" /> : <CheckCircle size={18} />}
                  Konfirmasi Booking
                </Button>
              )}
              
              {booking.status === "CONFIRMED" && (
                <Button 
                  fullWidth 
                  onClick={() => updateStatus("COMPLETED")}
                  disabled={loading !== null}
                >
                  {loading === "COMPLETED" ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                  Tandai Selesai
                </Button>
              )}

              <a 
                href={buildWhatsAppUrl(waMessage)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <Button variant="whatsapp" fullWidth>
                  <MessageCircle size={18} /> Chat WhatsApp
                </Button>
              </a>

              {booking.status !== "CANCELLED" && (
                <Button 
                  variant="ghost" 
                  fullWidth 
                  className="text-error hover:bg-error/10"
                  onClick={() => updateStatus("CANCELLED")}
                  disabled={loading !== null}
                >
                  <XCircle size={18} /> Batalkan Pesanan
                </Button>
              )}
            </div>
          </div>

          <div className="bg-surface border border-border p-6 rounded-xl">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <CreditCard size={16} /> Status Pembayaran
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span>Tagihan:</span>
                <span className="font-bold">Rp {booking.totalPrice.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Status:</span>
                <Badge variant={booking.paymentStatus === "PAID" ? "success" : "error"}>
                  {booking.paymentStatus === "PAID" ? "LUNAS" : "BELUM BAYAR"}
                </Badge>
              </div>
              
              <Button 
                variant="secondary" 
                fullWidth 
                size="sm"
                onClick={() => updatePayment(booking.paymentStatus === "PAID" ? "UNPAID" : "PAID")}
                disabled={loading === "payment"}
              >
                {loading === "payment" ? <Loader2 className="animate-spin" /> : <CreditCard size={16} />}
                Tandai {booking.paymentStatus === "PAID" ? "Belum Bayar" : "Sudah Bayar"}
              </Button>
            </div>
          </div>

          <div className="bg-surface border border-border p-6 rounded-xl">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <FileText size={16} /> Catatan Internal
            </h3>
            <textarea 
              className="w-full bg-dark border border-border rounded-lg p-3 text-sm focus:border-accent outline-none min-h-[100px]"
              placeholder="Catatan rahasia admin..."
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
            />
            <Button 
              variant="ghost" 
              fullWidth 
              size="sm" 
              className="mt-2 text-xs"
              onClick={saveNotes}
              disabled={isSavingNotes}
            >
              {isSavingNotes ? <Loader2 className="animate-spin" /> : <Save size={14} />}
              Simpan Catatan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
