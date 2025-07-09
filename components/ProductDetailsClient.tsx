'use client';

import toast, { Toaster } from 'react-hot-toast';
import React from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/redux/slice/cartSlice';
import { FiStar } from 'react-icons/fi';
import { useModalStore } from '@/store/modalStore';

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
  const { openLogin } = useModalStore();
  const dispatch = useDispatch();
  const discountedPrice = (product.price * 0.9).toFixed(2);
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);


  const handleAddToCart = () => {
    if (!isLoggedIn) {
      openLogin();
      return;
    }

    try {
      dispatch(addToCart(product));
      toast.success(`"${product.title}" added to cart!`, {
        duration: 2000,
        position: 'top-right',
        style: {
          background: '#000',
          color: '#fff',
          fontSize: '16px',
          padding: '10px 15px',
          borderRadius: '6px',
        },
      });
    } catch (error) {
      toast.error('Failed to add product to cart', {
        duration: 2000,
        position: 'top-right',
        style: {
          background: '#000',
          color: '#fff',
          fontSize: '16px',
          padding: '10px 15px',
          borderRadius: '6px',
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-6xl bg-white rounded shadow-xl overflow-hidden flex flex-col lg:flex-row">
        {/* Image Section */}
        <div className="w-full lg:w-1/2 bg-gray-100 p-8 flex items-center justify-center">
          <div className="relative w-full h-72 sm:h-96 md:h-[28rem]">
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
        <div className="w-full lg:w-1/2 p-8 flex flex-col justify-between gap-8">
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{product.title}</h1>
            <p className="text-gray-700 text-base leading-relaxed line-clamp-6">
              {product.description || 'No description available.'}
            </p>

            <div className="flex items-center gap-4 flex-wrap text-xl font-semibold mt-4">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded">
                ${discountedPrice}
              </span>
              <span className="line-through text-red-600 text-base">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500 italic">({product.category})</span>
            </div>

            <div className="flex items-center gap-2 text-yellow-500 mt-2">
              <FiStar className="w-5 h-5" />
              <span className="text-gray-800 font-medium">{product.rating?.rate ?? 'N/A'}</span>
              <span className="text-gray-500 text-sm">
                ({product.rating?.count ?? 0} reviews)
              </span>
            </div>
          </div>

          <div>
            <button
              onClick={handleAddToCart}
              aria-label={`Add ${product.title} to cart`}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 text-lg font-semibold rounded shadow hover:scale-[1.01] transition-all duration-300"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default ProductDetailsClient;
