import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

// GET all services for admin (including inactive ones)
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

// POST new service
export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const service = await prisma.service.create({
      data: {
        name: body.name,
        description: body.description,
        shortDescription: body.shortDescription,
        price: parseFloat(body.price),
        duration: body.duration,
        image: body.image || "/images/placeholder.jpg",
        category: body.category,
        isActive: body.isActive ?? true,
        isPopular: body.isPopular ?? false,
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal membuat layanan" }, { status: 500 });
  }
}
