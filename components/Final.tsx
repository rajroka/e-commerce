'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useModalStore } from '@/store/modalStore';
import { useCartStore } from '@/store/cartStore'; 
import FirstSignupmodal from './FirstSignupmodal';
import { useSession } from '@/lib/auth-client';
import { FaStar } from 'react-icons/fa';
import { toast } from "react-hot-toast";

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
  const { data: session } = useSession();
  const { openLogin } = useModalStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const setUserId = useCartStore((state) => state.setUserId);

  useEffect(() => {
    setUserId(session?.user?.email || null , status);
  }, [session, setUserId]);

  const handleAddToCart = (product: Product) => {
    if (!session) {
      toast.error('Please login to add items', { position: 'top-right' });
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

    toast.success(`Added to cart`, { position: 'top-right' });
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10">
      {sortedProducts.map((product) => (
        <div
          key={product.id}
          className="group flex rounded  flex-col relative bg-transparent"
        >
          {/* Badge - Removed rounded corners */}
          <div className="absolute top-0 right-0 z-10">
            <span className="bg-white text-[10px] uppercase tracking-[0.15em] px-3 py-1 font-bold text-gray-900 border-l border-b border-gray-100">
              {product.category || 'New'}
            </span>
          </div>

          {/* Image Container - Removed rounded corners */}
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#EFEFEF]">
            <Link href={`/products/${product.id}`}>
              <Image
                src={product.image}
                alt={product.title || "Product"}
                loading="lazy"
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-contain p-6 mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Content */}
          <div className="pt-4 flex flex-col flex-grow">
          
            

            {/* Title & Price Header - Text set to 12px (text-sm) */}
            <div className="flex justify-between items-start gap-2 mb-1">
              <h2 className="text-[14px] font-bold text-gray-900 uppercase tracking-tight line-clamp-1">
                {product.title || product.name}
              </h2>
              <span className="text-[14px] font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
            </div>

            {/* Sub-description - Text set to 12px */}
            <p className="text-[12px] text-gray-500 mb-4 italic line-clamp-1">
              {product.description }
            </p>

            {/* Actions - Removed rounded-xl, using square corners */}
            <div className="mt-auto">
              <button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-gray-800 hover:bg-black rounded text-white text-[12px] py-3 uppercase tracking-[0.2em] font-bold transition-all duration-300 active:scale-[0.98]"
              >
                Add to cart - ${product.price.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      ))}

      <FirstSignupmodal />
    </div>
  );
};

export default FinalProduct;