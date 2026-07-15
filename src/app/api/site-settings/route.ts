import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

const DEFAULT_SETTINGS: Record<string, string> = {
  "business_name": "AL MAKKA ENTERPRISE",
  "address_bn": "আল মক্কা প্লাজা, তাজউদ্দীন আহমদ এভিনিউ, তেজগাঁও, ঢাকা-১২০৮, বাংলাদেশ",
  "address_en": "Al Makka Plaza, Tajuddin Ahmed Avenue, Tejgaon, Dhaka-1208, Bangladesh",
  "phone": "+8801751567281",
  "email": "support@almakkaenterprise.com",
  "hours_sat_thu": "09:00 AM - 08:00 PM",
  "hours_fri": "বন্ধ (সাপ্তাহিক ছুটি)",
  "hours_fri_en": "Closed (Weekly Holiday)",
  "payment_methods": JSON.stringify(["bKash", "Nagad", "Rocket", "COD"]),
  "payment_description_bn": "স্থানীয় মোবাইল ব্যাংকিং অথবা ক্যাশ অন ডেলিভারির মাধ্যমে পেমেন্ট সম্পন্ন করুন।",
  "payment_description_en": "Easy payment processing via local mobile banking or cash on delivery.",
  "copyright_text": "Avorex Technologies",
};

// GET: Fetch all site settings
export async function GET() {
  try {
    let settings = await prisma.siteSettings.findMany();

    if (settings.length === 0) {
      const defaultEntries = Object.entries(DEFAULT_SETTINGS).map(([key, value]) => ({
        key,
        value,
      }));

      await prisma.siteSettings.createMany({
        data: defaultEntries,
      });

      settings = await prisma.siteSettings.findMany();
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("GET Site Settings Error:", error);
    return NextResponse.json({ error: "Failed to fetch site settings" }, { status: 500 });
  }
}

// PUT: Update site settings (bulk)
export async function PUT(req: NextRequest) {
  try {
    const { settings } = await req.json();

    if (!settings || !Array.isArray(settings)) {
      return NextResponse.json({ error: "Invalid settings data" }, { status: 400 });
    }

    for (const setting of settings) {
      if (setting.key && setting.value !== undefined) {
        await prisma.siteSettings.upsert({
          where: { key: setting.key },
          update: { value: setting.value },
          create: { key: setting.key, value: setting.value },
        });
      }
    }

    return NextResponse.json({ success: true, message: "Site settings updated successfully" });
  } catch (error) {
    console.error("PUT Site Settings Error:", error);
    return NextResponse.json({ error: "Failed to update site settings" }, { status: 500 });
  }
}

// DELETE: Reset site settings to defaults
export async function DELETE() {
  try {
    await prisma.siteSettings.deleteMany();

    const defaultEntries = Object.entries(DEFAULT_SETTINGS).map(([key, value]) => ({
      key,
      value,
    }));

    await prisma.siteSettings.createMany({
      data: defaultEntries,
    });

    return NextResponse.json({ success: true, message: "Site settings reset to defaults" });
  } catch (error) {
    console.error("DELETE Site Settings Error:", error);
    return NextResponse.json({ error: "Failed to reset site settings" }, { status: 500 });
  }
}
