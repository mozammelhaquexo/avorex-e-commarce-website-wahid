import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const getFilePath = () => path.join(process.cwd(), "src/data/units.json");

const readUnits = () => {
  const filePath = getFilePath();
  if (!fs.existsSync(filePath)) {
    const defaults = [
      { id: "pcs", en: "pcs", bn: "পিস" },
      { id: "kg", en: "kg", bn: "কেজি" },
      { id: "set", en: "set", bn: "সেট" },
      { id: "box", en: "box", bn: "বক্স" },
      { id: "meter", en: "meter", bn: "মিটার" },
      { id: "liter", en: "liter", bn: "লিটার" }
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
    const list = readUnits();
    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "Unit name is required" }, { status: 400 });
    }
    const list = readUnits();
    const id = name.toLowerCase().replace(/\s+/g, "-");
    const exists = list.some(
      (u: any) => u.id === id || u.bn.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      return NextResponse.json({ error: "Unit already exists" }, { status: 400 });
    }
    list.push({ id, en: name, bn: name });
    fs.writeFileSync(getFilePath(), JSON.stringify(list, null, 2), "utf-8");
    return NextResponse.json({ success: true, units: list });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Unit identifier is required" }, { status: 400 });
    }
    const list = readUnits();
    const filtered = list.filter((u: any) => u.id !== id);
    fs.writeFileSync(getFilePath(), JSON.stringify(filtered, null, 2), "utf-8");
    return NextResponse.json({ success: true, units: filtered });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
