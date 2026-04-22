import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BookingDetailClient from "./BookingDetailClient";

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      service: {
        include: {
          addons: true,
        },
      },
    },
  });

  if (!booking) {
    notFound();
  }

  return <BookingDetailClient booking={booking} />;
}
