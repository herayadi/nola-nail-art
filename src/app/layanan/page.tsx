import Services from "@/components/home/Services";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Layanan & Harga | Nola Nail Art",
  description:
    "Daftar lengkap layanan perawatan kuku dan kecantikan di Nola Nail Art.",
};

export default async function LayananPage() {
  const services = await prisma.service.findMany({
    orderBy: { id: "asc" },
  });
  return (
    <>
      <div
        style={{
          paddingTop: "var(--space-4xl)",
          backgroundColor: "var(--color-light)",
        }}
      >
        <div
          className="container"
          style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}
        >
          <h1 style={{ fontSize: "3rem", margin: "var(--space-md) 0" }}>
            Layanan Kuku Premium
          </h1>
          <p style={{ color: "var(--color-gray-500)", fontSize: "1.125rem" }}>
            Mulai dari basic care hingga custom nail art terumit, kami siap
            melayani.
          </p>
        </div>
      </div>
      {/* Reusing Home Services component to render the grid */}
      <Services services={services} />
    </>
  );
}
