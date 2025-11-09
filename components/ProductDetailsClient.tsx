'use client';

import toast, { Toaster } from 'react-hot-toast';
import React from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useModalStore } from '@/store/modalStore';
import { useCartStore } from '@/store/cartStore'; // Zustand store
import { FiStar } from 'react-icons/fi';

interface ProductProps {
  product: {
    id: string;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
      rate: number;
      count: number;
    };
  };
}

const ProductDetailsClient: React.FC<{ product: ProductProps['product'] }> = ({ product }) => {
  const { data: session } = useSession();
  const { openLogin } = useModalStore();
  const addToCart = useCartStore((state) => state.addToCart);

  const discountedPrice = (product.price * 0.9).toFixed(2);

  const handleAddToCart = () => {
    if (!session) {
      toast.error('Please login to add items to your cart', {
        position: 'top-right',
        duration: 2000,
      });
      openLogin();
      return;
    }

    try {
      addToCart({
        id: product.id,
        name: product.title,
        image: product.image,
        price: product.price,
        quantity: 1,
      });
      toast.success(`"${product.title}" added to cart!`, {
        position: 'top-right',
        duration: 2000,
      });
    } catch (error) {
      toast.error('Failed to add product to cart', {
        position: 'top-right',
        duration: 2000,
      });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 bg-white">
          
          {/* Image Section */}
          <div className="bg-white flex items-center justify-center p-6">
            <div className="relative w-full h-80 sm:h-96 md:h-[30rem]">
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
          <div className="bg-gray-100 p-8 sm:p-10 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <span className="inline-block bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full font-medium uppercase tracking-wide">
                {product.category}
              </span>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{product.title}</h1>

              <p className="text-gray-700 text-base leading-relaxed line-clamp-6">
                {product.description || 'No description available.'}
              </p>

              <div className="flex items-center gap-4 text-2xl font-semibold mt-3">
                <span className="text-green-600">${discountedPrice}</span>
                <span className="line-through text-red-500 text-lg">${product.price.toFixed(2)}</span>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <FiStar className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-800 font-medium">{product.rating?.rate ?? 'N/A'}</span>
                <span className="text-gray-500 text-sm">({product.rating?.count ?? 0} reviews)</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleAddToCart}
                aria-label={`Add ${product.title} to cart`}
                className="w-full bg-black hover:bg-gray-800 text-white py-3 text-lg font-semibold rounded-xl shadow-md hover:scale-[1.015] transition-all duration-300"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
        <Toaster
          toastOptions={{
            style: {
              background: '#000',
              color: '#fff',
              fontSize: '15px',
              padding: '12px 18px',
              borderRadius: '8px',
            },
          }}
        />
      </div>
    </>
  );
};

export default ProductDetailsClient;
