'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import ProductCard from '@/components/ProductCard';

export default function FeaturedItems() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    axios.get('/api/products?limit=4')
      .then(r => {
        const list = Array.isArray(r.data.products) ? r.data.products : [];
        setProducts(list.slice(0, 4));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="w-full bg-gray-50 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">

        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">Hand-picked</p>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Featured Items</h2>
          </div>
          <Link href="/products" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors hidden sm:block">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 animate-pulse aspect-[3/4]" />
              ))
            : products.map((p, i) => (
                <ProductCard
                  key={p._id || p.id}
                  product={p}
                  badge={i === 1 ? 'Bestseller' : undefined}
                />
              ))
          }
        </div>
      </div>
    </section>
  );
}


