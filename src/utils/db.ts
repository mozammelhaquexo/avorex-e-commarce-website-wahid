import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const dbUrl = process.env.DATABASE_URL || "file:./dev.db";

let prisma: PrismaClient;

if (dbUrl.startsWith("libsql://") || dbUrl.startsWith("https://")) {
  const { PrismaLibSql } = require("@prisma/adapter-libsql");
  const { createClient } = require("@libsql/client");
  const authToken = process.env.DATABASE_AUTH_TOKEN || "";
  const libsql = createClient({ url: dbUrl, authToken });
  const adapter = new PrismaLibSql(libsql);
  prisma = new PrismaClient({ adapter });
} else {
  try {
    const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
    const adapter = new PrismaBetterSqlite3(dbUrl);
    prisma = new PrismaClient({ adapter });
  } catch {
    prisma = new PrismaClient();
  }
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export const db = globalForPrisma.prisma || prisma;
export default db;
