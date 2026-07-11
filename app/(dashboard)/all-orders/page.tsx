'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HugeiconsIcon } from '@hugeicons/react';
import { ShoppingCart01Icon, LoaderPinwheelIcon } from '@hugeicons/core-free-icons';

const STROKE = 1.5;

type OrderItem = { name: string; quantity: number; price: number };
type Order = {
  _id: string;
  userEmail: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
  couponCode?: string;
};

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_STYLES: Record<string, string> = {
  pending:    'border border-amber-300 text-amber-700',
  processing: 'border border-blue-300 text-blue-700',
  shipped:    'border border-purple-300 text-purple-700',
  delivered:  'border border-green-300 text-green-700',
  cancelled:  'border border-gray-300 text-gray-600',
};

export default function AllOrdersPage() {
  const [orders,   setOrders]   = useState<Order[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

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
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <HugeiconsIcon icon={ShoppingCart01Icon} size={22} color="#ef4444" strokeWidth={STROKE} />
        <h1 className="text-2xl font-bold text-gray-900">All Orders</h1>
        {!loading && (
          <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
            {orders.length}
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => <div key={i} className="h-24 bg-white animate-pulse rounded-2xl border border-gray-100" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center text-sm text-gray-500">
          No orders yet.
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 mb-0.5">Order ID</p>
                  <p className="font-mono text-sm font-bold text-gray-800 break-all">{order._id}</p>
                  <p className="text-sm text-gray-500 mt-1">{order.userEmail}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {order.createdAt ? new Date(order.createdAt).toLocaleString() : '—'}
                    {order.couponCode && (
                      <span className="ml-2 text-green-600 font-semibold">Coupon: {order.couponCode}</span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap sm:flex-shrink-0">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${STATUS_STYLES[order.status] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                    {order.status}
                  </span>
                  <span className="text-base font-bold text-gray-900">${(order.total ?? 0).toFixed(2)}</span>

                  <div className="relative">
                    {updating === order._id && (
                      <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                        <HugeiconsIcon icon={LoaderPinwheelIcon} size={12} color="#9ca3af" strokeWidth={STROKE} className="animate-spin" />
                      </div>
                    )}
                    <select
                      value={order.status}
                      onChange={e => updateStatus(order._id, e.target.value)}
                      disabled={updating === order._id}
                      className="text-sm border border-gray-200 rounded-xl px-3 py-1.5 pr-7 bg-white outline-none focus:border-red-400 disabled:opacity-50 cursor-pointer appearance-none"
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {order.items?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {order.items.map((item, i) => (
                    <span key={i} className="bg-gray-50 text-gray-600 text-xs px-3 py-1 rounded-lg border border-gray-100">
                      {item.name} ×{item.quantity}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
