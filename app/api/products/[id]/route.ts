import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import Product from "@/lib/modals/Product";
import { requireAdmin } from "@/lib/auth-utils";

// ─── GET /api/products/[id] — public ─────────────────────────────────────────
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  await connect();
  const { id } = await context.params;

  const product = await Product.findById(id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}

// ─── PUT /api/products/[id] — admin only ──────────────────────────────────────
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireAdmin(request);
  if (error) return error;

  await connect();
  const { id } = await context.params;
  const body = await request.json();

  const updated = await Product.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  console.info(`[products/${id}] Updated by admin ${session.user.email}`);
  return NextResponse.json(updated);
}

// ─── DELETE /api/products/[id] — admin only ───────────────────────────────────
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireAdmin(request);
  if (error) return error;

  await connect();
  const { id } = await context.params;

  const deleted = await Product.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  console.info(`[products/${id}] Deleted by admin ${session.user.email}`);
  return NextResponse.json({ message: "Product deleted successfully" });
}
