import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connect from '@/lib/db';
import Order from '@/lib/modals/Order';
import { sendOrderConfirmationEmail } from '@/lib/email';

// GET — fetch current user's orders
export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connect();
  const orders = await Order.find({ userId: session.user.id }).sort({ createdAt: -1 });
  return NextResponse.json({ orders }, { status: 200 });
}

// POST — place a new order
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connect();

  const body = await request.json();
  const { items, subtotal, discount, total, couponCode, stripeSessionId } = body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'No items provided' }, { status: 400 });
  }

  const order = new Order({
    userId: session.user.id,
    userEmail: session.user.email,
    items,
    subtotal: subtotal ?? total,
    discount: discount ?? 0,
    total,
    couponCode: couponCode ?? null,
    stripeSessionId: stripeSessionId ?? null,
    status: 'pending',
  });

  await order.save();

  // Send confirmation email (non-blocking)
  sendOrderConfirmationEmail({
    to: session.user.email,
    orderId: (order._id as any).toString(),
    items,
    total,
    discount: discount ?? 0,
    couponCode: couponCode ?? undefined,
  }).catch((err) => console.error('[Email] Failed to send order confirmation:', err));

  return NextResponse.json({ order }, { status: 201 });
}
