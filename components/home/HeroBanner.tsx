'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

function useCountdown(targetDate: Date) {
  const calc = () => {
    const diff = targetDate.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return time;
}

const pad = (n: number) => String(n).padStart(2, '0');
const TARGET = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

const slides = [
  {
    badge: 'Alloy Fashion Sale',
    headline: 'Limited Time Offer!\nUp to 50% Off',
    sub: 'Redefines your everyday style',
    cta: 'Shop Now',
    href: '/products',
    imageSrc: '/66.png',
  },
  {
    badge: 'New Arrivals',
    headline: 'Fresh Styles\nJust Landed',
    sub: 'Be the first to wear the latest trends',
    cta: 'Explore Now',
    href: '/products',
    imageSrc: '/66.png',
  },
];

export default function HeroBanner() {
  const { days, hours, minutes, seconds } = useCountdown(TARGET);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center min-h-[420px] md:min-h-[480px] px-6 md:px-10 lg:px-16 gap-8 py-10 md:py-0">

        {/* Left: text */}
        <div className="flex-1 flex flex-col gap-4 z-10">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-red-500">
            <span className="w-6 h-px bg-red-400" />
            {slide.badge}
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight whitespace-pre-line">
            {slide.headline}
          </h1>

          <p className="text-sm text-gray-500">{slide.sub}</p>

          {/* Countdown */}
          <div className="flex items-center gap-2 mt-1">
            {[
              { label: 'Days', value: days },
              { label: 'Hrs',  value: hours },
              { label: 'Min',  value: minutes },
              { label: 'Sec',  value: seconds },
            ].map(({ label, value }, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className="flex flex-col items-center bg-white rounded-lg shadow px-3 py-2 min-w-[52px]">
                  <span className="text-xl font-bold text-gray-900 tabular-nums leading-none">
                    {pad(value)}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-0.5">{label}</span>
                </div>
                {i < 3 && <span className="text-lg font-semibold text-gray-400">:</span>}
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-2">
            <Link href={slide.href} className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-full transition-colors shadow">
              {slide.cta}
            </Link>
            <Link href="/products" className="px-6 py-2.5 border border-gray-300 hover:border-gray-400 text-gray-700 text-sm font-semibold rounded-full transition-colors">
              View All
            </Link>
          </div>
        </div>

        {/* Right: image */}
        <div className="flex-1 relative flex justify-center items-end">
          <div className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full bg-white/60 blur-3xl" />
          <div className="relative w-full max-w-sm aspect-[4/5]">
            <Image
              src={slide.imageSrc}
              alt="Hero product"
              fill
              priority
              className="object-contain drop-shadow-xl"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute bottom-6 left-0 bg-red-500 text-white rounded-xl px-4 py-3 shadow-lg">
              <span className="block text-xs font-medium">Up to</span>
              <span className="block text-2xl font-bold leading-none">50% Off</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-red-500 w-6' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    </section>
  );
}
