'use client';

import Image from 'next/image';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { StarIcon } from '@hugeicons/core-free-icons';

const STROKE = 1.5;

// Static store data modelled after the design screenshot
const stores = [
  {
    id: 1,
    name: 'Nike Eco Mall',
    avatar: '/66.png',
    rating: 4.8,
    products: 124,
    tagline: 'Premium athletic wear',
    badge: '🏆 Top Seller',
    href: '/products?store=nike',
  },
  {
    id: 2,
    name: 'Pramita Boutique',
    avatar: '/66.png',
    rating: 4.7,
    products: 88,
    tagline: 'Elegant everyday fashion',
    badge: '⭐ Verified',
    href: '/products?store=pramita',
  },
  {
    id: 3,
    name: 'Galaxy Zaheda Mall',
    avatar: '/66.png',
    rating: 4.6,
    products: 203,
    tagline: 'Trendy styles for everyone',
    badge: '🔥 Hot Store',
    href: '/products?store=galaxy',
  },
  {
    id: 4,
    name: 'Azure Mall',
    avatar: '/66.png',
    rating: 4.5,
    products: 97,
    tagline: 'Minimalist essentials',
    badge: '✨ New Store',
    href: '/products?store=azure',
  },
];

export default function BestSellingStores() {
  return (
    <section className="w-full bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="text-red-500 text-2xl">▶</span>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Best Selling Stores
            </h2>
          </div>
          <Link href="/products" className="text-sm font-semibold text-red-500 hover:underline">
            See All →
          </Link>
        </div>

        {/* ── Store cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {stores.map((store) => (
            <Link
              key={store.id}
              href={store.href}
              className="group flex flex-col items-center text-center bg-gray-50 hover:bg-red-50 border border-gray-100 hover:border-red-200 rounded-2xl p-5 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {/* Avatar */}
              <div className="relative w-16 h-16 mb-3">
                <Image
                  src={store.avatar}
                  alt={store.name}
                  fill
                  sizes="64px"
                  className="rounded-full object-cover ring-2 ring-white group-hover:ring-red-300 shadow transition-all"
                />
              </div>

              {/* Badge pill */}
              <span className="text-[10px] font-bold bg-white border border-gray-200 group-hover:border-red-300 text-gray-500 group-hover:text-red-500 px-2 py-0.5 rounded-full mb-2 transition-colors">
                {store.badge}
              </span>

              {/* Store name */}
              <p className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors leading-tight">
                {store.name}
              </p>

              <p className="text-[11px] text-gray-400 mt-1 leading-tight">{store.tagline}</p>

              {/* Stars + count */}
              <div className="flex items-center gap-1 mt-3">
                <HugeiconsIcon icon={StarIcon} size={11} color="#facc15" strokeWidth={STROKE} />
                <span className="text-xs font-bold text-gray-700">{store.rating}</span>
                <span className="text-[10px] text-gray-400">· {store.products} items</span>
              </div>

              {/* CTA */}
              <span className="mt-3 text-[11px] font-bold text-red-500 group-hover:underline">
                Visit Store →
              </span>
            </Link>
          ))}
        </div>

        {/* ── Wide promo card below stores ── */}
        <div className="mt-8 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-700 text-white flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-7 shadow-lg overflow-hidden relative">
          {/* Decorative circle */}
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-white/5" />

          <div className="z-10">
            <p className="text-xs text-gray-400 mb-1">GG Shop · Flagship Store</p>
            <h3 className="text-xl sm:text-2xl font-bold leading-tight">
              Shop, Discover &amp; Save More
            </h3>
            <p className="text-sm text-gray-300 mt-1">Explore curated collections with exclusive member discounts.</p>
          </div>

          <Link
            href="/products"
            className="z-10 flex-shrink-0 px-6 py-3 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-full transition-colors shadow"
          >
            Explore Now
          </Link>
        </div>
      </div>
    </section>
  );
}
