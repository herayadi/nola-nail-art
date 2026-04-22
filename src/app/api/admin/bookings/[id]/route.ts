import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, paymentStatus, internalNotes } = body;

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
        ...(internalNotes !== undefined && { internalNotes }),
      },
    });

    // Log Activity
    await prisma.activityLog.create({
      data: {
        userId: session.user?.email || "unknown",
        action: "UPDATE",
        entity: "Booking",
        entityId: id,
        details: JSON.stringify(body),
      },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui data booking" },
      { status: 500 }
    );
  }
}
