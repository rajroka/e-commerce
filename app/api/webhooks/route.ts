import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import stripe from '@/lib/stripe';
import connect from '@/lib/db';
import Order from '@/lib/modals/Order';
import Cart from '@/lib/modals/Cart';
import { sendOrderConfirmationEmail } from '@/lib/email';

// ── Stripe requires the raw body for signature verification ──────────────────
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig     = req.headers.get('stripe-signature');
  const secret  = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig!, secret);
  } catch (err: any) {
    console.error('[webhook] Signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  // ── Only handle successful payments ─────────────────────────────────────────
  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true });
  }

  const stripeSession = event.data.object as Stripe.Checkout.Session;

  // Idempotency — skip if order already created for this Stripe session
  await connect();
  const existing = await Order.findOne({ stripeSessionId: stripeSession.id });
  if (existing) {
    return NextResponse.json({ received: true });
  }

  const meta = stripeSession.metadata ?? {};
  const userId    = meta.userId;
  const userEmail = meta.userEmail || stripeSession.customer_email || '';

  if (!userId) {
    console.error('[webhook] No userId in metadata for session', stripeSession.id);
    return NextResponse.json({ error: 'Missing userId in metadata' }, { status: 400 });
  }

  // ── Reconstruct items from chunked metadata ──────────────────────────────
  let items: any[] = [];
  try {
    const chunks = parseInt(meta['items_chunks'] ?? '0', 10);
    let json = '';
    for (let i = 0; i < chunks; i++) json += meta[`items_${i}`] ?? '';
    items = JSON.parse(json);
  } catch {
    console.error('[webhook] Failed to parse items metadata');
    return NextResponse.json({ error: 'Failed to parse items' }, { status: 400 });
  }

  const subtotal    = parseFloat(meta.subtotal ?? '0');
  const discount    = parseFloat(meta.discount ?? '0');
  const total       = parseFloat(meta.total   ?? '0');
  const couponCode  = meta.couponCode || null;

  // ── Create order ─────────────────────────────────────────────────────────
  const order = await Order.create({
    userId,
    userEmail,
    items,
    subtotal,
    discount,
    total,
    couponCode,
    stripeSessionId: stripeSession.id,
    status: 'processing', // payment confirmed → move past pending immediately
  });

  // ── Clear the user's server cart ─────────────────────────────────────────
  await Cart.findOneAndDelete({ userId }).catch(() => {});

  // ── Send confirmation email (non-blocking) ────────────────────────────────
  sendOrderConfirmationEmail({
    to: userEmail,
    orderId: (order._id as any).toString(),
    items,
    total,
    discount,
    couponCode: couponCode ?? undefined,
  }).catch((err) => console.error('[webhook] Email failed:', err));

  return NextResponse.json({ received: true });
}
