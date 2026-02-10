'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';
import { useModalStore } from '@/store/modalStore';
import { useCartStore } from '@/store/cartStore'; 
import { useSession } from '@/lib/auth-client';

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

  useEffect(() => {
    setUserId(session?.user?.email || null , status);
  }, [session, setUserId]);

  const handleAddToCart = () => {
    if (!session) {
      toast.error('Please login to add items', { 
        position: 'top-right', 
        duration: 2000 
      });
      openLogin();
      return;
    }

    addToCart({
      id: product.id,
      name: product.title,
      image: product.image,
      price: product.price,
      quantity: product.quantity ?? 1,
    });

    toast.success(`Added to cart`, { 
        position: 'top-right', 
        duration: 2000 
    });
  };

  const discountedPrice = (product.price * 0.9).toFixed(2);

  return (
    <div className="min-h-screen bg-[#F9F4F5] flex items-center justify-center p-4 sm:p-6 lg:p-12">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-white border border-gray-100 shadow-sm">
        
        {/* Image Section - Responsive height */}
        <div className="flex items-center justify-center p-6 sm:p-10 bg-white border-b lg:border-b-0 lg:border-r border-gray-100">
          <div className="relative w-full aspect-square max-h-[300px] sm:max-h-[450px] lg:max-h-full">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-16 bg-white">
          <div className="space-y-6">
            {/* Category & Discount Badges - Square */}
            <div className="flex items-center gap-3">
              <span className="bg-gray-100 text-gray-900 text-[10px] sm:text-[11px] px-3 py-1 font-bold uppercase tracking-widest border border-gray-200">
                {product.category}
              </span>
              <span className="text-red-600 font-bold text-[10px] sm:text-[11px] uppercase tracking-widest">
                10% OFF
              </span>
            </div>

            {/* Title - Responsive size */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 uppercase tracking-tighter leading-tight">
              {product.title}
            </h1>

            {/* Description - Set to 14px (text-sm) */}
            <p className="text-sm text-gray-500 leading-relaxed italic border-t border-gray-100 pt-6">
              {product.description || 'Weightless, high-performance formula designed for long-lasting wear.'}
            </p>

            {/* Price Area */}
            <div className="flex items-baseline gap-4 pt-4">
              <span className="text-3xl font-black text-gray-900 tracking-tighter">
                ${discountedPrice}
              </span>
              <span className="line-through text-gray-400 text-lg font-medium">
                ${product.price.toFixed(2)}
              </span>
            </div>

            {/* CTA Button - Square, gray-800, text-14px */}
            <div className="pt-8">
              <button
                onClick={handleAddToCart}
                className="w-full bg-gray-800 rounded  hover:bg-black text-white py-4 text-sm font-bold uppercase tracking-[0.2em] transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3"
              >
                Add to Cart — ${discountedPrice}
              </button>
            </div>

           
          </div>
        </div>
      </div>

      <Toaster position="top-right" />
    </div>
  );
};

export default ProductDetailsClient;