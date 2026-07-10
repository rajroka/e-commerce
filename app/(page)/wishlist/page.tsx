'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FiHeart, FiShoppingBag, FiTrash2 } from 'react-icons/fi';

export default function WishlistPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const { items, fetchWishlist, removeFromWishlist } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addToCart);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isPending && !session) { router.push('/sign-in'); return; }
    if (session) fetchWishlist();
  }, [isPending, session, router, fetchWishlist]);

  if (!mounted || isPending) {
    return <div className="min-h-screen bg-[#F9F4F5] flex items-center justify-center"><div className="w-8 h-8 border-2 border-gray-800 border-t-transparent rounded-full animate-spin" /></div>;
  }

  const handleMoveToCart = (item: typeof items[0]) => {
    addToCart({ id: item.productId, name: item.name, image: item.image, price: item.price, quantity: 1 });
    removeFromWishlist(item.productId);
    toast.success('Moved to cart');
  };

  return (
    <main className="min-h-screen bg-[#F9F4F5] py-12 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-gray-900 flex items-center gap-3">
            <FiHeart className="text-red-400" /> Wishlist
          </h1>
          <p className="text-sm text-gray-500 uppercase tracking-widest mt-1">{items.length} saved items</p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white border border-gray-100 shadow-sm p-16 text-center">
            <FiHeart size={48} className="mx-auto text-gray-200 mb-6" />
            <h2 className="text-xl font-black uppercase tracking-tighter text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-sm text-gray-500 mb-8">Save items you love and come back to them anytime.</p>
            <Link href="/products" className="inline-block px-8 py-3 bg-gray-800 text-white text-sm font-bold uppercase tracking-widest hover:bg-black transition rounded">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.productId} className="bg-white border border-gray-100 shadow-sm group flex flex-col">
                <Link href={`/products/${item.productId}`} className="relative aspect-[4/5] bg-[#EFEFEF] block overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-6 mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">{item.category}</span>
                  <h3 className="text-sm font-bold uppercase tracking-tight text-gray-900 line-clamp-2 flex-1">{item.name}</h3>
                  <p className="text-lg font-black text-gray-900 mt-2">${item.price.toFixed(2)}</p>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleMoveToCart(item)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-black text-white text-[11px] font-bold uppercase tracking-widest py-3 transition rounded"
                    >
                      <FiShoppingBag size={14} /> Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.productId)}
                      className="p-3 border border-gray-200 hover:border-red-400 hover:text-red-500 text-gray-400 transition rounded"
                      aria-label="Remove from wishlist"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
