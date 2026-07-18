'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { HugeiconsIcon } from '@hugeicons/react';
import { StarIcon, HeartIcon, HeartAddIcon, ShoppingCart01Icon } from '@hugeicons/core-free-icons';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { useSession } from '@/lib/auth-client';
import { useModalStore } from '@/store/modalStore';
import toast from 'react-hot-toast';

const STROKE = 1.5;

export default function FeaturedItems() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const { data: session }       = useSession();
  const { openLogin }           = useModalStore();
  const addToCart               = useCartStore(s => s.addToCart);
  const { items: wishlist, toggleWishlist } = useWishlistStore();

  useEffect(() => {
    axios.get('/api/products?limit=4')
      .then(r => setProducts((r.data.products || r.data).slice(0, 4)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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
    <section className="w-full bg-gray-50 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">Hand-picked</p>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Featured Items</h2>
          </div>
          <Link href="/products"
            className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors hidden sm:block">
            View all →
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl animate-pulse aspect-[3/4]" />
              ))
            : products.map(p => {
                const inWishlist = wishlist.some(w => w.productId === (p._id || p.id));
                const rating     = Math.round(p.rating ?? 4);
                return (
                  <div key={p._id || p.id}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">

                    {/* Image */}
                    <div className="relative aspect-square bg-gray-50 overflow-hidden">
                      <Link href={`/products/${p._id || p.id}`}>
                        <Image src={p.image} alt={p.name} fill
                          sizes="(max-width:640px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-110" />
                      </Link>

                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                      {/* Wishlist */}
                      <button onClick={() => handleWishlist(p)}
                        aria-label={inWishlist ? 'Remove' : 'Add to wishlist'}
                        className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 duration-200">
                        <HugeiconsIcon icon={inWishlist ? HeartIcon : HeartAddIcon} size={14}
                          color={inWishlist ? '#ef4444' : '#6b7280'} strokeWidth={STROKE} />
                      </button>

                      {/* Quick add */}
                      <button onClick={() => handleCart(p)}
                        className="absolute bottom-3 left-3 right-3 py-2 bg-gray-900 text-white text-xs font-bold rounded-full
                                   opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0
                                   transition-all duration-300 flex items-center justify-center gap-1.5">
                        <HugeiconsIcon icon={ShoppingCart01Icon} size={12} color="white" strokeWidth={STROKE} />
                        QUICK ADD
                      </button>
                    </div>

                    {/* Info */}
                    <div className="p-4 flex flex-col gap-1.5 flex-1">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{p.category}</p>
                      <Link href={`/products/${p._id || p.id}`}>
                        <p className="text-sm font-bold text-gray-900 line-clamp-1 hover:text-red-500 transition-colors">{p.name}</p>
                      </Link>
                      <div className="flex items-center gap-0.5">
                        {[1,2,3,4,5].map(j => (
                          <HugeiconsIcon key={j} icon={StarIcon} size={10}
                            color={j <= rating ? '#facc15' : '#e5e7eb'} strokeWidth={STROKE} />
                        ))}
                      </div>
                      <p className="text-base font-black text-gray-900 mt-auto">${p.price}</p>
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


