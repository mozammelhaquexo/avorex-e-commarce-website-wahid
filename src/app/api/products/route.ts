import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { getAdminUserFromRequest } from "@/utils/auth";

// Public: Get products with pagination + search
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { nameEn: { contains: search } },
        { nameBn: { contains: search } },
        { sku: { contains: search } },
        { categoryEn: { contains: search } },
      ];
    }

    if (category && category !== "All") {
      where.categoryEn = category;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: unknown) {
    console.error("GET Products Error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// Protected: Add a new product
export async function POST(req: NextRequest) {
  try {
    const admin = getAdminUserFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const {
      nameEn,
      nameBn,
      descriptionEn,
      descriptionBn,
      price,
      stock,
      images,
      categoryEn,
      categoryBn,
      sku,
      unit,
    } = await req.json();

    if (!nameEn || !nameBn || price === undefined || stock === undefined || !categoryEn || !categoryBn) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        nameEn,
        nameBn,
        descriptionEn: descriptionEn || "",
        descriptionBn: descriptionBn || "",
        price: parseFloat(String(price)),
        stock: parseInt(String(stock)),
        images: images || "[]",
        categoryEn,
        categoryBn,
        sku: sku || null,
        unit: unit || null,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: unknown) {
    console.error("POST Product Error:", error);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}
