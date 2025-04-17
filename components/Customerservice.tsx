'use client';

import React from 'react';
import {
  FaStoreAlt,
  FaTruck,
  FaDollarSign,
  FaClock,
} from 'react-icons/fa';

const Customerservice = () => {
  return (
    <div className="w-full py-10 px-6 md:px-12 bg-zinc-950 dark:bg-zinc-900 transition-colors duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 bg-zinc-900 dark:bg-zinc-800 p-8 rounded-2xl shadow-2xl">

        {/* 1. Curb-side Pickup */}
        <div className="flex items-center gap-4 text-white dark:text-gray-200">
          <div className="bg-emerald-500 dark:bg-emerald-600 p-3 rounded-full">
            <FaStoreAlt size={22} />
          </div>
          <div>
            <div className="font-semibold text-lg">Curb-side</div>
            <div className="text-sm text-gray-300 dark:text-gray-400">Pickup available</div>
          </div>
        </div>

        {/* 2. Free Shipping */}
        <div className="flex items-center gap-4 text-white dark:text-gray-200">
          <div className="bg-emerald-500 dark:bg-emerald-600 p-3 rounded-full">
            <FaTruck size={22} />
          </div>
          <div>
            <div className="font-semibold text-lg">Free Shipping</div>
            <div className="text-sm text-gray-300 dark:text-gray-400">Orders over $50</div>
          </div>
        </div>

        {/* 3. Low Prices */}
        <div className="flex items-center gap-4 text-white dark:text-gray-200">
          <div className="bg-emerald-500 dark:bg-emerald-600 p-3 rounded-full">
            <FaDollarSign size={22} />
          </div>
          <div>
            <div className="font-semibold text-lg">Low Prices</div>
            <div className="text-sm text-gray-300 dark:text-gray-400">Guaranteed deals</div>
          </div>
        </div>

        {/* 4. 24/7 Support */}
        <div className="flex items-center gap-4 text-white dark:text-gray-200">
          <div className="bg-emerald-500 dark:bg-emerald-600 p-3 rounded-full">
            <FaClock size={22} />
          </div>
          <div>
            <div className="font-semibold text-lg">24/7 Support</div>
            <div className="text-sm text-gray-300 dark:text-gray-400">Always available</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Customerservice;
