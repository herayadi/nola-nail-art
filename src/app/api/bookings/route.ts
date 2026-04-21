// app/api/bookings/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { id: "asc" },
    });

    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data pemesanan" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerNotes,
      selectedDate,
      timeSlot,
      totalPrice,
      serviceId,
      addonIds,
    } = body;

    // Basic validation
    if (!customerName || !customerPhone || !selectedDate || !timeSlot || !serviceId) {
      return NextResponse.json(
        { error: "Data booking tidak lengkap" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        customerName,
        customerPhone,
        customerNotes,
        selectedDate: new Date(selectedDate),
        timeSlot,
        totalPrice: parseFloat(totalPrice),
        serviceId,
        addonIds: JSON.stringify(addonIds || []),
        status: "PENDING",
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan data booking" },
      { status: 500 }
    );
  }
}
