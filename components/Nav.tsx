"use client";

import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingCart01Icon, HeartIcon, Search01Icon, UserIcon,
  Menu01Icon, Cancel01Icon, ChevronDownIcon,
  Home01Icon, Package01Icon, Logout01Icon,
} from "@hugeicons/core-free-icons";
import { useCartStore } from "@/store/cartStore";
import { useEffect, useRef, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { useWishlistStore } from "@/store/wishlistStore";
import Image2 from "next/image";

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

const LANGS = [
  { code: "EN", label: "English", flag: "🇺🇸" },
  { code: "NP", label: "Nepali",  flag: "🇳🇵" },
  { code: "AR", label: "Arabic",  flag: "🇸🇦" },
];

const STROKE = 1.5;
const SZ = 20;

export default function Nav() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [displaySession, setDisplaySession] = useState<CachedSession | null>(readCache);
  const [searchQuery,  setSearchQuery]  = useState("");
  const [langOpen,     setLangOpen]     = useState(false);
  const [activeLang,   setActiveLang]   = useState(LANGS[0]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const langRef     = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const setUserId        = useCartStore(s => s.setUserId);
  const getTotalQuantity = useCartStore(s => s.getTotalQuantity);
  const { items: wishlistItems, fetchWishlist, synced } = useWishlistStore();

  useEffect(() => {
    if (isPending) return;
    if (session?.user) {
      const next: CachedSession = {
        email: session.user.email ?? null, name: session.user.name ?? null,
        image: session.user.image ?? null, role: (session.user as any).role ?? null,
        id: session.user.id ?? null,
      };
      setDisplaySession(next); writeCache(next);
    } else { setDisplaySession(null); writeCache(null); }
  }, [session, isPending]);

  useEffect(() => {
    setUserId(session?.user?.id ?? null, isPending ? "loading" : session ? "authenticated" : "unauthenticated");
  }, [session, isPending, setUserId]);

  useEffect(() => { if (session?.user && !synced) fetchWishlist(); }, [session?.user, synced, fetchWishlist]);

  useEffect(() => {
    function h(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const userEmail = displaySession?.email ?? undefined;
  const userName  = displaySession?.name  ?? undefined;
  const userImage = displaySession?.image ?? undefined;
  const isAdmin   = displaySession?.role === "admin";
  const cartCount = getTotalQuantity();
  const showSpinner = isPending && displaySession === null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
  };
  const handleSignOut = async () => {
    setUserMenuOpen(false); writeCache(null); setDisplaySession(null);
    await signOut({ fetchOptions: { onSuccess: () => router.push("/sign-in") } });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <Image src="/ggimage.png" alt="GG Shop" width={36} height={36} priority
              className="rounded-full transition-transform duration-200 group-hover:scale-105" />
            <span className="text-base font-bold text-red-500 hidden sm:block">GG Shop</span>
          </Link>

          {/* Search — desktop */}
          <form onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-auto items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 gap-2 focus-within:border-red-400 focus-within:ring-1 focus-within:ring-red-200 transition-all">
            <HugeiconsIcon icon={Search01Icon} size={15} color="#9ca3af" strokeWidth={STROKE} />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none" />
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-1 ml-auto">

            {/* Cart — hidden for admins */}
            {!isAdmin && (
              <Link href="/cart" aria-label="Cart" className="relative p-2 text-gray-600 hover:text-red-500 transition-colors">
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
              <Link href="/wishlist" aria-label="Wishlist" className="relative p-2 text-gray-600 hover:text-red-500 transition-colors">
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

            {/* Language */}
            <div ref={langRef} className="relative hidden sm:block">
              <button onClick={() => setLangOpen(o => !o)}
                className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
                aria-expanded={langOpen} aria-label="Select language">
                <span className="text-base leading-none">{activeLang.flag}</span>
                <span className="font-medium text-xs">{activeLang.label}</span>
                <HugeiconsIcon icon={ChevronDownIcon} size={12} color="currentColor" strokeWidth={STROKE}
                  className={`transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
                  {LANGS.map(l => (
                    <button key={l.code} onClick={() => { setActiveLang(l); setLangOpen(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-gray-50 ${activeLang.code === l.code ? "text-red-500 font-semibold" : "text-gray-700"}`}>
                      <span>{l.flag}</span><span>{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User section */}
            <div className="hidden md:flex items-center pl-2 border-l border-gray-100">
              {showSpinner ? (
                <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin mx-3" />
              ) : userEmail ? (
                <div ref={userMenuRef} className="relative">
                  <button onClick={() => setUserMenuOpen(o => !o)}
                    className="flex items-center gap-2 hover:bg-gray-50 rounded-xl px-2 py-1.5 transition-colors"
                    aria-expanded={userMenuOpen}>
                    {userImage ? (
                      <Image2 src={userImage} alt={userName || "User"} width={28} height={28}
                        className="rounded-full ring-2 ring-red-100 flex-shrink-0" />
                    ) : (
                      <div className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0">
                        <HugeiconsIcon icon={UserIcon} size={14} color="#6b7280" strokeWidth={STROKE} />
                      </div>
                    )}
                    <div className="flex flex-col items-start leading-tight">
                      <span className="text-[10px] text-gray-400">Welcome back</span>
                      <span className="text-xs font-semibold text-gray-800 max-w-[96px] truncate">{userName || userEmail}</span>
                    </div>
                    <HugeiconsIcon icon={ChevronDownIcon} size={11} color="#9ca3af" strokeWidth={STROKE}
                      className={`transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
                      {[
                        { href: "/profile", label: "My Profile" },
                        { href: "/orders",  label: "My Orders"  },
                        { href: "/wishlist", label: "Wishlist"  },
                        ...(isAdmin ? [{ href: "/dashboard", label: "Dashboard" }] : []),
                      ].map(item => (
                        <Link key={item.href} href={item.href} onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500 transition-colors">
                          {item.label}
                        </Link>
                      ))}
                      <div className="h-px bg-gray-100 mx-3 my-1" />
                      <button onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium">
                        <HugeiconsIcon icon={Logout01Icon} size={14} color="currentColor" strokeWidth={STROKE} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button onClick={() => router.push("/sign-in")}
                    className="text-sm font-medium text-gray-600 hover:text-red-500 transition-colors px-2 py-1.5">
                    Sign In
                  </button>
                  <button onClick={() => router.push("/sign-up")}
                    className="btn-primary py-1.5 px-4 text-sm">
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <MobileNav
              userEmail={userEmail} userName={userName} userImage={userImage}
              cartCount={cartCount} showSpinner={showSpinner} isAdmin={isAdmin}
              wishlistCount={wishlistItems.length} onSignOut={handleSignOut}
            />
          </div>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch}
          className="md:hidden flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 gap-2 mb-3 focus-within:border-red-400 focus-within:ring-1 focus-within:ring-red-200 transition-all">
          <HugeiconsIcon icon={Search01Icon} size={15} color="#9ca3af" strokeWidth={STROKE} />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="What are you looking for?"
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none" />
        </form>
      </div>
    </header>
  );
}

// ─── MobileNav ────────────────────────────────────────────────────────────────
function MobileNav({ userEmail, userName, userImage, cartCount, showSpinner, isAdmin, wishlistCount, onSignOut }: {
  userEmail?: string; userName?: string | null; userImage?: string | null;
  cartCount: number; showSpinner: boolean; isAdmin: boolean; wishlistCount: number;
  onSignOut: () => void;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const go = (href: string) => { setOpen(false); router.push(href); };

  return (
    <div className="md:hidden flex items-center">
      <button onClick={() => setOpen(o => !o)} className="p-2 text-gray-600 hover:text-red-500 transition-colors"
        aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
        <HugeiconsIcon icon={open ? Cancel01Icon : Menu01Icon} size={SZ} color="currentColor" strokeWidth={STROKE} />
      </button>

      {open && <div className="fixed inset-0 bg-black/40 z-30" onClick={() => setOpen(false)} />}

      <div className={`fixed top-0 right-0 w-72 h-full bg-white shadow-2xl z-40 flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-base font-bold text-red-500">GG Shop</span>
          <button onClick={() => setOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-50">
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
              className="w-full text-left px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
              {item.label}
            </button>
          ))}

          <div className="h-px bg-gray-100 my-2" />

          {showSpinner ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm px-3 py-2">
              <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />Loading…
            </div>
          ) : userEmail ? (
            <>
              <div className="flex items-center gap-3 px-3 py-3 border border-gray-100 rounded-xl mb-1">
                {userImage
                  ? <Image src={userImage} alt={userName || "User"} width={34} height={34} className="rounded-full" />
                  : <div className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center"><HugeiconsIcon icon={UserIcon} size={16} color="#6b7280" strokeWidth={STROKE} /></div>}
                <div>
                  <p className="text-sm font-semibold text-gray-900">{userName || "User"}</p>
                  <p className="text-xs text-gray-400 truncate max-w-[160px]">{userEmail}</p>
                </div>
              </div>
              {[{ label: "My Profile", href: "/profile" }, { label: "My Orders", href: "/orders" }].map(i => (
                <button key={i.href} onClick={() => go(i.href)}
                  className="w-full text-left px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">{i.label}</button>
              ))}
              <div className="h-px bg-gray-100 my-2" />
              <button onClick={() => { setOpen(false); onSignOut(); }}
                className="w-full flex items-center gap-2 text-left px-3 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                <HugeiconsIcon icon={Logout01Icon} size={15} color="currentColor" strokeWidth={STROKE} /> Sign Out
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
