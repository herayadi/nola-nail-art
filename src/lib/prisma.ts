import dotenv from "dotenv";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

// Ensure .env is loaded from the root even when running from subdirectories
dotenv.config({ path: path.join(process.cwd(), ".env") });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

console.log("PRISMA_INIT: url =", url);
console.log("PRISMA_INIT: authToken =", authToken ? "exists" : "missing");

if (!url) {
  throw new Error("TURSO_DATABASE_URL is not defined in environment variables");
}

// Initialize Turso LibSQL client
const libsql = createClient({
  url,
  authToken,
});

// Pass the LibSQL adapter to Prisma
const adapter = new PrismaLibSQL(libsql);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ["query"], // optional: untuk debugging
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
