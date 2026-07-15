import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

// POST: Exchange auth code for refresh token
export async function POST(req: NextRequest) {
  try {
    const { code, clientId, clientSecret } = await req.json();

    if (!code || !clientId || !clientSecret) {
      return NextResponse.json({ error: "Code, Client ID, and Client Secret are required" }, { status: 400 });
    }

    const baseUrl = req.nextUrl.origin;

    // Exchange authorization code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${baseUrl}/api/google-drive/callback`,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.json();
      throw new Error(err.error_description || "Failed to exchange code for tokens");
    }

    const tokens = await tokenRes.json();

    if (!tokens.refresh_token) {
      return NextResponse.json({
        error: "No refresh token received. Please try the authorization flow again.",
      }, { status: 400 });
    }

    // Save refresh token to DB
    await prisma.siteSettings.upsert({
      where: { key: "gdrive_refresh_token" },
      update: { value: tokens.refresh_token },
      create: { key: "gdrive_refresh_token", value: tokens.refresh_token },
    });

    await prisma.siteSettings.upsert({
      where: { key: "gdrive_connected" },
      update: { value: "true" },
      create: { key: "gdrive_connected", value: "true" },
    });

    return NextResponse.json({
      success: true,
      message: "Google Drive connected successfully!",
      refreshToken: tokens.refresh_token,
    });
  } catch (error: any) {
    console.error("Google Drive auth failed:", error);
    return NextResponse.json({ error: error.message || "Authorization failed" }, { status: 500 });
  }
}

// GET: Generate auth URL
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("clientId");

  if (!clientId) {
    return NextResponse.json({ error: "Client ID required" }, { status: 400 });
  }

  const baseUrl = req.nextUrl.origin;
  const redirectUri = `${baseUrl}/api/google-drive/callback`;
  const scopes = ["https://www.googleapis.com/auth/drive.file"];
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scopes.join(" "))}&access_type=offline&prompt=consent`;

  return NextResponse.json({ url: authUrl, redirectUri });
}
