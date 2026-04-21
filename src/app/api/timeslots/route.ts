import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const timeSlots = await prisma.timeSlot.findMany({
      where: { isActive: true },
      orderBy: { time: "asc" },
    });

    return NextResponse.json(timeSlots);
  } catch (error) {
    console.error("Error fetching time slots:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data slot waktu", details: (error as Error).message },
      { status: 500 }
    );
  }
}
