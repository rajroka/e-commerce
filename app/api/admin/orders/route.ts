import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import connect from "@/lib/db";
import Order from "@/lib/modals/Order";

// ─── GET /api/admin/orders — all orders ──────────────────────────────────────
export async function GET(request: NextRequest) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  await connect();

  const raw = await Order.find().sort({ createdAt: -1 }).lean();

  const orders = raw.map((o: any) => ({
    ...o,
    _id:       o._id?.toString()       ?? "",
    userId:    o.userId?.toString()    ?? "",
    createdAt: o.createdAt instanceof Date ? o.createdAt.toISOString() : (o.createdAt ?? null),
    updatedAt: o.updatedAt instanceof Date ? o.updatedAt.toISOString() : (o.updatedAt ?? null),
    total:    typeof o.total    === "number" ? o.total    : 0,
    subtotal: typeof o.subtotal === "number" ? o.subtotal : (o.total ?? 0),
    discount: typeof o.discount === "number" ? o.discount : 0,
    items: (o.items ?? []).map((item: any) => ({
      ...item,
      productId: item.productId?.toString() ?? "",
      price:    typeof item.price    === "number" ? item.price    : 0,
      quantity: typeof item.quantity === "number" ? item.quantity : 1,
    })),
  }));

  return NextResponse.json({ orders });
}

// ─── PATCH /api/admin/orders — update order status ───────────────────────────
export async function PATCH(request: NextRequest) {
  const { session, error } = await requireAdmin(request);
  if (error) return error;

  await connect();

  const { orderId, status } = await request.json();

  const VALID_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];
  if (!orderId || !VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: `status must be one of: ${VALID_STATUSES.join(", ")}` },
      { status: 400 }
    );
  }

  const updated = await Order.findByIdAndUpdate(
    orderId,
    { $set: { status } },
    { new: true }
  );

  if (!updated) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  console.info(`[admin/orders] Order ${orderId} status → "${status}" by ${session.user.email}`);
  return NextResponse.json({ ok: true, order: updated });
}
