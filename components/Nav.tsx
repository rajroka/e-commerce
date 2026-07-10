"use client";

import Link from "next/link";
import Image from "next/image";
import { FaCartShopping } from "react-icons/fa6";
import { FiHeart } from "react-icons/fi";
import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { useWishlistStore } from "@/store/wishlistStore";

// ---------------------------------------------------------------------------
// Session cache helpers (sessionStorage, client-only)
// ---------------------------------------------------------------------------
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
    if (s) {
      sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(s));
    } else {
      sessionStorage.removeItem(SESSION_CACHE_KEY);
    }
  } catch {}
}

// ---------------------------------------------------------------------------
// Nav
// ---------------------------------------------------------------------------
export default function Nav() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Always null on first render (matches server HTML — no hydration mismatch).
  // After mount, we load from sessionStorage so returning users skip the spinner.
  const [displaySession, setDisplaySession] = useState<CachedSession | null>(null);
  const [mounted, setMounted] = useState(false);

  const setUserId = useCartStore((state) => state.setUserId);
  const getTotalQuantity = useCartStore((state) => state.getTotalQuantity);
  const { items: wishlistItems, fetchWishlist, synced } = useWishlistStore();

  // After mount: load cache so the UI updates without waiting for the network
  useEffect(() => {
    setMounted(true);
    const cached = readCachedSession();
    if (cached) setDisplaySession(cached);
  }, []);

  // Once the real session resolves, update display + write cache
  useEffect(() => {
    if (!mounted || isPending) return;

    if (session?.user) {
      const next: CachedSession = {
        email: session.user.email ?? null,
        name: session.user.name ?? null,
        image: session.user.image ?? null,
        role: (session.user as { role?: string }).role ?? null,
        id: session.user.id ?? null,
      };
      setDisplaySession(next);
      writeCachedSession(next);
    } else {
      setDisplaySession(null);
      writeCachedSession(null);
    }
  }, [session, isPending, mounted]);

  // Keep cart store in sync
  useEffect(() => {
    const authStatus = isPending
      ? "loading"
      : session
      ? "authenticated"
      : "unauthenticated";
    setUserId(session?.user?.id ?? null, authStatus);
  }, [session, isPending, setUserId]);

  // Fetch wishlist only once per session
  useEffect(() => {
    if (session?.user && !synced) {
      fetchWishlist();
    }
  }, [session?.user, synced, fetchWishlist]);

  // Before mount: nothing user-specific is shown (matches server render)
  // After mount: show cached or resolved session data
  const userEmail = mounted ? (displaySession?.email ?? undefined) : undefined;
  const userName = mounted ? (displaySession?.name ?? undefined) : undefined;
  const userImage = mounted ? (displaySession?.image ?? undefined) : undefined;
  const isAdmin = mounted ? displaySession?.role === "admin" : false;
  const cartCount = mounted ? getTotalQuantity() : 0;

  // Show spinner only after mount, when no cache exists and session is still loading
  const showSpinner = mounted && isPending && displaySession === null;

  return (
    <header className="sticky top-0 z-50 w-full bg-gray-900/95 backdrop-blur-md border-b border-gray-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/ggimage.png"
              alt="GG Shop Logo"
              width={42}
              height={42}
              priority
              className="rounded-full transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-xl font-bold tracking-tight">GG Shop</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/products" className="text-gray-300 hover:text-purple-400 font-medium transition-colors">
              Products
            </Link>

            {isAdmin && (
              <Link href="/dashboard" className="text-gray-300 hover:text-purple-400 font-medium transition-colors">
                Dashboard
              </Link>
            )}

            <Link href="/cart" className="relative text-gray-300 hover:text-purple-400 p-2 transition-colors" aria-label="Cart">
              <FaCartShopping size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {userEmail && (
              <Link href="/wishlist" className="relative text-gray-300 hover:text-purple-400 p-2 transition-colors" aria-label="Wishlist">
                <FiHeart size={20} />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {wishlistItems.length > 9 ? "9+" : wishlistItems.length}
                  </span>
                )}
              </Link>
            )}

            {showSpinner ? (
              <div className="flex items-center gap-3 pl-4 border-l border-gray-700">
                <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : userEmail ? (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-700">
                <Link href="/profile" className="flex flex-col items-end hover:text-purple-400 transition-colors">
                  <span className="text-sm font-semibold">{userName || userEmail}</span>
                </Link>

                {userImage && (
                  <Image
                    src={userImage}
                    alt={userName || "User avatar"}
                    width={38}
                    height={38}
                    className="rounded-full border-2 border-purple-400/50 shadow-sm"
                  />
                )}

                <button
                  onClick={async () => {
                    writeCachedSession(null);
                    setDisplaySession(null);
                    await signOut({
                      fetchOptions: {
                        onSuccess: () => router.push("/sign-in"),
                      },
                    });
                  }}
                  className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
                >
                  Sign out
                </button>
              </div>
            ) : (
              // Only render sign-in/up buttons after mount to match server render
              mounted ? (
                <div className="flex gap-3 items-center ml-4">
                  <button
                    onClick={() => router.push("/sign-up")}
                    className="bg-white text-black font-medium px-5 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm"
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={() => router.push("/sign-in")}
                    className="border border-white text-white font-medium px-5 py-2 rounded-md hover:bg-neutral-800 transition-colors text-sm"
                  >
                    Sign In
                  </button>
                </div>
              ) : (
                // Placeholder matching the approximate width to avoid layout shift
                <div className="w-[168px]" />
              )
            )}
          </nav>

          <MobileNav
            userEmail={userEmail}
            userName={userName}
            userImage={userImage}
            cartCount={cartCount}
            showSpinner={showSpinner}
            isAdmin={isAdmin}
            mounted={mounted}
            onSignOut={async () => {
              writeCachedSession(null);
              setDisplaySession(null);
              await signOut({
                fetchOptions: {
                  onSuccess: () => router.push("/sign-in"),
                },
              });
            }}
          />
        </div>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// MobileNav
// ---------------------------------------------------------------------------
function MobileNav({
  userEmail,
  userName,
  userImage,
  cartCount,
  showSpinner,
  isAdmin,
  mounted,
  onSignOut,
}: {
  userEmail: string | undefined;
  userName: string | undefined | null;
  userImage: string | undefined | null;
  cartCount: number;
  showSpinner: boolean;
  isAdmin: boolean;
  mounted: boolean;
  onSignOut: () => void;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleNavigate = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <div className="md:hidden flex items-center gap-2">
      <Link href="/cart" className="relative p-2 text-gray-300" aria-label="Cart">
        <FaCartShopping size={20} />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {cartCount > 9 ? "9+" : cartCount}
          </span>
        )}
      </Link>

      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg text-gray-300 hover:text-white transition-colors"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        {open ? "✕" : "☰"}
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-16 right-0 w-72 bg-gray-900 border-l border-gray-700 h-[calc(100vh-4rem)] flex flex-col px-6 py-8 space-y-6 z-40 shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={() => handleNavigate("/products")}
          className="text-lg font-medium text-gray-300 hover:text-purple-400 text-left transition-colors"
        >
          Products
        </button>

        {isAdmin && (
          <button
            onClick={() => handleNavigate("/dashboard")}
            className="text-lg font-medium text-gray-300 hover:text-purple-400 text-left transition-colors"
          >
            Dashboard
          </button>
        )}

        <button
          onClick={() => handleNavigate("/cart")}
          className="text-lg font-medium text-gray-300 hover:text-purple-400 text-left transition-colors flex items-center gap-2"
        >
          Cart
          {cartCount > 0 && (
            <span className="bg-purple-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {cartCount}
            </span>
          )}
        </button>

        <div className="h-px bg-gray-800 w-full" />

        {showSpinner ? (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
            Loading...
          </div>
        ) : userEmail ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {userImage && (
                <Image
                  src={userImage}
                  alt={userName || "User"}
                  width={36}
                  height={36}
                  className="rounded-full border-2 border-purple-400/50"
                />
              )}
              <div>
                <p className="text-sm font-semibold text-white">{userName || "User"}</p>
                <p className="text-xs text-gray-400 truncate max-w-[160px]">{userEmail}</p>
              </div>
            </div>
            <button
              onClick={() => { setOpen(false); onSignOut(); }}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md text-sm font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : mounted ? (
          <div className="space-y-3">
            <button
              onClick={() => handleNavigate("/sign-up")}
              className="w-full bg-white text-black font-medium py-3 rounded-md hover:bg-gray-200 transition-colors text-sm"
            >
              Sign Up
            </button>
            <button
              onClick={() => handleNavigate("/sign-in")}
              className="w-full border border-white text-white font-medium py-3 rounded-md hover:bg-neutral-800 transition-colors text-sm"
            >
              Sign In
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
