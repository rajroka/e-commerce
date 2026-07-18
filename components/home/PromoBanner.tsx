'use client';

import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';

const STROKE = 1.5;

export default function PromoBanner() {
  return (
    <section className="w-full bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 flex flex-col md:flex-row items-center justify-between gap-8">

        {/* Left */}
        <div className="flex flex-col gap-4 text-center md:text-left">
          <p className="text-xs font-bold text-red-400 uppercase tracking-widest">Limited Offer</p>
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tighter">
            GET 30% OFF<br />
            <span className="text-red-500">YOUR FIRST ORDER</span>
          </h2>
          <p className="text-sm text-gray-400 max-w-sm">
            Sign up and use code <span className="text-white font-bold">FIRST30</span> at checkout. New members only.
          </p>
        </div>

        {/* Right: counters + CTA */}
        <div className="flex flex-col items-center md:items-end gap-6">
          <div className="flex items-center gap-4">
            {[
              { val: '02', label: 'Days' },
              { val: '14', label: 'Hours' },
              { val: '38', label: 'Mins' },
            ].map((t, i) => (
              <div key={t.label} className="flex items-center gap-4">
                <div className="flex flex-col items-center bg-white/10 rounded-xl px-4 py-3 min-w-[60px]">
                  <span className="text-2xl font-black text-white tabular-nums">{t.val}</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest">{t.label}</span>
                </div>
                {i < 2 && <span className="text-white font-black text-xl">:</span>}
              </div>
            ))}
          </div>
          <Link href="/sign-up"
            className="group inline-flex items-center gap-2 px-8 py-3.5 bg-red-500 hover:bg-red-600 text-white text-sm font-black tracking-wide rounded-full transition-colors">
            CLAIM OFFER
            <HugeiconsIcon icon={ArrowRight01Icon} size={15} color="white" strokeWidth={STROKE}
              className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}


