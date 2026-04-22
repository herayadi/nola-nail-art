import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Gagal memuat profil" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, password, role } = await request.json();
    const updateData: any = {};
    
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    const updated = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData,
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Gagal memperbarui profil" }, { status: 500 });
  }
}
