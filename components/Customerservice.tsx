'use client';

import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ShoppingBag01Icon, TruckDeliveryIcon, Tag01Icon, CustomerSupportIcon,
} from '@hugeicons/core-free-icons';

const features = [
  { icon: ShoppingBag01Icon, title: 'Store Pickup',    desc: 'Available in select locations' },
  { icon: TruckDeliveryIcon, title: 'Fast Shipping',   desc: 'Free on orders over $50' },
  { icon: Tag01Icon,         title: 'Best Prices',     desc: 'Price match guaranteed' },
  { icon: CustomerSupportIcon, title: '24/7 Support',  desc: 'Dedicated customer service' },
];

const STROKE = 1.5;

export default function Customerservice() {
  return (
    <section aria-label="Service features" className="w-full bg-white border-t border-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 grid grid-cols-2 md:grid-cols-4 gap-6">
        {features.map(({ icon, title, desc }) => (
          <div key={title} className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <HugeiconsIcon icon={icon} size={20} color="#ef4444" strokeWidth={STROKE} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{title}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


