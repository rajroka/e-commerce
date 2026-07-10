"use client";

import Link from "next/link";
import { FiXCircle } from "react-icons/fi";

export default function CancelPage() {
  return (
    <main className="min-h-screen bg-[#F9F4F5] flex items-center justify-center px-4">
      <div className="bg-white border border-gray-100 shadow-sm p-12 max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <FiXCircle className="text-red-400 text-6xl" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-900">
            Payment Cancelled
          </h1>
          <p className="text-sm text-gray-500 uppercase tracking-widest">
            Your order was not completed.
          </p>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed">
          No charges were made. Your cart items are still saved — you can try again whenever you&apos;re ready.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link
            href="/cart"
            className="flex-1 py-3 bg-gray-800 text-white text-sm font-bold uppercase tracking-[0.15em] hover:bg-black transition-all rounded text-center"
          >
            Return to Cart
          </Link>
          <Link
            href="/products"
            className="flex-1 py-3 border border-gray-300 text-gray-700 text-sm font-bold uppercase tracking-[0.15em] hover:bg-gray-50 transition-all rounded text-center"
          >
            Keep Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
