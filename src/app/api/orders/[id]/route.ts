import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { getAdminUserFromRequest } from "@/utils/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Protected: Update order details (Status, Tracking)
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const admin = getAdminUserFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;
    const { status, trackingId, trackingCourier } = await req.json();

    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Generate tracking links dynamically based on courier
    let trackingLink = "";
    if (trackingId && trackingCourier) {
      if (trackingCourier === "PATHAO") {
        trackingLink = `https://pathao.com/courier-tracking?id=${trackingId}`;
      } else if (trackingCourier === "STEADFAST") {
        trackingLink = `https://steadfast.com.bd/tracking?consignment_id=${trackingId}`;
      } else if (trackingCourier === "REDX") {
        trackingLink = `https://redx.com.bd/tracking?id=${trackingId}`;
      }
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: status || existingOrder.status,
        trackingId: trackingId !== undefined ? trackingId : existingOrder.trackingId,
        trackingCourier: trackingCourier !== undefined ? trackingCourier : existingOrder.trackingCourier,
      },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    console.error("PUT Order Error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

// Protected: Delete an order
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const admin = getAdminUserFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;

    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Order deleted successfully" });
  } catch (error: any) {
    console.error("DELETE Order Error:", error);
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
