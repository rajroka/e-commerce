import Link from "next/link"
import Image from "next/image"
import { auth } from "@/auth"  // we'll create this helper below
import { FaCartShopping } from "react-icons/fa6"
import SignOutButton from "./Sign-out"

export default async function Nav() {
  const session = await auth() // server-side session check
  const user = session?.user

  return (
    <header className="sticky top-0 z-50 w-full bg-gray-900 text-white shadow-md">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/ggimage.png" alt="Logo" width={40} height={40} className="rounded-full" />
          <span className="text-xl font-semibold text-purple-400">Raj Store</span>
        </Link>

        <nav className="flex items-center gap-5">
          <Link href="/products" className="hover:text-purple-400">Products</Link>
          <Link href="/cart" className="relative flex items-center hover:text-purple-400">
            <FaCartShopping size={20} />
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              {user.image && (
                <Image
                  src={user.image}
                  alt={user.name || "User"}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
               <SignOutButton />
            </div>
          ) : (
            <Link
              href="/api/auth/signin"
              className="px-3 py-1 bg-purple-600 rounded hover:bg-purple-700 transition"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
