import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    const portfolio = await prisma.portfolio.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(portfolio);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data portfolio" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const portfolio = await prisma.portfolio.create({
      data: {
        title: body.title,
        category: body.category,
        imageUrl: body.imageUrl,
        beforeImage: body.beforeImage || null,
        isFeatured: body.isFeatured ?? false,
        sortOrder: parseInt(body.sortOrder) || 0,
      },
    });

    return NextResponse.json(portfolio);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal membuat portfolio" }, { status: 500 });
  }
}
