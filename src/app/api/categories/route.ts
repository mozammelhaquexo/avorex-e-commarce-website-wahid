import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const getFilePath = () => path.join(process.cwd(), "src/data/categories.json");

const readCategories = () => {
  const filePath = getFilePath();
  if (!fs.existsSync(filePath)) {
    const defaults = [
      { en: "Carburetors", bn: "কার্বুরেটর" },
      { en: "Spark Plugs", bn: "স্পার্ক প্লাগ" },
      { en: "Pistons", bn: "পিস্টন" },
      { en: "Gas Valves", bn: "ভালভ ও লাইন" },
      { en: "Filters", bn: "ফিল্টার" },
      { en: "Accessories", bn: "অন্যান্য" }
    ];
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(defaults, null, 2), "utf-8");
    return defaults;
  }
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content);
};

export async function GET() {
  try {
    const list = readCategories();
    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { nameBn, nameEn } = await req.json();
    if (!nameBn) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }
    const list = readCategories();
    const en = nameEn || nameBn;
    const bn = nameBn;

    const exists = list.some(
      (c: any) => c.bn.toLowerCase() === bn.toLowerCase() || c.en.toLowerCase() === en.toLowerCase()
    );
    if (exists) {
      return NextResponse.json({ error: "Category already exists" }, { status: 400 });
    }

    list.push({ en, bn });
    fs.writeFileSync(getFilePath(), JSON.stringify(list, null, 2), "utf-8");
    return NextResponse.json({ success: true, categories: list });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const en = searchParams.get("en");
    if (!en) {
      return NextResponse.json({ error: "Category name identifier is required" }, { status: 400 });
    }
    const list = readCategories();
    const filtered = list.filter((c: any) => c.en !== en);
    fs.writeFileSync(getFilePath(), JSON.stringify(filtered, null, 2), "utf-8");
    return NextResponse.json({ success: true, categories: filtered });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
