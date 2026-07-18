'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { HugeiconsIcon } from '@hugeicons/react';
import { StarIcon, HeartIcon, HeartAddIcon, ChevronLeftIcon, ChevronRightIcon, ShoppingCart01Icon } from '@hugeicons/core-free-icons';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useSession } from '@/lib/auth-client';
import { useModalStore } from '@/store/modalStore';
import toast from 'react-hot-toast';

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
  const { data: session }       = useSession();
  const { openLogin }           = useModalStore();
  const addToCart               = useCartStore(s => s.addToCart);
  const { items: wishlist, toggleWishlist } = useWishlistStore();

  useEffect(() => {
    const url = category ? `/api/products?category=${category}&limit=8` : '/api/products?limit=8';
    axios.get(url)
      .then(r => setProducts(r.data.products || r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category]);

  const scroll = (dir: 'left' | 'right') =>
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });

  const handleCart = (p: any) => {
    if (!session) { toast.error('Please login to add items'); openLogin(); return; }
    addToCart({ id: p._id || p.id, name: p.name, image: p.image, price: p.price, quantity: 1 });
    toast.success('Added to cart!');
  };

  const handleWishlist = (p: any) => {
    if (!session) { openLogin(); return; }
    toggleWishlist({ productId: p._id || p.id, name: p.name, image: p.image, price: p.price, category: p.category ?? '' });
  };

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
                <div key={i} className="flex-shrink-0 w-52 bg-gray-100 rounded-2xl animate-pulse aspect-[3/4]" />
              ))
            : products.map(p => {
                const inWishlist  = wishlist.some(w => w.productId === (p._id || p.id));
                const hasDiscount = p.discountPct > 0;
                const sale        = hasDiscount ? (p.price * (1 - p.discountPct / 100)).toFixed(2) : null;
                const rating      = Math.round(p.rating ?? 4);
                return (
                  <div key={p._id || p.id}
                    className="group flex-shrink-0 w-52 bg-white rounded-2xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">

                    <div className="relative aspect-square bg-gray-50 overflow-hidden">
                      {hasDiscount && (
                        <span className="absolute top-2.5 left-2.5 z-10 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                          -{p.discountPct}%
                        </span>
                      )}
                      <Link href={`/products/${p._id || p.id}`}>
                        <Image src={p.image} alt={p.name} fill sizes="208px"
                          className="object-cover transition-transform duration-500 group-hover:scale-110" />
                      </Link>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                      {/* Wishlist */}
                      <button onClick={() => handleWishlist(p)}
                        aria-label={inWishlist ? 'Remove' : 'Add to wishlist'}
                        className="absolute top-2.5 right-2.5 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110">
                        <HugeiconsIcon icon={inWishlist ? HeartIcon : HeartAddIcon} size={13}
                          color={inWishlist ? '#ef4444' : '#6b7280'} strokeWidth={STROKE} />
                      </button>

                      {/* Quick add */}
                      <button onClick={() => handleCart(p)}
                        className="absolute bottom-2.5 left-2.5 right-2.5 py-1.5 bg-gray-900 text-white text-[11px] font-bold rounded-full
                                   opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0
                                   transition-all duration-300 flex items-center justify-center gap-1">
                        <HugeiconsIcon icon={ShoppingCart01Icon} size={11} color="white" strokeWidth={STROKE} />
                        ADD TO CART
                      </button>
                    </div>

                    <div className="p-3.5 flex flex-col gap-1 flex-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{p.category}</p>
                      <p className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug">{p.name}</p>
                      <div className="flex items-center gap-0.5">
                        {[1,2,3,4,5].map(j => (
                          <HugeiconsIcon key={j} icon={StarIcon} size={10}
                            color={j <= rating ? '#facc15' : '#e5e7eb'} strokeWidth={STROKE} />
                        ))}
                      </div>
                      <div className="flex items-baseline gap-1.5 mt-auto pt-1">
                        <span className="text-sm font-black text-gray-900">${sale ?? p.price}</span>
                        {sale && <span className="text-xs text-gray-400 line-through">${p.price}</span>}
                      </div>
                    </div>
                  </div>
                );
              })
          }
        </div>
      </div>
    </section>
  );
}


