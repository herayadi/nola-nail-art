import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
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

    const updateData: Record<string, string> = {};
    if (body.role) updateData.role = body.role;
    if (body.name !== undefined) updateData.name = body.name;
    if (body.password) {
      updateData.password = await bcrypt.hash(body.password, 12);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Gagal memperbarui user" }, { status: 500 });
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
    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ message: "User dihapus" });
  } catch {
    return NextResponse.json({ error: "Gagal menghapus user" }, { status: 500 });
  }
}
