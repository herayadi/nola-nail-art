import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  User,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  FileText,
  ArrowLeft,
  Sparkles,
  MessageCircle,
  History,
  TrendingUp,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import styles from "../customers.module.css";
import Badge from "@/components/ui/Badge";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      bookings: {
        include: { service: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!customer) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <Link
        href="/admin/customers"
        className="flex items-center gap-2 text-gray-500 hover:text-white mb-10 transition-all group"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />{" "}
        Back to Database
      </Link>

      <div className={styles.detailGrid}>
        {/* Profile Card */}
        <div className="space-y-8">
          <div className={styles.profileCard}>
            <div className={styles.largeAvatar}>
              <User size={56} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {customer.name}
            </h1>
            <div className={styles.vipBadge}>VIP STUDIO MEMBER</div>

            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <Phone size={18} />
                <span>{customer.phone}</span>
              </div>
              <div className={styles.infoItem}>
                <Mail size={18} />
                <span>{customer.email || "No email registered"}</span>
              </div>
              <div className={styles.infoItem}>
                <Calendar size={18} />
                <span>
                  Since{" "}
                  {new Date(customer.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className={styles.infoItem}>
                <MapPin size={18} />
                <span>Jakarta, Indonesia</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-10">
              <div className="bg-admin-bg/50 p-5 rounded-2xl border border-admin-border shadow-inner">
                <div className="text-[10px] text-gray-500 uppercase font-bold mb-1 tracking-widest">
                  Total Visits
                </div>
                <div className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                  {customer.totalBookings}
                  <TrendingUp size={14} className="text-success" />
                </div>
              </div>
              <div className="bg-admin-bg/50 p-5 rounded-2xl border border-admin-border shadow-inner">
                <div className="text-[10px] text-gray-500 uppercase font-bold mb-1 tracking-widest">
                  Lifetime Value
                </div>
                <div className="text-xl font-bold text-accent">
                  Rp {customer.totalSpent.toLocaleString("id-ID")}
                </div>
              </div>
            </div>

            <a
              href={buildWhatsAppUrl(
                `Halo ${customer.name}, ini dari Nola Nail Art...`,
              )}
              target="_blank"
              className="block mt-8"
            >
              <button className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-green-500/20">
                <MessageCircle size={20} /> Connect via WhatsApp
              </button>
            </a>
          </div>

          <div className="bg-admin-surface border border-admin-border p-8 rounded-3xl shadow-xl">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <FileText size={14} /> Internal Dossier
            </h3>
            <div className="p-4 bg-admin-bg/30 rounded-xl border border-white/5 italic text-sm text-gray-300 leading-relaxed">
              "
              {customer.internalNotes ||
                "No internal dossiers recorded for this client yet. Maintain professional context here."}
              "
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className={styles.historyContainer}>
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <History size={24} className="text-accent" />
              Service History
            </h2>
            <div className="text-[10px] text-gray-500 font-bold bg-white/5 px-4 py-1 rounded-full uppercase tracking-widest">
              Total {customer.bookings.length} Events
            </div>
          </div>

          <div className="space-y-4">
            {customer.bookings.length === 0 ? (
              <div className="text-center py-20 opacity-20">
                <Sparkles size={48} className="mx-auto mb-4" />
                <p>No historical service data found.</p>
              </div>
            ) : (
              customer.bookings.map((booking: any) => (
                <div key={booking.id} className={styles.historyItem}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-admin-surface rounded-xl flex items-center justify-center border border-admin-border">
                        <Sparkles size={20} className="text-accent" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-white">
                          {booking.service.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <Calendar size={12} />
                          {new Date(booking.selectedDate).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                          <span className="text-gray-700">|</span>
                          <span className="text-accent font-medium">
                            {booking.timeSlot}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={
                        booking.status === "COMPLETED"
                          ? "success"
                          : booking.status === "CANCELLED"
                            ? "error"
                            : "warning"
                      }
                      className="text-[10px] px-3"
                    >
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <CreditCard size={14} className="text-gray-500" />
                      <span className="text-gray-400 font-bold">
                        Rp {booking.totalPrice.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <Link
                      href={`/admin/bookings/${booking.id}`}
                      className="text-accent text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-1"
                    >
                      Inspect Record{" "}
                      <ArrowLeft size={10} className="rotate-180" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
