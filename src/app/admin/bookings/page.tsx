import { prisma } from "@/lib/prisma";
import {
  Search,
  Filter,
  Download,
  ChevronRight,
  Calendar,
  Sparkles,
  CreditCard,
  Clock,
} from "lucide-react";
import Link from "next/link";
import styles from "./bookings.module.css";
import Badge from "@/components/ui/Badge";

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const bookings = await prisma.booking.findMany({
    where: status ? { status } : {},
    include: {
      service: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Session Logs</h1>
          <p className={styles.subtitle}>
            Overseeing every brushstroke and appointment in the studio.
          </p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.searchWrapper}>
            <Search className="absolute left-5 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Track client, service or session..."
              className={styles.searchInput}
            />
          </div>
          <button className={styles.exportBtn}>
            <Download size={18} /> Export
          </button>
        </div>
      </header>

      <div className={styles.filters}>
        <Link
          href="/admin/bookings"
          className={`${styles.filterBtn} ${!status ? styles.filterBtnActive : ""}`}
        >
          ALL SESSIONS
        </Link>
        <Link
          href="/admin/bookings?status=PENDING"
          className={`${styles.filterBtn} ${status === "PENDING" ? styles.filterBtnActive : ""}`}
        >
          PENDING
        </Link>
        <Link
          href="/admin/bookings?status=CONFIRMED"
          className={`${styles.filterBtn} ${status === "CONFIRMED" ? styles.filterBtnActive : ""}`}
        >
          CONFIRMED
        </Link>
        <Link
          href="/admin/bookings?status=COMPLETED"
          className={`${styles.filterBtn} ${status === "COMPLETED" ? styles.filterBtnActive : ""}`}
        >
          ARCHIVED
        </Link>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Client</th>
              <th>Artistry Session</th>
              <th>Schedule</th>
              <th>Value</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-24 text-gray-600">
                  <Calendar size={48} className="mx-auto mb-4 opacity-10" />
                  <p>No appointment records found in this universe.</p>
                </td>
              </tr>
            ) : (
              bookings.map((booking: any) => (
                <tr key={booking.id}>
                  <td>
                    <div className={styles.customerInfo}>
                      <span className={styles.customerName}>
                        {booking.customerName}
                      </span>
                      <span className={styles.customerPhone}>
                        {booking.customerPhone}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.serviceInfo}>
                      <div className={styles.serviceIcon}>
                        <Sparkles size={16} />
                      </div>
                      <span className="font-medium">
                        {booking.service.name}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.dateCell}>
                      <span className={styles.time}>{booking.timeSlot}</span>
                      <span className={styles.date}>
                        {new Date(booking.selectedDate).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span className={styles.price}>
                        Rp {booking.totalPrice.toLocaleString("id-ID")}
                      </span>
                      <span
                        className={`text-[9px] font-bold tracking-tighter uppercase ${booking.paymentStatus === "PAID" ? "text-success" : "text-error"}`}
                      >
                        {booking.paymentStatus === "PAID"
                          ? "Settled"
                          : "Outstanding"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <Badge
                      variant={
                        booking.status === "PENDING"
                          ? "warning"
                          : booking.status === "CONFIRMED"
                            ? "info"
                            : booking.status === "COMPLETED"
                              ? "success"
                              : "neutral"
                      }
                      className="text-[10px] px-3 font-black tracking-widest"
                    >
                      {booking.status}
                    </Badge>
                  </td>
                  <td>
                    <Link href={`/admin/bookings/${booking.id}`}>
                      <button className="w-8 h-8 flex items-center justify-center hover:bg-accent hover:text-dark rounded-full transition-all">
                        <ChevronRight size={18} />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
