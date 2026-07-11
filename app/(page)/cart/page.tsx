'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  MinusSignIcon, PlusSignIcon, Delete01Icon, ArrowLeft01Icon,
  ShoppingBag01Icon, Tag01Icon, Cancel01Icon, LoaderPinwheelIcon,
} from '@hugeicons/core-free-icons';
import { useCartStore } from '@/store/cartStore';
import { useSession } from '@/lib/auth-client';

const STROKE = 1.5;
const FREE_SHIPPING_THRESHOLD = 50;
const TAX_RATE = 0.08;

export default function CartPage() {
  const { data: session } = useSession();
  const items          = useCartStore(s => s.items);
  const updateQuantity = useCartStore(s => s.updateQuantity);
  const removeFromCart = useCartStore(s => s.removeFromCart);
  const clearCart      = useCartStore(s => s.clearCart);
  const setUserId      = useCartStore(s => s.setUserId);
  const syncStatus     = useCartStore(s => s.syncStatus);
  const getTotalPrice  = useCartStore(s => s.getTotalPrice);
  const getTotalQty    = useCartStore(s => s.getTotalQuantity);

  const [couponInput,   setCouponInput]   = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [coupon, setCoupon] = useState<{ code: string; discount: number; newTotal: number } | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const checkoutRef = useRef(false);

  useEffect(() => { setReady(true); }, []);
  useEffect(() => { if (!session) return; setUserId(session.user.id, 'authenticated'); }, [session, setUserId]);
  useEffect(() => { setCoupon(null); }, [items]);

  const subtotal     = getTotalPrice();
  const discount     = coupon?.discount ?? 0;
  const afterDiscount = Math.max(0, subtotal - discount);
  const shipping     = afterDiscount >= FREE_SHIPPING_THRESHOLD || afterDiscount === 0 ? 0 : 5.99;
  const tax          = parseFloat((afterDiscount * TAX_RATE).toFixed(2));
  const total        = parseFloat((afterDiscount + shipping + tax).toFixed(2));

  const handleApplyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    if (!session) { toast.error('Please sign in to apply a coupon'); return; }
    setCouponLoading(true);
    try {
      const res  = await fetch('/api/coupons', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, orderTotal: subtotal }) });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? 'Invalid coupon'); return; }
      setCoupon({ code: data.code, discount: data.discount, newTotal: data.newTotal });
      toast.success(`Coupon applied — you save $${data.discount.toFixed(2)}`);
    } finally { setCouponLoading(false); }
  };

  const handleCheckout = async () => {
    if (checkoutRef.current || checkoutLoading) return;
    if (!session) { toast.error('Please sign in to checkout'); return; }
    if (items.length === 0) { toast.error('Your cart is empty'); return; }
    checkoutRef.current = true;
    setCheckoutLoading(true);
    try {
      const res  = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cartItems: items.map(i => ({ id: i.id, name: i.name, image: i.image, price: i.price, quantity: i.quantity })), couponCode: coupon?.code ?? null, discount }) });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? 'Checkout failed.'); return; }
      if (data.url) { window.location.href = data.url; return; }
      toast.error('No checkout URL returned.');
    } catch { toast.error('Network error.'); }
    finally { checkoutRef.current = false; setCheckoutLoading(false); }
  };

  if (!ready) return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="h-8 w-40 bg-gray-200 rounded animate-pulse mb-10" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-4">{[1,2,3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />)}</div>
        <div className="lg:col-span-4 h-80 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    </main>
  );

  if (items.length === 0) return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center max-w-sm w-full">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <HugeiconsIcon icon={ShoppingBag01Icon} size={32} color="#d1d5db" strokeWidth={STROKE} />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-sm text-gray-500 mb-7">Browse our products and add something you love.</p>
        <Link href="/products" className="btn-primary inline-flex items-center gap-2 px-6 py-3">
          <HugeiconsIcon icon={ArrowLeft01Icon} size={14} color="white" strokeWidth={STROKE} /> Browse Products
        </Link>
      </div>
    </main>
  );

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {getTotalQty()} {getTotalQty() === 1 ? 'item' : 'items'}
              {syncStatus === 'syncing' && <span className="ml-2 text-gray-400 text-xs">· Saving…</span>}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => { clearCart(); toast.success('Cart cleared'); }} className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium">Clear all</button>
            <Link href="/products" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-red-500 transition-colors">
              <HugeiconsIcon icon={ArrowLeft01Icon} size={14} color="currentColor" strokeWidth={STROKE} /> Continue Shopping
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <section className="lg:col-span-8 space-y-4" aria-label="Cart items">
            {items.map(item => {
              const atMax = item.stock !== undefined && item.quantity >= item.stock;
              return (
                <article key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 flex gap-4 sm:gap-5 items-start">
                  <Link href={`/products/${item.id}`} className="flex-shrink-0">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-xl overflow-hidden">
                      <Image src={item.image} alt={item.name} fill className="object-contain p-2" sizes="96px" />
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/products/${item.id}`} className="text-sm font-semibold text-gray-900 hover:text-red-500 transition-colors line-clamp-2 leading-snug">{item.name}</Link>
                      <button onClick={() => { removeFromCart(item.id); toast.success('Item removed'); }} aria-label={`Remove ${item.name}`}
                        className="flex-shrink-0 p-1 text-gray-300 hover:text-red-500 transition-colors rounded-lg">
                        <HugeiconsIcon icon={Delete01Icon} size={15} color="currentColor" strokeWidth={STROKE} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">${item.price.toFixed(2)} each</p>
                    {item.stock !== undefined && item.stock < 5 && <p className="text-xs text-amber-500 font-medium mt-1">Only {item.stock} left in stock</p>}
                    <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity"
                          className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-red-500 transition-colors">
                          <HugeiconsIcon icon={MinusSignIcon} size={13} color="currentColor" strokeWidth={STROKE} />
                        </button>
                        <span className="w-10 text-center text-sm font-semibold text-gray-900 select-none">{item.quantity}</span>
                        <button onClick={() => { if (atMax) { toast.error(`Only ${item.stock} in stock`); return; } updateQuantity(item.id, item.quantity + 1); }}
                          aria-label="Increase quantity" disabled={atMax}
                          className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                          <HugeiconsIcon icon={PlusSignIcon} size={13} color="currentColor" strokeWidth={STROKE} />
                        </button>
                      </div>
                      <p className="text-sm font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          <aside className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24 space-y-5">
              <h2 className="text-base font-bold text-gray-900">Order Summary</h2>
              {!coupon ? (
                <div>
                  <label htmlFor="coupon" className="flex items-center gap-1 text-xs font-medium text-gray-500 mb-1.5">
                    <HugeiconsIcon icon={Tag01Icon} size={12} color="currentColor" strokeWidth={STROKE} /> Coupon code
                  </label>
                  <div className="flex gap-2">
                    <input id="coupon" type="text" value={couponInput} onChange={e => setCouponInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()} placeholder="e.g. WELCOME10"
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm placeholder-gray-400 outline-none focus:border-red-400 transition-colors" />
                    <button onClick={handleApplyCoupon} disabled={couponLoading || !couponInput.trim()}
                      className="px-4 py-2 bg-gray-900 hover:bg-red-500 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">
                      {couponLoading ? '…' : 'Apply'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">Try: WELCOME10 · SAVE20 · FLAT5</p>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-xs font-semibold text-green-700">{coupon.code}</p>
                    <p className="text-sm font-bold text-green-600">−${coupon.discount.toFixed(2)}</p>
                  </div>
                  <button onClick={() => { setCoupon(null); setCouponInput(''); }} aria-label="Remove coupon" className="text-green-400 hover:text-green-700 transition-colors">
                    <HugeiconsIcon icon={Cancel01Icon} size={16} color="currentColor" strokeWidth={STROKE} />
                  </button>
                </div>
              )}

              <div className="h-px bg-gray-100" />
              <div className="space-y-3 text-sm">
                <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
                {discount > 0 && <Row label="Discount" value={`−$${discount.toFixed(2)}`} className="text-green-600" />}
                <Row label="Shipping" value={shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`} valueClass={shipping === 0 ? 'text-green-600 font-semibold' : ''} />
                <Row label={`Tax (${(TAX_RATE*100).toFixed(0)}%)`} value={`$${tax.toFixed(2)}`} />
                {shipping > 0 && <p className="text-xs text-gray-400">Add ${(FREE_SHIPPING_THRESHOLD - afterDiscount).toFixed(2)} more for free shipping</p>}
              </div>
              <div className="h-px bg-gray-100" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Total</span>
                <span className="text-xl font-bold text-gray-900">${total.toFixed(2)}</span>
              </div>
              <button onClick={handleCheckout} disabled={checkoutLoading || items.length === 0}
                className="w-full flex items-center justify-center gap-2 py-4 bg-red-500 hover:bg-red-600 text-white font-bold text-sm rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]">
                {checkoutLoading
                  ? <><HugeiconsIcon icon={LoaderPinwheelIcon} size={15} color="white" strokeWidth={STROKE} className="animate-spin" />Redirecting…</>
                  : `Checkout · $${total.toFixed(2)}`}
              </button>
              {!session && (
                <p className="text-xs text-center text-gray-400">
                  <Link href="/sign-in" className="text-red-500 font-medium hover:underline">Sign in</Link> to save your cart and checkout
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Row({ label, value, className = '', valueClass = '' }: { label: string; value: string; className?: string; valueClass?: string; }) {
  return (
    <div className={`flex items-center justify-between text-gray-600 ${className}`}>
      <span>{label}</span>
      <span className={`font-medium text-gray-900 ${valueClass}`}>{value}</span>
    </div>
  );
}
