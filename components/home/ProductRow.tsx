'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { HugeiconsIcon } from '@hugeicons/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@hugeicons/core-free-icons';
import { useModalStore } from '@/store/modalStore';
import ProductCard from '@/components/ProductCard';

const STROKE = 1.5;

interface Props {
  title: string;
  subtitle?: string;
  category?: string;
  bg?: 'white' | 'gray';
}

export default function ProductRow({ title, subtitle, category, bg = 'white' }: Props) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const scrollRef               = useRef<HTMLDivElement>(null);
  const { openLogin }           = useModalStore();

  useEffect(() => {
    const url = category ? `/api/products?category=${category}&limit=8` : '/api/products?limit=8';
    axios.get(url)
      .then(r => setProducts(Array.isArray(r.data.products) ? r.data.products : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category]);

  const scroll = (dir: 'left' | 'right') =>
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });

  return (
    <section className={`w-full ${bg === 'gray' ? 'bg-gray-50' : 'bg-white'} py-14`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            {subtitle && <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">{subtitle}</p>}
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">{title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <Link href={category ? `/products?category=${category}` : '/products'}
              className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors hidden sm:block mr-2">
              View all →
            </Link>
            <button onClick={() => scroll('left')} aria-label="Scroll left"
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors">
              <HugeiconsIcon icon={ChevronLeftIcon} size={14} color="currentColor" strokeWidth={STROKE} />
            </button>
            <button onClick={() => scroll('right')} aria-label="Scroll right"
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors">
              <HugeiconsIcon icon={ChevronRightIcon} size={14} color="currentColor" strokeWidth={STROKE} />
            </button>
          </div>
        </div>

        {/* Scroll row */}
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-64 bg-white rounded-2xl border border-gray-200 animate-pulse aspect-[3/4]" />
              ))
            : products.map(p => (
                <div key={p._id || p.id} className="flex-shrink-0 w-64">
                  <ProductCard product={p} />
                </div>
              ))
          }
        </div>
      </div>
    </section>
  );
}


