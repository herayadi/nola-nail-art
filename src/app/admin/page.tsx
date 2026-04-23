import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import {
  Calendar,
  Clock,
  TrendingUp,
  Users,
  DollarSign,
  ChevronRight,
  User,
  Zap,
  Star,
} from "lucide-react";
import Link from "next/link";
import styles from "./dashboard.module.css";
import Badge from "@/components/ui/Badge";

export default async function AdminDashboard() {
  const [
    totalBookings,
    pendingBookings,
    totalRevenue,
    totalCustomers,
    recentBookings,
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.aggregate({ _sum: { totalPrice: true } }),
    prisma.customer.count(),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { service: true },
    }),
  ]);

  const chartData = [
    { day: "Mon", value: 45 },
    { day: "Tue", value: 80 },
    { day: "Wed", value: 65 },
    { day: "Thu", value: 95 },
    { day: "Fri", value: 120 },
    { day: "Sat", value: 150 },
    { day: "Sun", value: 110 },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Studio Analytics</h1>
        <p className={styles.subtitle}>
          Welcome back, Curator. Here's your studio's performance pulse.
        </p>
      </header>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Total Engagements</span>
            <div className={styles.statIcon}>
              <Calendar size={20} />
            </div>
          </div>
          <div className={styles.statValue}>{totalBookings}</div>
          <div className={`${styles.statTrend} ${styles.trendUp}`}>
            <TrendingUp size={14} /> +12.5%{" "}
            <span className="text-gray-600 ml-1">vs last month</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Awaiting Confirmation</span>
            <div
              className={styles.statIcon}
              style={{
                backgroundColor: "rgba(224, 168, 32, 0.1)",
                color: "#E0A820",
              }}
            >
              <Clock size={20} />
            </div>
          </div>
          <div className={styles.statValue}>{pendingBookings}</div>
          <p className="text-[10px] text-gray-500 uppercase font-bold mt-3 tracking-widest flex items-center gap-1">
            <Zap size={10} className="text-warning" /> Immediate Action Required
          </p>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Gross Revenue</span>
            <div
              className={styles.statIcon}
              style={{
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                color: "#22C55E",
              }}
            >
              <DollarSign size={20} />
            </div>
          </div>
          <div className={styles.statValue}>
            Rp {(totalRevenue._sum.totalPrice || 0).toLocaleString("id-ID")}
          </div>
          <div className={`${styles.statTrend} ${styles.trendUp}`}>
            <TrendingUp size={14} /> +8.4%{" "}
            <span className="text-gray-600 ml-1">Profitability index</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Total Universe</span>
            <div
              className={styles.statIcon}
              style={{
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                color: "#3B82F6",
              }}
            >
              <Users size={20} />
            </div>
          </div>
          <div className={styles.statValue}>{totalCustomers}</div>
          <p className="text-[10px] text-gray-500 uppercase font-bold mt-3 tracking-widest flex items-center gap-1">
            <Star size={10} className="text-accent" /> Registered Studio Members
          </p>
        </div>
      </div>

      <div className={styles.mainGrid}>
        {/* Left: Chart Section */}
        <section className={styles.section}>
          <div className={styles.sectionTitle}>
            Weekly Activity Cycle
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">
              Booking Density
            </span>
          </div>

          <div className={styles.chartContainer}>
            {chartData.map((item: any) => (
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
            Recent Sessions
            <Link
              href="/admin/bookings"
              className="text-accent hover:underline text-[10px] font-black uppercase tracking-widest flex items-center gap-1"
            >
              ALL LOGS <ChevronRight size={12} />
            </Link>
          </div>

          <div className={styles.recentList}>
            {recentBookings.length === 0 ? (
              <div className="text-center py-10 opacity-20">
                <Calendar size={48} className="mx-auto mb-2" />
                <p className="text-xs">No recent sessions recorded.</p>
              </div>
            ) : (
              recentBookings.map((booking: any) => (
                <div key={booking.id} className={styles.recentItem}>
                  <div className={styles.itemAvatar}>
                    <User size={18} />
                  </div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>
                      {booking.customerName}
                    </div>
                    <div className={styles.itemDesc}>
                      {booking.service.name} • {booking.timeSlot}
                    </div>
                  </div>
                  <Badge
                    variant={
                      booking.status === "PENDING"
                        ? "warning"
                        : booking.status === "CONFIRMED"
                          ? "info"
                          : "success"
                    }
                    className="text-[10px] px-2"
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
