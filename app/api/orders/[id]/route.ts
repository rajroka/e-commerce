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
  const order = await Order.findById(id).lean<any>();

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  const isAdmin = (session.user as any).role === 'admin';
  if (!isAdmin && order.userId?.toString() !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const serialized = {
    ...order,
    _id:       order._id?.toString()       ?? '',
    userId:    order.userId?.toString()    ?? '',
    createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : (order.createdAt ?? null),
    updatedAt: order.updatedAt instanceof Date ? order.updatedAt.toISOString() : (order.updatedAt ?? null),
    total:    typeof order.total    === 'number' ? order.total    : 0,
    subtotal: typeof order.subtotal === 'number' ? order.subtotal : (order.total ?? 0),
    discount: typeof order.discount === 'number' ? order.discount : 0,
    items: (order.items ?? []).map((item: any) => ({
      ...item,
      productId: item.productId?.toString() ?? '',
      price:    typeof item.price    === 'number' ? item.price    : 0,
      quantity: typeof item.quantity === 'number' ? item.quantity : 1,
    })),
  };

  return NextResponse.json({ order: serialized }, { status: 200 });
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
