"use client";

import Link from "next/link";
import Image from "next/image";
import { FaCartShopping } from "react-icons/fa6";
import { useCartStore } from "@/store/cartStore";
import { useEffect } from "react";
import { useSession  } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { signOut} from "@/lib/auth-client"

export default function Nav() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const setUserId = useCartStore((state) => state.setUserId);

useEffect(() => {
  const status = isPending
    ? "loading"
    : session
    ? "authenticated"
    : "unauthenticated";

  setUserId(session?.user?.email || null, status);
}, [session, isPending, setUserId]);

  const userEmail = session?.user?.email;
  const userName = session?.user?.name;
  const userImage = session?.user?.image;
  const admin = (session?.user as any)?.role
console.log(admin)
  return (
    <header className="sticky top-0 z-50 w-full px-4 md:px-6 lg:px-10  bg-gray-900/95 backdrop-blur-md border-b border-gray-700 text-white shadow-lg">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/ggimage.png"
              alt="Logo"
              width={42}
              height={42}
              className="rounded-full transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-xl font-bold tracking-tight">GG Shop</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/products" className="text-gray-300 hover:text-purple-400 font-medium">
              Products
            </Link>

            <Link href="/cart" className="text-gray-300 hover:text-purple-400 p-2">
              <FaCartShopping size={22} />
            </Link>

            {/* User Section */}
  {isPending ? (
    // Loading state
    <div className="flex items-center gap-3 pl-4 border-l border-gray-700">
      <div className="w-6 h-6 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-gray-300 text-sm">Loading...</span>
    </div>
  ) : userEmail ? (
    <div className="flex items-center gap-4 pl-4 border-l border-gray-700">
      <div className="flex flex-col items-end">
        <span className="text-sm font-semibold">{userName || userEmail}</span>
      </div>

      {userImage && (
        <Image
          src={userImage}
          alt={userName || "User"}
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
        className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600"
      >
        Sign out
      </button>
    </div>
  ) : (
    <div className="flex gap-3 items-center ml-4">
      <button
        onClick={() => router.push("/sign-up")}
        className="bg-white text-black font-medium px-6 py-2 rounded-md hover:bg-gray-200"
      >
        Sign Up
      </button>

      <button
        onClick={() => router.push("/sign-in")}
        className="border border-white text-white font-medium px-6 py-2 rounded-md hover:bg-neutral-800"
      >
        Sign In
      </button>
    </div>
  )}
          </nav>

          <MobileNav userEmail={userEmail} />
        </div>
      </div>
    </header>
  );
}

function MobileNav({ userEmail }: { userEmail: string | undefined }) {
  return (
    <div className="md:hidden flex items-center">
      <Link href="/cart" className="relative p-2 mr-2 text-gray-300">
        <FaCartShopping size={20} />
      </Link>

      <input type="checkbox" id="mobile-menu-toggle" className="hidden peer" />

      <label
        htmlFor="mobile-menu-toggle"
        className="p-2 rounded-lg text-gray-300 hover:text-white cursor-pointer z-50 relative"
      >
        ☰
      </label>

      <div className="fixed inset-0 bg-black/50 hidden peer-checked:block z-30" />

      <div className="absolute top-16 right-0 w-64 bg-gray-900 border-l border-gray-700 h-screen hidden peer-checked:flex flex-col px-6 py-8 space-y-6 z-40 shadow-2xl">
        <Link href="/products" className="text-lg font-medium text-gray-300 hover:text-purple-400">
          Products
        </Link>

        <Link href="/cart" className="text-lg font-medium text-gray-300 hover:text-purple-400">
          Cart
        </Link>

        <div className="h-px bg-gray-800 w-full my-2" />

        {userEmail ? (
          <p className="text-sm text-gray-400">Logged in as {userEmail}</p>
        ) : (
          <Link
            href="/sign-in"
            className="w-full text-center py-3 bg-purple-600 rounded-lg font-bold"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
