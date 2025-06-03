'use client';

import toast, { Toaster } from 'react-hot-toast';
import React from 'react';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/slice/cartSlice';

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
  const dispatch = useDispatch();
  const discountedPrice = (product.price * 0.9).toFixed(2);


  
  const handleAddToCart = () => {
   try {
    dispatch(addToCart(product));
    toast.success(` ${product.title} is added to cart `, {
      duration: 2000,
      position: 'top-right',
      style: {
        background: '#4CAF50',
        color: '#fff',
        fontSize: '16px',
        padding: '10px',
        borderRadius: '5px',
      },
    });
   } catch (error) {
     toast.error('Failed to add product to cart', {
         duration: 2000,
         position: 'top-right',
         style: {
            background: '#F44336',
            color: '#fff',
            fontSize: '16px',
            padding: '10px',
            borderRadius: '5px',
         },
      });
   }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 to-green-200 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center px-4 py-10 transition-colors duration-300">
      <div className="w-full max-w-4xl bg-white dark:bg-zinc-900 text-black dark:text-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row transition-all duration-300">

        {/* Image Section */}
        <div className="w-full lg:w-1/2 bg-gray-100 dark:bg-zinc-800 p-6 flex items-center justify-center">
          <div className="relative w-full h-64 sm:h-80 md:h-96">
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
        <div className="w-full lg:w-1/2 p-6 md:p-10 flex flex-col justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">{product.title}</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm sm:text-base line-clamp-6">
              {product.description}
            </p>

            <div className="flex flex-wrap items-center gap-2 text-green-600 dark:text-green-400 text-lg sm:text-xl font-semibold">
              <span className="line-through text-red-500">${product.price}</span>
              <span>${discountedPrice}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({product.category})
              </span>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-yellow-500 text-sm">
              ⭐ {product.rating?.rate} ({product.rating?.count} reviews)
            </p>

            <button
              onClick={handleAddToCart}
              
              className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition-transform transform hover:scale-105 duration-200"
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
