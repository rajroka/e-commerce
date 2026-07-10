'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useCartStore } from '@/store/cartStore';
import { useModalStore } from '@/store/modalStore';
import { useSession } from '@/lib/auth-client';
import toast from 'react-hot-toast';

const FLASH_END = new Date(Date.now() + 6 * 60 * 60 * 1000);

function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { h: 0, m: 0, s: 0 };
    return {
      h: Math.floor(diff / (1000 * 60 * 60)),
      m: Math.floor((diff / (1000 * 60)) % 60),
      s: Math.floor((diff / 1000) % 60),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return t;
}

const pad = (n: number) => String(n).padStart(2, '0');
const DISCOUNTS = [20, 30, 35, 25, 40, 50, 45, 30];

function salePrice(price: number, pct: number) {
  return (price * (1 - pct / 100)).toFixed(2);
}

export default function FlashSale() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { h, m, s } = useCountdown(FLASH_END);
  const { data: session } = useSession();
  const { openLogin } = useModalStore();
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    axios.get('/api/products')
      .then((r) => setProducts((r.data.products || r.data).slice(0, 8)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' });
  };

  const handleCart = (product: any) => {
    if (!session) {
      toast.error('Please login to add items', { position: 'top-right' });
      openLogin();
      return;
    }
    addToCart({ id: product._id || product.id, name: product.name, image: product.image, price: product.price, quantity: 1 });
    toast.success('Added to cart!', { position: 'top-right' });
  };

  return (
    <section className="w-full bg-white py-10 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <span className="text-red-500 text-2xl">▶</span>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Flash Sale</h2>
            <div className="flex items-center gap-1 bg-gray-900 rounded-full px-3 py-1">
              {[pad(h), pad(m), pad(s)].map((val, i) => (
                <span key={i} className="flex items-center gap-1">
                  <span className="text-white text-sm font-bold tabular-nums">{val}</span>
                  {i < 2 && <span className="text-red-400 font-bold text-xs">:</span>}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/products" className="text-sm font-medium text-red-500 hover:underline hidden sm:block">
              See All →
            </Link>
            <button onClick={() => scroll('left')} aria-label="Scroll left"
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors">
              <FaChevronLeft size={12} />
            </button>
            <button onClick={() => scroll('right')} aria-label="Scroll right"
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors">
              <FaChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* Product rail */}
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-52 bg-gray-100 rounded-xl animate-pulse aspect-[3/4]" />
              ))
            : products.map((p, i) => {
                const pct  = DISCOUNTS[i % DISCOUNTS.length];
                const sale = salePrice(p.price, pct);
                return (
                  <div key={p._id || p.id}
                    className="flex-shrink-0 w-52 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col overflow-hidden">
                    <div className="relative aspect-square bg-gray-50 overflow-hidden">
                      <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                        -{pct}%
                      </span>
                      <Link href={`/products/${p._id || p.id}`}>
                        <Image src={p.image} alt={p.name} fill sizes="208px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      </Link>
                    </div>

                    <div className="p-3 flex flex-col gap-1 flex-1">
                      <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-tight">{p.name}</p>

                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <FaStar key={j} size={10}
                            className={j < Math.round(p.rating ?? 4) ? 'text-yellow-400' : 'text-gray-200'} />
                        ))}
                        <span className="text-[10px] text-gray-400 ml-1">({p.reviews ?? 0})</span>
                      </div>

                      <div className="flex items-baseline gap-2 mt-auto">
                        <span className="text-sm font-bold text-red-500">${sale}</span>
                        <span className="text-xs text-gray-400 line-through">${p.price}</span>
                      </div>

                      <div className="mt-2">
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-red-400 rounded-full" style={{ width: `${30 + (i * 11) % 60}%` }} />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5">{20 + (i * 7) % 40} sold</p>
                      </div>

                      <button onClick={() => handleCart(p)}
                        className="mt-2 w-full bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-1.5 rounded-full transition-colors">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </section>
  );
}
