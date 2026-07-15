import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/utils/db";

export async function POST() {
  try {
    // Check if admin already exists
    const existing = await prisma.user.findUnique({
      where: { email: "admin@avorex.com" },
    });

    if (existing) {
      return NextResponse.json({ message: "Admin user already exists" });
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await prisma.user.create({
      data: {
        email: "admin@avorex.com",
        password: hashedPassword,
        name: "Avorex Admin",
        role: "ADMIN",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Admin user created",
      credentials: { email: admin.email, password: "admin123" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Seed failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
