'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useModalStore } from '@/store/modalStore';
import { useCartStore } from '@/store/cartStore'; 

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
  const { data: session, status } = useSession(); // ✅ Added status
  const { openLogin } = useModalStore();

  // ✅ 1. Standard Zustand hook usage
  const addToCart = useCartStore((state) => state.addToCart);
  const setUserId = useCartStore((state) => state.setUserId);

  // ✅ 2. Sync User ID with Status Guard
  // This ensures that when you refresh on a product page, the cart persists.
  useEffect(() => {
    setUserId(session?.user?.email || null, status);
  }, [session, status, setUserId]);

  const handleAddToCart = () => {
    // We check session here to protect the action
    if (!session) {
      toast.error('Please login to add items to your cart', { 
        position: 'top-right', 
        duration: 2000 
      });
      openLogin();
      return;
    }

    // ✅ 3. Call the action directly
    addToCart({
      id: product.id,
      name: product.title,
      image: product.image,
      price: product.price,
      quantity: product.quantity ?? 1,
    });

    toast.success(`"${product.title}" added to cart!`, { 
        position: 'top-right', 
        duration: 2000 
    });
  };

  const discountedPrice = (product.price * 0.9).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 bg-white">
        
        {/* Image Section */}
        <div className="flex items-center justify-center p-6 bg-white relative group">
          <div className="relative w-full h-80 sm:h-96 md:h-[30rem] transition-transform duration-500 group-hover:scale-105">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-contain rounded-lg"
              priority
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="flex flex-col justify-between gap-6 p-8 sm:p-10 bg-gray-100">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <span className="inline-block bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                {product.category}
              </span>
              <span className="text-green-600 font-bold text-sm bg-green-50 px-2 py-1 rounded">
                10% OFF
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              {product.title}
            </h1>

            <div className="flex items-center gap-4 mt-2">
              <div className="flex text-yellow-400">
                {/* Static stars for UI polish */}
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-400 text-sm">(4.8 / 5.0)</span>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed pt-4 border-t border-gray-200">
              {product.description || 'No description available for this premium item.'}
            </p>

            <div className="flex items-baseline gap-4 pt-6">
              <span className="text-4xl font-black text-gray-900">${discountedPrice}</span>
              <span className="line-through text-gray-400 text-xl font-medium">${product.price.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleAddToCart}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 text-xl font-bold rounded-2xl shadow-lg shadow-indigo-100 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add to Cart
            </button>
            <p className="text-center text-gray-400 text-sm">
              Free shipping on orders over $50 • 30-day returns
            </p>
          </div>
        </div>
      </div>

      <Toaster position="top-right" />
    </div>
  );
};

export default ProductDetailsClient;