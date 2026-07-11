import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import { auth } from '@/lib/auth';
import connect from '@/lib/db';

export async function POST(req: NextRequest) {
  // ── Auth ────────────────────────────────────────────────────────────────────
  await connect();
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: 'You must be signed in to checkout' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { cartItems, couponCode, discount = 0 } = body;

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // ── Build Stripe line items ──────────────────────────────────────────────
    const line_items = cartItems.map((item: any) => {
      const name = item.name || item.title || 'Product';

      if (typeof item.price !== 'number' || item.price <= 0) {
        throw new Error(`Invalid price for "${name}"`);
      }
      if (typeof item.quantity !== 'number' || item.quantity < 1) {
        throw new Error(`Invalid quantity for "${name}"`);
      }

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name,
            ...(item.image ? { images: [item.image] } : {}),
            metadata: { productId: item.id ?? '' },
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      };
    });

    const origin =
      req.headers.get('origin') ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      'http://localhost:3000';

    // ── Stripe discount coupon ───────────────────────────────────────────────
    // We encode the discount as a Stripe coupon so the receipt reflects it.
    const stripeDiscounts: any[] = [];
    if (discount > 0 && couponCode) {
      try {
        // Reuse existing Stripe coupon or create a new one
        const stripeCouponId = `GG-${couponCode}`;
        try {
          await stripe.coupons.retrieve(stripeCouponId);
        } catch {
          await stripe.coupons.create({
            id: stripeCouponId,
            amount_off: Math.round(discount * 100),
            currency: 'usd',
            duration: 'once',
            name: couponCode,
          });
        }
        stripeDiscounts.push({ coupon: stripeCouponId });
      } catch {
        // Discount creation failed — proceed without it (total will be off but
        // the order record from the webhook will use the correct total)
      }
    }

    // ── Store cart + order metadata in Stripe session ─────────────────────
    // The webhook will read this to create the order after successful payment.
    const metadata: Record<string, string> = {
      userId:    session.user.id,
      userEmail: session.user.email,
      // Stripe metadata values must be strings ≤500 chars each
      // We chunk items as JSON; if > 500 chars we trim (webhook falls back to items param)
      couponCode: couponCode ?? '',
      discount:   String(discount),
      subtotal:   String(cartItems.reduce((s: number, i: any) => s + i.price * i.quantity, 0)),
      total:      String(
        Math.max(0, cartItems.reduce((s: number, i: any) => s + i.price * i.quantity, 0) - discount)
      ),
    };

    // Encode items — Stripe metadata value limit is 500 chars, key limit 40 chars.
    // We split into chunks of ≤490 chars.
    const itemsJson = JSON.stringify(
      cartItems.map((i: any) => ({
        productId: i.id,
        name:      i.name || i.title,
        image:     i.image,
        price:     i.price,
        quantity:  i.quantity,
      }))
    );
    const CHUNK = 490;
    let ci = 0;
    for (let pos = 0; pos < itemsJson.length; pos += CHUNK) {
      metadata[`items_${ci++}`] = itemsJson.slice(pos, pos + CHUNK);
    }
    metadata['items_chunks'] = String(ci);

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      discounts: stripeDiscounts.length > 0 ? stripeDiscounts : undefined,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${origin}/cart`,
      customer_email: session.user.email,
      metadata,
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (err: any) {
    console.error('[checkout] error:', err);
    return NextResponse.json(
      { error: err.message ?? 'Checkout failed. Please try again.' },
      { status: 500 }
    );
  }
}
