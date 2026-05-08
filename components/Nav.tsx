"use client";

import Link from "next/link";
import Image from "next/image";
import { FaCartShopping } from "react-icons/fa6";
import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

export default function Nav() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const setUserId = useCartStore((state) => state.setUserId);
  const getTotalQuantity = useCartStore((state) => state.getTotalQuantity);

  useEffect(() => {
    const authStatus = isPending
      ? "loading"
      : session
      ? "authenticated"
      : "unauthenticated";

    setUserId(session?.user?.email || null, authStatus);
  }, [session, isPending, setUserId]);

  const userEmail = session?.user?.email;
  const userName = session?.user?.name;
  const userImage = session?.user?.image;
  const cartCount = getTotalQuantity();

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
              className="rounded-full transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-xl font-bold tracking-tight">GG Shop</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/products" className="text-gray-300 hover:text-purple-400 font-medium transition-colors">
              Products
            </Link>

            {session?.user?.role === 'admin' && (
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

            {/* User Section */}
            {isPending ? (
              <div className="flex items-center gap-3 pl-4 border-l border-gray-700">
                <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : userEmail ? (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-700">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold">{userName || userEmail}</span>
                </div>

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
            )}
          </nav>

          <MobileNav
            userEmail={userEmail}
            userName={userName}
            userImage={userImage}
            cartCount={cartCount}
            isPending={isPending}
            isAdmin={session?.user?.role === 'admin'}
            onSignOut={async () => {
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

function MobileNav({
  userEmail,
  userName,
  userImage,
  cartCount,
  isPending,
  isAdmin,
  onSignOut,
}: {
  userEmail: string | undefined;
  userName: string | undefined | null;
  userImage: string | undefined | null;
  cartCount: number;
  isPending: boolean;
  isAdmin: boolean;
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

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
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

        {isPending ? (
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
        ) : (
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
        )}
      </div>
    </div>
  );
}
