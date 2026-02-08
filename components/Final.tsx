'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiShoppingCart } from 'react-icons/fi';
import { useSession } from 'next-auth/react';
import { ToastContainer, toast } from 'react-toastify';
import { useModalStore } from '@/store/modalStore';
import { useCartStore } from '@/store/cartStore'; 
import FirstSignupmodal from './FirstSignupmodal';

interface Product {
  id: string;
  image: string;
  title: string;
  price: number;
  description?: string;
  rating?: { rate: number; count: number };
  category?: string;
  name?: string;
  quantity?: number;
}

const FinalProduct: React.FC<{ sortedProducts: Product[] }> = ({ sortedProducts }) => {
  // ✅ Extract 'status' to prevent hydration wipes
  const { data: session, status } = useSession();
  const { openLogin } = useModalStore();

  const addToCart = useCartStore((state) => state.addToCart);
  const setUserId = useCartStore((state) => state.setUserId);

  // ✅ 2. Sync userId to the store with the Status Guard
  useEffect(() => {
    setUserId(session?.user?.email || null, status);
  }, [session, status, setUserId]);

  const handleAddToCart = (product: Product) => {
    if (!session) {
      toast.error('Please login to add items to your cart', {
        autoClose: 2000,
        position: 'top-right',
      });
      openLogin();
      return;
    }

    addToCart({
      id: product.id,
      name: product.title || product.name || '',
      image: product.image,
      price: product.price,
      quantity: 1,
    });

    toast.success(`Added "${product.title || product.name}" to cart`, {
      autoClose: 2000,
      position: 'top-right',
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      {sortedProducts.map((product) => (
        <div
          key={product.id}
          className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col relative"
        >
          {/* Badge */}
          {product.category && (
            <span className="absolute top-4 left-4 bg-indigo-600 text-white text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-widest z-20 shadow-lg">
              {product.category}
            </span>
          )}

          {/* Image Container */}
          <div className="relative w-full h-72 overflow-hidden bg-white">
            <Link href={`/products/${product.id}`}>
              <Image
                src={product.image}
                alt={product.title || "Product"}
                loading="lazy"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-contain p-8 transition-transform duration-700 group-hover:scale-110"
              />
            </Link>
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col flex-grow bg-white border-t border-gray-50">
            <h2 className="text-md font-bold text-gray-900 line-clamp-2 min-h-[3rem] mb-2 group-hover:text-indigo-600 transition-colors">
              {product.title || product.name}
            </h2>

            {/* Price Row */}
            <div className="flex items-center gap-3 mb-6">
              <p className="text-xl font-black text-indigo-600">
                ${(product.price * 0.8).toFixed(2)}
              </p>
              <p className="text-sm font-medium text-gray-400 line-through">
                ${product.price.toFixed(2)}
              </p>
              <span className="ml-auto text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded">
                -20%
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-auto">
              <button
                onClick={() => handleAddToCart(product)}
                className="flex-1 bg-gray-900 hover:bg-indigo-600 text-white text-xs py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all duration-300 transform active:scale-95 shadow-md"
              >
                <FiShoppingCart size={16} /> Add to Cart
              </button>

              <Link
                href={`/products/${product.id}`}
                className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-900 py-3 rounded-xl flex items-center justify-center text-xs font-bold border border-gray-200 transition-all duration-300"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      ))}

      <FirstSignupmodal />
      <ToastContainer />
    </div>
  );
};

export default FinalProduct;