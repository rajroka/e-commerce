"use client";

import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingCart01Icon, HeartIcon, Search01Icon,
  Menu01Icon, Cancel01Icon, Home01Icon, Logout01Icon,
  UserIcon, Package01Icon,
} from "@hugeicons/core-free-icons";
import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useWishlistStore } from "@/store/wishlistStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, LayoutDashboard, UserCircle, ShoppingBag, Heart } from "lucide-react";

const STROKE = 1.5;
const SZ = 20;

// ─── Session cache ─────────────────────────────────────────────────────────────
interface CachedSession {
  email: string | null; name: string | null;
  image: string | null; role: string | null; id: string | null;
}
const SESSION_CACHE_KEY = "gg-nav-session-cache";
function readCache(): CachedSession | null {
  if (typeof window === "undefined") return null;
  try { const r = sessionStorage.getItem(SESSION_CACHE_KEY); return r ? JSON.parse(r) : null; }
  catch { return null; }
}
function writeCache(s: CachedSession | null) {
  try { s ? sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(s)) : sessionStorage.removeItem(SESSION_CACHE_KEY); }
  catch {}
}

export default function Nav() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [displaySession, setDisplaySession] = useState<CachedSession | null>(readCache);
  const [searchQuery,    setSearchQuery]    = useState("");

  const setUserId        = useCartStore(s => s.setUserId);
  const getTotalQuantity = useCartStore(s => s.getTotalQuantity);
  const { items: wishlistItems, fetchWishlist, synced } = useWishlistStore();

  useEffect(() => {
    if (isPending) return;
    if (session?.user) {
      const next: CachedSession = {
        email: session.user.email ?? null,
        name:  session.user.name  ?? null,
        image: session.user.image ?? null,
        role:  (session.user as any).role ?? null,
        id:    session.user.id ?? null,
      };
      setDisplaySession(next);
      writeCache(next);
    } else {
      setDisplaySession(null);
      writeCache(null);
      // Clear wishlist when not logged in
      useWishlistStore.setState({ items: [], synced: false });
    }
  }, [session, isPending]);

  useEffect(() => {
    setUserId(
      session?.user?.id ?? null,
      isPending ? "loading" : session ? "authenticated" : "unauthenticated"
    );
  }, [session, isPending, setUserId]);

  useEffect(() => {
    if (session?.user && !synced) fetchWishlist();
  }, [session?.user, synced, fetchWishlist]);

  const userEmail    = displaySession?.email ?? undefined;
  const userName     = displaySession?.name  ?? undefined;
  const userImage    = displaySession?.image ?? undefined;
  const isAdmin      = displaySession?.role === "admin";
  const cartCount    = getTotalQuantity();
  const showSpinner  = isPending && displaySession === null;
  const initials     = userName ? userName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "?";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleSignOut = async () => {
    writeCache(null);
    setDisplaySession(null);
    useWishlistStore.setState({ items: [], synced: false });
    localStorage.removeItem("gg-shop-wishlist-v1");
    await signOut({ fetchOptions: { onSuccess: () => router.push("/sign-in") } });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-16 overflow-visible">

          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0 group">
            <Image src="/m.png" alt="SportShop" width={360} height={120} priority
              className="h-[120px] w-auto transition-transform duration-200 group-hover:scale-105" />
          </Link>

          {/* Search — desktop */}
          <form onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-auto items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 gap-2 focus-within:border-red-400 focus-within:ring-1 focus-within:ring-red-200 transition-all">
            <HugeiconsIcon icon={Search01Icon} size={15} color="#9ca3af" strokeWidth={STROKE} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search sports gear, shoes, equipment…"
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
            />
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-1 ml-auto">

            {/* Cart — hidden for admins */}
            {!isAdmin && (
              <Link href="/cart" aria-label="Cart" className="relative p-2 text-gray-600 hover:text-red-500 transition-colors rounded-lg">
                <HugeiconsIcon icon={ShoppingCart01Icon} size={SZ} color="currentColor" strokeWidth={STROKE} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Wishlist — hidden for admins */}
            {!isAdmin && (
              <Link href="/wishlist" aria-label="Wishlist" className="relative p-2 text-gray-600 hover:text-red-500 transition-colors rounded-lg">
                <HugeiconsIcon icon={HeartIcon} size={SZ} color="currentColor" strokeWidth={STROKE} />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistItems.length > 9 ? "9+" : wishlistItems.length}
                  </span>
                )}
              </Link>
            )}

            {/* Dashboard button — admins only */}
            {isAdmin && (
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-full transition-colors mr-1"
              >
                <HugeiconsIcon icon={Home01Icon} size={14} color="white" strokeWidth={STROKE} />
                Dashboard
              </Link>
            )}

            {/* ── User section — desktop ── */}
            <div className="hidden md:flex items-center pl-2 border-l border-gray-100 ml-1">
              {showSpinner ? (
                <Loader2 size={18} className="animate-spin text-red-400 mx-3" />
              ) : userEmail ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2">
                      <Avatar className="size-8 cursor-pointer hover:opacity-90 transition-opacity">
                        <AvatarImage src={userImage ?? ""} alt={userName ?? "User"} />
                        <AvatarFallback className="bg-red-100 text-red-600 text-xs font-bold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" sideOffset={8} className="w-48 rounded-xl shadow-lg p-1">
                    {/* User info header */}
                    <div className="px-3 py-2 mb-1">
                      <p className="text-xs font-semibold text-gray-900 truncate">{userName || "User"}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{userEmail}</p>
                    </div>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                      <Link href="/profile" className="flex items-center gap-2">
                        <UserCircle size={14} /> My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                      <Link href="/profile?tab=orders" className="flex items-center gap-2">
                        <ShoppingBag size={14} /> My Orders
                      </Link>
                    </DropdownMenuItem>
                    {!isAdmin && (
                      <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                        <Link href="/wishlist" className="flex items-center gap-2">
                          <Heart size={14} /> Wishlist
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {isAdmin && (
                      <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                        <Link href="/dashboard" className="flex items-center gap-2">
                          <LayoutDashboard size={14} /> Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="cursor-pointer rounded-lg text-red-500 focus:text-red-500 focus:bg-red-50"
                    >
                      <LogOut size={14} className="mr-2" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => router.push("/sign-in")}
                    className="text-gray-600 hover:text-red-500">
                    Sign In
                  </Button>
                  <Button size="sm" onClick={() => router.push("/sign-up")}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-full">
                    Sign Up
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <MobileNav
              userEmail={userEmail}
              userName={userName}
              userImage={userImage}
              cartCount={cartCount}
              showSpinner={showSpinner}
              isAdmin={isAdmin}
              wishlistCount={wishlistItems.length}
              onSignOut={handleSignOut}
              initials={initials}
            />
          </div>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch}
          className="md:hidden flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 gap-2 mb-3 focus-within:border-red-400 focus-within:ring-1 focus-within:ring-red-200 transition-all">
          <HugeiconsIcon icon={Search01Icon} size={15} color="#9ca3af" strokeWidth={STROKE} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search sports gear…"
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
          />
        </form>
      </div>
    </header>
  );
}

// ─── MobileNav ────────────────────────────────────────────────────────────────
function MobileNav({
  userEmail, userName, userImage, cartCount, showSpinner,
  isAdmin, wishlistCount, onSignOut, initials,
}: {
  userEmail?: string; userName?: string | null; userImage?: string | null;
  cartCount: number; showSpinner: boolean; isAdmin: boolean;
  wishlistCount: number; onSignOut: () => void; initials: string;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const go = (href: string) => { setOpen(false); router.push(href); };

  return (
    <div className="md:hidden flex items-center">
      <button
        onClick={() => setOpen(o => !o)}
        className="p-2 text-gray-600 hover:text-red-500 transition-colors rounded-lg focus:outline-none"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        <HugeiconsIcon icon={open ? Cancel01Icon : Menu01Icon} size={SZ} color="currentColor" strokeWidth={STROKE} />
      </button>

      {open && <div className="fixed inset-0 bg-black/40 z-30" onClick={() => setOpen(false)} />}

      <div className={`fixed top-0 right-0 w-72 h-full bg-white shadow-2xl z-40 flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-base font-bold text-red-500">SportShop</span>
          <button onClick={() => setOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg focus:outline-none">
            <HugeiconsIcon icon={Cancel01Icon} size={18} color="currentColor" strokeWidth={STROKE} />
          </button>
        </div>

        <div className="flex flex-col gap-1 px-3 py-4 overflow-y-auto flex-1">
          {[
            { label: "Home",     href: "/" },
            { label: "Products", href: "/products" },
            ...(isAdmin
              ? [{ label: "Dashboard", href: "/dashboard" }]
              : [
                  { label: `Cart${cartCount > 0 ? ` (${cartCount})` : ""}`, href: "/cart" },
                  { label: `Wishlist${wishlistCount > 0 ? ` (${wishlistCount})` : ""}`, href: "/wishlist" },
                ]
            ),
          ].map(item => (
            <button key={item.href} onClick={() => go(item.href)}
              className="w-full text-left px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors focus:outline-none">
              {item.label}
            </button>
          ))}

          <div className="h-px bg-gray-100 my-2" />

          {showSpinner ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm px-3 py-2">
              <Loader2 size={16} className="animate-spin" /> Loading…
            </div>
          ) : userEmail ? (
            <>
              <div className="flex items-center gap-3 px-3 py-3 bg-gray-50 rounded-xl mb-1">
                <Avatar className="size-9">
                  <AvatarImage src={userImage ?? ""} alt={userName ?? "User"} />
                  <AvatarFallback className="bg-red-100 text-red-600 text-xs font-bold">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{userName || "User"}</p>
                  <p className="text-xs text-gray-400 truncate max-w-[160px]">{userEmail}</p>
                </div>
              </div>
              {[
                { label: "My Profile", href: "/profile" },
                { label: "My Orders",  href: "/profile?tab=orders" },
              ].map(i => (
                <button key={i.href} onClick={() => go(i.href)}
                  className="w-full text-left px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors focus:outline-none">
                  {i.label}
                </button>
              ))}
              <div className="h-px bg-gray-100 my-2" />
              <button
                onClick={() => { setOpen(false); onSignOut(); }}
                className="w-full flex items-center gap-2 text-left px-3 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-colors focus:outline-none"
              >
                <LogOut size={15} /> Sign Out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 mt-1">
              <button onClick={() => go("/sign-up")} className="btn-primary w-full justify-center py-2.5 rounded-xl">Sign Up</button>
              <button onClick={() => go("/sign-in")} className="btn-ghost w-full justify-center py-2.5 rounded-xl">Sign In</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
