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
  Settings01Icon,
  Logout01Icon,
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

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-red-500 flex items-center justify-center flex-shrink-0
                          transition-transform duration-200 group-hover:scale-105">
            <span className="text-white text-sm font-black leading-none">G</span>
          </div>
          <span className="font-bold text-base text-gray-900">GG Shop</span>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-0.5 px-3 py-4 flex-1">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">Menu</p>
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
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${isActive
                  ? "bg-red-500 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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

      {/* Bottom: user + logout */}
      <div className="px-3 pb-4 border-t border-gray-100 pt-3">
        {/* User pill */}
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-50 mb-2">
          <div className="w-7 h-7 rounded-full overflow-hidden bg-red-100 flex items-center justify-center flex-shrink-0">
            {userImage ? (
              <Image src={userImage} alt={userName} width={28} height={28} className="object-cover" />
            ) : (
              <span className="text-xs font-bold text-red-500">{userName.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-gray-900 truncate">{userName}</p>
            <p className="text-[10px] text-gray-400">Admin</p>
          </div>
        </div>

        {/* Settings */}
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-500
                     hover:bg-gray-100 hover:text-gray-800 transition-colors"
        >
          <HugeiconsIcon icon={Settings01Icon} size={15} color="currentColor" strokeWidth={STROKE} />
          Settings
        </Link>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-500
                     hover:bg-red-50 hover:text-red-600 transition-colors mt-0.5"
        >
          <HugeiconsIcon icon={Logout01Icon} size={15} color="currentColor" strokeWidth={STROKE} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Mobile top bar ─────────────────────────────────────────────────── */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-500 flex items-center justify-center">
            <span className="text-white text-xs font-black">G</span>
          </div>
          <span className="font-bold text-sm text-gray-900">GG Shop Admin</span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <HugeiconsIcon icon={open ? Cancel01Icon : Menu01Icon} size={20} color="currentColor" strokeWidth={STROKE} />
        </button>
      </div>

      {/* ── Desktop sidebar ─────────────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-56 flex-shrink-0 bg-white border-r border-gray-100 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* ── Mobile drawer ───────────────────────────────────────────────────── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col
          transition-transform duration-300 md:hidden
          ${open ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-500 flex items-center justify-center">
              <span className="text-white text-xs font-black">G</span>
            </div>
            <span className="font-bold text-sm text-gray-900">GG Shop Admin</span>
          </div>
          <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
            <HugeiconsIcon icon={Cancel01Icon} size={18} color="currentColor" strokeWidth={STROKE} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile backdrop */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setOpen(false)} />
      )}
    </>
  );
}
