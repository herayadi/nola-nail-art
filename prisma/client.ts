// prisma/client.ts
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error("❌ DATABASE_URL is not defined in .env");
}

console.log("ENV:", databaseUrl);

const adapter = new PrismaBetterSqlite3({
    url: databaseUrl,
});

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    adapter,
    // log: ['query', 'info', 'warn', 'error'], // aktifkan jika butuh debug
});

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}