import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connect from '@/lib/db';
import Order from '@/lib/modals/Order';

// GET /api/admin/orders — all orders for admin
export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  await connect();
  const orders = await Order.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ orders });
}
