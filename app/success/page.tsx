"use client";

import { useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle01Icon,
  Package01Icon,
  ArrowRight01Icon,
  LoaderPinwheelIcon,
} from "@hugeicons/core-free-icons";
import { useCartStore } from "@/store/cartStore";

const STROKE = 1.5;

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId    = searchParams.get("session_id");
  const clearCart    = useCartStore(s => s.clearCart);
  const clearedRef   = useRef(false);

  // Clear the client-side cart exactly once.
  // The server cart (MongoDB) was already cleared by the Stripe webhook.
  useEffect(() => {
    if (!clearedRef.current) {
      clearedRef.current = true;
      clearCart();
    }
  }, [clearCart]);

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center max-w-md w-full space-y-6">
        {/* Icon — border only, no soft bg */}
        <div className="w-20 h-20 rounded-full border-2 border-green-200 flex items-center justify-center mx-auto">
          <HugeiconsIcon
            icon={CheckmarkCircle01Icon}
            size={44}
            color="#22c55e"
            strokeWidth={STROKE}
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Successful!</h1>
          <p className="text-sm text-gray-500 mt-2">
            Your order is confirmed. A receipt has been sent to your email.
          </p>
        </div>

        {sessionId && (
          <div className="border border-gray-100 rounded-xl px-4 py-3 text-left">
            <p className="text-[10px] text-gray-400 mb-0.5">Order Reference</p>
            <p className="font-mono text-xs text-gray-600 break-all">
              #{sessionId.slice(-12).toUpperCase()}
            </p>
          </div>
        )}

        <div className="border border-gray-100 rounded-xl p-4 text-left space-y-3">
          <p className="text-xs font-semibold text-gray-700">What happens next</p>
          {[
            "Your order is being prepared",
            "You'll receive an email confirmation shortly",
            "Track your order under Profile → Orders",
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full border border-gray-200 text-[10px] font-bold text-gray-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-xs text-gray-600">{step}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <Link
            href="/profile?tab=orders"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-full transition-colors"
          >
            <HugeiconsIcon icon={Package01Icon} size={15} color="white" strokeWidth={STROKE} />
            View Orders
          </Link>
          <Link
            href="/products"
            className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 text-gray-700 text-sm font-semibold rounded-full hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Keep Shopping
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} color="currentColor" strokeWidth={STROKE} />
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center">
          <HugeiconsIcon
            icon={LoaderPinwheelIcon}
            size={28}
            color="#ef4444"
            strokeWidth={STROKE}
            className="animate-spin"
          />
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
