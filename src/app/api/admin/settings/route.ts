import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    const settingsMap = settings.reduce(
      (acc: Record<string, string>, curr: any) => {
        acc[curr.key] = curr.value;
        return acc;
      },
      {} as Record<string, string>,
    );

    return NextResponse.json(settingsMap);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal memuat pengaturan" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();

    // Process all keys in the body
    const updates = Object.entries(body).map(([key, value]) => {
      return prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    });

    await Promise.all(updates);

    return NextResponse.json({ message: "Pengaturan berhasil disimpan" });
  } catch (error) {
    console.error("Settings Error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan pengaturan" },
      { status: 500 },
    );
  }
}
