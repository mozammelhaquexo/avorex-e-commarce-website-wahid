import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

async function createPrismaClient(): Promise<PrismaClient> {
  const dbUrl = process.env.DATABASE_URL || "file:./dev.db";

  if (dbUrl.startsWith("libsql://") || dbUrl.startsWith("https://")) {
    const { PrismaLibSql } = await import("@prisma/adapter-libsql");
    const authToken = process.env.DATABASE_AUTH_TOKEN || "";
    const adapter = new PrismaLibSql({ url: dbUrl, authToken });
    return new PrismaClient({ adapter, log: [] });
  }

  try {
    const { PrismaBetterSqlite3 } = await import("@prisma/adapter-better-sqlite3");
    const adapter = new PrismaBetterSqlite3(dbUrl);
    return new PrismaClient({ adapter, log: [] });
  } catch {
    return new PrismaClient({ log: [] });
  }
}

export async function getPrisma(): Promise<PrismaClient> {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  globalForPrisma.prisma = await createPrismaClient();
  return globalForPrisma.prisma;
}
