import { prisma } from "@/lib/prisma";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  Eye,
  EyeOff,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import styles from "../bookings/bookings.module.css"; // Reuse table styles
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { category: "asc" },
  });

  return (
    <div className="animate-fade-in">
      <div className={styles.header}>
        <h1 className={styles.title}>Manajemen Layanan</h1>
        <Link href="/admin/services/new">
          <Button className="flex items-center gap-2">
            <Plus size={18} /> Tambah Layanan
          </Button>
        </Link>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Layanan</th>
              <th>Kategori</th>
              <th>Harga</th>
              <th>Durasi</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} style={{ opacity: service.isActive ? 1 : 0.6 }}>
                <td>
                  <div className="flex items-center gap-3">
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '8px', 
                      overflow: 'hidden',
                      backgroundColor: 'var(--admin-surface-hover)'
                    }}>
                      <img 
                        src={service.image} 
                        alt={service.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>
                    <div>
                      <div className="font-semibold flex items-center gap-2">
                        {service.name}
                        {service.isPopular && <Sparkles size={14} className="text-accent" />}
                      </div>
                      <div className="text-xs text-gray-400 line-clamp-1">{service.shortDescription}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <Badge variant="neutral">{service.category}</Badge>
                </td>
                <td>
                  <div className="font-bold">Rp {service.price.toLocaleString("id-ID")}</div>
                </td>
                <td>
                  <div className="text-sm text-gray-400">{service.duration}</div>
                </td>
                <td>
                  <Badge variant={service.isActive ? "success" : "neutral"}>
                    {service.isActive ? "Aktif" : "Non-aktif"}
                  </Badge>
                </td>
                <td>
                  <div className="flex gap-2">
                    <Link href={`/admin/services/${service.id}`}>
                      <button className="p-2 hover:bg-white/5 rounded-md text-gray-400 hover:text-white transition-colors">
                        <Edit2 size={16} />
                      </button>
                    </Link>
                    <button className="p-2 hover:bg-error/10 rounded-md text-error transition-colors">
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
