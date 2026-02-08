"use client";

import Link from "next/link";
import Image from "next/image";
import { FaCartShopping } from "react-icons/fa6";
import SignOutButton from "./Sign-out";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Nav() {
  const { status, data: session } = useSession();
  const user = session?.user;

  // 1. Standard Zustand hook usage
  const setUserId = useCartStore((state) => state.setUserId);
  const getTotalQuantity = useCartStore((state) => state.getTotalQuantity);
  
  // 2. Hydration Guard: Prevents "Text content does not match" errors
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // ✅ 3. Pass BOTH email and status to the store
    // The store logic now uses 'status' to decide whether to wipe or keep items
    setUserId(session?.user?.email || null, status);
    
  }, [session, status, setUserId]);

  if (status === "loading") {
    return (
      <header className="sticky top-0 z-50 w-full bg-gray-900 border-b border-gray-700 h-16 flex items-center px-8 text-white">
        <div className="animate-pulse flex space-x-4 w-full max-w-7xl mx-auto">
          <div className="rounded-full bg-gray-700 h-10 w-10"></div>
          <div className="h-4 bg-gray-700 rounded w-24 mt-3"></div>
        </div>
      </header>
    );
  }

  // Get quantity safely only after mounting to avoid hydration mismatch
  const totalQuantity = mounted ? getTotalQuantity() : 0;

  return (
    <header className="sticky top-0 z-50 w-full bg-gray-900/95 backdrop-blur-md border-b border-gray-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Image
                src="/ggimage.png"
                alt="Logo"
                width={42}
                height={42}
                className="rounded-full transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">GG Shop</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/products"
              className="text-gray-300 hover:text-purple-400 transition-colors duration-200 font-medium relative group"
            >
              Products
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-200 group-hover:w-full"></span>
            </Link>

            <Link
              href="/cart"
              className="relative flex items-center text-gray-300 hover:text-purple-400 transition-colors duration-200 p-2"
            >
              <FaCartShopping size={22} />
              {totalQuantity > 0 && (
                <span className="absolute top-0 right-0 bg-purple-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-in zoom-in">
                  {totalQuantity}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-700">
                <div className="flex flex-col items-end mr-1">
                  <span className="text-xs text-gray-400">Welcome,</span>
                  <span className="text-sm font-semibold">{user.name?.split(' ')[0]}</span>
                </div>
                {user.image && (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    width={38}
                    height={38}
                    className="rounded-full border-2 border-purple-400/50 hover:border-purple-400 transition-colors duration-200 shadow-sm"
                  />
                )}
                <SignOutButton />
              </div>
            ) : (
              <div className="flex gap-3 items-center ml-4">
                <Link
                  href="/api/auth/signin"
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/api/auth/signin"
                  className="px-5 py-2 text-sm rounded-lg text-black bg-white hover:bg-gray-200 transition-all duration-200 font-bold"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Navigation */}
          <MobileNav user={user} totalQuantity={totalQuantity} />
        </div>
      </div>
    </header>
  );
}

function MobileNav({ user, totalQuantity }: { user: any, totalQuantity: number }) {
  return (
    <div className="md:hidden flex items-center">
      {/* Small cart icon for mobile always visible */}
      <Link href="/cart" className="relative p-2 mr-2 text-gray-300">
        <FaCartShopping size={20} />
        {totalQuantity > 0 && (
          <span className="absolute top-0 right-0 bg-purple-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            {totalQuantity}
          </span>
        )}
      </Link>

      <input type="checkbox" id="mobile-menu-toggle" className="hidden peer" />
      <label
        htmlFor="mobile-menu-toggle"
        className="p-2 rounded-lg text-gray-300 hover:text-white cursor-pointer z-50 relative"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </label>

      {/* Mobile Sidebar */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm hidden peer-checked:block z-30" />
      <div className="absolute top-16 right-0 w-64 bg-gray-900 border-l border-gray-700 h-screen hidden peer-checked:flex flex-col px-6 py-8 space-y-6 z-40 transition-all duration-300 shadow-2xl">
        <Link href="/products" className="text-lg font-medium text-gray-300 hover:text-purple-400">Products</Link>
        <Link href="/cart" className="flex items-center text-lg font-medium text-gray-300 hover:text-purple-400">
          Cart ({totalQuantity})
        </Link>
        <div className="h-px bg-gray-800 w-full my-2" />
        {user ? (
          <div className="flex flex-col gap-4">
            <span className="text-sm text-gray-400">{user.email}</span>
            <SignOutButton />
          </div>
        ) : (
          <Link href="/api/auth/signin" className="w-full text-center py-3 bg-purple-600 rounded-lg font-bold">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}