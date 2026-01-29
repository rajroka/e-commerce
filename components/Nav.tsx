import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { FaCartShopping } from "react-icons/fa6";
import SignOutButton from "./Sign-out";

export default async function Nav() {
  const session = await auth();
  const user = session?.user;

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
            <span className="text-xl font-bold text-white bg-clip-text">
              GG Shop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/products"
              className="text-gray-300 hover:text-purple-400 transition-colors duration-200 font-medium relative group"
            >
              Products
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-200 group-hover:w-full"></span>
            </Link>

            <Link
              href="/cart"
              className="relative flex items-center text-gray-300 hover:text-purple-400 transition-colors duration-200"
            >
              <FaCartShopping size={22} />
              <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                {user.image && (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    width={38}
                    height={38}
                    className="rounded-full border-2 border-purple-400/50 hover:border-purple-400 transition-colors duration-200"
                  />
                )}
                <SignOutButton />
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/api/auth/signin"
                  className="px-4 py-2  text-gray-300 border rounded   hover:text-white transition-colors duration-200 font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/api/auth/signin"
                  className="px-4 py-2  rounded text-black bg-gray-100  hover:bg-gray-300 transition-all duration-200  font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Navigation */}
          <MobileNav user={user} />
        </div>
      </div>
    </header>
  );
}

// Mobile Navigation
function MobileNav({ user }: { user: any }) {
  return (
    <div className="md:hidden">
      {/* Mobile Menu Trigger */}
      <input type="checkbox" id="mobile-menu-toggle" className="hidden peer" />
      <label
        htmlFor="mobile-menu-toggle"
        className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200 cursor-pointer flex items-center z-50 relative"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </label>

      {/* Mobile Menu Dropdown */}
      <div className="absolute top-16 left-0 w-full bg-gray-900/95 backdrop-blur-md border-b border-gray-700 shadow-xl hidden peer-checked:flex flex-col px-4 py-6 space-y-6 z-40">
        <Link
          href="/products"
          className="block text-lg text-gray-300 hover:text-purple-400 transition-colors duration-200 font-medium py-2"
        >
          Products
        </Link>

        <Link
          href="/cart"
          className="flex items-center text-lg text-gray-300 hover:text-purple-400 transition-colors duration-200 py-2"
        >
          <FaCartShopping size={20} className="mr-3" />
          Shopping Cart
          <span className="ml-2 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            0
          </span>
        </Link>

        {user ? (
          <div className="pt-4 border-t border-gray-700 space-y-4">
            <div className="flex items-center gap-3">
              {user.image && (
                <Image
                  src={user.image}
                  alt={user.name || "User"}
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-purple-400"
                />
              )}
              <span className="text-white font-medium">{user.name}</span>
            </div>
            <SignOutButton />
          </div>
        ) : (
          <div className="pt-4 border-t border-gray-700 space-y-3">
            <Link
              href="/api/auth/signin"
              className="block w-full text-center px-4 py-3 text-gray-300 hover:text-white transition-colors duration-200 font-medium border border-gray-600 rounded-lg hover:border-purple-400"
            >
              Login
            </Link>
            <Link
              href="/api/auth/signin"
              className="block w-full text-center px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Overlay */}
      <label
        htmlFor="mobile-menu-toggle"
        className="hidden peer-checked:block fixed inset-0 bg-black/20 z-30"
      />
    </div>
  );
}