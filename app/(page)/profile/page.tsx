'use client';

import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession, signOut } from '@/lib/auth-client';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  UserIcon, Package01Icon, MapPinIcon, Shield01Icon,
  BellIcon, AlertDiamondIcon, Logout01Icon,
  ChevronRightIcon, Home01Icon, Menu01Icon, Cancel01Icon, StarIcon,
} from '@hugeicons/core-free-icons';

import type { UserProfile, Order, Notifications, Address, ProfileTab } from '@/components/profile/types';
import PersonalInfoTab   from '@/components/profile/PersonalInfoTab';
import AddressesTab      from '@/components/profile/AddressesTab';
import OrdersTab         from '@/components/profile/OrdersTab';
import SecurityTab       from '@/components/profile/SecurityTab';
import NotificationsTab  from '@/components/profile/NotificationsTab';
import DangerZoneTab     from '@/components/profile/DangerZoneTab';

// ─── Sidebar items ─────────────────────────────────────────────────────────────
const STROKE = 1.5;

const NAV_ITEMS: { id: ProfileTab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview',      label: 'Overview',       icon: <HugeiconsIcon icon={Home01Icon}       size={16} color="currentColor" strokeWidth={STROKE} /> },
  { id: 'personal',      label: 'Personal Info',  icon: <HugeiconsIcon icon={UserIcon}         size={16} color="currentColor" strokeWidth={STROKE} /> },
  { id: 'addresses',     label: 'Addresses',      icon: <HugeiconsIcon icon={MapPinIcon}       size={16} color="currentColor" strokeWidth={STROKE} /> },
  { id: 'orders',        label: 'Orders',         icon: <HugeiconsIcon icon={Package01Icon}    size={16} color="currentColor" strokeWidth={STROKE} /> },
  { id: 'security',      label: 'Security',       icon: <HugeiconsIcon icon={Shield01Icon}     size={16} color="currentColor" strokeWidth={STROKE} /> },
  { id: 'notifications', label: 'Notifications',  icon: <HugeiconsIcon icon={BellIcon}         size={16} color="currentColor" strokeWidth={STROKE} /> },
  { id: 'danger',        label: 'Danger Zone',    icon: <HugeiconsIcon icon={AlertDiamondIcon} size={16} color="currentColor" strokeWidth={STROKE} /> },
];

const STATUS_CFG: Record<string, { bg: string; text: string; dot: string }> = {
  pending:    { bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-400' },
  processing: { bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-400' },
  shipped:    { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-400' },
  delivered:  { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-400' },
  cancelled:  { bg: 'bg-red-50',    text: 'text-red-700',    dot: 'bg-red-400' },
};

// ─── Page ──────────────────────────────────────────────────────────────────────
function ProfilePageInner() {
  const { data: session, isPending } = useSession();
  const router       = useRouter();
  const searchParams = useSearchParams();

  // Read ?tab=orders (or any valid tab) from the URL on first render
  const initialTab = (searchParams.get('tab') as ProfileTab | null) ?? 'overview';
  const validTabs  = NAV_ITEMS.map(n => n.id);
  const [tab,           setTab]           = useState<ProfileTab>(
    validTabs.includes(initialTab) ? initialTab : 'overview'
  );
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [profile,       setProfile]       = useState<UserProfile | null>(null);
  const [orders,        setOrders]        = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isPending && !session) router.push('/sign-in');
  }, [isPending, session, router]);

  // Fetch extended profile
  useEffect(() => {
    if (!session) return;
    fetch('/api/user')
      .then(r => r.json())
      .then(d => setProfile(d))
      .catch(console.error)
      .finally(() => setProfileLoading(false));
  }, [session]);

  // Fetch orders
  useEffect(() => {
    if (!session) return;
    fetch('/api/orders')
      .then(r => r.json())
      .then(d => setOrders(d.orders ?? []))
      .catch(console.error)
      .finally(() => setOrdersLoading(false));
  }, [session]);

  // Loading / auth guard
  if (isPending || !session || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  const role       = profile.role ?? 'user';
  const totalSpent = orders.reduce((s, o) => s + (o.total ?? 0), 0);
  const delivered  = orders.filter(o => o.status === 'delivered').length;

  const changeTab = (t: ProfileTab) => {
    setTab(t);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Breadcrumb bar ── */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="text-red-500 font-bold text-base">GG Shop</Link>
        <nav className="flex items-center gap-1 text-xs text-gray-400">
          <Link href="/" className="hover:text-red-500 transition-colors">Home</Link>
          <HugeiconsIcon icon={ChevronRightIcon} size={12} color="currentColor" strokeWidth={STROKE} />
          <span className="text-gray-700 font-medium capitalize">
            {NAV_ITEMS.find(n => n.id === tab)?.label ?? 'Profile'}
          </span>
        </nav>
        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(o => !o)}
          className="lg:hidden p-2 text-gray-500 hover:text-gray-800 transition-colors"
          aria-label="Toggle menu"
        >
          {sidebarOpen
            ? <HugeiconsIcon icon={Cancel01Icon} size={20} color="currentColor" strokeWidth={STROKE} />
            : <HugeiconsIcon icon={Menu01Icon}   size={20} color="currentColor" strokeWidth={STROKE} />}
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col lg:flex-row gap-6">

        {/* ── Sidebar ── */}
        <aside className={`lg:w-60 flex-shrink-0 flex flex-col gap-4 ${sidebarOpen ? 'block' : 'hidden'} lg:flex`}>

          {/* Avatar card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center text-center gap-3">
            {profile.image ? (
              <Image src={profile.image} alt={profile.name} width={72} height={72}
                className="rounded-full ring-2 ring-gray-200 object-cover w-[72px] h-[72px]" />
            ) : (
              <div className="w-[72px] h-[72px] rounded-full border-2 border-gray-200 flex items-center justify-center">
                <HugeiconsIcon icon={UserIcon} size={28} color="#9ca3af" strokeWidth={STROKE} />
              </div>
            )}
            <div className="min-w-0 w-full">
              <p className="font-semibold text-gray-900 text-sm truncate">{profile.name}</p>
              <p className="text-xs text-gray-400 truncate mt-0.5">{profile.email}</p>
            </div>
            <span className={`text-xs font-semibold px-3 py-0.5 rounded-full border capitalize ${
              role === 'admin' ? 'border-red-300 text-red-600' : 'border-gray-200 text-gray-500'
            }`}>{role}</span>
          </div>

          {/* Nav links */}
          <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {NAV_ITEMS.map(item => (
              <button key={item.id} onClick={() => changeTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-l-2 ${
                  tab === item.id
                    ? item.id === 'danger'
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-red-500 bg-red-50 text-red-600'
                    : item.id === 'danger'
                      ? 'border-transparent text-red-400 hover:bg-red-50'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}>
                {item.icon}
                {item.label}
                {tab === item.id && <HugeiconsIcon icon={ChevronRightIcon} size={13} color="currentColor" strokeWidth={STROKE} className="ml-auto opacity-60" />}
              </button>
            ))}

            <div className="h-px bg-gray-100 mx-4" />

            <button
              onClick={() => signOut({ fetchOptions: { onSuccess: () => router.push('/sign-in') } })}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-red-500 transition-colors"
            >
              <HugeiconsIcon icon={Logout01Icon} size={16} color="currentColor" strokeWidth={STROKE} /> Sign Out
            </button>
          </nav>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0">

          {/* ── Overview ── */}
          {tab === 'overview' && (
            <div className="space-y-5">
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <StatCard icon={<HugeiconsIcon icon={Package01Icon} size={18} color="#ef4444" strokeWidth={STROKE} />}
                  label="Total Orders" value={orders.length} />
                <StatCard icon={<HugeiconsIcon icon={StarIcon} size={16} color="#fbbf24" strokeWidth={STROKE} />}
                  label="Delivered" value={delivered} />
                <StatCard icon={<span className="text-green-500 font-bold text-sm">$</span>}
                  label="Total Spent" value={`$${totalSpent.toFixed(2)}`}
                  className="col-span-2 sm:col-span-1" />
              </div>

              {/* Recent orders */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                  <p className="text-sm font-semibold text-gray-900">Recent Orders</p>
                  <button onClick={() => changeTab('orders')}
                    className="text-xs text-red-500 font-semibold hover:underline">
                    View all →
                  </button>
                </div>
                {ordersLoading ? (
                  <div className="p-5 space-y-3">{[1,2].map(i => <SkelRow key={i} />)}</div>
                ) : orders.length === 0 ? (
                  <div className="p-8 text-center text-sm text-gray-400">No orders yet</div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {orders.slice(0, 3).map(o => <MiniOrderRow key={o._id} order={o} />)}
                  </div>
                )}
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-2 gap-4">
                <QuickCard href="/products" icon={<HugeiconsIcon icon={Package01Icon} size={18} color="#ef4444" strokeWidth={STROKE} />}
                  label="Browse Products" sub="New arrivals & deals" />
                <QuickCard href="/wishlist" icon={<span className="text-pink-500 text-lg">♡</span>}
                  label="My Wishlist" sub="Saved for later" />
              </div>

              {/* Profile completion nudge */}
              {(!profile.phone || !profile.bio) && (
                <div className="border border-blue-200 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl border border-blue-200 flex items-center justify-center flex-shrink-0">
                    <HugeiconsIcon icon={UserIcon} size={16} color="#3b82f6" strokeWidth={STROKE} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-blue-800">Complete your profile</p>
                    <p className="text-xs text-blue-500 mt-0.5">Add your phone number and bio</p>
                  </div>
                  <button onClick={() => changeTab('personal')}
                    className="text-xs font-bold text-blue-600 hover:underline flex-shrink-0">
                    Update →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── Personal Info ── */}
          {tab === 'personal' && (
            <PersonalInfoTab
              profile={profile}
              onUpdate={(updated) => setProfile(p => p ? { ...p, ...updated } : p)}
            />
          )}

          {/* ── Addresses ── */}
          {tab === 'addresses' && (
            <AddressesTab
              addresses={profile.addresses}
              onUpdate={(addresses) => setProfile(p => p ? { ...p, addresses } : p)}
            />
          )}

          {/* ── Orders ── */}
          {tab === 'orders' && (
            <OrdersTab orders={orders} loading={ordersLoading} />
          )}

          {/* ── Security ── */}
          {tab === 'security' && <SecurityTab />}

          {/* ── Notifications ── */}
          {tab === 'notifications' && (
            <NotificationsTab
              notifications={profile.notifications}
              onUpdate={(notifications) => setProfile(p => p ? { ...p, notifications } : p)}
            />
          )}

          {/* ── Danger Zone ── */}
          {tab === 'danger' && <DangerZoneTab />}
        </main>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ProfilePageInner />
    </Suspense>
  );
}

// ─── Small shared components ──────────────────────────────────────────────────
function StatCard({ icon, label, value, className = '' }: {
  icon: React.ReactNode; label: string; value: string | number; bg?: string; className?: string;
}) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3 ${className}`}>
      <div className="w-9 h-9 rounded-xl border border-gray-100 flex items-center justify-center flex-shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-lg font-bold text-gray-900 leading-tight">{value}</p>
      </div>
    </div>
  );
}

function MiniOrderRow({ order }: { order: Order }) {
  const cfg = STATUS_CFG[order.status] ?? STATUS_CFG.pending;
  return (
    <div className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/50 transition-colors">
      <div>
        <p className="text-xs font-mono text-gray-400">#{order._id.slice(-8).toUpperCase()}</p>
        <p className="text-[11px] text-gray-400 mt-0.5">
          {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize inline-flex items-center gap-1.5 ${cfg.bg} ${cfg.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />{order.status}
        </span>
        <span className="text-sm font-bold text-gray-900">${(order.total ?? 0).toFixed(2)}</span>
      </div>
    </div>
  );
}

function QuickCard({ href, icon, label, sub }: {
  href: string; icon: React.ReactNode; label: string; sub: string; bg?: string;
}) {
  return (
    <Link href={href}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3 hover:shadow-md transition-shadow group">
      <div className="w-9 h-9 rounded-xl border border-gray-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{label}</p>
        <p className="text-xs text-gray-400 truncate">{sub}</p>
      </div>
      <HugeiconsIcon icon={ChevronRightIcon} size={14} color="currentColor" strokeWidth={STROKE} className="ml-auto text-gray-300 group-hover:text-red-400 transition-colors flex-shrink-0" />
    </Link>
  );
}

function SkelRow() {
  return (
    <div className="flex items-center gap-3 animate-pulse">
      <div className="h-9 w-9 bg-gray-100 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 bg-gray-100 rounded w-1/3" />
        <div className="h-2.5 bg-gray-100 rounded w-1/4" />
      </div>
      <div className="h-5 w-16 bg-gray-100 rounded-full" />
    </div>
  );
}
