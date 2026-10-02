'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  MinusSignIcon, PlusSignIcon, Delete01Icon, ArrowLeft01Icon,
  ShoppingBag01Icon, Tag01Icon, Cancel01Icon, LoaderPinwheelIcon,
  Location01Icon,
} from '@hugeicons/core-free-icons';
import { useCartStore } from '@/store/cartStore';
import { useSession } from '@/lib/auth-client';

const STROKE = 1.5;
const FREE_SHIPPING_THRESHOLD = 50;
const TAX_RATE = 0.08;

type Address = {
  fullName: string; line1: string; line2: string;
  city: string; state: string; postalCode: string; country: string;
};
const EMPTY_ADDRESS: Address = { fullName: '', line1: '', line2: '', city: '', state: '', postalCode: '', country: '' };
const inp = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm placeholder-gray-400 bg-white outline-none transition-colors';

/* ── Review Modal ─────────────────────────────────────────────────────────── */
function ReviewModal({ items, address, subtotal, discount, total, coupon, onConfirm, onCancel, loading }: {
  items: any[]; address: Address; subtotal: number; discount: number;
  total: number; coupon: any; onConfirm: () => void; onCancel: () => void; loading: boolean;
}) {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={onCancel} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Review Order</h2>
            <button onClick={onCancel} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg">✕</button>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Items</p>
              <div className="space-y-2">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                    <div className="relative w-10 h-10 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="40px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 line-clamp-1">{item.name}</p>
                      <p className="text-[11px] text-gray-400">×{item.quantity}</p>
                    </div>
                    <p className="text-xs font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Delivery Address</p>
              <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 space-y-0.5">
                <p className="font-semibold text-gray-900">{address.fullName}</p>
                <p>{address.line1}{address.line2 ? `, ${address.line2}` : ''}</p>
                <p>{[address.city, address.state, address.postalCode].filter(Boolean).join(', ')}</p>
                <p>{address.country}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <span className="text-base">💵</span>
              <div>
                <p className="text-xs font-bold text-amber-700">Cash on Delivery</p>
                <p className="text-[11px] text-amber-600">Pay when your order arrives</p>
              </div>
            </div>
            <div className="space-y-1.5 text-sm border-t border-gray-100 pt-3">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount{coupon?.code ? ` (${coupon.code})` : ''}</span>
                  <span>−${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-900 pt-1.5 border-t border-gray-100">
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button onClick={onConfirm} disabled={loading}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-full transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {loading
                ? <><HugeiconsIcon icon={LoaderPinwheelIcon} size={15} color="white" strokeWidth={STROKE} className="animate-spin" />Placing…</>
                : '✓ Confirm & Place Order'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Main Page ───────────────────────────────────────────────────────────── */
export default function CartPage() {
  const { data: session } = useSession();
  const items          = useCartStore(s => s.items);
  const updateQuantity = useCartStore(s => s.updateQuantity);
  const removeFromCart = useCartStore(s => s.removeFromCart);
  const clearCart      = useCartStore(s => s.clearCart);
  const syncStatus     = useCartStore(s => s.syncStatus);
  const getTotalQty    = useCartStore(s => s.getTotalQuantity);

  const [selected,        setSelected]        = useState<Set<string>>(new Set());
  const [couponInput,     setCouponInput]     = useState('');
  const [couponLoading,   setCouponLoading]   = useState(false);
  const [coupon,          setCoupon]          = useState<{ code: string; discount: number; newTotal: number } | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [ready,           setReady]           = useState(false);
  const [address,         setAddress]         = useState<Address>(EMPTY_ADDRESS);
  const [addrOpen,        setAddrOpen]        = useState(false);
  const [paymentMethod,   setPaymentMethod]   = useState<'online' | 'cod'>('online');
  const [showReview,      setShowReview]      = useState(false);
  const [placingCod,      setPlacingCod]      = useState(false);
  const checkoutRef = useRef(false);

  // Select all by default when items load
  useEffect(() => { setReady(true); }, []);
  useEffect(() => {
    setSelected(new Set(items.map(i => i.id)));
    setCoupon(null);
  }, [items.length]);

  const selectedItems  = items.filter(i => selected.has(i.id));
  const subtotal       = selectedItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount       = coupon?.discount ?? 0;
  const afterDiscount  = Math.max(0, subtotal - discount);
  const shipping       = afterDiscount >= FREE_SHIPPING_THRESHOLD || afterDiscount === 0 ? 0 : 5.99;
  const tax            = parseFloat((afterDiscount * TAX_RATE).toFixed(2));
  const total          = parseFloat((afterDiscount + shipping + tax).toFixed(2));
  const allSelected    = items.length > 0 && items.every(i => selected.has(i.id));

  const toggleItem = (id: string) =>
    setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(items.map(i => i.id)));

  const isAddressFilled = address.fullName.trim() && address.line1.trim() && address.city.trim() && address.country.trim();
  const setField = (k: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setAddress(prev => ({ ...prev, [k]: e.target.value }));

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
    if (!session)              { toast.error('Please sign in to checkout'); return; }
    if (selectedItems.length === 0) { toast.error('Please select at least one item'); return; }
    if (!isAddressFilled)      { setAddrOpen(true); toast.error('Please fill in your delivery address'); return; }
    if (paymentMethod === 'cod') { setShowReview(true); return; }

    checkoutRef.current = true;
    setCheckoutLoading(true);
    const checkoutItems = selectedItems.map(i => ({ id: i.id, name: i.name, image: i.image, price: i.price, quantity: i.quantity }));
    try {
      const res  = await fetch('/api/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems: checkoutItems, couponCode: coupon?.code ?? null, discount, shippingAddress: address }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? 'Checkout failed.'); return; }
      if (data.url) { clearCart(); window.location.href = data.url; return; }
      toast.error('No checkout URL returned.');
    } catch { toast.error('Network error.'); }
    finally { checkoutRef.current = false; setCheckoutLoading(false); }
  };

  const handleCodConfirm = async () => {
    setPlacingCod(true);
    const checkoutItems = selectedItems.map(i => ({ id: i.id, name: i.name, image: i.image, price: i.price, quantity: i.quantity }));
    try {
      const res  = await fetch('/api/orders/cod', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems: checkoutItems, couponCode: coupon?.code ?? null, discount, shippingAddress: address }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? 'Failed to place order.'); return; }
      // Remove only the ordered items from cart
      selectedItems.forEach(i => removeFromCart(i.id));
      window.location.href = `/success/cod?order_id=${data.orderId}`;
    } catch { toast.error('Network error.'); }
    finally { setPlacingCod(false); }
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
      {showReview && (
        <ReviewModal
          items={selectedItems} address={address} subtotal={subtotal}
          discount={discount} total={total} coupon={coupon}
          loading={placingCod} onConfirm={handleCodConfirm} onCancel={() => setShowReview(false)}
        />
      )}

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

          {/* ── Left: items + address ── */}
          <div className="lg:col-span-8 space-y-4">

            {/* Select all row */}
            <div className="flex items-center gap-3 px-1">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                id="select-all"
                className="w-4 h-4 accent-red-500 cursor-pointer rounded"
              />
              <label htmlFor="select-all" className="text-sm font-medium text-gray-600 cursor-pointer select-none">
                Select All ({items.length})
              </label>
              {selected.size > 0 && selected.size < items.length && (
                <span className="text-xs text-gray-400">{selected.size} selected</span>
              )}
            </div>

            {/* Cart items */}
            <section aria-label="Cart items" className="space-y-3">
              {items.map(item => {
                const atMax    = item.stock !== undefined && item.quantity >= item.stock;
                const isChosen = selected.has(item.id);
                return (
                  <article key={item.id} className={`bg-white rounded-2xl border shadow-sm p-4 sm:p-5 flex gap-3 sm:gap-4 items-start transition-all ${isChosen ? 'border-gray-100' : 'border-gray-100 opacity-50'}`}>

                    {/* Checkbox */}
                    <div className="flex items-center pt-1 flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={isChosen}
                        onChange={() => toggleItem(item.id)}
                        className="w-4 h-4 accent-red-500 cursor-pointer rounded"
                        aria-label={`Select ${item.name}`}
                      />
                    </div>

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
                      {(item.color || item.size) && (
                        <p className="text-xs text-gray-500 mt-0.5">{[item.color, item.size].filter(Boolean).join(' · ')}</p>
                      )}
                      {item.stock !== undefined && item.stock < 5 && <p className="text-xs text-amber-500 font-medium mt-1">Only {item.stock} left</p>}
                      <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Decrease"
                            className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-red-500 transition-colors">
                            <HugeiconsIcon icon={MinusSignIcon} size={13} color="currentColor" strokeWidth={STROKE} />
                          </button>
                          <span className="w-10 text-center text-sm font-semibold text-gray-900 select-none">{item.quantity}</span>
                          <button onClick={() => { if (atMax) { toast.error(`Only ${item.stock} in stock`); return; } updateQuantity(item.id, item.quantity + 1); }}
                            aria-label="Increase" disabled={atMax}
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

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <button onClick={() => setAddrOpen(o => !o)} className="w-full flex items-center justify-between px-5 py-4 text-left">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={Location01Icon} size={16} color="#ef4444" strokeWidth={STROKE} />
                  <span className="text-sm font-bold text-gray-900">Delivery Address</span>
                  {isAddressFilled
                    ? <span className="text-[10px] font-semibold text-green-600 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">✓ Saved</span>
                    : <span className="text-[10px] font-semibold text-red-500 bg-red-50 border border-red-200 rounded-full px-2 py-0.5">Required</span>
                  }
                </div>
                <span className="text-gray-400 text-xs">{addrOpen ? '▲' : '▼'}</span>
              </button>
              {addrOpen && (
                <div className="px-5 pb-5 space-y-3 border-t border-gray-100">
                  <div className="pt-4">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Full Name <span className="text-red-400">*</span></label>
                    <input value={address.fullName} onChange={setField('fullName')} placeholder="Jane Smith" className={inp} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Address Line 1 <span className="text-red-400">*</span></label>
                    <input value={address.line1} onChange={setField('line1')} placeholder="123 Main Street" className={inp} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Address Line 2 <span className="text-gray-400">(optional)</span></label>
                    <input value={address.line2} onChange={setField('line2')} placeholder="Apt, Suite, Floor…" className={inp} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">City <span className="text-red-400">*</span></label>
                      <input value={address.city} onChange={setField('city')} placeholder="New York" className={inp} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">State / Province</label>
                      <input value={address.state} onChange={setField('state')} placeholder="NY" className={inp} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Postal Code</label>
                      <input value={address.postalCode} onChange={setField('postalCode')} placeholder="10001" className={inp} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Country <span className="text-red-400">*</span></label>
                      <input value={address.country} onChange={setField('country')} placeholder="United States" className={inp} />
                    </div>
                  </div>
                  {isAddressFilled && (
                    <button type="button" onClick={() => setAddrOpen(false)}
                      className="w-full py-2.5 bg-gray-900 hover:bg-red-500 text-white text-sm font-semibold rounded-xl transition-colors">
                      Save Address
                    </button>
                  )}
                </div>
              )}
              {!addrOpen && isAddressFilled && (
                <div className="px-5 pb-4 text-xs text-gray-500 space-y-0.5 border-t border-gray-50">
                  <p className="font-semibold text-gray-700 pt-3">{address.fullName}</p>
                  <p>{address.line1}{address.line2 ? `, ${address.line2}` : ''}</p>
                  <p>{[address.city, address.state, address.postalCode].filter(Boolean).join(', ')}</p>
                  <p>{address.country}</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: summary ── */}
          <aside className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900">Order Summary</h2>
                {selectedItems.length < items.length && (
                  <span className="text-xs text-red-500 font-semibold">{selectedItems.length} of {items.length} selected</span>
                )}
              </div>

              {/* Coupon */}
              {!coupon ? (
                <div>
                  <label htmlFor="coupon" className="flex items-center gap-1 text-xs font-medium text-gray-500 mb-1.5">
                    <HugeiconsIcon icon={Tag01Icon} size={12} color="currentColor" strokeWidth={STROKE} /> Coupon code
                  </label>
                  <div className="flex gap-2">
                    <input id="coupon" type="text" value={couponInput} onChange={e => setCouponInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()} placeholder="e.g. WELCOME10"
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm placeholder-gray-400 outline-none transition-colors" />
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
                  <button onClick={() => { setCoupon(null); setCouponInput(''); }} className="text-green-400 hover:text-green-700 transition-colors">
                    <HugeiconsIcon icon={Cancel01Icon} size={16} color="currentColor" strokeWidth={STROKE} />
                  </button>
                </div>
              )}

              <div className="h-px bg-gray-100" />
              <div className="space-y-3 text-sm">
                <Row label={`Subtotal (${selectedItems.length} item${selectedItems.length !== 1 ? 's' : ''})`} value={`$${subtotal.toFixed(2)}`} />
                {discount > 0 && <Row label="Discount" value={`−$${discount.toFixed(2)}`} className="text-green-600" />}
                <Row label="Shipping" value={shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`} valueClass={shipping === 0 ? 'text-green-600 font-semibold' : ''} />
                <Row label={`Tax (${(TAX_RATE * 100).toFixed(0)}%)`} value={`$${tax.toFixed(2)}`} />
                {shipping > 0 && <p className="text-xs text-gray-400">Add ${(FREE_SHIPPING_THRESHOLD - afterDiscount).toFixed(2)} more for free shipping</p>}
              </div>
              <div className="h-px bg-gray-100" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Total</span>
                <span className="text-xl font-bold text-gray-900">${total.toFixed(2)}</span>
              </div>

              {!isAddressFilled && (
                <button onClick={() => setAddrOpen(true)}
                  className="w-full py-2 border border-dashed border-red-300 text-red-500 text-xs font-semibold rounded-xl hover:bg-red-50 transition-colors">
                  ↑ Add delivery address first
                </button>
              )}

              {/* Payment method */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">Payment Method</p>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setPaymentMethod('online')}
                    className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 text-xs font-semibold transition-all ${paymentMethod === 'online' ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                    <span className="text-lg">💳</span>Online
                  </button>
                  <button onClick={() => setPaymentMethod('cod')}
                    className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 text-xs font-semibold transition-all ${paymentMethod === 'cod' ? 'border-amber-500 bg-amber-50 text-amber-600' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                    <span className="text-lg">💵</span>Cash on Delivery
                  </button>
                </div>
                {paymentMethod === 'cod' && <p className="text-[11px] text-amber-600 mt-1.5 text-center">Pay when your order arrives</p>}
              </div>

              <button onClick={handleCheckout}
                disabled={checkoutLoading || selectedItems.length === 0}
                className={`w-full flex items-center justify-center gap-2 py-4 text-white font-bold text-sm rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] ${paymentMethod === 'cod' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-red-500 hover:bg-red-600'}`}>
                {checkoutLoading
                  ? <><HugeiconsIcon icon={LoaderPinwheelIcon} size={15} color="white" strokeWidth={STROKE} className="animate-spin" />Processing…</>
                  : paymentMethod === 'cod'
                    ? `Place Order · $${total.toFixed(2)}`
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

function Row({ label, value, className = '', valueClass = '' }: { label: string; value: string; className?: string; valueClass?: string }) {
  return (
    <div className={`flex items-center justify-between text-gray-600 ${className}`}>
      <span>{label}</span>
      <span className={`font-medium text-gray-900 ${valueClass}`}>{value}</span>
    </div>
  );
}
