import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connect from '@/lib/db';
import Order from '@/lib/modals/Order';

// GET — single order (user must own it, or be admin)
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connect();
  const { id } = await params;
  const order = await Order.findById(id);

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  const isAdmin = (session.user as any).role === 'admin';
  if (!isAdmin && order.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json({ order }, { status: 200 });
}

// PATCH — admin updates order status
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await connect();
  const { id } = await params;
  const { status } = await request.json();

  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  return NextResponse.json({ order }, { status: 200 });
}
