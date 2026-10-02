'use client';

import Image from 'next/image';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';

const STROKE = 1.5;

export default function HeroBanner() {
  return (
    <section className="relative w-full h-[85vh] min-h-[520px] overflow-hidden">

      {/* Background image — covers the whole section */}
      <Image
        src="/main-hero.jpg"
        alt="Hero background"
        fill
        priority
        className="object-cover object-top"
        sizes="100vw"
      />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 flex flex-col justify-center gap-6">

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-[0.95] tracking-tighter">
          MOVE<br />
          <span className="text-red-500">FASTER.</span><br />
          GO FURTHER.
        </h1>

        <p className="text-base text-gray-300 max-w-md leading-relaxed">
          Professional-grade sports equipment for every athlete. From the gym to the field — perform at your peak with gear that keeps up.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/products"
            className="group inline-flex items-center gap-2 px-8 py-3.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold tracking-wide rounded-full transition-all duration-300">
            SHOP THE COLLECTION
            <HugeiconsIcon icon={ArrowRight01Icon} size={15} color="white" strokeWidth={STROKE} />
          </Link>
          <Link href="/products?category=running"
            className="inline-flex items-center px-8 py-3.5 border-2 border-white/60 hover:border-white text-white text-sm font-bold tracking-wide rounded-full transition-all duration-300">
            RUNNING
          </Link>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-8 pt-2 border-t border-white/20 w-fit">
          {[
            { value: '500+', label: 'Products' },
            { value: '50k+', label: 'Athletes' },
            { value: '4.9★', label: 'Rating' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-xl font-black text-white">{s.value}</p>
              <p className="text-xs text-gray-400 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
