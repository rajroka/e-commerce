'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Loader2, ChevronDown, ChevronUp, Package } from 'lucide-react';

type OrderItem = {
  productId: string;
  name:      string;
  image:     string;
  quantity:  number;
  price:     number;
  color?:    string | null;
  size?:     string | null;
};

type Order = {
  _id:             string;
  userEmail:       string;
  items:           OrderItem[];
  total:           number;
  subtotal:        number;
  discount:        number;
  status:          string;
  paymentMethod?:  'stripe' | 'cod';
  createdAt:       string;
  couponCode?:     string;
  shippingAddress?: {
    name: string; line1: string; city: string; country: string;
  };
};

const STATUS_OPTIONS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending:    'outline',
  confirmed:  'secondary',
  processing: 'secondary',
  shipped:    'secondary',
  delivered:  'default',
  cancelled:  'destructive',
};

const STEPS = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
const STATUS_STEP: Record<string, number> = {
  pending: 1, confirmed: 2, processing: 3, shipped: 4, delivered: 5, cancelled: 0,
};

export default function AllOrdersPage() {
  const [orders,   setOrders]   = useState<Order[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search,   setSearch]   = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetch('/api/admin/orders')
      .then(r => r.json())
      .then(d => setOrders(d.orders ?? []))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = orders.filter(o => {
    const q = search.trim().toLowerCase();
    const matchSearch = !q ||
      o.userEmail.toLowerCase().includes(q) ||
      o._id.toLowerCase().includes(q) ||
      o.items.some(i => i.name.toLowerCase().includes(q));
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  if (loading) return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
    </div>
  );

  return (
    <div className="space-y-4">

      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by email, order ID, or product…"
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none placeholder-gray-400 bg-white"
        />
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-44 h-9 text-sm">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-sm">All statuses</SelectItem>
            {STATUS_OPTIONS.map(s => (
              <SelectItem key={s} value={s} className="capitalize text-sm">
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary */}
      <p className="text-xs text-gray-400">
        {filtered.length} of {orders.length} order{orders.length !== 1 ? 's' : ''}
        {search || filterStatus !== 'all' ? ' (filtered)' : ''}
      </p>

      {/* Empty state */}
      {filtered.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center space-y-3">
            <Package size={36} className="text-gray-300 mx-auto" />
            <p className="text-sm text-muted-foreground">
              {orders.length === 0 ? 'No orders yet.' : 'No orders match your search.'}
            </p>
          </CardContent>
        </Card>
      )}

      {filtered.map(order => {
        const open     = expanded === order._id;
        const step     = STATUS_STEP[order.status] ?? 1;
        const total    = order.total    ?? 0;
        const subtotal = order.subtotal ?? total;
        const discount = order.discount ?? 0;
        const tax      = parseFloat(((subtotal - discount) * 0.08).toFixed(2));

        return (
          <Card key={order._id} className="overflow-hidden">

            {/* ── Header row ── */}
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                {/* Left: ID + customer */}
                <button
                  onClick={() => setExpanded(open ? null : order._id)}
                  className="min-w-0 text-left flex-1"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-gray-500">
                      #{order._id.slice(-8).toUpperCase()}
                    </span>
                    <Badge variant={STATUS_VARIANT[order.status] ?? 'outline'} className="capitalize text-[11px]">
                      {order.status}
                    </Badge>
                    {order.paymentMethod === 'cod'
                      ? <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">💵 COD</span>
                      : <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-2 py-0.5">💳 Online</span>
                    }
                  </div>
                  <p className="text-sm font-medium text-gray-800 mt-0.5 truncate">{order.userEmail}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {order.createdAt ? new Date(order.createdAt).toLocaleString() : '—'}
                    {order.couponCode && (
                      <span className="ml-2 text-green-600 font-semibold">· {order.couponCode}</span>
                    )}
                  </p>
                </button>

                {/* Right: total + status dropdown + expand */}
                <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
                  <span className="text-base font-bold text-gray-900">${total.toFixed(2)}</span>

                  <div className="relative">
                    {updating === order._id && (
                      <div className="absolute inset-y-0 right-8 flex items-center pointer-events-none z-10">
                        <Loader2 size={12} className="animate-spin text-muted-foreground" />
                      </div>
                    )}
                    <Select
                      value={order.status}
                      onValueChange={val => updateStatus(order._id, val)}
                      disabled={updating === order._id}
                    >
                      <SelectTrigger className="w-36 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map(s => (
                          <SelectItem key={s} value={s} className="capitalize text-xs">
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <button
                    onClick={() => setExpanded(open ? null : order._id)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
                    aria-label={open ? 'Collapse' : 'Expand'}
                  >
                    {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>

              {/* Item badges — always visible */}
              {order.items?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {order.items.map((item, i) => (
                    <Badge key={i} variant="secondary" className="font-normal text-[11px]">
                      {item.name} ×{item.quantity}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>

            {/* ── Expanded detail panel ── */}
            {open && (
              <div className="border-t border-gray-100 bg-gray-50 px-5 py-5 space-y-5">

                {/* Progress tracker */}
                {order.status !== 'cancelled' && (
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-3">Progress</p>
                    <div className="flex">
                      {STEPS.map((s, i) => {
                        const active = step > i;
                        return (
                          <div key={s} className="flex-1 flex flex-col items-center gap-1.5">
                            <div className="flex items-center w-full">
                              {i > 0 && <div className={`flex-1 h-0.5 ${active ? 'bg-red-400' : 'bg-gray-200'}`} />}
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border-2 text-[10px] font-bold
                                ${active ? 'bg-red-500 border-red-500 text-white' : 'border-gray-200 bg-white text-gray-400'}`}>
                                {active ? '✓' : i + 1}
                              </div>
                              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${step > i + 1 ? 'bg-red-400' : 'bg-gray-200'}`} />}
                            </div>
                            <span className="text-[10px] text-gray-400 text-center">{s}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Items with images */}
                <div>
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-3">
                    Items ({order.items.length})
                  </p>
                  <div className="space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-3">
                        {item.image && (
                          <Link href={`/products/${item.productId}`} target="_blank">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                              <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                            </div>
                          </Link>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</p>
                          <p className="text-xs text-gray-400">
                            ×{item.quantity}
                            {item.color && <span className="ml-1">· {item.color}</span>}
                            {item.size  && <span className="ml-1">· {item.size}</span>}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-gray-900 flex-shrink-0">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals + shipping side by side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* Order totals */}
                  <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-2">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-3">Summary</p>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600 font-medium">
                        <span>Discount{order.couponCode ? ` (${order.couponCode})` : ''}</span>
                        <span>−${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Tax (8%)</span><span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-100">
                      <span>Total</span><span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                      <span className="text-gray-500">Payment</span>
                      {order.paymentMethod === 'cod'
                        ? <span className="font-semibold text-amber-600">💵 Cash on Delivery</span>
                        : <span className="font-semibold text-blue-600">💳 Online (Paid)</span>
                      }
                    </div>
                  </div>

                  {/* Shipping address */}
                  <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-3">Ship To</p>
                    {order.shippingAddress ? (
                      <div className="text-sm text-gray-700 space-y-0.5">
                        <p className="font-semibold">{order.shippingAddress.name}</p>
                        <p className="text-gray-500">{order.shippingAddress.line1}</p>
                        <p className="text-gray-500">{order.shippingAddress.city}, {order.shippingAddress.country}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400">No address on record</p>
                    )}
                  </div>
                </div>

              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
