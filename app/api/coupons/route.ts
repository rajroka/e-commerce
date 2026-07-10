import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connect from '@/lib/db';
import Coupon from '@/lib/modals/Coupon';

// POST /api/coupons — validate a coupon code against an order total
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connect();

  // Seed demo coupons if none exist
  const count = await Coupon.countDocuments();
  if (count === 0) {
    await Coupon.insertMany([
      { code: 'WELCOME10', discountType: 'percent', discountValue: 10, minOrderAmount: 0 },
      { code: 'SAVE20', discountType: 'percent', discountValue: 20, minOrderAmount: 50 },
      { code: 'FLAT5', discountType: 'fixed', discountValue: 5, minOrderAmount: 25 },
    ]);
  }

  const { code, orderTotal } = await request.json();
  if (!code) return NextResponse.json({ error: 'Coupon code required' }, { status: 400 });

  const coupon = await Coupon.findOne({ code: code.toUpperCase().trim(), active: true });

  if (!coupon) {
    return NextResponse.json({ error: 'Invalid or expired coupon code' }, { status: 404 });
  }
  if (coupon.expiresAt && new Date() > coupon.expiresAt) {
    return NextResponse.json({ error: 'Coupon has expired' }, { status: 410 });
  }
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 410 });
  }
  if (orderTotal < coupon.minOrderAmount) {
    return NextResponse.json(
      { error: `Minimum order amount is $${coupon.minOrderAmount}` },
      { status: 422 }
    );
  }

  const discount =
    coupon.discountType === 'percent'
      ? Math.round(orderTotal * (coupon.discountValue / 100) * 100) / 100
      : Math.min(coupon.discountValue, orderTotal);

  return NextResponse.json({
    valid: true,
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discount,
    newTotal: Math.max(0, orderTotal - discount),
  });
}

// GET /api/coupons — admin: list all coupons
export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  await connect();
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  return NextResponse.json({ coupons });
}
