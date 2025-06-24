'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#f5f5f5]">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/ggsolution.png"
          alt="Hero background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="text-center px-6 sm:px-10 py-12 max-w-3xl bg-white/80 backdrop-blur-md rounded-2xl shadow-xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4">
          Discover Quality. <br />
          <span className="text-green-600">Shop Smart.</span>
        </h1>
        <p className="text-gray-700 text-base sm:text-lg mb-6">
          Get amazing deals on your favorite products. Enjoy exclusive offers, fast shipping, and great service.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <span className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full text-sm sm:text-base font-medium transition shadow">
              Shop Now
            </span>
          </Link>
          <Link href="/deals">
            <span className="border border-gray-900 hover:bg-gray-900 hover:text-white text-gray-900 px-6 py-3 rounded-full text-sm sm:text-base font-medium transition shadow">
              View Deals
            </span>
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-6 text-gray-600 text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Free shipping over $50
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            30-day money-back guarantee
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
