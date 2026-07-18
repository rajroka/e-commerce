'use client';

import Image from 'next/image';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';

const STROKE = 1.5;

export default function HeroBanner() {
  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

          {/* Left */}
          <div className="flex flex-col gap-6">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-gray-900 leading-[0.95] tracking-tighter">
              MOVE<br />
              <span className="text-red-500">FASTER.</span><br />
              GO FURTHER.
            </h1>

            <p className="text-base text-gray-500 max-w-md leading-relaxed">
              Professional-grade sports equipment for every athlete. From the gym to the field — perform at your peak with gear that keeps up.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/products"
                className="group inline-flex items-center gap-2 px-8 py-3.5 bg-gray-900 hover:bg-red-500 text-white text-sm font-bold tracking-wide rounded-full transition-all duration-300">
                SHOP THE COLLECTION
                <HugeiconsIcon icon={ArrowRight01Icon} size={15} color="white" strokeWidth={STROKE}
                  className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/products?category=running"
                className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-gray-200 hover:border-gray-900 text-gray-700 hover:text-gray-900 text-sm font-bold tracking-wide rounded-full transition-all duration-300">
                RUNNING
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-2 border-t border-gray-100">
              {[
                { value: '500+', label: 'Products' },
                { value: '50k+', label: 'Athletes' },
                { value: '4.9★', label: 'Rating' },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-xl font-black text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-400 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: image */}
          <div className="relative flex items-center justify-center">
            {/* Background circle */}
            <div className="absolute w-[380px] h-[380px] md:w-[460px] md:h-[460px] rounded-full bg-gray-50 border border-gray-100" />
            {/* Image */}
            <div className="relative w-[320px] h-[320px] md:w-[420px] md:h-[420px] z-10">
              <Image
                src="/ball.png"
                alt="Sports gear"
                fill
                priority
                className="object-contain drop-shadow-2xl"
                sizes="(max-width: 768px) 320px, 420px"
              />
            </div>
            {/* Floating badge removed */}
          </div>

        </div>
      </div>
    </section>
  );
}


