"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FiGrid,
  FiPackage,
  FiPlusSquare,
  FiList,
  FiUsers,
  FiTrendingUp,
  FiShoppingBag,
  FiTag,
} from "react-icons/fi";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: <FiGrid size={16} /> },
  { name: "All Products", href: "/all-products", icon: <FiPackage size={16} /> },
  { name: "Add Product", href: "/add-product", icon: <FiPlusSquare size={16} /> },
  { name: "All Orders", href: "/all-orders", icon: <FiShoppingBag size={16} /> },
  { name: "All Users", href: "/all-users", icon: <FiUsers size={16} /> },
  { name: "Analytics", href: "/analytics", icon: <FiTrendingUp size={16} /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-white border-b p-4 sticky top-0 z-30">
        <h1 className="font-bold text-lg text-gray-800">Admin Panel</h1>
        <button
          onClick={() => setOpen(!open)}
          className="px-3 py-2 rounded-md border text-gray-600"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-white border-r min-h-screen p-5 w-64 fixed md:static top-0 left-0 z-50 transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="text-lg font-black uppercase tracking-tight text-gray-900 mb-8 hidden md:block">
          Admin Panel
        </div>

        <nav className="flex flex-col gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <span className={isActive ? "text-white" : "text-gray-400"}>{link.icon}</span>
                {link.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Overlay for Mobile */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}
    </>
  );
}
