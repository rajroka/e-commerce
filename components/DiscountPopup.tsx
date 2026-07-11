'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, Tag01Icon } from '@hugeicons/core-free-icons';

const DiscountPopup = ({ children }: { children?: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const STROKE = 1.5;

  useEffect(() => {
    if (!localStorage.getItem('gg-popup-shown')) {
      const timer = setTimeout(() => {
        setOpen(true);
        localStorage.setItem('gg-popup-shown', 'true');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      role="dialog" aria-modal="true" aria-label="Special offer">
      <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full overflow-hidden">
        <button onClick={() => setOpen(false)} aria-label="Close offer"
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors z-10">
          <HugeiconsIcon icon={Cancel01Icon} size={16} color="currentColor" strokeWidth={STROKE} />
        </button>

        <div className="bg-gradient-to-br from-red-500 to-red-600 px-6 pt-8 pb-10 text-white text-center">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <HugeiconsIcon icon={Tag01Icon} size={22} color="white" strokeWidth={STROKE} />
          </div>
          <h2 className="text-2xl font-bold mb-1">15% Off Today</h2>
          <p className="text-red-100 text-sm">On your first order</p>
        </div>

        <div className="px-6 py-6 text-center">
          <div className="bg-gray-50 rounded-xl border border-dashed border-gray-200 px-4 py-3 mb-5">
            <p className="text-xs text-gray-500 mb-1">Use code at checkout</p>
            <p className="text-lg font-bold text-gray-900 tracking-wider">WELCOME15</p>
          </div>
          {children && <p className="text-sm text-gray-600 mb-4">{children}</p>}
          <Link href="/products" onClick={() => setOpen(false)}
            className="btn-primary w-full justify-center py-3 rounded-xl text-sm">
            Shop Now
          </Link>
          <button onClick={() => setOpen(false)}
            className="mt-3 text-xs text-gray-400 hover:text-gray-600 transition-colors">
            No thanks, I'll pay full price
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscountPopup;
