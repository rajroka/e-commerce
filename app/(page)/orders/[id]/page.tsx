'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from '@/lib/auth-client';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon, ChevronRightIcon, Package01Icon } from '@hugeicons/core-free-icons';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const STROKE = 1.5;

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending:    'outline',
  confirmed:  'secondary',
  processing: 'secondary',
  shipped:    'secondary',
  delivered:  'default',
  cancelled:  'destructive',
};

const STATUS_COLOR: Record<string, string> = {
  pending:    'text-gray-500',
  confirmed:  'text-blue-500',
  processing: 'text-orange-500',
  shipped:    'text-yellow-500',
  delivered:  'text-green-500',
  cancelled:  'text-red-500',
};

const STEPS = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
const STATUS_STEP: Record<string, number> = {
  pending: 1, confirmed: 2, processing: 3, shipped: 4, delivered: 5, cancelled: 0,
};

export default function OrderDetailPage() {
  const { id }            = useParams<{ id: string }>();
  const router            = useRouter();
  const { data: session, isPending } = useSession();

  const [order,   setOrder]   = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    if (isPending) return;
    if (!session)  { router.push('/sign-in'); return; }

    fetch(`/api/orders/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) { setError(d.error); return; }
        setOrder(d.order);
      })
      .catch(() => setError('Failed to load order.'))
      .finally(() => setLoading(false));
  }, [id, session, isPending, router]);

  if (isPending || loading) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader2 size={28} className="animate-spin text-red-500" />
    </main>
  );

  if (error) return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 px-4">
      <div className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center">
        <HugeiconsIcon icon={Package01Icon} size={24} color="#9ca3af" strokeWidth={STROKE} />
      </div>
      <p className="text-sm font-semibold text-gray-700">{error}</p>
      <Link href="/profile?tab=orders" className="text-sm text-red-500 hover:underline font-medium">
        ← Back to Orders
      </Link>
    </main>
  );

  if (!order) return null;

  const step     = STATUS_STEP[order.status] ?? 1;
  const total    = order.total    ?? 0;
  const subtotal = order.subtotal ?? total;
  const discount = order.discount ?? 0;
  const tax      = parseFloat(((subtotal - discount) * 0.08).toFixed(2));

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-red-500 transition-colors">Home</Link>
          <HugeiconsIcon icon={ChevronRightIcon} size={12} color="currentColor" strokeWidth={STROKE} />
          <Link href="/profile?tab=orders" className="hover:text-red-500 transition-colors">My Orders</Link>
          <HugeiconsIcon icon={ChevronRightIcon} size={12} color="currentColor" strokeWidth={STROKE} />
          <span className="text-gray-600 font-medium">#{order._id.slice(-8).toUpperCase()}</span>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Order Details</h1>
            <p className="text-xs text-gray-400 mt-0.5 font-mono">#{order._id.slice(-12).toUpperCase()}</p>
          </div>
          <Badge variant={STATUS_VARIANT[order.status] ?? 'outline'} className="capitalize text-sm px-3 py-1">
            {order.status}
          </Badge>
        </div>

        <div className="space-y-4">

          {/* Progress tracker */}
          {order.status !== 'cancelled' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-5">Order Progress</p>
              <div className="flex">
                {STEPS.map((s, i) => {
                  const active = step > i;
                  return (
                    <div key={s} className="flex-1 flex flex-col items-center gap-2">
                      <div className="flex items-center w-full">
                        {i > 0 && <div className={`flex-1 h-0.5 ${active ? 'bg-red-400' : 'bg-gray-200'}`} />}
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 text-xs font-bold
                          ${active ? 'bg-red-500 border-red-500 text-white' : 'border-gray-200 bg-white text-gray-400'}`}>
                          {active ? '✓' : i + 1}
                        </div>
                        {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${step > i + 1 ? 'bg-red-400' : 'bg-gray-200'}`} />}
                      </div>
                      <span className="text-[11px] text-gray-500 text-center leading-tight">{s}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ordered items */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Items ({order.items.length})
            </p>
            <div className="divide-y divide-gray-50">
              {order.items.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                  <Link href={`/products/${item.productId}`}>
                    <div className="relative w-14 h-14 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                      <Image src={item.image} alt={item.name} fill className="object-contain p-1" sizes="56px" />
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400">×{item.quantity}</span>
                      {(item.color || item.size) && (
                        <span className="text-xs text-gray-400">· {[item.color, item.size].filter(Boolean).join(' / ')}</span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-900 flex-shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-2.5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Order Summary</p>
            {[
              { label: 'Subtotal',                          value: `$${subtotal.toFixed(2)}` },
              discount > 0 ? { label: `Discount${order.couponCode ? ` (${order.couponCode})` : ''}`, value: `−$${discount.toFixed(2)}`, green: true } : null,
              { label: 'Tax (8%)',                          value: `$${tax.toFixed(2)}` },
            ].filter(Boolean).map((row: any) => (
              <div key={row.label} className={`flex justify-between text-sm ${row.green ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                <span>{row.label}</span><span>{row.value}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm font-bold text-gray-900 pt-2.5 border-t border-gray-100">
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Shipping address */}
          {order.shippingAddress && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Delivery Address</p>
              <div className="text-sm space-y-0.5">
                <p className="font-semibold text-gray-900">{order.shippingAddress.name}</p>
                <p className="text-gray-500">{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && <p className="text-gray-500">{order.shippingAddress.line2}</p>}
                <p className="text-gray-500">
                  {[order.shippingAddress.city, order.shippingAddress.state, order.shippingAddress.postalCode].filter(Boolean).join(', ')}
                </p>
                <p className="text-gray-500">{order.shippingAddress.country}</p>
              </div>
            </div>
          )}

          {/* Order meta */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Order Info</p>
            <div className="space-y-1.5 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Order ID</span>
                <span className="font-mono text-xs text-gray-500">#{order._id.slice(-12).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span>Placed on</span>
                <span>{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex justify-between">
                <span>Order Status</span>
                <span className={`font-semibold capitalize ${STATUS_COLOR[order.status] ?? 'text-gray-700'}`}>{order.status}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment</span>
                {order.paymentMethod === 'cod'
                  ? <span className="font-semibold text-amber-600">COD · Unpaid</span>
                  : <span className="font-semibold text-green-600">Online · Paid</span>
                }
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Link href="/profile?tab=orders"
              className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-full hover:border-gray-400 transition-colors">
              <HugeiconsIcon icon={ArrowLeft01Icon} size={14} color="currentColor" strokeWidth={STROKE} />
              My Orders
            </Link>
            <Link href="/products"
              className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-full transition-colors">
              Keep Shopping
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
