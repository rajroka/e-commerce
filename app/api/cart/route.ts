import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import Cart from '@/lib/modals/Cart';
import Product from '@/lib/modals/Product';
import connect from '@/lib/db';

// ─── helpers ──────────────────────────────────────────────────────────────────
async function requireSession(request: NextRequest) {
  // connect() must run before auth.api.getSession because better-auth
  // may hit the DB to validate the session token.
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

// ─── POST /api/cart ────────────────────────────────────────────────────────────
// Full cart upsert. Validates each item against current stock before saving.
export async function POST(request: NextRequest) {
  const session = await requireSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { items } = body;

  if (!Array.isArray(items)) {
    return NextResponse.json({ error: 'items must be an array' }, { status: 400 });
  }

  // ── Stock validation ────────────────────────────────────────────────────────
  const violations: string[] = [];

  const checked = await Promise.all(
    items.map(async (item: any) => {
      const product = await Product.findById(item.id).select('stock name').lean() as any;
      if (!product) return item; // product deleted — keep as-is, UI will reflect on next page load

      const available = product.stock ?? Infinity;
      if (item.quantity > available) {
        violations.push(`"${product.name}" only has ${available} in stock`);
        return { ...item, quantity: Math.max(1, available) }; // clamp
      }
      return item;
    })
  );

  await Cart.findOneAndUpdate(
    { userId: session.user.id },
    { userId: session.user.id, items: checked },
    { upsert: true, new: true }
  );

  if (violations.length > 0) {
    return NextResponse.json({
      ok: true,
      warnings: violations,
      items: checked,
    });
  }

  return NextResponse.json({ ok: true });
}

// ─── DELETE /api/cart ──────────────────────────────────────────────────────────
export async function DELETE(request: NextRequest) {
  const session = await requireSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await Cart.findOneAndDelete({ userId: session.user.id });
  return NextResponse.json({ ok: true });
}
