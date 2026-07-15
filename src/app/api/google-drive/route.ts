import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

// GET: Fetch Google Drive settings
export async function GET() {
  try {
    const settings = await prisma.siteSettings.findMany({
      where: {
        key: {
          in: ["gdrive_client_id", "gdrive_client_secret", "gdrive_refresh_token", "gdrive_folder_id", "gdrive_connected"],
        },
      },
    });

    const mapped: Record<string, string> = {};
    settings.forEach((s) => {
      mapped[s.key] = s.value;
    });

    return NextResponse.json({
      clientId: mapped["gdrive_client_id"] || "",
      clientSecret: mapped["gdrive_client_secret"] || "",
      refreshToken: mapped["gdrive_refresh_token"] || "",
      folderId: mapped["gdrive_folder_id"] || "",
      connected: mapped["gdrive_connected"] === "true",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Save Google Drive settings
export async function PUT(req: NextRequest) {
  try {
    const { clientId, clientSecret, refreshToken, folderId, connected } = await req.json();

    const upserts = [
      { key: "gdrive_client_id", value: clientId || "" },
      { key: "gdrive_client_secret", value: clientSecret || "" },
      { key: "gdrive_refresh_token", value: refreshToken || "" },
      { key: "gdrive_folder_id", value: folderId || "" },
      { key: "gdrive_connected", value: connected ? "true" : "false" },
    ];

    for (const s of upserts) {
      await prisma.siteSettings.upsert({
        where: { key: s.key },
        update: { value: s.value },
        create: s,
      });
    }

    return NextResponse.json({ success: true, message: "Google Drive settings saved" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
