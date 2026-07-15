import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/utils/db";
import { readdir, readFile, writeFile, mkdir, unlink, stat } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const BACKUP_DIR = path.join(process.cwd(), "backups");

// Generate formatted filename: "Backup_16-07-2026_Time_1-00-AM.json"
function getFormattedFileName(): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  let hours = now.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `Backup_${day}-${month}-${year}_Time_${hours}-${minutes}-${ampm}.json`;
}

async function ensureBackupDir() {
  if (!existsSync(BACKUP_DIR)) {
    await mkdir(BACKUP_DIR, { recursive: true });
  }
}

// Collect image files as base64 if they are local uploads
async function collectImages(): Promise<Record<string, string>> {
  const images: Record<string, string> = {};
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!existsSync(uploadsDir)) return images;

  const files = await readdir(uploadsDir);
  for (const file of files) {
    const filePath = path.join(uploadsDir, file);
    try {
      const data = await readFile(filePath);
      const ext = path.extname(file).toLowerCase();
      const mime =
        ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" :
        ext === ".png" ? "image/png" :
        ext === ".gif" ? "image/gif" :
        ext === ".webp" ? "image/webp" :
        ext === ".svg" ? "image/svg+xml" : "application/octet-stream";
      images[`/uploads/${file}`] = `data:${mime};base64,${data.toString("base64")}`;
    } catch {
      // skip unreadable files
    }
  }
  return images;
}

// GET: List backups or download a specific backup
export async function GET(req: NextRequest) {
  await ensureBackupDir();

  const { searchParams } = new URL(req.url);
  const fileName = searchParams.get("file");

  // Download specific backup
  if (fileName) {
    const safeName = path.basename(fileName);
    const filePath = path.join(BACKUP_DIR, safeName);
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: "Backup not found" }, { status: 404 });
    }
    const data = await readFile(filePath);
    return new NextResponse(data, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${safeName}"`,
      },
    });
  }

  // List all backups
  const files = await readdir(BACKUP_DIR);
  const backups = [];
  for (const f of files) {
    if (!f.endsWith(".json")) continue;
    const filePath = path.join(BACKUP_DIR, f);
    try {
      const info = await stat(filePath);
      const data = JSON.parse(await readFile(filePath, "utf-8"));
      backups.push({
        fileName: f,
        createdAt: data.createdAt || info.birthtime.toISOString(),
        products: data.products?.length || 0,
        orders: data.orders?.length || 0,
        customRequests: data.customRequests?.length || 0,
        categories: data.categories?.length || 0,
        sizeKB: Math.round(info.size / 1024),
      });
    } catch {
      // skip invalid files
    }
  }

  backups.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json(backups);
}

// POST: Create a new backup
export async function POST(req: NextRequest) {
  await ensureBackupDir();

  try {
    const prisma = await getPrisma();
    const [products, orders, customRequests, whatsappSettings, siteSettings] =
      await Promise.all([
        prisma.product.findMany(),
        prisma.order.findMany(),
        prisma.customRequest.findMany(),
        prisma.whatsAppSettings.findMany(),
        prisma.siteSettings.findMany(),
      ]);

    // Collect uploaded images
    const images = await collectImages();

    const backup = {
      version: "1.0",
      createdAt: new Date().toISOString(),
      products,
      orders,
      customRequests,
      whatsappSettings,
      siteSettings,
      images,
    };

    const fileName = getFormattedFileName();
    const filePath = path.join(BACKUP_DIR, fileName);
    await writeFile(filePath, JSON.stringify(backup, null, 2));

    return NextResponse.json({
      success: true,
      fileName,
      message: `Backup created: ${fileName}`,
      stats: {
        products: products.length,
        orders: orders.length,
        customRequests: customRequests.length,
        images: Object.keys(images).length,
        sizeKB: Math.round(Buffer.byteLength(JSON.stringify(backup)) / 1024),
      },
    });
  } catch (error: any) {
    console.error("Backup creation failed:", error);
    return NextResponse.json({ error: error.message || "Backup failed" }, { status: 500 });
  }
}

// DELETE: Delete a backup file
export async function DELETE(req: NextRequest) {
  await ensureBackupDir();

  const { searchParams } = new URL(req.url);
  const fileName = searchParams.get("file");
  if (!fileName) {
    return NextResponse.json({ error: "File name required" }, { status: 400 });
  }

  const safeName = path.basename(fileName);
  const filePath = path.join(BACKUP_DIR, safeName);
  if (!existsSync(filePath)) {
    return NextResponse.json({ error: "Backup not found" }, { status: 404 });
  }

  await unlink(filePath);
  return NextResponse.json({ success: true, message: `Deleted ${safeName}` });
}
