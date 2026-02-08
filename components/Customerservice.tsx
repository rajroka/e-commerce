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
      className="w-full py-12 px-6 md:px-16 bg-gray-100 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-gray-900">
        
        {/* Curb-side Pickup Feature */}
        <article className="flex flex-col items-center text-center gap-1 p-6 py-4   rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <FaStoreAlt size={36} className="text-emerald-600" aria-hidden="true" />
          <h3 className="font-semibold text-xl">Curb-side Pickup</h3>
          <p className="text-gray-600 mt-1 text-sm">Pickup available for your convenience</p>
        </article>

        {/* Free Shipping Feature */}
        <article className="flex flex-col items-center text-center gap-1 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <FaTruck size={36} className="text-emerald-600" aria-hidden="true" />
          <h3 className="font-semibold text-xl">Free Shipping</h3>
          <p className="text-gray-600 mt-1 text-sm">On orders over $50</p>
        </article>

        {/* Low Prices Feature */}
        <article className="flex flex-col items-center text-center gap-1 p-6  rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <FaDollarSign size={36} className="text-emerald-600" aria-hidden="true" />
          <h3 className="font-semibold text-xl">Low Prices</h3>
          <p className="text-gray-600 mt-1 text-sm">Guaranteed best deals</p>
        </article>

        {/* 24/7 Support Feature */}
        <article className="flex flex-col items-center text-center gap-1 p-6  rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <FaClock size={36} className="text-emerald-600" aria-hidden="true" />
          <h3 className="font-semibold text-xl">24/7 Support</h3>
          <p className="text-gray-600 mt-1 text-sm">Always here to help</p>
        </article>

      </div>
    </section>
  );
};

export default Customerservice;
