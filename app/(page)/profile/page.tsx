'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FiPackage, FiUser, FiMail, FiClock } from 'react-icons/fi';

type OrderItem = { productId: string; name: string; image: string; price: number; quantity: number };
type Order = {
  _id: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
  couponCode?: string;
  discount?: number;
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session) router.push('/sign-in');
  }, [isPending, session, router]);

  useEffect(() => {
    if (!session) return;
    fetch('/api/orders')
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? []))
      .finally(() => setLoading(false));
  }, [session]);

  if (isPending || !session) {
    return <div className="min-h-screen bg-[#F9F4F5] flex items-center justify-center"><div className="w-8 h-8 border-2 border-gray-800 border-t-transparent rounded-full animate-spin" /></div>;
  }

  const user = session.user;

  return (
    <main className="min-h-screen bg-[#F9F4F5] py-12 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Profile Card */}
        <section className="bg-white border border-gray-100 shadow-sm p-8 flex items-center gap-6">
          {user.image ? (
            <Image src={user.image} alt={user.name ?? 'User'} width={80} height={80} className="rounded-full border-2 border-gray-200" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
              <FiUser size={32} className="text-gray-500" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-900">{user.name ?? 'My Account'}</h1>
            <p className="flex items-center gap-2 text-sm text-gray-500 mt-1"><FiMail size={14} />{user.email}</p>
            <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-gray-100 text-gray-700 rounded">
              {(user as any).role ?? 'user'}
            </span>
          </div>
        </section>

        {/* Order History */}
        <section>
          <h2 className="text-lg font-black uppercase tracking-tighter text-gray-900 mb-4 flex items-center gap-2">
            <FiPackage /> Order History
          </h2>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-24 bg-white animate-pulse rounded border border-gray-100" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white border border-gray-100 shadow-sm p-12 text-center">
              <FiPackage size={40} className="mx-auto text-gray-300 mb-4" />
              <p className="text-sm text-gray-500 uppercase tracking-widest">No orders yet</p>
              <Link href="/products" className="inline-block mt-4 px-6 py-3 bg-gray-800 text-white text-sm font-bold uppercase tracking-widest hover:bg-black transition rounded">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="bg-white border border-gray-100 shadow-sm p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-widest">Order ID</p>
                      <p className="text-sm font-bold text-gray-900 font-mono">{order._id}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
                        {order.status}
                      </span>
                      <span className="text-sm font-black text-gray-900">${order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="flex flex-wrap gap-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded">
                        <Image src={item.image} alt={item.name} width={36} height={36} className="object-contain rounded" />
                        <div>
                          <p className="text-xs font-bold text-gray-800 line-clamp-1 max-w-[120px]">{item.name}</p>
                          <p className="text-[10px] text-gray-500">×{item.quantity} · ${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 mt-4 text-[11px] text-gray-400">
                    <FiClock size={12} />
                    {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    {order.couponCode && <span className="ml-2 text-green-600 font-bold">Coupon: {order.couponCode} (−${order.discount?.toFixed(2)})</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
