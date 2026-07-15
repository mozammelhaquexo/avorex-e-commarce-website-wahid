import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const ext = path.extname(file.name).toLowerCase() || ".jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filepath = path.join(uploadDir, filename);

    // Compress and resize images with sharp
    const imageExts = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    if (imageExts.includes(ext)) {
      try {
        const sharp = (await import("sharp")).default;
        await sharp(buffer)
          .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
          .jpeg({ quality: 80, progressive: true })
          .toFile(filepath.replace(ext, ".jpg"));

        const compressedFilename = filename.replace(ext, ".jpg");
        const fileUrl = `/uploads/${compressedFilename}`;
        return NextResponse.json({ url: fileUrl });
      } catch {
        // Fallback: save original if sharp fails
        await writeFile(filepath, buffer);
      }
    }

    await writeFile(filepath, buffer);
    const fileUrl = `/uploads/${filename}`;
    return NextResponse.json({ url: fileUrl });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
