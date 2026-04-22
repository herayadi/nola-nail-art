// app/api/bookings/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get("date");

    const where: any = {};
    if (dateStr) {
      where.selectedDate = new Date(dateStr);
    }

    const bookings = await prisma.booking.findMany({
      where,
      select: {
        timeSlot: true,
      },
      orderBy: { timeSlot: "asc" },
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

    // Phone number validation (must start with 08 and max 13 chars)
    if (!customerPhone.startsWith("08")) {
      return NextResponse.json(
        { error: "Nomor WhatsApp harus diawali dengan 08" },
        { status: 400 }
      );
    }
    
    if (customerPhone.length > 13) {
      return NextResponse.json(
        { error: "Nomor WhatsApp maksimal 13 karakter" },
        { status: 400 }
      );
    }

    // Check for double booking
    const bookingDate = new Date(selectedDate);
    const existingBooking = await prisma.booking.findFirst({
      where: {
        selectedDate: bookingDate,
        timeSlot: timeSlot,
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "Maaf, slot waktu ini sudah dipesan oleh orang lain. Silakan pilih waktu yang lain." },
        { status: 409 }
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
