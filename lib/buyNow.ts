/**
 * lib/buyNow.ts
 *
 * Shared "Buy Now" helper — calls /api/checkout with a single item
 * and redirects straight to Stripe, bypassing the cart entirely.
 *
 * Usage:
 *   const { buyNow, buying } = useBuyNow();
 *   <button disabled={buying} onClick={() => buyNow({ id, name, image, price })}>
 *     Buy Now
 *   </button>
 */

"use client";

import { useState, useRef } from "react";
import toast from "react-hot-toast";

export interface BuyNowItem {
  id:    string;
  name:  string;
  image: string;
  price: number;
}

export function useBuyNow() {
  const [buying, setBuying] = useState(false);
  const guardRef = useRef(false);

  const buyNow = async (item: BuyNowItem) => {
    if (guardRef.current || buying) return;
    guardRef.current = true;
    setBuying(true);

    const toastId = toast.loading("Preparing checkout…");

    try {
      const res = await fetch("/api/checkout", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          cartItems: [{ ...item, quantity: 1 }],
          couponCode: null,
          discount:   0,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Checkout failed. Please try again.", { id: toastId });
        return;
      }

      if (data.url) {
        toast.dismiss(toastId);
        window.location.href = data.url;
        return;
      }

      toast.error("No checkout URL returned.", { id: toastId });
    } catch {
      toast.error("Network error — please try again.", { id: toastId });
    } finally {
      guardRef.current = false;
      setBuying(false);
    }
  };

  return { buyNow, buying };
}
