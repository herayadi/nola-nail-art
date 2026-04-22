import { prisma } from "@/lib/prisma";
import {
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  Clock,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import styles from "./services.module.css";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { category: "asc" },
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Service Menu</h1>
          <p className={styles.subtitle}>
            Defining the artistry and value of your studio's offerings.
          </p>
        </div>
        <Link href="/admin/services/new">
          <Button variant="primary" className="flex items-center gap-2 group">
            <Plus
              size={18}
              className="group-hover:rotate-90 transition-transform"
            />
            Create New Service
          </Button>
        </Link>
      </header>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Service Details</th>
              <th>Classification</th>
              <th>Investment</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service: any) => (
              <tr
                key={service.id}
                style={{ opacity: service.isActive ? 1 : 0.5 }}
              >
                <td>
                  <div className={styles.serviceCell}>
                    <div className={styles.imageWrapper}>
                      <img
                        src={service.image}
                        alt={service.name}
                        className={styles.image}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={styles.serviceName}>
                          {service.name}
                        </span>
                        {service.isPopular && (
                          <Sparkles size={12} className="text-accent" />
                        )}
                      </div>
                      <div className={styles.serviceDesc}>
                        {service.shortDescription}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={styles.categoryBadge}>
                    {service.category}
                  </span>
                </td>
                <td>
                  <div className={styles.price}>
                    Rp {service.price.toLocaleString("id-ID")}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                    <Clock size={12} />
                    {service.duration}
                  </div>
                </td>
                <td>
                  <Badge
                    variant={service.isActive ? "success" : "neutral"}
                    className="text-[9px] px-3"
                  >
                    {service.isActive ? "ACTIVE" : "HIDDEN"}
                  </Badge>
                </td>
                <td>
                  <div className="flex gap-2">
                    <Link href={`/admin/services/${service.id}`}>
                      <button
                        className={`${styles.actionBtn} ${styles.editBtn}`}
                        title="Edit Service"
                      >
                        <Edit2 size={16} />
                      </button>
                    </Link>
                    <button
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      title="Delete Service"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
