'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';

const STROKE = 1.5;

// Offer ends 3 days from the first time this module loads
const OFFER_END = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

function useCountdown(target: Date) {
  const calc = () => {
    const diff = Math.max(0, target.getTime() - Date.now());
    return {
      days:  String(Math.floor(diff / 86_400_000)).padStart(2, '0'),
      hours: String(Math.floor((diff % 86_400_000) / 3_600_000)).padStart(2, '0'),
      mins:  String(Math.floor((diff % 3_600_000)  / 60_000)).padStart(2, '0'),
      secs:  String(Math.floor((diff % 60_000)     / 1_000)).padStart(2, '0'),
    };
  };

  const [time, setTime] = useState(calc);

  useEffect(() => {
    const id = setInterval(() => setTime(calc), 1000);
    return () => clearInterval(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return time;
}

export default function PromoBanner() {
  const { days, hours, mins, secs } = useCountdown(OFFER_END);

  const units = [
    { val: days,  label: 'Days'  },
    { val: hours, label: 'Hours' },
    { val: mins,  label: 'Mins'  },
    { val: secs,  label: 'Secs'  },
  ];

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

        {/* Right: live countdown + CTA */}
        <div className="flex flex-col items-center md:items-end gap-6">
          <div className="flex items-center gap-3">
            {units.map((t, i) => (
              <div key={t.label} className="flex items-center gap-3">
                <div className="flex flex-col items-center bg-white/10 rounded-xl px-4 py-3 min-w-[58px]">
                  <span className="text-2xl font-black text-white tabular-nums">{t.val}</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest">{t.label}</span>
                </div>
                {i < 3 && <span className="text-white font-black text-xl leading-none">:</span>}
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
