import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/utils/db";
import { getAdminUserFromRequest } from "@/utils/auth";

const PRODUCT_SELECT = {
  id: true,
  nameEn: true,
  nameBn: true,
  descriptionEn: true,
  descriptionBn: true,
  price: true,
  stock: true,
  images: true,
  categoryEn: true,
  categoryBn: true,
  sku: true,
  unit: true,
  createdAt: true,
};

export async function GET(req: NextRequest) {
  try {
    const prisma = await getPrisma();
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
      ];
    }

    if (category && category !== "All") {
      where.categoryEn = category;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        select: PRODUCT_SELECT,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const response = NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });

    response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("GET Products Error:", message);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const prisma = await getPrisma();
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
      select: PRODUCT_SELECT,
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
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("POST Product Error:", message);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}
