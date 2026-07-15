import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

// GET: Handle Google OAuth callback
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const baseUrl = req.nextUrl.origin;

  if (error) {
    return NextResponse.redirect(
      new URL(`/admin/dashboard?gdrive_error=${encodeURIComponent(error)}`, baseUrl)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/admin/dashboard?gdrive_error=No+authorization+code+received", baseUrl)
    );
  }

  try {
    // Get client credentials from DB
    const [clientIdSetting, clientSecretSetting] = await Promise.all([
      prisma.siteSettings.findUnique({ where: { key: "gdrive_client_id" } }),
      prisma.siteSettings.findUnique({ where: { key: "gdrive_client_secret" } }),
    ]);

    const clientId = clientIdSetting?.value;
    const clientSecret = clientSecretSetting?.value;

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(
        new URL("/admin/dashboard?gdrive_error=Google+Drive+credentials+not+configured", baseUrl)
      );
    }

    // Exchange code for tokens
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
      throw new Error(err.error_description || "Token exchange failed");
    }

    const tokens = await tokenRes.json();

    if (tokens.refresh_token) {
      await prisma.siteSettings.upsert({
        where: { key: "gdrive_refresh_token" },
        update: { value: tokens.refresh_token },
        create: { key: "gdrive_refresh_token", value: tokens.refresh_token },
      });
    }

    await prisma.siteSettings.upsert({
      where: { key: "gdrive_connected" },
      update: { value: "true" },
      create: { key: "gdrive_connected", value: "true" },
    });

    return NextResponse.redirect(
      new URL("/admin/dashboard?gdrive_success=connected", baseUrl)
    );
  } catch (err: any) {
    return NextResponse.redirect(
      new URL(`/admin/dashboard?gdrive_error=${encodeURIComponent(err.message)}`, baseUrl)
    );
  }
}
