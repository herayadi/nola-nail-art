import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();

    const portfolio = await prisma.portfolio.update({
      where: { id },
      data: {
        title: body.title,
        category: body.category,
        imageUrl: body.imageUrl,
        beforeImage: body.beforeImage,
        isFeatured: body.isFeatured,
        sortOrder: body.sortOrder !== undefined ? parseInt(body.sortOrder) : undefined,
      },
    });

    return NextResponse.json(portfolio);
  } catch (error) {
    return NextResponse.json({ error: "Gagal memperbarui portfolio" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await prisma.portfolio.delete({ where: { id } });

    return NextResponse.json({ message: "Portfolio berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus portfolio" }, { status: 500 });
  }
}
