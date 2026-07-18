"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  Package01Icon,
  AddCircleIcon,
  ShoppingCart01Icon,
  UserIcon,
  Analytics01Icon,
  Menu01Icon,
  Cancel01Icon,
  Logout01Icon,
  Tag01Icon,
} from "@hugeicons/core-free-icons";
import { signOut, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";

const STROKE = 1.5;

const links = [
  { name: "Dashboard",   href: "/dashboard",    icon: DashboardSquare01Icon },
  { name: "Analytics",   href: "/analytics",    icon: Analytics01Icon },
  { name: "Products",    href: "/all-products", icon: Package01Icon },
  { name: "Add Product", href: "/add-product",  icon: AddCircleIcon },
  { name: "Discounts",   href: "/discounts",    icon: Tag01Icon },
  { name: "Orders",      href: "/all-orders",   icon: ShoppingCart01Icon },
  { name: "Customers",   href: "/all-users",    icon: UserIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  const userName  = session?.user?.name  ?? "Admin";
  const userImage = (session?.user as any)?.image as string | undefined;

  const handleSignOut = () =>
    signOut({ fetchOptions: { onSuccess: () => router.push("/sign-in") } });

  const NavLinks = () => (
    <nav className="flex flex-col gap-0.5 px-3 py-3 flex-1">
      {links.map((link) => {
        const isActive =
          pathname === link.href ||
          (link.href !== "/dashboard" && pathname.startsWith(link.href));
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className={`
              flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all
              ${isActive
                ? "bg-red-500 text-white shadow-sm"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              }
            `}
          >
            <HugeiconsIcon
              icon={link.icon}
              size={16}
              color={isActive ? "white" : "currentColor"}
              strokeWidth={STROKE}
            />
            {link.name}
          </Link>
        );
      })}
    </nav>
  );

  const UserFooter = () => (
    <div className="px-3 py-3 border-t border-gray-200">
      {/* User pill */}
      <div className="flex items-center gap-2.5 px-3 py-3 rounded-xl bg-gray-100 mb-1">
        <div className="w-7 h-7 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center flex-shrink-0">
          {userImage ? (
            <Image src={userImage} alt={userName} width={28} height={28} className="object-cover" />
          ) : (
            <span className="text-xs font-bold text-gray-600">{userName.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-gray-900 truncate">{userName}</p>
          <p className="text-[10px] text-gray-500">Admin</p>
        </div>
      </div>

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-gray-500
                   hover:bg-gray-100 hover:text-red-500 transition-all"
      >
        <HugeiconsIcon icon={Logout01Icon} size={16} color="currentColor" strokeWidth={STROKE} />
        Sign Out
      </button>
    </div>
  );

  return (
    <>
      {/* ── Desktop sidebar (fixed) ──────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-56 bg-white border-r border-gray-200 z-30">
        {/* Logo */}
        <div className="flex items-center px-5 py-4 border-b border-gray-200">
          <img src="/m.png" alt="SportShop" className="h-10 w-auto" />
        </div>
        <NavLinks />
        <UserFooter />
      </aside>

      {/* ── Mobile top bar ───────────────────────────────────────────────── */}
      <div className="md:hidden fixed top-0 left-0 right-0 flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 z-30">
        <img src="/m.png" alt="SportShop" className="h-8 w-auto" />
        <button
          onClick={() => setOpen(o => !o)}
          className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <HugeiconsIcon icon={open ? Cancel01Icon : Menu01Icon} size={20} color="currentColor" strokeWidth={STROKE} />
        </button>
      </div>

      {/* ── Mobile drawer ────────────────────────────────────────────────── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white flex flex-col
          transition-transform duration-300 md:hidden
          ${open ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <img src="/m.png" alt="SportShop" className="h-8 w-auto" />
          <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100">
            <HugeiconsIcon icon={Cancel01Icon} size={18} color="currentColor" strokeWidth={STROKE} />
          </button>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <NavLinks />
          <UserFooter />
        </div>
      </aside>

      {/* Mobile backdrop */}
      {open && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setOpen(false)} />
      )}
    </>
  );
}


