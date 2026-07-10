"use client";

import Link from "next/link";
import Image from "next/image";
import { FaCartShopping, FaChevronDown } from "react-icons/fa6";
import { FiHeart, FiSearch, FiUser } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
import { useCartStore } from "@/store/cartStore";
import { useEffect, useRef, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { useWishlistStore } from "@/store/wishlistStore";

// ─── Session cache ────────────────────────────────────────────────────────────
interface CachedSession {
  email: string | null;
  name: string | null;
  image: string | null;
  role: string | null;
  id: string | null;
}

const SESSION_CACHE_KEY = "gg-nav-session-cache";

function readCachedSession(): CachedSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_CACHE_KEY);
    return raw ? (JSON.parse(raw) as CachedSession) : null;
  } catch {
    return null;
  }
}

function writeCachedSession(s: CachedSession | null) {
  try {
    if (s) sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(s));
    else sessionStorage.removeItem(SESSION_CACHE_KEY);
  } catch {}
}

// ─── Language options ─────────────────────────────────────────────────────────
const LANGS = [
  { code: "EN", label: "English", flag: "🇺🇸" },
  { code: "NP", label: "Nepali",  flag: "🇳🇵" },
  { code: "AR", label: "Arabic",  flag: "🇸🇦" },
];

// ─── Nav ──────────────────────────────────────────────────────────────────────
export default function Nav() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [displaySession, setDisplaySession] = useState<CachedSession | null>(null);
  const [mounted, setMounted]               = useState(false);
  const [searchQuery, setSearchQuery]       = useState("");
  const [langOpen, setLangOpen]             = useState(false);
  const [activeLang, setActiveLang]         = useState(LANGS[0]);
  const [userMenuOpen, setUserMenuOpen]     = useState(false);

  const langRef     = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const setUserId        = useCartStore((s) => s.setUserId);
  const getTotalQuantity = useCartStore((s) => s.getTotalQuantity);
  const { items: wishlistItems, fetchWishlist, synced } = useWishlistStore();

  // Mount + session cache
  useEffect(() => {
    setMounted(true);
    const cached = readCachedSession();
    if (cached) setDisplaySession(cached);
  }, []);

  useEffect(() => {
    if (!mounted || isPending) return;
    if (session?.user) {
      const next: CachedSession = {
        email: session.user.email ?? null,
        name:  session.user.name  ?? null,
        image: session.user.image ?? null,
        role:  (session.user as { role?: string }).role ?? null,
        id:    session.user.id    ?? null,
      };
      setDisplaySession(next);
      writeCachedSession(next);
    } else {
      setDisplaySession(null);
      writeCachedSession(null);
    }
  }, [session, isPending, mounted]);

  useEffect(() => {
    const authStatus = isPending ? "loading" : session ? "authenticated" : "unauthenticated";
    setUserId(session?.user?.id ?? null, authStatus);
  }, [session, isPending, setUserId]);

  useEffect(() => {
    if (session?.user && !synced) fetchWishlist();
  }, [session?.user, synced, fetchWishlist]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const userEmail = mounted ? (displaySession?.email ?? undefined) : undefined;
  const userName  = mounted ? (displaySession?.name  ?? undefined) : undefined;
  const userImage = mounted ? (displaySession?.image ?? undefined) : undefined;
  const isAdmin   = mounted ? displaySession?.role === "admin" : false;
  const cartCount = mounted ? getTotalQuantity() : 0;
  const showSpinner = mounted && isPending && displaySession === null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    writeCachedSession(null);
    setDisplaySession(null);
    await signOut({ fetchOptions: { onSuccess: () => router.push("/sign-in") } });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-16">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <Image
              src="/ggimage.png"
              alt="GG Shop"
              width={38}
              height={38}
              priority
              className="rounded-full transition-transform duration-200 group-hover:scale-105"
            />
            <span className="text-lg font-bold text-red-500 hidden sm:block">
              GG Shop
            </span>
          </Link>

          {/* ── Search bar (desktop) ── */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-auto items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 gap-2 focus-within:border-red-400 focus-within:ring-1 focus-within:ring-red-300 transition-all"
          >
            <FiSearch className="text-gray-400 flex-shrink-0" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
            />
          </form>

          {/* ── Right actions ── */}
          <div className="flex items-center gap-1 ml-auto">

            {/* Cart */}
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative p-2 text-gray-600 hover:text-red-500 transition-colors"
            >
              <FaCartShopping size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative p-2 text-gray-600 hover:text-red-500 transition-colors"
            >
              <FiHeart size={20} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {wishlistItems.length > 9 ? "9+" : wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Language picker */}
            <div ref={langRef} className="relative hidden sm:block">
              <button
                onClick={() => setLangOpen((o) => !o)}
                className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-50"
                aria-expanded={langOpen}
                aria-label="Select language"
              >
                <span className="text-base leading-none">{activeLang.flag}</span>
                <span className="font-medium">{activeLang.label}</span>
                <FaChevronDown
                  size={10}
                  className={`transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`}
                />
              </button>

              {langOpen && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
                  {LANGS.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setActiveLang(l); setLangOpen(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-gray-50 ${
                        activeLang.code === l.code ? "text-red-500 font-semibold" : "text-gray-700"
                      }`}
                    >
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User section */}
            {showSpinner ? (
              <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin mx-2" />
            ) : userEmail ? (
              <div ref={userMenuRef} className="relative hidden md:block">
                <button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className="flex items-center gap-2 pl-3 border-l border-gray-200 hover:bg-gray-50 rounded-lg px-2 py-1.5 transition-colors"
                  aria-expanded={userMenuOpen}
                >
                  {userImage ? (
                    <Image
                      src={userImage}
                      alt={userName || "User"}
                      width={30}
                      height={30}
                      className="rounded-full ring-2 ring-red-200 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <FiUser size={14} className="text-red-500" />
                    </div>
                  )}
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-[10px] text-gray-400">Welcome Back!</span>
                    <span className="text-xs font-bold text-gray-800 max-w-[100px] truncate">
                      {userName || userEmail}
                    </span>
                  </div>
                  <FaChevronDown
                    size={10}
                    className={`text-gray-400 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500 transition-colors"
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500 transition-colors"
                    >
                      My Orders
                    </Link>
                    <Link
                      href="/wishlist"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500 transition-colors"
                    >
                      Wishlist
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500 transition-colors"
                      >
                        Dashboard
                      </Link>
                    )}
                    <div className="h-px bg-gray-100 mx-3 my-1" />
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors font-semibold"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : mounted ? (
              <div className="hidden md:flex items-center gap-2 pl-3 border-l border-gray-200">
                <button
                  onClick={() => router.push("/sign-in")}
                  className="text-sm font-semibold text-gray-700 hover:text-red-500 transition-colors px-2 py-1.5"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push("/sign-up")}
                  className="text-sm font-bold bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-full transition-colors"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <div className="hidden md:block w-[168px]" />
            )}

            {/* Mobile hamburger */}
            <MobileNav
              userEmail={userEmail}
              userName={userName}
              userImage={userImage}
              cartCount={cartCount}
              showSpinner={showSpinner}
              isAdmin={isAdmin}
              mounted={mounted}
              wishlistCount={wishlistItems.length}
              onSignOut={handleSignOut}
            />
          </div>
        </div>

        {/* ── Mobile search bar ── */}
        <form
          onSubmit={handleSearch}
          className="md:hidden flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 gap-2 mb-3 focus-within:border-red-400 focus-within:ring-1 focus-within:ring-red-300 transition-all"
        >
          <FiSearch className="text-gray-400 flex-shrink-0" size={15} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="What are you looking for?"
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
          />
        </form>
      </div>
    </header>
  );
}

// ─── MobileNav ────────────────────────────────────────────────────────────────
function MobileNav({
  userEmail, userName, userImage,
  cartCount, showSpinner, isAdmin, mounted,
  wishlistCount, onSignOut,
}: {
  userEmail: string | undefined;
  userName: string | undefined | null;
  userImage: string | undefined | null;
  cartCount: number;
  showSpinner: boolean;
  isAdmin: boolean;
  mounted: boolean;
  wishlistCount: number;
  onSignOut: () => void;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const go = (href: string) => { setOpen(false); router.push(href); };

  return (
    <div className="md:hidden flex items-center">
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-2 text-gray-600 hover:text-red-500 transition-colors"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        {open ? (
          <HiX size={20} />
        ) : (
          <HiMenu size={20} />
        )}
      </button>

      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-30" onClick={() => setOpen(false)} />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 w-72 h-full bg-white shadow-2xl z-40 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-base font-bold text-red-500">GG Shop</span>
          <button onClick={() => setOpen(false)} className="p-1 text-gray-400 hover:text-gray-700">
          <HiX size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-1 px-3 py-4 overflow-y-auto flex-1">
          <NavItem label="Home"     onClick={() => go("/")} />
          <NavItem label="Products" onClick={() => go("/products")} />
          <NavItem
            label={`Cart${cartCount > 0 ? ` (${cartCount})` : ""}`}
            onClick={() => go("/cart")}
          />
          <NavItem
            label={`Wishlist${wishlistCount > 0 ? ` (${wishlistCount})` : ""}`}
            onClick={() => go("/wishlist")}
          />
          {isAdmin && <NavItem label="Dashboard" onClick={() => go("/dashboard")} />}

          <div className="h-px bg-gray-100 my-2" />

          {showSpinner ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm px-3 py-2">
              <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
              Loading…
            </div>
          ) : userEmail ? (
            <>
              <div className="flex items-center gap-3 px-3 py-3 bg-gray-50 rounded-xl mb-2">
                {userImage ? (
                  <Image src={userImage} alt={userName || "User"} width={36} height={36} className="rounded-full ring-2 ring-red-200" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
                    <FiUser size={16} className="text-red-500" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold text-gray-900">{userName || "User"}</p>
                  <p className="text-xs text-gray-400 truncate max-w-[160px]">{userEmail}</p>
                </div>
              </div>
              <NavItem label="My Profile" onClick={() => go("/profile")} />
              <NavItem label="My Orders"  onClick={() => go("/orders")} />
              <div className="h-px bg-gray-100 my-2" />
              <button
                onClick={() => { setOpen(false); onSignOut(); }}
                className="w-full text-left px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : mounted ? (
            <div className="flex flex-col gap-2 mt-2">
              <button
                onClick={() => go("/sign-up")}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-full text-sm transition-colors"
              >
                Sign Up
              </button>
              <button
                onClick={() => go("/sign-in")}
                className="w-full border border-gray-200 text-gray-700 font-semibold py-3 rounded-full text-sm hover:bg-gray-50 transition-colors"
              >
                Sign In
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function NavItem({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
    >
      {label}
    </button>
  );
}
