import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

// Ensure the path is absolute for the adapter
const dbPath = connectionString.replace("file:", "");
const absoluteDbPath = path.isAbsolute(dbPath)
  ? dbPath
  : path.join(/* turbopackIgnore: true */ process.cwd(), dbPath);

// The adapter expects an object with a 'url' property, not a database instance
const adapter = new PrismaBetterSqlite3({
  url: `file:${absoluteDbPath}`,
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ["query"], // optional: untuk debugging
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
