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
    const { question, answer, serviceId, sortOrder } = await request.json();

    const updated = await prisma.faq.update({
      where: { id },
      data: {
        question,
        answer,
        sortOrder: Number(sortOrder) || 0,
        serviceId: serviceId || null,
      },
      include: { service: { select: { id: true, name: true } } },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Gagal memperbarui FAQ" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await prisma.faq.delete({ where: { id } });

    return NextResponse.json({ message: "FAQ dihapus" });
  } catch {
    return NextResponse.json({ error: "Gagal menghapus FAQ" }, { status: 500 });
  }
}
