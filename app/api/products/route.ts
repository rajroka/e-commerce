import { NextRequest, NextResponse } from "next/server";
import Product from "@/lib/modals/Product";
import connect from "@/lib/db";
import { requireAdmin } from "@/lib/auth-utils";

// ─── GET /api/products — public ───────────────────────────────────────────────
export async function GET(request: NextRequest) {
  await connect();

  try {
    const url = new URL(request.url);
    const category   = url.searchParams.get("category");
    const search     = url.searchParams.get("search");
    const pageParam  = parseInt(url.searchParams.get("page")  || "1",  10);
    const limitParam = parseInt(url.searchParams.get("limit") || "12", 10);

    const page  = isNaN(pageParam)  || pageParam  < 1 ? 1  : pageParam;
    const limit = isNaN(limitParam) || limitParam < 1 ? 12 : Math.min(limitParam, 100);

    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (search)   filter.$or = [
      { name:        { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];

    const [products, totalCount] = await Promise.all([
      Product.find(filter).skip((page - 1) * limit).limit(limit),
      Product.countDocuments(filter),
    ]);

    return NextResponse.json(
      { products, totalCount, page, totalPages: Math.ceil(totalCount / limit) },
      { status: 200 }
    );
  } catch (error) {
    console.error("[products] GET error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// ─── POST /api/products — admin only ──────────────────────────────────────────
export async function POST(request: NextRequest) {
  const { session, error } = await requireAdmin(request);
  if (error) return error;

  await connect();

  try {
    const body = await request.json();
    delete body.id; // MongoDB uses _id

    const { name, description, price, image, category, stock = 0, rating = 0, reviews = [] } = body;

    if (!name || !description || !price || !image || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newProduct = new Product({ name, description, price, image, category, stock, rating, reviews });
    await newProduct.save();

    console.info(`[products] Created by admin ${session.user.email}`);
    return NextResponse.json({ message: "Product created successfully" }, { status: 201 });
  } catch (err) {
    console.error("[products] POST error:", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

// ─── DELETE /api/products?id=… — admin only ────────────────────────────────────
export async function DELETE(request: NextRequest) {
  const { session, error } = await requireAdmin(request);
  if (error) return error;

  const productId = new URL(request.url).searchParams.get("id");
  if (!productId) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
  }

  await connect();

  try {
    const deleted = await Product.findByIdAndDelete(productId);
    if (!deleted) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    console.info(`[products] Deleted ${productId} by admin ${session.user.email}`);
    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("[products] DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

// ─── PUT /api/products?id=… — admin only ──────────────────────────────────────
export async function PUT(request: NextRequest) {
  const { session, error } = await requireAdmin(request);
  if (error) return error;

  const productId = new URL(request.url).searchParams.get("id");
  if (!productId) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
  }

  await connect();

  try {
    const body = await request.json();
    delete body.id;

    const updated = await Product.findByIdAndUpdate(productId, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    console.info(`[products] Updated ${productId} by admin ${session.user.email}`);
    return NextResponse.json({ message: "Product updated successfully", product: updated }, { status: 200 });
  } catch (err) {
    console.error("[products] PUT error:", err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}
