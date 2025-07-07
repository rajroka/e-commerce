import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { cartItems } = await req.json();

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: 'No cart items provided' }, { status: 400 });
    }

    // Optional: Log cart items to debug
    console.log('Cart items:', cartItems);

    const line_items = cartItems.map((item: any) => {
      // Ensure required fields are present
      const name = item.title || item.name || 'Unnamed product';
      const image = item.image ? [item.image] : [];

      if (!item.price || typeof item.price !== 'number' || item.price <= 0) {
        throw new Error(`Invalid price for product: ${name}`);
      }

      if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
        throw new Error(`Invalid quantity for product: ${name}`);
      }

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name,
            images: image,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: 'Checkout error' }, { status: 500 });
  }
}
