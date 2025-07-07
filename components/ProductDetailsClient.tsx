'use client';

import toast, { Toaster } from 'react-hot-toast';
import React from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/redux/slice/cartSlice';
import { useRouter } from 'next/navigation';
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
  const dispatch = useDispatch();
  const discountedPrice = (product.price * 0.9).toFixed(2);
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
  const router = useRouter();

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      router.push('/login');
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
    <div className="min-h-screen bg-gray-200  flex items-center justify-center px-4 py-10 transition-colors duration-300">
      <div className="w-full max-w-5xl bg-white text-black rounded-3xl shadow-lg overflow-hidden flex flex-col lg:flex-row transition-all duration-300">

        {/* Image Section */}
        <div className="w-full lg:w-1/2 bg-gray-100  flex items-center justify-center">
          <div className="relative w-full h-64 sm:h-80 md:h-96">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-contain bg-white"
              priority
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="w-full lg:w-1/2 p-8 flex flex-col justify-between gap-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold  leading-tight">{product.title}</h1>
            <p className="text-gray-800  text-base sm:text-base  mt-1  mb-1  line-clamp-6">
             {product.description || 'No description available'}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-black text-xl font-semibold">
                <span>${discountedPrice}</span>
              <span className="line-through text-base  text-red-600">${product.price.toFixed(2)}</span>
            
              <span className="text-sm text-gray-600 italic">
                ({product.category})
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-yellow-500 text-lg">
              <FiStar className="w-6 h-6" aria-hidden="true" />
              <span aria-label={`Rating: ${product.rating?.rate ?? 'No rating'}`} className="text-black">
                {product.rating?.rate ?? 'N/A'}
              </span>
              <span className="text-gray-600 text-sm">
                ({product.rating?.count ?? 5} reviews)
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              aria-label={`Add ${product.title} to cart`}
              className="mt-2 w-full bg-black hover:bg-gray-900 text-white font-semibold py-3 rounded-lg transition-transform transform  focus:outline-none focus:ring-4 focus:ring-gray-700"
              type="button"
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
