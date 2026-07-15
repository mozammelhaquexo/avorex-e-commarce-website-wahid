import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getPrisma } from "@/utils/db";
import { signToken } from "@/utils/auth";

async function ensureSeeded(prisma: Awaited<ReturnType<typeof getPrisma>>) {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "email" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "role" TEXT NOT NULL DEFAULT 'ADMIN',
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Product" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "nameEn" TEXT NOT NULL,
        "nameBn" TEXT NOT NULL,
        "descriptionEn" TEXT NOT NULL DEFAULT '',
        "descriptionBn" TEXT NOT NULL DEFAULT '',
        "price" REAL NOT NULL,
        "stock" INTEGER NOT NULL DEFAULT 0,
        "images" TEXT NOT NULL DEFAULT '[]',
        "categoryEn" TEXT NOT NULL,
        "categoryBn" TEXT NOT NULL,
        "sku" TEXT,
        "unit" TEXT,
        "tags" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Order" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "orderNumber" TEXT NOT NULL UNIQUE,
        "customerName" TEXT NOT NULL,
        "customerPhone" TEXT NOT NULL,
        "customerAddress" TEXT NOT NULL,
        "items" TEXT NOT NULL,
        "totalAmount" REAL NOT NULL,
        "paymentMethod" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'PENDING',
        "trackingId" TEXT,
        "trackingCourier" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "CustomRequest" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "customerName" TEXT NOT NULL,
        "phone" TEXT NOT NULL,
        "partName" TEXT NOT NULL,
        "partDetails" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'PENDING',
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "WhatsAppSettings" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "key" TEXT NOT NULL UNIQUE,
        "value" TEXT NOT NULL,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "SiteSettings" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "key" TEXT NOT NULL UNIQUE,
        "value" TEXT NOT NULL,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Product_categoryEn_idx" ON "Product"("categoryEn")`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Product_nameEn_idx" ON "Product"("nameEn")`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Product_sku_idx" ON "Product"("sku")`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Order_status_idx" ON "Order"("status")`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Order_customerPhone_idx" ON "Order"("customerPhone")`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Order_createdAt_idx" ON "Order"("createdAt")`);

    const existingUser = await prisma.$queryRawUnsafe<{ count: number }[]>(
      `SELECT COUNT(*) as count FROM "User" WHERE email = 'admin@avorex.com'`
    );
    if (existingUser[0]?.count === 0) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await prisma.$executeRawUnsafe(
        `INSERT INTO "User" ("id", "email", "password", "name", "role", "createdAt", "updatedAt") VALUES (?, ?, ?, ?, ?, ?, ?)`,
        crypto.randomUUID(),
        "admin@avorex.com",
        hashedPassword,
        "Avorex Admin",
        "ADMIN",
        new Date().toISOString(),
        new Date().toISOString()
      );
    }
  } catch (e) {
    console.error("Auto-seed failed:", e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const prisma = await getPrisma();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    await ensureSeeded(prisma);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }

    // Create token
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Set HTTP-only Cookie
    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
    });

    response.cookies.set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Login API Error:", message);
    return NextResponse.json(
      { error: "Internal Server Error", detail: process.env.NODE_ENV !== "production" ? message : undefined },
      { status: 500 }
    );
  }
}
