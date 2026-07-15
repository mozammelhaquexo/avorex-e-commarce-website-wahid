import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/utils/db";

export async function POST() {
  try {
    // Create tables first using raw SQL
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

    // Create indexes
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Product_categoryEn_idx" ON "Product"("categoryEn")`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Product_nameEn_idx" ON "Product"("nameEn")`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Product_sku_idx" ON "Product"("sku")`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Order_status_idx" ON "Order"("status")`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Order_customerPhone_idx" ON "Order"("customerPhone")`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Order_createdAt_idx" ON "Order"("createdAt")`);

    // Check if admin exists
    const existing = await prisma.user.findUnique({
      where: { email: "admin@avorex.com" },
    });

    if (existing) {
      return NextResponse.json({ message: "Already seeded! Admin user exists." });
    }

    // Create admin
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await prisma.user.create({
      data: {
        email: "admin@avorex.com",
        password: hashedPassword,
        name: "Avorex Admin",
        role: "ADMIN",
      },
    });

    // Create demo products
    const DEMO = [
      { nameEn: "Premium CNG Carburetor (F10A)", nameBn: "প্রিমিয়াম সিএনজি কার্বুরেটর", descriptionEn: "High durability carburetor", descriptionBn: "স্থায়ী কার্বুরেটর", price: 4500, stock: 12, images: "[]", categoryEn: "Carburetors", categoryBn: "কার্বুরেটর", sku: "CNG-CARB-F10A", unit: "pcs" },
      { nameEn: "Iridium Spark Plug (4 Pack)", nameBn: "ইরিডিয়াম স্পার্ক প্লাগ", descriptionEn: "Laser welded iridium tip", descriptionBn: "লেজার ইরিডিয়াম টিপ", price: 850, stock: 25, images: "[]", categoryEn: "Spark Plugs", categoryBn: "স্পার্ক প্লাগ", sku: "CNG-SPK-IRD4", unit: "set" },
      { nameEn: "Engine Piston Kit", nameBn: "ইঞ্জিন পিস্টন কিট", descriptionEn: "Chrome-finished pistons", descriptionBn: "ক্রোম পিস্টন", price: 3200, stock: 8, images: "[]", categoryEn: "Pistons", categoryBn: "পিস্টন", sku: "CNG-PSN-HCK", unit: "set" },
      { nameEn: "CNG Solenoid Valve", nameBn: "সিএনজি সোলেনয়েড ভালভ", descriptionEn: "Electromagnetic shutoff", descriptionBn: "ইলেকট্রো-ম্যাগনেটিক ভালভ", price: 2800, stock: 15, images: "[]", categoryEn: "Gas Valves", categoryBn: "গ্যাস ভালভ", sku: "CNG-VLV-SOL", unit: "pcs" },
      { nameEn: "Gas Filter", nameBn: "গ্যাস ফিল্টার", descriptionEn: "Paper-mesh filter", descriptionBn: "পেপার-মেশ ফিল্টার", price: 1200, stock: 30, images: "[]", categoryEn: "Filters", categoryBn: "ফিল্টার", sku: "CNG-FLT-DSG", unit: "pcs" },
      { nameEn: "Mixer Tube Venturi", nameBn: "মিক্সার টিউব", descriptionEn: "High efficiency mixer", descriptionBn: "উচ্চ ক্ষমতার মিক্সার", price: 1500, stock: 18, images: "[]", categoryEn: "Accessories", categoryBn: "অন্যান্য", sku: "CNG-MIX-V32", unit: "pcs" },
    ];

    for (const p of DEMO) {
      await prisma.product.create({ data: p });
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded!",
      admin: { email: "admin@avorex.com", password: "admin123" },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
