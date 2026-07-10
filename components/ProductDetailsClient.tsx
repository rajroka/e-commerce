'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';
import { useModalStore } from '@/store/modalStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useSession } from '@/lib/auth-client';
import { FiHeart } from 'react-icons/fi';
import ReviewSection from './ReviewSection';

interface ProductProps {
  product: {
    id: string;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    quantity?: number;
  };
}

const ProductDetailsClient: React.FC<{ product: ProductProps['product'] }> = ({ product }) => {
  const { data: session } = useSession();
  const { openLogin } = useModalStore();

  const addToCart = useCartStore((state) => state.addToCart);
  const setUserId = useCartStore((state) => state.setUserId);
  const { isInWishlist, toggleWishlist, fetchWishlist } = useWishlistStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUserId(session?.user?.id || null, session ? 'authenticated' : 'unauthenticated');
    if (session) fetchWishlist();
  }, [session, setUserId, fetchWishlist]);

  const handleAddToCart = () => {
    if (!session) {
      toast.error('Please login to add items', { position: 'top-right', duration: 2000 });
      openLogin();
      return;
    }
    addToCart({ id: product.id, name: product.title, image: product.image, price: product.price, quantity: product.quantity ?? 1 });
    toast.success('Added to cart', { position: 'top-right', duration: 2000 });
  };

  const handleWishlist = () => {
    if (!session) {
      toast.error('Please login to save items', { position: 'top-right', duration: 2000 });
      return;
    }
    toggleWishlist({ productId: product.id, name: product.title, image: product.image, price: product.price, category: product.category });
  };

  const discountedPrice = (product.price * 0.9).toFixed(2);
  const wishlisted = mounted && isInWishlist(product.id);

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden">

          {/* Image */}
          <div className="flex items-center justify-center p-6 sm:p-10 bg-white border-b lg:border-b-0 lg:border-r border-gray-100">
            <div className="relative w-full aspect-square max-h-[300px] sm:max-h-[450px] lg:max-h-full">
              <Image src={product.image} alt={product.title} fill className="object-contain" priority />
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-16 bg-white">
            <div className="space-y-5">
              {/* Badges */}
              <div className="flex items-center gap-3">
                <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 font-medium rounded-full border border-gray-200 capitalize">
                  {product.category}
                </span>
                <span className="text-red-500 font-semibold text-xs">10% off</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {product.title}
              </h1>

              <p className="text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-5">
                {product.description || 'Weightless, high-performance formula designed for long-lasting wear.'}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-4 pt-2">
                <span className="text-3xl font-bold text-gray-900">${discountedPrice}</span>
                <span className="line-through text-gray-400 text-lg">${product.price.toFixed(2)}</span>
              </div>

              {/* Actions */}
              <div className="pt-4 flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gray-800 hover:bg-black rounded-xl text-white py-4 text-sm font-semibold transition-all duration-300 active:scale-[0.98]"
                >
                  Add to Cart — ${discountedPrice}
                </button>
                <button
                  onClick={handleWishlist}
                  aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    wishlisted ? 'bg-red-50 border-red-300 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400'
                  }`}
                >
                  <FiHeart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReviewSection productId={product.id} />
      <Toaster position="top-right" />
    </>
  );
};

export default ProductDetailsClient;
