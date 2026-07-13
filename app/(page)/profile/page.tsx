'use client';

import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession, signOut } from '@/lib/auth-client';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  UserIcon, Package01Icon, MapPinIcon, Shield01Icon,
  AlertDiamondIcon, Logout01Icon, ChevronRightIcon,
  Home01Icon, Menu01Icon, StarIcon,
} from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Loader2, Menu } from 'lucide-react';

import type { UserProfile, Order, Address, ProfileTab } from '@/components/profile/types';
import PersonalInfoTab from '@/components/profile/PersonalInfoTab';
import AddressesTab    from '@/components/profile/AddressesTab';
import OrdersTab       from '@/components/profile/OrdersTab';
import SecurityTab     from '@/components/profile/SecurityTab';
import DangerZoneTab   from '@/components/profile/DangerZoneTab';

const STROKE = 1.5;

const NAV_ITEMS: { id: ProfileTab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview',  label: 'Overview',      icon: <HugeiconsIcon icon={Home01Icon}       size={16} color="currentColor" strokeWidth={STROKE} /> },
  { id: 'personal',  label: 'Personal Info', icon: <HugeiconsIcon icon={UserIcon}         size={16} color="currentColor" strokeWidth={STROKE} /> },
  { id: 'addresses', label: 'Addresses',     icon: <HugeiconsIcon icon={MapPinIcon}       size={16} color="currentColor" strokeWidth={STROKE} /> },
  { id: 'orders',    label: 'Orders',        icon: <HugeiconsIcon icon={Package01Icon}    size={16} color="currentColor" strokeWidth={STROKE} /> },
  { id: 'security',  label: 'Security',      icon: <HugeiconsIcon icon={Shield01Icon}     size={16} color="currentColor" strokeWidth={STROKE} /> },
  { id: 'danger',    label: 'Danger Zone',   icon: <HugeiconsIcon icon={AlertDiamondIcon} size={16} color="currentColor" strokeWidth={STROKE} /> },
];

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'outline', processing: 'secondary', shipped: 'secondary',
  delivered: 'default', cancelled: 'destructive',
};

// ─── Sidebar nav (shared between desktop and mobile sheet) ────────────────────
function SidebarNav({
  tab, changeTab, profile, router,
}: {
  tab: ProfileTab;
  changeTab: (t: ProfileTab) => void;
  profile: UserProfile;
  router: ReturnType<typeof useRouter>;
}) {
  const role = profile.role ?? 'user';
  return (
    <div className="flex flex-col gap-4">
      {/* Avatar card */}
      <Card>
        <CardContent className="p-5 flex flex-col items-center text-center gap-3">
          {profile.image ? (
            <Image src={profile.image} alt={profile.name} width={72} height={72}
              className="rounded-full ring-2 ring-border object-cover w-[72px] h-[72px]" />
          ) : (
            <div className="w-[72px] h-[72px] rounded-full border-2 border-border flex items-center justify-center">
              <HugeiconsIcon icon={UserIcon} size={28} color="#9ca3af" strokeWidth={STROKE} />
            </div>
          )}
          <div className="min-w-0 w-full">
            <p className="font-semibold text-gray-900 text-sm truncate">{profile.name}</p>
            <p className="text-xs text-muted-foreground truncate mt-0.5">{profile.email}</p>
          </div>
          <Badge variant={role === 'admin' ? 'destructive' : 'outline'} className="capitalize">
            {role}
          </Badge>
        </CardContent>
      </Card>

      {/* Nav */}
      <Card className="overflow-hidden py-1">
        <CardContent className="p-0">
          {NAV_ITEMS.map((item, idx) => (
            <div key={item.id}>
              <button
                onClick={() => changeTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-l-2 ${
                  tab === item.id
                    ? 'border-red-500 bg-red-50 text-red-600'
                    : item.id === 'danger'
                    ? 'border-transparent text-red-400 hover:bg-red-50'
                    : 'border-transparent text-gray-600 hover:bg-muted hover:text-gray-900'
                }`}
              >
                {item.icon}
                {item.label}
                {tab === item.id && (
                  <HugeiconsIcon icon={ChevronRightIcon} size={13} color="currentColor"
                    strokeWidth={STROKE} className="ml-auto opacity-60" />
                )}
              </button>
              {idx === NAV_ITEMS.length - 2 && <Separator />}
            </div>
          ))}
          <Separator />
          <button
            onClick={() => signOut({ fetchOptions: { onSuccess: () => router.push('/sign-in') } })}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-red-500 transition-colors"
          >
            <HugeiconsIcon icon={Logout01Icon} size={16} color="currentColor" strokeWidth={STROKE} />
            Sign Out
          </button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Inner page (uses useSearchParams) ────────────────────────────────────────
function ProfilePageInner() {
  const { data: session, isPending } = useSession();
  const router       = useRouter();
  const searchParams = useSearchParams();

  const initialTab = (searchParams.get('tab') as ProfileTab | null) ?? 'overview';
  const validTabs  = NAV_ITEMS.map(n => n.id);
  const [tab,            setTab]            = useState<ProfileTab>(validTabs.includes(initialTab) ? initialTab : 'overview');
  const [profile,        setProfile]        = useState<UserProfile | null>(null);
  const [orders,         setOrders]         = useState<Order[]>([]);
  const [ordersLoading,  setOrdersLoading]  = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session) router.push('/sign-in');
  }, [isPending, session, router]);

  useEffect(() => {
    if (!session) return;
    fetch('/api/user').then(r => r.json()).then(setProfile).catch(console.error).finally(() => setProfileLoading(false));
  }, [session]);

  const fetchOrders = () => {
    if (!session) return;
    fetch('/api/orders').then(r => r.json()).then(d => setOrders(d.orders ?? [])).catch(console.error).finally(() => setOrdersLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [session]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (tab === 'orders' && session) { setOrdersLoading(true); fetchOrders(); }
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isPending || !session || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-red-500" />
      </div>
    );
  }

  if (!profile) return null;

  const totalSpent = orders.reduce((s, o) => s + (o.total ?? 0), 0);
  const delivered  = orders.filter(o => o.status === 'delivered').length;

  const changeTab = (t: ProfileTab) => setTab(t);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <nav className="flex items-center gap-1 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-red-500 transition-colors">Home</Link>
            <HugeiconsIcon icon={ChevronRightIcon} size={12} color="currentColor" strokeWidth={STROKE} />
            <span className="text-gray-700 font-medium capitalize">
              {NAV_ITEMS.find(n => n.id === tab)?.label ?? 'Profile'}
            </span>
          </nav>

        {/* Mobile sheet trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-4 overflow-y-auto">
            <div className="mt-6">
              <SidebarNav tab={tab} changeTab={changeTab} profile={profile} router={router} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col lg:flex-row gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block lg:w-60 flex-shrink-0">
          <SidebarNav tab={tab} changeTab={changeTab} profile={profile} router={router} />
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">

          {/* Overview */}
          {tab === 'overview' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <StatCard icon={<HugeiconsIcon icon={Package01Icon} size={18} color="#ef4444" strokeWidth={STROKE} />} label="Total Orders" value={orders.length} />
                <StatCard icon={<HugeiconsIcon icon={StarIcon} size={16} color="#fbbf24" strokeWidth={STROKE} />} label="Delivered" value={delivered} />
                <StatCard icon={<span className="text-green-500 font-bold text-sm">$</span>} label="Total Spent" value={`$${totalSpent.toFixed(2)}`} className="col-span-2 sm:col-span-1" />
              </div>

              <Card>
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <p className="text-sm font-semibold text-gray-900">Recent Orders</p>
                  <Button variant="link" size="sm" className="text-red-500 p-0 h-auto" onClick={() => changeTab('orders')}>
                    View all →
                  </Button>
                </div>
                {ordersLoading
                  ? <div className="p-5 space-y-3">{[1, 2].map(i => <SkelRow key={i} />)}</div>
                  : orders.length === 0
                  ? <div className="p-8 text-center text-sm text-muted-foreground">No orders yet</div>
                  : <div className="divide-y divide-border">{orders.slice(0, 3).map(o => <MiniOrderRow key={o._id} order={o} />)}</div>
                }
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <QuickCard href="/products" icon={<HugeiconsIcon icon={Package01Icon} size={18} color="#ef4444" strokeWidth={STROKE} />} label="Browse Products" sub="New arrivals & deals" />
                <QuickCard href="/wishlist" icon={<span className="text-pink-500 text-lg">♡</span>} label="My Wishlist" sub="Saved for later" />
              </div>

              {(!profile.phone || !profile.bio) && (
                <Card className="border-blue-200">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl border border-blue-200 flex items-center justify-center flex-shrink-0">
                      <HugeiconsIcon icon={UserIcon} size={16} color="#3b82f6" strokeWidth={STROKE} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-blue-800">Complete your profile</p>
                      <p className="text-xs text-blue-500 mt-0.5">Add your phone number and bio</p>
                    </div>
                    <Button variant="link" size="sm" className="text-blue-600 p-0 h-auto flex-shrink-0" onClick={() => changeTab('personal')}>
                      Update →
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {tab === 'personal' && (
            <PersonalInfoTab profile={profile} onUpdate={u => setProfile(p => p ? { ...p, ...u } : p)} />
          )}
          {tab === 'addresses' && (
            <AddressesTab addresses={profile.addresses} onUpdate={addresses => setProfile(p => p ? { ...p, addresses } : p)} />
          )}
          {tab === 'orders' && (
            <OrdersTab orders={orders} loading={ordersLoading} onRefresh={() => { setOrdersLoading(true); fetchOrders(); }} />
          )}
          {tab === 'security'  && <SecurityTab />}
          {tab === 'danger'    && <DangerZoneTab />}
        </main>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-red-500" />
      </div>
    }>
      <ProfilePageInner />
    </Suspense>
  );
}

// ─── Small shared components ──────────────────────────────────────────────────
function StatCard({ icon, label, value, className = '' }: {
  icon: React.ReactNode; label: string; value: string | number; className?: string;
}) {
  return (
    <Card className={className}>
      <CardContent className="p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl border border-border flex items-center justify-center flex-shrink-0">{icon}</div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-lg font-bold text-gray-900 leading-tight">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function MiniOrderRow({ order }: { order: Order }) {
  return (
    <div className="flex items-center justify-between px-5 py-3 hover:bg-muted/50 transition-colors">
      <div>
        <p className="text-xs font-mono text-muted-foreground">#{order._id.slice(-8).toUpperCase()}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant={STATUS_VARIANT[order.status] ?? 'outline'} className="capitalize text-xs">
          {order.status}
        </Badge>
        <span className="text-sm font-bold text-gray-900">${(order.total ?? 0).toFixed(2)}</span>
      </div>
    </div>
  );
}

function QuickCard({ href, icon, label, sub }: { href: string; icon: React.ReactNode; label: string; sub: string }) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-md transition-shadow group cursor-pointer">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl border border-border flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{label}</p>
            <p className="text-xs text-muted-foreground truncate">{sub}</p>
          </div>
          <HugeiconsIcon icon={ChevronRightIcon} size={14} color="currentColor" strokeWidth={STROKE}
            className="ml-auto text-muted-foreground group-hover:text-red-400 transition-colors flex-shrink-0" />
        </CardContent>
      </Card>
    </Link>
  );
}

function SkelRow() {
  return (
    <div className="flex items-center gap-3 px-5 py-3">
      <Skeleton className="h-9 w-9 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-2.5 w-1/4" />
      </div>
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
  );
}
