import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import PortfolioForm from "../PortfolioForm";

export default async function EditPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const portfolio = await prisma.portfolio.findUnique({
    where: { id },
  });

  if (!portfolio) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Edit Portfolio</h1>
        <p className="text-gray-400">Perbarui detail hasil karya: {portfolio.title}</p>
      </div>
      <PortfolioForm initialData={portfolio} isEditing />
    </div>
  );
}
