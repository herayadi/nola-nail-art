import { prisma } from "@/lib/prisma";
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  Users, 
  DollarSign, 
  ChevronRight,
  User
} from "lucide-react";
import Link from "next/link";
import styles from "./dashboard.module.css";
import Badge from "@/components/ui/Badge";

export default async function AdminDashboard() {
  // Fetch real stats from DB
  const [
    totalBookings,
    pendingBookings,
    totalRevenue,
    totalCustomers,
    recentBookings
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.aggregate({ _sum: { totalPrice: true } }),
    prisma.customer.count(),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { service: true }
    })
  ]);

  // Dummy data for Pure CSS Chart (Booking per Day - last 7 days)
  const chartData = [
    { day: "Sen", value: 45 },
    { day: "Sel", value: 80 },
    { day: "Rab", value: 65 },
    { day: "Kam", value: 95 },
    { day: "Jum", value: 120 },
    { day: "Sab", value: 150 },
    { day: "Min", value: 110 },
  ];

  return (
    <div className="animate-fade-in">
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Selamat datang kembali, Admin Nola Nail Art.</p>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Total Booking</span>
            <div className={styles.statIcon}><Calendar size={20} /></div>
          </div>
          <div className={styles.statValue}>{totalBookings}</div>
          <div className={`${styles.statTrend} ${styles.trendUp}`}>
            <TrendingUp size={14} /> +12% dari bulan lalu
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Pending</span>
            <div className={styles.statIcon} style={{ backgroundColor: 'rgba(224, 168, 32, 0.12)', color: '#E0A820' }}>
              <Clock size={20} />
            </div>
          </div>
          <div className={styles.statValue}>{pendingBookings}</div>
          <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>Butuh konfirmasi segera</p>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Revenue</span>
            <div className={styles.statIcon}><DollarSign size={20} /></div>
          </div>
          <div className={styles.statValue}>
            Rp {(totalRevenue._sum.totalPrice || 0).toLocaleString("id-ID")}
          </div>
          <div className={`${styles.statTrend} ${styles.trendUp}`}>
            <TrendingUp size={14} /> +8.4%
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Customer</span>
            <div className={styles.statIcon}><Users size={20} /></div>
          </div>
          <div className={styles.statValue}>{totalCustomers}</div>
          <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>Pelanggan terdaftar</p>
        </div>
      </div>

      <div className={styles.mainGrid}>
        {/* Left: Chart Section */}
        <section className={styles.section}>
          <div className={styles.sectionTitle}>
            Aktivitas Mingguan
            <span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--admin-text-muted)' }}>Booking per Hari</span>
          </div>
          
          <div className={styles.chartContainer}>
            {chartData.map((item) => (
              <div key={item.day} className={styles.chartBarWrapper}>
                <div 
                  className={styles.bar} 
                  style={{ height: `${(item.value / 150) * 100}%` }}
                >
                  <span className={styles.barValue}>{item.value}</span>
                </div>
                <span className={styles.barLabel}>{item.day}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Right: Recent Bookings */}
        <section className={styles.section}>
          <div className={styles.sectionTitle}>
            Booking Terbaru
            <Link href="/admin/bookings" className={styles.subtitle} style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center' }}>
              Lihat Semua <ChevronRight size={14} />
            </Link>
          </div>

          <div className={styles.recentList}>
            {recentBookings.length === 0 ? (
              <p style={{ color: 'var(--admin-text-muted)', textAlign: 'center', py: 'var(--space-xl)' }}>
                Belum ada data booking.
              </p>
            ) : (
              recentBookings.map((booking) => (
                <div key={booking.id} className={styles.recentItem}>
                  <div className={styles.itemAvatar}>
                    <User size={20} />
                  </div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>{booking.customerName}</div>
                    <div className={styles.itemDesc}>{booking.service.name} • {booking.timeSlot}</div>
                  </div>
                  <Badge 
                    variant={
                      booking.status === "PENDING" ? "warning" : 
                      booking.status === "CONFIRMED" ? "info" : "success"
                    }
                  >
                    {booking.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
