import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/utils/db";
import { getAdminUserFromRequest } from "@/utils/auth";

// Protected: Get all orders (for Admin Dashboard)
export async function GET(req: NextRequest) {
  try {
    const prisma = await getPrisma();
    const admin = getAdminUserFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("GET Orders Error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// Public: Create a new order
export async function POST(req: NextRequest) {
  try {
    const prisma = await getPrisma();
    const {
      customerName,
      customerPhone,
      customerAddress,
      paymentMethod,
      items,
      totalAmount,
    } = await req.json();

    if (!customerName || !customerPhone || !customerAddress || !paymentMethod || !items || totalAmount === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate unique order number (e.g., MAKKA-162981-XXXX)
    const orderNumber = `MAKKA-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerPhone,
        customerAddress,
        paymentMethod,
        items: JSON.stringify(items),
        totalAmount: parseFloat(totalAmount),
        status: "PENDING",
      },
    });

    // Also deduct stock for products in the order
    for (const item of items) {
      try {
        await prisma.product.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      } catch (err) {
        console.error(`Failed to deduct stock for product ID: ${item.id}`, err);
      }
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("POST Order Error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
