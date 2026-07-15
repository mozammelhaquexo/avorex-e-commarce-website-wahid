import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

// POST: Restore from a backup (uploaded as JSON)
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("backup") as File | null;
    const mode = formData.get("mode") as string; // "full" or "merge"

    if (!file) {
      return NextResponse.json({ error: "No backup file provided" }, { status: 400 });
    }

    const text = await file.text();
    let backup: any;
    try {
      backup = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: "Invalid JSON file" }, { status: 400 });
    }

    if (!backup.products && !backup.orders) {
      return NextResponse.json({ error: "Invalid backup format" }, { status: 400 });
    }

    const restored: Record<string, number> = {};

    // Full restore: delete everything first
    if (mode === "full") {
      await prisma.order.deleteMany();
      await prisma.customRequest.deleteMany();
      await prisma.product.deleteMany();
      await prisma.whatsAppSettings.deleteMany();
      await prisma.siteSettings.deleteMany();
    }

    // Restore products
    if (Array.isArray(backup.products) && backup.products.length > 0) {
      const productData = backup.products.map((p: any) => ({
        id: p.id,
        nameEn: p.nameEn,
        nameBn: p.nameBn,
        descriptionEn: p.descriptionEn || "",
        descriptionBn: p.descriptionBn || "",
        price: p.price,
        stock: p.stock,
        images: p.images || "",
        categoryEn: p.categoryEn || "",
        categoryBn: p.categoryBn || "",
        sku: p.sku || null,
        unit: p.unit || null,
      }));

      if (mode === "full") {
        await prisma.product.createMany({ data: productData });
      } else {
        for (const p of productData) {
          await prisma.product.upsert({
            where: { id: p.id },
            update: p,
            create: p,
          });
        }
      }
      restored.products = productData.length;
    }

    // Restore orders
    if (Array.isArray(backup.orders) && backup.orders.length > 0) {
      const orderData = backup.orders.map((o: any) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        customerPhone: o.customerPhone,
        customerAddress: o.customerAddress,
        items: o.items || "[]",
        totalAmount: o.totalAmount,
        paymentMethod: o.paymentMethod || "COD",
        status: o.status || "PENDING",
        trackingId: o.trackingId || null,
        trackingCourier: o.trackingCourier || null,
      }));

      if (mode === "full") {
        await prisma.order.createMany({ data: orderData });
      } else {
        for (const o of orderData) {
          await prisma.order.upsert({
            where: { id: o.id },
            update: o,
            create: o,
          });
        }
      }
      restored.orders = orderData.length;
    }

    // Restore custom requests
    if (Array.isArray(backup.customRequests) && backup.customRequests.length > 0) {
      const crData = backup.customRequests.map((cr: any) => ({
        id: cr.id,
        customerName: cr.customerName,
        phone: cr.phone,
        partName: cr.partName,
        partDetails: cr.partDetails || "",
        status: cr.status || "PENDING",
      }));

      if (mode === "full") {
        await prisma.customRequest.createMany({ data: crData });
      } else {
        for (const cr of crData) {
          await prisma.customRequest.upsert({
            where: { id: cr.id },
            update: cr,
            create: cr,
          });
        }
      }
      restored.customRequests = crData.length;
    }

    // Restore WhatsApp settings
    if (Array.isArray(backup.whatsappSettings) && backup.whatsappSettings.length > 0) {
      const wsData = backup.whatsappSettings.map((s: any) => ({
        key: s.key,
        value: s.value,
      }));

      if (mode === "full") {
        await prisma.whatsAppSettings.createMany({ data: wsData });
      } else {
        for (const s of wsData) {
          await prisma.whatsAppSettings.upsert({
            where: { key: s.key },
            update: { value: s.value },
            create: s,
          });
        }
      }
      restored.whatsappSettings = wsData.length;
    }

    // Restore site settings
    if (Array.isArray(backup.siteSettings) && backup.siteSettings.length > 0) {
      const ssData = backup.siteSettings.map((s: any) => ({
        key: s.key,
        value: s.value,
      }));

      if (mode === "full") {
        await prisma.siteSettings.createMany({ data: ssData });
      } else {
        for (const s of ssData) {
          await prisma.siteSettings.upsert({
            where: { key: s.key },
            update: { value: s.value },
            create: s,
          });
        }
      }
      restored.siteSettings = ssData.length;
    }

    // Restore uploaded images
    if (backup.images && typeof backup.images === "object") {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }

      let imageCount = 0;
      for (const [key, dataUrl] of Object.entries(backup.images)) {
        if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:")) continue;
        const matches = dataUrl.match(/^data:[^;]+;base64,(.+)$/);
        if (!matches) continue;
        const fileName = path.basename(key);
        const filePath = path.join(uploadsDir, fileName);
        const buffer = Buffer.from(matches[1], "base64");
        await writeFile(filePath, buffer);
        imageCount++;
      }
      restored.images = imageCount;
    }

    return NextResponse.json({
      success: true,
      message: `Database restored successfully (${mode} mode)`,
      restored,
    });
  } catch (error: any) {
    console.error("Restore failed:", error);
    return NextResponse.json({ error: error.message || "Restore failed" }, { status: 500 });
  }
}
