import { prisma } from "@/lib/prisma";
import { 
  User, 
  Search, 
  Calendar,
  CreditCard,
  ChevronRight,
  TrendingUp,
  Award
} from "lucide-react";
import Link from "next/link";
import styles from "./customers.module.css";

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { totalSpent: "desc" },
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Customer Universe</h1>
          <p className={styles.subtitle}>Analyzing the loyalty and journey of your studio visitors.</p>
        </div>
        <div className={styles.searchWrapper}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input 
            type="text" 
            placeholder="Search by name or connection..." 
            className={styles.searchInput}
          />
        </div>
      </header>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Profile</th>
              <th>Engagement</th>
              <th>Loyalty Value</th>
              <th>Established</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-24 text-gray-600">
                  <User size={48} className="mx-auto mb-4 opacity-10" />
                  <p>Your database is currently empty.</p>
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <div className={styles.profileCell}>
                      <div className={styles.avatar}>
                        <User size={20} />
                      </div>
                      <div>
                        <div className={styles.name}>{customer.name}</div>
                        <div className={styles.phone}>{customer.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.stats}>
                      <span className={styles.statValue}>
                        {customer.totalBookings}
                        <span className="text-xs text-gray-500 ml-1">VISITS</span>
                      </span>
                      <span className="text-[10px] text-gray-500 flex items-center gap-1">
                        <TrendingUp size={10} /> RECURRING
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.stats}>
                      <span className={`${styles.statValue} ${styles.statAccent}`}>
                        Rp {customer.totalSpent.toLocaleString("id-ID")}
                      </span>
                      <span className="text-[10px] text-gray-500 flex items-center gap-1 uppercase">
                        <Award size={10} /> Lifetime Value
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400">
                        {new Date(customer.createdAt).toLocaleDateString("id-ID", {
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="text-[10px] text-gray-600 uppercase tracking-tighter">Registered Date</span>
                    </div>
                  </td>
                  <td>
                    <Link href={`/admin/customers/${customer.id}`}>
                      <button className="bg-white/5 hover:bg-accent hover:text-dark px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2">
                        Profile <ChevronRight size={14} />
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
