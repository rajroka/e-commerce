'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/cartStore';
import { FiMinus, FiPlus, FiTrash2, FiArrowLeft, FiShoppingBag, FiTag, FiX } from 'react-icons/fi';
import { useSession } from '@/lib/auth-client';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CartPage = () => {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    newTotal: number;
  } | null>(null);

  const {
    items,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    setUserId,
    getTotalQuantity,
    getTotalPrice,
  } = useCartStore();

  useEffect(() => {
    setMounted(true);
    setUserId(session?.user?.id || null, session ? 'authenticated' : 'unauthenticated');
  }, [session, setUserId]);

  // Reset coupon if cart total changes
  useEffect(() => { setAppliedCoupon(null); }, [items]);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim(), orderTotal: getTotalPrice() }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? 'Invalid coupon'); return; }
      setAppliedCoupon({ code: data.code, discount: data.discount, newTotal: data.newTotal });
      toast.success(`Coupon applied! You save $${data.discount.toFixed(2)}`);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!session) {
      toast.error('Please login to checkout', { duration: 2000 });
      return;
    }

    const finalTotal = appliedCoupon ? appliedCoupon.newTotal : getTotalPrice();

    // 1. Create order record
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map((i) => ({
          productId: i.id,
          name: i.name,
          image: i.image,
          price: i.price,
          quantity: i.quantity,
        })),
        subtotal: getTotalPrice(),
        discount: appliedCoupon?.discount ?? 0,
        total: finalTotal,
        couponCode: appliedCoupon?.code ?? null,
      }),
    });

    // 2. Redirect to Stripe
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cartItems: items.map((i) => ({
          ...i,
          // Apply proportional discount per item if coupon applied
          price: appliedCoupon
            ? parseFloat((i.price * (appliedCoupon.newTotal / getTotalPrice())).toFixed(2))
            : i.price,
        })),
      }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      toast.error('Checkout failed', { duration: 2000 });
    }
  };

  if (!mounted) return <div className="min-h-screen bg-gray-50" />;

  if (items.length === 0)
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center px-4 md:px-10 lg:px-20">
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center max-w-md">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiShoppingBag className="text-4xl text-gray-300" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-3">Your cart is empty</h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Looks like you haven&apos;t added anything yet. Explore our products and find something you love!
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <FiArrowLeft className="mr-2" /> Start Shopping
          </Link>
        </div>
      </main>
    );

  const subtotal = getTotalPrice();
  const discount = appliedCoupon?.discount ?? 0;
  const finalTotal = appliedCoupon ? appliedCoupon.newTotal : subtotal;

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Your Cart</h1>
          <p className="text-gray-500 mt-2 font-medium flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-sm">{getTotalQuantity()}</span>
            Items ready for checkout
          </p>
        </div>
        <Link href="/products" className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors flex items-center">
          <FiArrowLeft className="mr-2" /> Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-8 space-y-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-3xl border border-gray-50 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="relative w-32 h-32 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                <Image src={item.image} alt={item.name} fill className="object-contain p-4" />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                  {item.name}
                </h2>
                <p className="text-gray-400 text-sm font-medium mt-1">Unit Price: ${item.price.toFixed(2)}</p>

                <div className="flex items-center justify-center sm:justify-start gap-6 mt-6">
                  <div className="flex items-center border border-gray-100 rounded-xl bg-gray-50 p-1">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white hover:text-indigo-600 hover:shadow-sm transition-all"
                    >
                      <FiMinus size={18} />
                    </button>
                    <span className="w-12 text-center font-black text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white hover:text-indigo-600 hover:shadow-sm transition-all"
                    >
                      <FiPlus size={18} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <FiTrash2 size={18} />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              </div>

              <div className="text-right hidden sm:block border-l border-gray-50 pl-8">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total</p>
                <p className="text-2xl font-black text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-gray-900 p-8 rounded-3xl text-white shadow-2xl sticky top-28 space-y-6">
            <h2 className="text-xl font-black">Summary</h2>

            {/* Coupon Input */}
            {!appliedCoupon ? (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  <FiTag className="inline mr-1" />Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                    placeholder="ENTER CODE"
                    className="flex-1 bg-gray-800 border border-gray-700 text-white text-sm px-3 py-2 rounded-lg placeholder-gray-500 focus:border-gray-500 outline-none uppercase tracking-widest"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponInput.trim()}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg transition disabled:opacity-50"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
                <p className="text-[10px] text-gray-500 mt-2">Try: WELCOME10 · SAVE20 · FLAT5</p>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-green-900/30 border border-green-700/50 rounded-lg px-4 py-3">
                <div>
                  <p className="text-green-400 text-xs font-bold uppercase tracking-widest">{appliedCoupon.code}</p>
                  <p className="text-green-300 text-sm font-black">−${appliedCoupon.discount.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => { setAppliedCoupon(null); setCouponInput(''); }}
                  className="text-gray-400 hover:text-white transition"
                  aria-label="Remove coupon"
                >
                  <FiX size={16} />
                </button>
              </div>
            )}

            <div className="h-px bg-gray-800" />

            {/* Totals */}
            <div className="space-y-4">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount</span>
                  <span>−${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span className="text-green-400 text-xs font-bold uppercase tracking-widest">Free</span>
              </div>
              <div className="h-px bg-gray-800" />
              <div className="flex justify-between items-end">
                <span className="text-gray-400">Total</span>
                <span className="text-xl font-black text-white">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-indigo-500 hover:-translate-y-1 transition-all active:scale-95"
            >
              Checkout Now
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CartPage;
