import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth-utils';
import connect from '@/lib/db';
import Order from '@/lib/modals/Order';

export async function POST(req: NextRequest) {
  const { session, error } = await requireSession(req);
  if (error) return error;

  await connect();

  try {
    const { cartItems, couponCode, discount = 0, shippingAddress } = await req.json();

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    if (!shippingAddress?.fullName || !shippingAddress?.line1 || !shippingAddress?.city || !shippingAddress?.country) {
      return NextResponse.json({ error: 'Delivery address is required' }, { status: 400 });
    }

    const subtotal = cartItems.reduce((s: number, i: any) => s + i.price * i.quantity, 0);
    const total    = Math.max(0, subtotal - discount);

    const items = cartItems.map((i: any) => ({
      productId: i.id,
      name:      i.name,
      image:     i.image,
      price:     i.price,
      quantity:  i.quantity,
      color:     i.color ?? null,
      size:      i.size  ?? null,
    }));

    const order = await Order.create({
      userId:    session.user.id,
      userEmail: session.user.email,
      items,
      subtotal,
      discount,
      total,
      couponCode:      couponCode ?? null,
      paymentMethod:   'cod',
      status:          'pending',
      shippingAddress: {
        name:       shippingAddress.fullName,
        line1:      shippingAddress.line1,
        line2:      shippingAddress.line2      ?? undefined,
        city:       shippingAddress.city,
        state:      shippingAddress.state      ?? undefined,
        postalCode: shippingAddress.postalCode ?? undefined,
        country:    shippingAddress.country,
      },
    });

    return NextResponse.json({ orderId: order._id.toString() }, { status: 201 });
  } catch (err: any) {
    console.error('[orders/cod] error:', err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
