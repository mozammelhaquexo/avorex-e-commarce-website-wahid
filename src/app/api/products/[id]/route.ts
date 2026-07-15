import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/utils/db";
import { getAdminUserFromRequest } from "@/utils/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Protected: Update a product
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const prisma = await getPrisma();
    const admin = getAdminUserFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        nameEn: body.nameEn !== undefined ? body.nameEn : existingProduct.nameEn,
        nameBn: body.nameBn !== undefined ? body.nameBn : existingProduct.nameBn,
        descriptionEn: body.descriptionEn !== undefined ? body.descriptionEn : existingProduct.descriptionEn,
        descriptionBn: body.descriptionBn !== undefined ? body.descriptionBn : existingProduct.descriptionBn,
        price: body.price !== undefined ? parseFloat(body.price) : existingProduct.price,
        stock: body.stock !== undefined ? parseInt(body.stock) : existingProduct.stock,
        images: body.images !== undefined ? body.images : existingProduct.images,
        categoryEn: body.categoryEn !== undefined ? body.categoryEn : existingProduct.categoryEn,
        categoryBn: body.categoryBn !== undefined ? body.categoryBn : existingProduct.categoryBn,
        sku: body.sku !== undefined ? body.sku : existingProduct.sku,
        unit: body.unit !== undefined ? body.unit : existingProduct.unit,
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    console.error("PUT Product Error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// Protected: Delete a product
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const prisma = await getPrisma();
    const admin = getAdminUserFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    console.error("DELETE Product Error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
