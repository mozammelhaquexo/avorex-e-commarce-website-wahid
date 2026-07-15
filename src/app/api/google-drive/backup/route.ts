import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/utils/db";
import { readFile, readdir, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const BACKUP_DIR = path.join(process.cwd(), "backups");
const FOLDER_NAME = "Avorex E-Commarce Website";

// Get Google access token using refresh token
async function getAccessToken(clientId: string, clientSecret: string, refreshToken: string): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error_description || "Failed to get access token");
  }

  const data = await res.json();
  return data.access_token;
}

// Find or create the backup folder in Google Drive
async function findOrCreateFolder(accessToken: string, folderName: string): Promise<string> {
  // Search for existing folder
  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=name='${encodeURIComponent(folderName)}' and mimeType='application/vnd.google-apps.folder' and trashed=false&fields=files(id,name)`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (searchRes.ok) {
    const data = await searchRes.json();
    if (data.files && data.files.length > 0) {
      return data.files[0].id;
    }
  }

  // Create folder
  const createRes = await fetch("https://www.googleapis.com/drive/v3/files", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
    }),
  });

  if (!createRes.ok) {
    throw new Error("Failed to create Google Drive folder");
  }

  const folder = await createRes.json();
  return folder.id;
}

// Create backup data
async function createBackupData() {
  const prisma = await getPrisma();
  const [products, orders, customRequests, whatsappSettings, siteSettings] = await Promise.all([
    prisma.product.findMany(),
    prisma.order.findMany(),
    prisma.customRequest.findMany(),
    prisma.whatsAppSettings.findMany(),
    prisma.siteSettings.findMany(),
  ]);

  // Collect uploaded images
  const images: Record<string, string> = {};
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (existsSync(uploadsDir)) {
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
      } catch {}
    }
  }

  return {
    version: "1.0",
    createdAt: new Date().toISOString(),
    products,
    orders,
    customRequests,
    whatsappSettings,
    siteSettings,
    images,
  };
}

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

// POST: Backup to Google Drive
export async function POST(req: NextRequest) {
  try {
    const prisma = await getPrisma();
    const { clientId, clientSecret } = await req.json();

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: "Google Drive Client ID and Secret are required" }, { status: 400 });
    }

    // Get refresh token from DB
    const refreshSetting = await prisma.siteSettings.findUnique({ where: { key: "gdrive_refresh_token" } });
    const refreshToken = refreshSetting?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: "Google Drive not connected. Please authorize first." }, { status: 400 });
    }

    // Get access token
    const accessToken = await getAccessToken(clientId, clientSecret, refreshToken);

    // Find or create folder
    const folderId = await findOrCreateFolder(accessToken, FOLDER_NAME);

    // Create backup data
    const backupData = await createBackupData();
    const fileName = getFormattedFileName();
    const fileContent = JSON.stringify(backupData, null, 2);

    // Upload to Google Drive
    const metadata = {
      name: fileName,
      parents: [folderId],
    };

    const form = new FormData();
    form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
    form.append("file", new Blob([fileContent], { type: "application/json" }));

    const uploadRes = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: form,
      }
    );

    if (!uploadRes.ok) {
      const err = await uploadRes.json();
      throw new Error(err.error?.message || "Failed to upload to Google Drive");
    }

    const uploaded = await uploadRes.json();

    // Also save locally
    if (!existsSync(BACKUP_DIR)) {
      await mkdir(BACKUP_DIR, { recursive: true });
    }
    const localPath = path.join(BACKUP_DIR, fileName);
    const { writeFile } = await import("fs/promises");
    await writeFile(localPath, fileContent);

    // Save folder ID to DB
    await prisma.siteSettings.upsert({
      where: { key: "gdrive_folder_id" },
      update: { value: folderId },
      create: { key: "gdrive_folder_id", value: folderId },
    });

    return NextResponse.json({
      success: true,
      message: `Backup uploaded to Google Drive as "${fileName}"`,
      fileName,
      fileId: uploaded.id,
      stats: {
        products: backupData.products.length,
        orders: backupData.orders.length,
        images: Object.keys(backupData.images).length,
        sizeKB: Math.round(Buffer.byteLength(fileContent) / 1024),
      },
    });
  } catch (error: any) {
    console.error("Google Drive backup failed:", error);
    return NextResponse.json({ error: error.message || "Backup failed" }, { status: 500 });
  }
}

// GET: List backups from Google Drive
export async function GET(req: NextRequest) {
  try {
    const prisma = await getPrisma();
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    if (action !== "list") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const clientId = searchParams.get("clientId") || "";
    const clientSecret = searchParams.get("clientSecret") || "";

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: "Client ID and Secret required" }, { status: 400 });
    }

    const refreshSetting = await prisma.siteSettings.findUnique({ where: { key: "gdrive_refresh_token" } });
    const refreshToken = refreshSetting?.value;
    if (!refreshToken) {
      return NextResponse.json({ error: "Not connected" }, { status: 400 });
    }

    const accessToken = await getAccessToken(clientId, clientSecret, refreshToken);

    const folderSetting = await prisma.siteSettings.findUnique({ where: { key: "gdrive_folder_id" } });
    const folderId = folderSetting?.value;
    if (!folderId) {
      return NextResponse.json({ files: [] });
    }

    const listRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents and trashed=false&fields=files(id,name,size,createdTime)&orderBy=createdTime desc&pageSize=50`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!listRes.ok) {
      throw new Error("Failed to list Google Drive files");
    }

    const data = await listRes.json();
    return NextResponse.json({ files: data.files || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
