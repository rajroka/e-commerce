'use client';

import React from 'react';
import Link from 'next/link';
import { FiShoppingCart } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/redux/slice/cartSlice';
import { ToastContainer , toast } from 'react-toastify';
import { RootState } from '@/redux/store';
import Logintoggle from './LoginModal';
import FirstSignupmodal from './FirstSignupmodal';
import { useModalStore } from '@/store/modalStore';


interface Product {
  id: string;
  image: string;
  title: string;
  price: number;
  description: string;
  rating?: {
    rate: number;
    count: number;
  };
  category?: string;
  name?: string;
}

const FinalProduct: React.FC<{ sortedProducts: Product[] }> = ({ sortedProducts }) => {
  const dispatch = useDispatch();
  
  
  const { openLogin } = useModalStore();


  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const handleAddToCart = (product: Product) => {
    if (!isLoggedIn) {
      toast.error('Please login to add items to your cart', {
        autoClose: 2000,
        position: 'top-right',
      });
      
      openLogin();

      return;
    }

    dispatch(
      addToCart({
        id: product.id,
        name: product.title || product.name,
        image: product.image,
        price: product.price,
        quantity: 1,
      })
    );

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
          className="group bg-white border border-gray-200 rounded shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
        >
          <div className="relative">
            {product.category && (
              <span className="absolute top-3 left-3 bg-black text-white text-xs px-3 py-1 rounded font-semibold shadow-md uppercase tracking-wider">
                {product.category}
              </span>
            )}
            <Link href={`/products/${product.id}`}>
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-60 object-contain p-5 bg-gray-50 transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          </div>

          <div className="px-2 py-2 flex flex-col flex-grow bg-gray-100 ">
            <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
              {product.title || product.name}
            </h2>

            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center space-x-3">
                <p className="text-sm font-bold text-emerald-600">
                  ${(product.price * 0.8).toFixed(2)}
                </p>
                <p className="text-sm font-semibold text-gray-500 line-through">
                  ${product.price.toFixed(2)}
                </p>
              </div>

              <div className="flex items-center gap-1 text-yellow-500 text-sm">
                {'★'.repeat(Math.round(product.rating?.rate || 4))}
                <span className="ml-1 text-gray-400 text-xs">
                  ({product.rating?.count || 120})
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-2 mb-1.5">
              <button
                className="w-1/2 bg-gray-700 hover:bg-gray-900 text-sm  text-white py-2 rounded flex items-center justify-center gap-2 font-medium shadow"
                onClick={() => handleAddToCart(product)}
              >
                <FiShoppingCart className="text-sm" /> Add to Cart
              </button>

              <Link
                href={`/products/${product.id}`}
                className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded flex items-center justify-center gap-2 text-sm font-medium border border-gray-300 shadow"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      ))}
       <Logintoggle  />
      <FirstSignupmodal />
      <ToastContainer />
    </div>
  );
};

export default FinalProduct;
