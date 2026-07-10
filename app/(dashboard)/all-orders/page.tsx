'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiPackage } from 'react-icons/fi';

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
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function AllOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/orders')
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? []))
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
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status } : o)));
      toast.success('Order status updated');
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FiPackage /> Order Management
      </h1>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => <div key={i} className="h-20 bg-white animate-pulse rounded-lg" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {orders.length === 0 && (
            <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">No orders yet.</div>
          )}
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">Order ID</p>
                  <p className="font-mono text-sm font-bold text-gray-800">{order._id}</p>
                  <p className="text-sm text-gray-500 mt-1">{order.userEmail}</p>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
                    {order.status}
                  </span>
                  <span className="text-lg font-black text-gray-900">${order.total.toFixed(2)}</span>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    disabled={updating === order._id}
                    className="text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-gray-500 disabled:opacity-50"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {order.items.map((item, i) => (
                  <span key={i} className="bg-gray-50 text-gray-700 text-xs px-3 py-1 rounded border border-gray-100">
                    {item.name} ×{item.quantity}
                  </span>
                ))}
              </div>

              <p className="text-xs text-gray-400 mt-3">
                {new Date(order.createdAt).toLocaleString()}
                {order.couponCode && <span className="ml-3 text-green-600 font-bold">Coupon: {order.couponCode}</span>}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
