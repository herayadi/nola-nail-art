import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    const faqs = await prisma.faq.findMany({
      include: { service: { select: { id: true, name: true } } },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    });
    return NextResponse.json(faqs);
  } catch {
    return NextResponse.json({ error: "Gagal memuat FAQ" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { question, answer, serviceId, sortOrder } = await request.json();

    if (!question || !answer) {
      return NextResponse.json({ error: "Pertanyaan dan jawaban wajib diisi" }, { status: 400 });
    }

    const faq = await prisma.faq.create({
      data: {
        question,
        answer,
        sortOrder: Number(sortOrder) || 0,
        serviceId: serviceId || null,
      },
      include: { service: { select: { id: true, name: true } } },
    });

    return NextResponse.json(faq, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Gagal membuat FAQ" }, { status: 500 });
  }
}
