"use client";

import Link from "next/link";
import { FiCheckCircle } from "react-icons/fi";

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-[#F9F4F5] flex items-center justify-center px-4">
      <div className="bg-white border border-gray-100 shadow-sm p-12 max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <FiCheckCircle className="text-green-500 text-6xl" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-900">
            Payment Successful
          </h1>
          <p className="text-sm text-gray-500 uppercase tracking-widest">
            Thank you for your purchase!
          </p>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed">
          Your order has been confirmed. You'll receive a confirmation email shortly.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link
            href="/products"
            className="flex-1 py-3 bg-gray-800 text-white text-sm font-bold uppercase tracking-[0.15em] hover:bg-black transition-all rounded text-center"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="flex-1 py-3 border border-gray-300 text-gray-700 text-sm font-bold uppercase tracking-[0.15em] hover:bg-gray-50 transition-all rounded text-center"
          >
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}
