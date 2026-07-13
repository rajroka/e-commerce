import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import Cart from '@/lib/modals/Cart';
import connect from '@/lib/db';

// ─── helpers ──────────────────────────────────────────────────────────────────
async function requireSession(request: NextRequest) {
  await connect();
  const session = await auth.api.getSession({ headers: request.headers });
  return session;
}

// ─── GET /api/cart ─────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const session = await requireSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const cart = await Cart.findOne({ userId: session.user.id }).lean<{ items: any[] }>();
  return NextResponse.json({ items: cart?.items ?? [] });
}

// ─── POST /api/cart ─────────────────────────────────────────────────────────
// Simple upsert — no stock validation here.
// Stock is validated at checkout time (/api/checkout) where it matters.
// Doing per-item Product.findById on every background push caused N DB
// queries per small cart change, making the cart feel sluggish.
export async function POST(request: NextRequest) {
  const session = await requireSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { items } = body;

  if (!Array.isArray(items)) {
    return NextResponse.json({ error: 'items must be an array' }, { status: 400 });
  }

  await Cart.findOneAndUpdate(
    { userId: session.user.id },
    { userId: session.user.id, items },
    { upsert: true, new: true }
  );

  return NextResponse.json({ ok: true });
}

// ─── DELETE /api/cart ──────────────────────────────────────────────────────────
export async function DELETE(request: NextRequest) {
  const session = await requireSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await Cart.findOneAndDelete({ userId: session.user.id });
  return NextResponse.json({ ok: true });
}
