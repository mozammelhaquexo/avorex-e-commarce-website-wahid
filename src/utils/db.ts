import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL || "file:./dev.db";

  if (dbUrl.startsWith("libsql://") || dbUrl.startsWith("https://")) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const adapterLibsql = require("@prisma/adapter-libsql");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const libsqlClient = require("@libsql/client");
    const authToken = process.env.DATABASE_AUTH_TOKEN || "";
    const libsql = libsqlClient.createClient({ url: dbUrl, authToken });
    const adapter = new adapterLibsql.PrismaLibSql(libsql);
    return new PrismaClient({ adapter });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const adapterSqlite = require("@prisma/adapter-better-sqlite3");
    const adapter = new adapterSqlite.PrismaBetterSqlite3(dbUrl);
    return new PrismaClient({ adapter });
  } catch {
    return new PrismaClient();
  }
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
