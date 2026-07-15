import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/utils/db";

const DEFAULT_UNITS = [
  { id: "pcs", en: "pcs", bn: "পিস" },
  { id: "kg", en: "kg", bn: "কেজি" },
  { id: "set", en: "set", bn: "সেট" },
  { id: "box", en: "box", bn: "বক্স" },
  { id: "meter", en: "meter", bn: "মিটার" },
  { id: "liter", en: "liter", bn: "লিটার" },
];

async function getUnits(prisma: any) {
  const setting = await prisma.siteSettings.findUnique({ where: { key: "units" } });
  if (!setting) {
    await prisma.siteSettings.create({
      data: { key: "units", value: JSON.stringify(DEFAULT_UNITS) },
    });
    return DEFAULT_UNITS;
  }
  return JSON.parse(setting.value);
}

async function saveUnits(prisma: any, units: any[]) {
  await prisma.siteSettings.upsert({
    where: { key: "units" },
    update: { value: JSON.stringify(units) },
    create: { key: "units", value: JSON.stringify(units) },
  });
}

export async function GET() {
  try {
    const prisma = await getPrisma();
    const list = await getUnits(prisma);
    return NextResponse.json(list);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const prisma = await getPrisma();
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Unit name is required" }, { status: 400 });
    }

    const list = await getUnits(prisma);
    const id = name.toLowerCase().replace(/\s+/g, "-");

    const exists = list.some(
      (u: any) => u.id === id || u.bn.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      return NextResponse.json({ error: "Unit already exists" }, { status: 400 });
    }

    list.push({ id, en: name, bn: name });
    await saveUnits(prisma, list);
    return NextResponse.json({ success: true, units: list });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const prisma = await getPrisma();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Unit identifier is required" }, { status: 400 });
    }

    const list = await getUnits(prisma);
    const filtered = list.filter((u: any) => u.id !== id);
    await saveUnits(prisma, filtered);
    return NextResponse.json({ success: true, units: filtered });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
