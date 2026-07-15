import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/utils/db";
import { getAdminUserFromRequest } from "@/utils/auth";

export async function GET(req: NextRequest) {
  try {
    const prisma = await getPrisma();
    const admin = getAdminUserFromRequest(req);
    if (!admin) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: admin.userId },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, user });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
