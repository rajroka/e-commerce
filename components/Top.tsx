'use client';

import Link from 'next/link';
import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { CustomerSupportIcon, HeadphonesIcon } from '@hugeicons/core-free-icons';

const Top = () => {
  return (
    <div className="w-full bg-gray-900 text-white text-sm z-50 relative px-4 lg:px-24">
      <div className="flex flex-col lg:flex-row items-center justify-between h-auto lg:h-10 py-2">
        <div className="text-center lg:text-left text-sm text-gray-300 mb-1 lg:mb-0">
          🚚 Free Shipping on Orders Over $50
        </div>
        <div className="hidden lg:flex gap-6 items-center text-gray-400 text-sm">
          <Link href="/contact" className="hover:text-white transition flex items-center gap-1.5">
            <HugeiconsIcon icon={CustomerSupportIcon} size={15} color="currentColor" strokeWidth={1.5} />
            Contact
          </Link>
          <Link href="/faq" className="hover:text-white transition flex items-center gap-1.5">
            <HugeiconsIcon icon={HeadphonesIcon} size={15} color="currentColor" strokeWidth={1.5} />
            Help Center
          </Link>
          <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
          <a href="tel:+1234567890" className="hover:text-white transition">123-456-7890</a>
        </div>
      </div>
    </div>
  );
};

export default Top;
