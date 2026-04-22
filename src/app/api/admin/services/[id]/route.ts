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

    const service = await prisma.service.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        shortDescription: body.shortDescription,
        price: body.price ? parseFloat(body.price) : undefined,
        duration: body.duration,
        image: body.image,
        category: body.category,
        isActive: body.isActive,
        isPopular: body.isPopular,
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json({ error: "Gagal memperbarui layanan" }, { status: 500 });
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
    await prisma.service.delete({ where: { id } });

    return NextResponse.json({ message: "Layanan berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus layanan" }, { status: 500 });
  }
}
