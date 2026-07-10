'use client';

import React from 'react';
import {
  PiStorefrontLight,
  PiTruckLight,
  PiTagLight,
  PiChatTeardropLight,
} from 'react-icons/pi';

const Customerservice = () => {
  const features = [
    { icon: <PiStorefrontLight size={32} />, title: 'Store Pickup',     desc: 'Available in select boutiques' },
    { icon: <PiTruckLight size={32} />,      title: 'Fast Shipping',    desc: 'Complimentary on orders over $50' },
    { icon: <PiTagLight size={32} />,        title: 'Exclusive Offers', desc: 'Best price guaranteed' },
    { icon: <PiChatTeardropLight size={32} />, title: 'Concierge',      desc: 'Dedicated support team' },
  ];

  return (
    <section aria-label="Customer Service Features" className="w-full py-16 px-6 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-4 text-gray-900">
        {features.map((item, index) => (
          <article key={index} className="flex flex-col items-center text-center group">
            <div className="mb-4 text-gray-900 transition-transform duration-300 group-hover:-translate-y-1">
              {item.icon}
            </div>
            <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed max-w-[150px]">{item.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Customerservice;
