import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import ServiceForm from "../ServiceForm";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const service = await prisma.service.findUnique({
    where: { id },
  });

  if (!service) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Edit Layanan</h1>
        <p className="text-gray-400">Perbarui informasi layanan: {service.name}</p>
      </div>
      <ServiceForm initialData={service} isEditing />
    </div>
  );
}
