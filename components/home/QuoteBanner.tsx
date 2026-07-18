'use client';

import Link from 'next/link';

export default function QuoteBanner() {
  return (
    <section className="w-full bg-gray-900 py-16 px-0 text-white text-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 flex flex-col items-center gap-6 text-center">
        <span className="text-6xl font-bold text-red-500/30 leading-none select-none" aria-hidden>"</span>

        <blockquote className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
          Let's shop beyond boundaries
        </blockquote>

        <p className="text-sm text-gray-400 max-w-md">
          Discover thousands of products from trusted sellers — delivered right to your door.
        </p>

        <Link href="/products"
          className="mt-2 px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold text-sm rounded-full transition-colors shadow-lg">
          Start Shopping
        </Link>
      </div>
    </section>
  );
}


