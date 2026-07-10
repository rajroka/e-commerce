import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connect from '@/lib/db';
import Wishlist from '@/lib/modals/Wishlist';

// GET — fetch wishlist
export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connect();
  const wishlist = await Wishlist.findOne({ userId: session.user.id });
  return NextResponse.json({ items: wishlist?.items ?? [] }, { status: 200 });
}

// POST — add item to wishlist (idempotent)
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connect();
  const { productId, name, image, price, category } = await request.json();

  if (!productId || !name || !image || price == null || !category) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const wishlist = await Wishlist.findOneAndUpdate(
    { userId: session.user.id },
    {
      $addToSet: { items: { productId, name, image, price, category } },
    },
    { upsert: true, new: true }
  );

  return NextResponse.json({ items: wishlist.items }, { status: 200 });
}

// DELETE — remove item from wishlist
export async function DELETE(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connect();
  const { productId } = await request.json();

  if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 });

  const wishlist = await Wishlist.findOneAndUpdate(
    { userId: session.user.id },
    { $pull: { items: { productId } } },
    { new: true }
  );

  return NextResponse.json({ items: wishlist?.items ?? [] }, { status: 200 });
}
