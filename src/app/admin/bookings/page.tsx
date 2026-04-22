import { prisma } from "@/lib/prisma";
import { 
  Search, 
  Filter, 
  Download, 
  ExternalLink,
  ChevronRight,
  Calendar
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

  // Fetch bookings with filters
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
    <div className="animate-fade-in">
      <div className={styles.header}>
        <h1 className={styles.title}>Manajemen Booking</h1>
        <div className={styles.actions}>
          <button className="bg-dark text-light px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 border border-gray-100 hover:bg-gray-50 hover:text-dark transition-colors">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Status:</span>
          <div className="flex gap-2">
            <Link 
              href="/admin/bookings" 
              className={`${styles.select} ${!status ? "bg-accent text-dark border-accent" : ""}`}
            >
              Semua
            </Link>
            <Link 
              href="/admin/bookings?status=PENDING" 
              className={`${styles.select} ${status === "PENDING" ? "bg-accent text-dark border-accent" : ""}`}
            >
              Pending
            </Link>
            <Link 
              href="/admin/bookings?status=CONFIRMED" 
              className={`${styles.select} ${status === "CONFIRMED" ? "bg-accent text-dark border-accent" : ""}`}
            >
              Confirmed
            </Link>
            <Link 
              href="/admin/bookings?status=COMPLETED" 
              className={`${styles.select} ${status === "COMPLETED" ? "bg-accent text-dark border-accent" : ""}`}
            >
              Completed
            </Link>
          </div>
        </div>
        
        <div className={styles.filterGroup} style={{ marginLeft: 'auto' }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Cari customer..." 
              className={styles.select} 
              style={{ paddingLeft: '36px', width: '250px' }}
            />
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Layanan</th>
              <th>Jadwal</th>
              <th>Total</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-3xl)', color: 'var(--admin-text-muted)' }}>
                  <Calendar size={48} style={{ margin: '0 auto var(--space-md)', opacity: 0.2 }} />
                  <p>Tidak ada data booking yang ditemukan.</p>
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <div className={styles.customerInfo}>
                      <span className={styles.customerName}>{booking.customerName}</span>
                      <span className={styles.customerPhone}>{booking.customerPhone}</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.serviceInfo}>
                      <span className={styles.serviceName}>{booking.service.name}</span>
                      <span className={styles.price}>Rp {booking.totalPrice.toLocaleString("id-ID")}</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.dateTime}>
                      <span className={styles.time}>{booking.timeSlot}</span>
                      <span className={styles.date}>
                        {new Date(booking.selectedDate).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>
                      Rp {booking.totalPrice.toLocaleString("id-ID")}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: booking.paymentStatus === "PAID" ? 'var(--color-success)' : 'var(--color-error)' }}>
                      {booking.paymentStatus === "PAID" ? "● Lunas" : "○ Belum Bayar"}
                    </div>
                  </td>
                  <td>
                    <Badge 
                      variant={
                        booking.status === "PENDING" ? "warning" : 
                        booking.status === "CONFIRMED" ? "info" : 
                        booking.status === "COMPLETED" ? "success" : "neutral"
                      }
                    >
                      {booking.status}
                    </Badge>
                  </td>
                  <td>
                    <Link href={`/admin/bookings/${booking.id}`} className={styles.viewLink}>
                      Detail <ChevronRight size={14} />
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
