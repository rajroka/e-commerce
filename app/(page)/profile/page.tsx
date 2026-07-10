'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { signOut } from '@/lib/auth-client';
import {
  FiPackage, FiUser, FiMail, FiClock,
  FiHeart, FiShoppingCart, FiLogOut,
  FiChevronRight, FiHome, FiShield,
} from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

// ─── Types ────────────────────────────────────────────────────────────────────
type OrderItem = {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

type Order = {
  _id: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
  couponCode?: string;
  discount?: number;
};

// ─── Status styling ───────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
  pending:    { bg: 'bg-amber-50',   text: 'text-amber-700',  dot: 'bg-amber-400' },
  processing: { bg: 'bg-blue-50',    text: 'text-blue-700',   dot: 'bg-blue-400' },
  shipped:    { bg: 'bg-purple-50',  text: 'text-purple-700', dot: 'bg-purple-400' },
  delivered:  { bg: 'bg-green-50',   text: 'text-green-700',  dot: 'bg-green-400' },
  cancelled:  { bg: 'bg-red-50',     text: 'text-red-700',    dot: 'bg-red-400' },
};

const defaultStatus = { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-400' };

// ─── Sidebar nav items ────────────────────────────────────────────────────────
type SideTab = 'overview' | 'orders' | 'wishlist' | 'settings';

const SIDE_ITEMS: { id: SideTab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview',  label: 'Overview',    icon: <FiHome size={16} /> },
  { id: 'orders',    label: 'My Orders',   icon: <FiPackage size={16} /> },
  { id: 'wishlist',  label: 'Wishlist',    icon: <FiHeart size={16} /> },
  { id: 'settings',  label: 'Settings',    icon: <FiShield size={16} /> },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [orders,  setOrders]  = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState<SideTab>('overview');

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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user       = session.user;
  const role       = (user as any).role ?? 'user';
  const totalSpent = orders.reduce((s, o) => s + o.total, 0);
  const delivered  = orders.filter((o) => o.status === 'delivered').length;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Top bar ── */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-red-500 font-bold text-lg">
          GG Shop
        </Link>
        <nav className="flex items-center gap-1 text-xs text-gray-400">
          <Link href="/" className="hover:text-red-500 transition-colors">Home</Link>
          <FiChevronRight size={12} />
          <span className="text-gray-700 font-medium">Profile</span>
        </nav>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 flex flex-col lg:flex-row gap-6">

        {/* ════════════════════════════════════
            LEFT SIDEBAR
        ════════════════════════════════════ */}
        <aside className="lg:w-64 flex-shrink-0 flex flex-col gap-4">

          {/* Avatar card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center gap-3">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name ?? 'User'}
                width={80}
                height={80}
                className="rounded-full ring-4 ring-red-100"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-red-50 ring-4 ring-red-100 flex items-center justify-center">
                <FiUser size={32} className="text-red-400" />
              </div>
            )}

            <div>
              <p className="font-bold text-gray-900 text-base leading-tight">
                {user.name ?? 'My Account'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
            </div>

            <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
              role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'
            }`}>
              {role}
            </span>
          </div>

          {/* Sidebar nav */}
          <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {SIDE_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-l-2 ${
                  tab === item.id
                    ? 'border-red-500 bg-red-50 text-red-600'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.icon}
                {item.label}
                {tab === item.id && <FiChevronRight size={14} className="ml-auto text-red-400" />}
              </button>
            ))}

            <div className="h-px bg-gray-100 mx-4" />

            <button
              onClick={async () => {
                await signOut({ fetchOptions: { onSuccess: () => router.push('/sign-in') } });
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
            >
              <FiLogOut size={16} />
              Sign Out
            </button>
          </nav>
        </aside>

        {/* ════════════════════════════════════
            MAIN CONTENT
        ════════════════════════════════════ */}
        <main className="flex-1 min-w-0 flex flex-col gap-6">

          {/* ── Overview ── */}
          {tab === 'overview' && (
            <>
              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <StatCard
                  icon={<FiPackage size={20} className="text-red-500" />}
                  label="Total Orders"
                  value={orders.length}
                  bg="bg-red-50"
                />
                <StatCard
                  icon={<FaStar size={18} className="text-amber-400" />}
                  label="Delivered"
                  value={delivered}
                  bg="bg-amber-50"
                />
                <StatCard
                  icon={<FiShoppingCart size={20} className="text-green-500" />}
                  label="Total Spent"
                  value={`$${totalSpent.toFixed(2)}`}
                  bg="bg-green-50"
                  className="col-span-2 sm:col-span-1"
                />
              </div>

              {/* Recent orders preview */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                  <h2 className="font-semibold text-gray-900 text-sm">Recent Orders</h2>
                  <button
                    onClick={() => setTab('orders')}
                    className="text-xs text-red-500 font-semibold hover:underline"
                  >
                    View All →
                  </button>
                </div>

                {loading ? (
                  <div className="p-6 space-y-3">
                    {[1, 2].map((i) => <SkeletonRow key={i} />)}
                  </div>
                ) : orders.length === 0 ? (
                  <EmptyOrders />
                ) : (
                  <div className="divide-y divide-gray-50">
                    {orders.slice(0, 3).map((o) => (
                      <OrderRow key={o._id} order={o} />
                    ))}
                  </div>
                )}
              </div>

              {/* Quick links */}
              <div className="grid grid-cols-2 gap-4">
                <QuickLink
                  href="/products"
                  icon={<FiShoppingCart size={20} className="text-red-500" />}
                  label="Browse Products"
                  sub="Discover new arrivals"
                  bg="bg-red-50"
                />
                <QuickLink
                  href="/wishlist"
                  icon={<FiHeart size={20} className="text-pink-500" />}
                  label="My Wishlist"
                  sub="Items you've saved"
                  bg="bg-pink-50"
                />
              </div>
            </>
          )}

          {/* ── Orders tab ── */}
          {tab === 'orders' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-50">
                <h2 className="font-semibold text-gray-900 text-sm">Order History</h2>
              </div>

              {loading ? (
                <div className="p-6 space-y-3">
                  {[1, 2, 3].map((i) => <SkeletonRow key={i} />)}
                </div>
              ) : orders.length === 0 ? (
                <EmptyOrders />
              ) : (
                <div className="divide-y divide-gray-50">
                  {orders.map((o) => (
                    <OrderRow key={o._id} order={o} expanded />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Wishlist tab ── */}
          {tab === 'wishlist' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center">
                <FiHeart size={28} className="text-pink-400" />
              </div>
              <p className="font-bold text-gray-900">Your Wishlist</p>
              <p className="text-sm text-gray-400">Items you&apos;ve saved for later</p>
              <Link
                href="/wishlist"
                className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-full transition-colors"
              >
                Go to Wishlist
              </Link>
            </div>
          )}

          {/* ── Settings tab ── */}
          {tab === 'settings' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-50">
                <h2 className="font-semibold text-gray-900 text-sm">Account Settings</h2>
              </div>
              <div className="p-6 space-y-5">
                <SettingsRow label="Full Name"     value={user.name ?? '—'} icon={<FiUser size={15} />} />
                <SettingsRow label="Email Address" value={user.email}        icon={<FiMail size={15} />} />
                <SettingsRow label="Role"          value={role}              icon={<FiShield size={15} />} />
                <div className="pt-4 border-t border-gray-100">
                  <button
                    onClick={async () => {
                      await signOut({ fetchOptions: { onSuccess: () => router.push('/sign-in') } });
                    }}
                    className="flex items-center gap-2 text-sm font-bold text-red-500 hover:underline"
                  >
                    <FiLogOut size={15} />
                    Sign out of this account
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  icon, label, value, bg, className = '',
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  bg: string;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 ${className}`}>
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-xl font-bold text-gray-900 leading-tight">{value}</p>
      </div>
    </div>
  );
}

function OrderRow({ order, expanded = false }: { order: Order; expanded?: boolean }) {
  const cfg = STATUS_CONFIG[order.status] ?? defaultStatus;

  return (
    <div className="px-6 py-4 hover:bg-gray-50/50 transition-colors">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* ID + date */}
        <div>
          <p className="text-xs font-mono text-gray-400">#{order._id.slice(-8)}</p>
          <p className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-0.5">
            <FiClock size={10} />
            {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'short', day: 'numeric',
            })}
          </p>
        </div>

        {/* Status + total */}
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full capitalize ${cfg.bg} ${cfg.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {order.status}
          </span>
          <span className="text-sm font-bold text-gray-900">${order.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Items — only shown in expanded (orders tab) */}
      {expanded && (
        <div className="flex flex-wrap gap-2 mt-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-2.5 py-1.5">
              <Image
                src={item.image}
                alt={item.name}
                width={32}
                height={32}
                className="rounded object-contain"
              />
              <div>
                <p className="text-[11px] font-bold text-gray-800 line-clamp-1 max-w-[110px]">{item.name}</p>
                <p className="text-[10px] text-gray-400">×{item.quantity} · ${item.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {order.couponCode && (
        <p className="mt-2 text-[11px] text-green-600 font-semibold">
          Coupon <span className="font-semibold">{order.couponCode}</span> applied — saved ${order.discount?.toFixed(2)}
        </p>
      )}
    </div>
  );
}

function EmptyOrders() {
  return (
    <div className="p-12 flex flex-col items-center text-center gap-4">
      <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
        <FiPackage size={28} className="text-gray-300" />
      </div>
      <p className="font-bold text-gray-400 text-sm">No orders yet</p>
      <Link
        href="/products"
        className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-full transition-colors"
      >
        Start Shopping
      </Link>
    </div>
  );
}

function QuickLink({
  href, icon, label, sub, bg,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  sub: string;
  bg: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow group"
    >
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className="text-xs text-gray-400">{sub}</p>
      </div>
      <FiChevronRight size={16} className="ml-auto text-gray-300 group-hover:text-red-400 transition-colors" />
    </Link>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 animate-pulse">
      <div className="h-10 w-10 bg-gray-100 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-100 rounded w-1/3" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      </div>
      <div className="h-6 w-16 bg-gray-100 rounded-full" />
    </div>
  );
}

function SettingsRow({
  label, value, icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-sm font-semibold text-gray-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}
