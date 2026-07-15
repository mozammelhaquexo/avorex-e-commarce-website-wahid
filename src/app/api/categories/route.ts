import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/utils/db";

const DEFAULT_CATEGORIES = [
  { en: "Carburetors", bn: "কার্বুরেটর" },
  { en: "Spark Plugs", bn: "স্পার্ক প্লাগ" },
  { en: "Pistons", bn: "পিস্টন" },
  { en: "Gas Valves", bn: "ভালভ ও লাইন" },
  { en: "Filters", bn: "ফিল্টার" },
  { en: "Accessories", bn: "অন্যান্য" },
];

async function getCategories(prisma: any) {
  const setting = await prisma.siteSettings.findUnique({ where: { key: "categories" } });
  if (!setting) {
    await prisma.siteSettings.create({
      data: { key: "categories", value: JSON.stringify(DEFAULT_CATEGORIES) },
    });
    return DEFAULT_CATEGORIES;
  }
  return JSON.parse(setting.value);
}

async function saveCategories(prisma: any, categories: any[]) {
  await prisma.siteSettings.upsert({
    where: { key: "categories" },
    update: { value: JSON.stringify(categories) },
    create: { key: "categories", value: JSON.stringify(categories) },
  });
}

export async function GET() {
  try {
    const prisma = await getPrisma();
    const list = await getCategories(prisma);
    return NextResponse.json(list);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const prisma = await getPrisma();
    const { nameBn, nameEn } = await req.json();

    if (!nameBn) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const list = await getCategories(prisma);
    const en = nameEn || nameBn;
    const bn = nameBn;

    const exists = list.some(
      (c: any) => c.bn.toLowerCase() === bn.toLowerCase() || c.en.toLowerCase() === en.toLowerCase()
    );
    if (exists) {
      return NextResponse.json({ error: "Category already exists" }, { status: 400 });
    }

    list.push({ en, bn });
    await saveCategories(prisma, list);
    return NextResponse.json({ success: true, categories: list });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const prisma = await getPrisma();
    const { searchParams } = new URL(req.url);
    const en = searchParams.get("en");

    if (!en) {
      return NextResponse.json({ error: "Category name identifier is required" }, { status: 400 });
    }

    const list = await getCategories(prisma);
    const filtered = list.filter((c: any) => c.en !== en);
    await saveCategories(prisma, filtered);
    return NextResponse.json({ success: true, categories: filtered });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
