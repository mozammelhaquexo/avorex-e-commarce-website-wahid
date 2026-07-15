import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function getPrismaClient() {
  const dbUrl = process.env.DATABASE_URL || "file:./dev.db";

  // Turso (libsql) — Vercel e kaj korbe
  if (dbUrl.startsWith("libsql://") || dbUrl.startsWith("https://")) {
    const { PrismaLibSQL } = require("@prisma/adapter-libsql");
    const { createClient } = require("@libsql/client");
    const authToken = process.env.DATABASE_AUTH_TOKEN || "";
    const libsql = createClient({ url: dbUrl, authToken });
    const adapter = new PrismaLibSQL(libsql);
    return new PrismaClient({ adapter });
  }

  // Local SQLite — development e kaj korbe
  try {
    const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
    const adapter = new PrismaBetterSqlite3(dbUrl);
    return new PrismaClient({ adapter });
  } catch {
    return new PrismaClient();
  }
}

export const prisma = globalForPrisma.prisma || getPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
