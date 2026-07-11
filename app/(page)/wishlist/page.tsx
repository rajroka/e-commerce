'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';
import { HugeiconsIcon } from '@hugeicons/react';
import { HeartIcon, ShoppingCart01Icon, Delete01Icon, ArrowLeft01Icon } from '@hugeicons/core-free-icons';

const STROKE = 1.5;

export default function WishlistPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const { items, fetchWishlist, removeFromWishlist } = useWishlistStore();
  const addToCart = useCartStore(s => s.addToCart);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isPending && !session) router.push('/sign-in');
    if (session) fetchWishlist();
  }, [isPending, session, router, fetchWishlist]);

  if (!mounted || isPending) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-7 h-7 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const handleMoveToCart = (item: typeof items[0]) => {
    addToCart({ id: item.productId, name: item.name, image: item.image, price: item.price, quantity: 1 });
    removeFromWishlist(item.productId);
    toast.success('Moved to cart');
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <HugeiconsIcon icon={HeartIcon} size={22} color="#f87171" strokeWidth={STROKE} /> Wishlist
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{items.length} saved {items.length === 1 ? 'item' : 'items'}</p>
          </div>
          <Link href="/products" className="btn-ghost text-sm hidden sm:inline-flex">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} color="currentColor" strokeWidth={STROKE} /> Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <HugeiconsIcon icon={HeartIcon} size={28} color="#fca5a5" strokeWidth={STROKE} />
            </div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-sm text-gray-500 mb-6">Save items you love and come back to them anytime.</p>
            <Link href="/products" className="btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map(item => (
              <div key={item.productId} className="card group flex flex-col overflow-hidden hover:shadow-md transition-shadow">
                <Link href={`/products/${item.productId}`} className="relative aspect-square bg-gray-50 block overflow-hidden">
                  <Image src={item.image} alt={item.name} fill sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw"
                    className="object-contain p-4 mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
                </Link>
                <div className="p-4 flex flex-col flex-1 gap-2">
                  <span className="text-xs text-gray-400 capitalize">{item.category}</span>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 flex-1 leading-snug">{item.name}</h3>
                  <p className="text-base font-bold text-gray-900">${item.price.toFixed(2)}</p>
                  <div className="flex gap-2 mt-1">
                    <button onClick={() => handleMoveToCart(item)} className="btn-primary flex-1 py-2 text-xs rounded-lg">
                      <HugeiconsIcon icon={ShoppingCart01Icon} size={13} color="white" strokeWidth={STROKE} /> Add to Cart
                    </button>
                    <button onClick={() => { removeFromWishlist(item.productId); toast.success('Removed'); }}
                      aria-label="Remove from wishlist"
                      className="w-9 flex items-center justify-center border border-gray-200 rounded-lg text-gray-400 hover:border-red-300 hover:text-red-500 transition-colors">
                      <HugeiconsIcon icon={Delete01Icon} size={14} color="currentColor" strokeWidth={STROKE} />
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
