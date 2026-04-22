import "dotenv/config";
import { prisma } from "../src/lib/prisma"; // ← Gunakan central prisma seperti di seed.ts
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Memulai seeding akun admin...");

  const hashedPassword = await bcrypt.hash("nola2026", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@nola.com" },
    update: {},
    create: {
      email: "admin@nola.com",
      password: hashedPassword,
      name: "Nola Admin",
      role: "ADMIN",
    },
  });

  console.log("✅ Akun Admin berhasil dibuat:", admin.email);
}

main()
  .catch((e) => {
    console.error("❌ Gagal seeding admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });