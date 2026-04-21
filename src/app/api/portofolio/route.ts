// app/api/portofolio/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const portofolios = await prisma.portfolio.findMany({
      orderBy: { id: "asc" },
    });

    return NextResponse.json(portofolios, { status: 200 });
  } catch (error) {
    console.error("Error fetching portofolios:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data portofolio" },
      { status: 500 },
    );
  }
}
