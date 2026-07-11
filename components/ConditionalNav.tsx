"use client";

import { usePathname } from "next/navigation";
import Nav from "@/components/Nav";

/**
 * Renders the public <Nav /> on all routes EXCEPT the admin dashboard.
 * Dashboard has its own sidebar — the global nav would double-stack.
 */
const HIDDEN_PREFIXES = ["/dashboard", "/all-products", "/all-orders", "/all-users", "/analytics", "/add-product", "/edit-product"];

export default function ConditionalNav() {
  const pathname = usePathname();
  const hide = HIDDEN_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  if (hide) return null;
  return <Nav />;
}
