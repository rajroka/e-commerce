'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { CircleCheckIcon, Package01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { useCartStore } from '@/store/cartStore';

const STROKE = 1.5;

export default function SuccessPage() {
  const clearCart = useCartStore(s => s.clearCart);
  useEffect(() => { clearCart(); }, [clearCart]);

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="card max-w-sm w-full p-10 text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <HugeiconsIcon icon={CircleCheckIcon} size={30} color="#22c55e" strokeWidth={STROKE} />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Payment successful</h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-8">Your order is confirmed. A receipt has been sent to your email.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/profile" className="btn-primary flex-1 justify-center py-2.5 rounded-xl">
            <HugeiconsIcon icon={Package01Icon} size={15} color="white" strokeWidth={STROKE} /> View Orders
          </Link>
          <Link href="/products" className="btn-ghost flex-1 justify-center py-2.5 rounded-xl">
            Keep Shopping <HugeiconsIcon icon={ArrowRight01Icon} size={15} color="currentColor" strokeWidth={STROKE} />
          </Link>
        </div>
      </div>
    </main>
  );
}
