import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { getAdminUserFromRequest } from "@/utils/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Protected: Delete a custom part request
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const admin = getAdminUserFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;

    const existingRequest = await prisma.customRequest.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    await prisma.customRequest.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Custom request deleted successfully" });
  } catch (error: any) {
    console.error("DELETE CustomRequest Error:", error);
    return NextResponse.json({ error: "Failed to delete custom request" }, { status: 500 });
  }
}
