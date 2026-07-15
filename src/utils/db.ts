import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

let _prisma: PrismaClient | null = null;

async function createPrismaClient(): Promise<PrismaClient> {
  const dbUrl = process.env.DATABASE_URL || "file:./dev.db";

  if (dbUrl.startsWith("libsql://") || dbUrl.startsWith("https://")) {
    const { PrismaLibSql } = await import("@prisma/adapter-libsql");
    const authToken = process.env.DATABASE_AUTH_TOKEN || "";
    const adapter = new PrismaLibSql({ url: dbUrl, authToken });
    return new PrismaClient({ adapter });
  }

  try {
    const { PrismaBetterSqlite3 } = await import("@prisma/adapter-better-sqlite3");
    const adapter = new PrismaBetterSqlite3(dbUrl);
    return new PrismaClient({ adapter });
  } catch {
    return new PrismaClient();
  }
}

export async function getPrisma(): Promise<PrismaClient> {
  if (_prisma) return _prisma;
  if (globalForPrisma.prisma) {
    _prisma = globalForPrisma.prisma;
    return _prisma;
  }
  _prisma = await createPrismaClient();
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = _prisma;
  }
  return _prisma;
}
