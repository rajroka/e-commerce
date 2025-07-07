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
    <section
      aria-label="Customer Service Features"
      className="w-full py-12 px-6 md:px-16 bg-white transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-gray-900">

        <article className="flex items-center gap-4">
          <FaStoreAlt size={28} className="text-emerald-600" aria-hidden="true" />
          <div>
            <h3 className="font-semibold text-xl">Curb-side Pickup</h3>
            <p className="text-gray-600 mt-1 text-sm">Pickup available for your convenience</p>
          </div>
        </article>

        <article className="flex items-center gap-4">
          <FaTruck size={28} className="text-emerald-600" aria-hidden="true" />
          <div>
            <h3 className="font-semibold text-xl">Free Shipping</h3>
            <p className="text-gray-600 mt-1 text-sm">On orders over $50</p>
          </div>
        </article>

        <article className="flex items-center gap-4">
          <FaDollarSign size={28} className="text-emerald-600" aria-hidden="true" />
          <div>
            <h3 className="font-semibold text-xl">Low Prices</h3>
            <p className="text-gray-600 mt-1 text-sm">Guaranteed best deals</p>
          </div>
        </article>

        <article className="flex items-center gap-4">
          <FaClock size={28} className="text-emerald-600" aria-hidden="true" />
          <div>
            <h3 className="font-semibold text-xl">24/7 Support</h3>
            <p className="text-gray-600 mt-1 text-sm">Always here to help</p>
          </div>
        </article>

      </div>
    </section>
  );
};

export default Customerservice;
