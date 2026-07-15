import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getPrisma } from "@/utils/db";
import { getAdminUserFromRequest } from "@/utils/auth";

export async function PUT(req: NextRequest) {
  try {
    const admin = getAdminUserFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { currentPassword, newEmail, newPassword } = await req.json();

    if (!currentPassword) {
      return NextResponse.json({ error: "Current password is required" }, { status: 400 });
    }

    if (!newEmail && !newPassword) {
      return NextResponse.json({ error: "Provide new email or new password" }, { status: 400 });
    }

    const prisma = await getPrisma();
    const user = await prisma.user.findUnique({ where: { id: admin.userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
    }

    const updateData: Record<string, string> = {};

    if (newEmail && newEmail !== user.email) {
      const existingEmail = await prisma.user.findUnique({ where: { email: newEmail } });
      if (existingEmail) {
        return NextResponse.json({ error: "Email already in use" }, { status: 400 });
      }
      updateData.email = newEmail;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
      }
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: admin.userId },
      data: updateData,
    });

    return NextResponse.json({ success: true, message: "Credentials updated successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Change password error:", message);
    return NextResponse.json({ error: "Failed to update credentials" }, { status: 500 });
  }
}
