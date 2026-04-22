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

    const review = await prisma.testimonial.update({
      where: { id },
      data: {
        isApproved: body.isApproved,
        isHighlight: body.isHighlight,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    return NextResponse.json({ error: "Gagal memproses review" }, { status: 500 });
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
    await prisma.testimonial.delete({ where: { id } });

    return NextResponse.json({ message: "Review berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus review" }, { status: 500 });
  }
}
