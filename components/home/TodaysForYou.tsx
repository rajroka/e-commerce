'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { FaStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useCartStore } from '@/store/cartStore';
import { useModalStore } from '@/store/modalStore';
import { useSession } from '@/lib/auth-client';
import { useWishlistStore } from '@/store/wishlistStore';
import toast from 'react-hot-toast';

const TABS = ['Best Seller', 'New Arrival', 'Special Discount', 'Official Store', 'Curated Picks'] as const;
type Tab = (typeof TABS)[number];

const TAB_OFFSET: Record<Tab, number> = {
  'Best Seller':      0,
  'New Arrival':      3,
  'Special Discount': 1,
  'Official Store':   4,
  'Curated Picks':    2,
};

export default function TodaysForYou() {
  const [products,  setProducts]  = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('Best Seller');

  const { data: session } = useSession();
  const { openLogin }     = useModalStore();
  const addToCart         = useCartStore((state) => state.addToCart);
  const { items: wishlist, toggleWishlist } = useWishlistStore();

  useEffect(() => {
    axios.get('/api/products')
      .then((r) => setProducts(r.data.products || r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCart = (product: any) => {
    if (!session) {
      toast.error('Please login to add items', { position: 'top-right' });
      openLogin();
      return;
    }
    addToCart({ id: product._id || product.id, name: product.name, image: product.image, price: product.price, quantity: 1 });
    toast.success('Added to cart!', { position: 'top-right' });
  };

  const handleWishlist = (product: any) => {
    if (!session) {
      toast.error('Please login to save items', { position: 'top-right' });
      openLogin();
      return;
    }
    toggleWishlist({ productId: product._id || product.id, name: product.name, image: product.image, price: product.price, category: product.category ?? '' });
  };

  const offset  = TAB_OFFSET[activeTab];
  const visible = products.length
    ? [...products.slice(offset), ...products.slice(0, offset)].slice(0, 8)
    : [];

  return (
    <section className="w-full bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-red-500 text-2xl">▶</span>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Today's For You</h2>
          </div>
          <Link href="/products" className="text-sm font-medium text-red-500 hover:underline self-end sm:self-auto">
            See All →
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto scrollbar-hide mb-8 border-b border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? 'border-red-500 text-red-500'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl animate-pulse aspect-[3/4]" />
              ))
            : visible.map((p) => {
                const inWishlist = wishlist.some((w) => w.productId === (p._id || p.id));
                return (
                  <div key={p._id || p.id}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col overflow-hidden">
                    <div className="relative aspect-square bg-gray-50 overflow-hidden">
                      <Link href={`/products/${p._id || p.id}`}>
                        <Image src={p.image} alt={p.name} fill
                          sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      </Link>

                      <button onClick={() => handleWishlist(p)}
                        aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                        className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:scale-110 transition-transform">
                        {inWishlist
                          ? <FaHeart size={14} className="text-red-500" />
                          : <FaRegHeart size={14} className="text-gray-400" />}
                      </button>

                      {activeTab === 'Special Discount' && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                          Sale
                        </span>
                      )}
                      {activeTab === 'New Arrival' && (
                        <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                          New
                        </span>
                      )}
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

                      <div className="flex items-baseline gap-2 mt-auto pt-1">
                        <span className="text-sm font-bold text-gray-900">${p.price}</span>
                        {activeTab === 'Special Discount' && (
                          <span className="text-xs text-gray-400 line-through">${(p.price * 1.3).toFixed(2)}</span>
                        )}
                      </div>

                      <button onClick={() => handleCart(p)}
                        className="mt-2 w-full bg-gray-900 hover:bg-red-500 text-white text-xs font-semibold py-1.5 rounded-full transition-colors">
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
