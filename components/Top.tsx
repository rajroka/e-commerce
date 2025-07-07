'use client';

import Link from 'next/link';
import React from 'react';
import { FiPhoneCall, FiHelpCircle } from 'react-icons/fi';

const Top = () => {
  return (
    <div className="w-full bg-gray-800 text-white text-sm z-50 relative px-4 sm:px-6 lg:px-24">
      <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-12 py-2">
        {/* Shipping Notice */}
        <div className="text-center sm:text-left font-medium">
          🚚 Free Shipping on Orders Over $50
        </div>

        {/* Right Links */}
        <div className="flex flex-wrap gap-4 sm:gap-6 items-center justify-center mt-2 sm:mt-0 text-gray-300 text-sm font-medium">
          
          <Link href="/contact" className="hover:text-white hover:underline transition">Contact</Link>
          <Link href="/help" className="hover:text-white hover:underline transition flex items-center gap-1">
            <FiHelpCircle size={16} /> Help Center
          </Link>
          
          <Link href="/products" className="hover:text-white hover:underline transition">Privacy Policy</Link>
          <Link href="tel:+1234567890" className="hover:text-white hover:underline transition flex items-center gap-1">
            <FiPhoneCall size={16} /> 123-456-7890
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Top;
