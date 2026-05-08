import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import Cart from '@/lib/modals/Cart';
import connect from '@/lib/db';

// GET: Return cart items for the authenticated user
export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connect();

  const userId = session.user.id;
  const cart = await Cart.findOne({ userId });

  return NextResponse.json({ items: cart ? cart.items : [] }, { status: 200 });
}

// POST: Upsert cart for the authenticated user
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connect();

  const userId = session.user.id;
  const body = await request.json();
  const { items } = body;

  await Cart.findOneAndUpdate(
    { userId },
    { userId, items },
    { upsert: true, new: true }
  );

  return NextResponse.json({ ok: true }, { status: 200 });
}

// DELETE: Clear cart for the authenticated user
export async function DELETE(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connect();

  const userId = session.user.id;
  await Cart.findOneAndDelete({ userId });

  return NextResponse.json({ ok: true }, { status: 200 });
}
