import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/db';
import Product from '@/lib/modals/Product';
import { requireAdmin } from '@/lib/auth-utils';

/**
 * PATCH /api/products/discount
 *
 * Apply or remove a discount on one or many products at once.
 *
 * Body:
 *   productIds:     string[]   — IDs to update (required)
 *   discountPct:    number     — 0–100; 0 clears the discount
 *   discountEndsAt: string | null — ISO datetime or null for permanent
 */
export async function PATCH(request: NextRequest) {
  const { session, error } = await requireAdmin(request);
  if (error) return error;

  await connect();

  try {
    const body = await request.json();
    const { productIds, discountPct, discountEndsAt } = body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ error: 'productIds must be a non-empty array' }, { status: 400 });
    }

    const pct = Number(discountPct ?? 0);
    if (isNaN(pct) || pct < 0 || pct > 100) {
      return NextResponse.json({ error: 'discountPct must be 0–100' }, { status: 400 });
    }

    const endsAt = discountEndsAt ? new Date(discountEndsAt) : null;
    if (discountEndsAt && endsAt && isNaN(endsAt.getTime())) {
      return NextResponse.json({ error: 'Invalid discountEndsAt date' }, { status: 400 });
    }

    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      { $set: { discountPct: pct, discountEndsAt: endsAt } }
    );

    console.info(
      `[discount] Admin ${session.user.email} set ${pct}% discount on ${result.modifiedCount} products`
    );

    return NextResponse.json({
      ok: true,
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error('[discount] PATCH error:', err);
    return NextResponse.json({ error: 'Failed to apply discount' }, { status: 500 });
  }
}
