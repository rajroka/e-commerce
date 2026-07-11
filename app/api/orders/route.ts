import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connect from '@/lib/db';
import Order from '@/lib/modals/Order';

// ─── GET /api/orders — fetch current user's orders ────────────────────────────
export async function GET(request: NextRequest) {
  await connect();
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const orders = await Order.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  // Serialize all non-plain-JSON fields from lean() output
  const serialized = orders.map((o: any) => ({
    ...o,
    _id:       o._id?.toString()       ?? '',
    userId:    o.userId?.toString()    ?? '',
    createdAt: o.createdAt instanceof Date ? o.createdAt.toISOString() : (o.createdAt ?? null),
    updatedAt: o.updatedAt instanceof Date ? o.updatedAt.toISOString() : (o.updatedAt ?? null),
    // Ensure numeric fields always exist
    total:    typeof o.total    === 'number' ? o.total    : 0,
    subtotal: typeof o.subtotal === 'number' ? o.subtotal : (o.total ?? 0),
    discount: typeof o.discount === 'number' ? o.discount : 0,
    // Ensure items array is safe
    items: (o.items ?? []).map((item: any) => ({
      ...item,
      productId: item.productId?.toString() ?? '',
      price:    typeof item.price    === 'number' ? item.price    : 0,
      quantity: typeof item.quantity === 'number' ? item.quantity : 1,
    })),
  }));

  return NextResponse.json({ orders: serialized }, { status: 200 });
}

// ─── POST /api/orders — kept for manual/admin order creation only ─────────────
// Normal checkout orders are now created exclusively by the Stripe webhook to
// prevent ghost orders when payment is abandoned.
export async function POST(request: NextRequest) {
  await connect();
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Only admins can create orders manually
  if ((session.user as any).role !== 'admin') {
    return NextResponse.json(
      { error: 'Orders are created automatically after payment' },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { items, subtotal, discount = 0, total, couponCode } = body;

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'No items provided' }, { status: 400 });
  }

  const order = await Order.create({
    userId:    session.user.id,
    userEmail: session.user.email,
    items,
    subtotal: subtotal ?? total,
    discount,
    total,
    couponCode: couponCode ?? null,
    status: 'pending',
  });

  return NextResponse.json({ order }, { status: 201 });
}
