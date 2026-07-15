import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { getAdminUserFromRequest } from "@/utils/auth";

// Protected: Get all custom part requests (for Admin Dashboard)
export async function GET(req: NextRequest) {
  try {
    const admin = getAdminUserFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const requests = await prisma.customRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(requests);
  } catch (error: any) {
    console.error("GET CustomRequests Error:", error);
    return NextResponse.json({ error: "Failed to fetch custom requests" }, { status: 500 });
  }
}

// Public: Create a new custom part request
export async function POST(req: NextRequest) {
  try {
    const { customerName, phone, partName, partDetails } = await req.json();

    if (!customerName || !phone || !partName || !partDetails) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const request = await prisma.customRequest.create({
      data: {
        customerName,
        phone,
        partName,
        partDetails,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, request });
  } catch (error: any) {
    console.error("POST CustomRequest Error:", error);
    return NextResponse.json({ error: "Failed to create custom request" }, { status: 500 });
  }
}
