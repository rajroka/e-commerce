'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { FiShoppingCart } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/redux/slice/cartSlice';
import toast from 'react-hot-toast';
import { useModalStore } from '@/store/modalStore';
import Image from 'next/image';

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const { openLogin } = useModalStore();
  const isLoggedIn = useSelector((state: any) => state.auth?.isLoggedIn);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const displayedProducts = products.slice(0, 8);
  const skeletons = new Array(8).fill(null);

  const handleAddToCart = (product: any) => {
    if (!isLoggedIn) {
      toast.error('Please login to add items to your cart');
      openLogin();
      return;
    }

    dispatch(
      addToCart({
        id: product._id || product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: 1,
      })
    );

    toast.success(`Added "${product.name}" to cart`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-6 py-10">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
        <h1 className="text-3xl  font-medium text-gray-800 tracking-tight">Trending Products</h1>
        <Link
          href="/products"
          className="px-6 py-2.5 bg-gray-700 hover:bg-gray-900 text-white rounded font-medium transition duration-200 shadow-md"
        >
          View All Products
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {isLoading
          ? skeletons.map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col"
              >
                <div className="h-60 bg-gray-200 w-full" />
                <div className="p-4 flex flex-col gap-3 flex-grow">
                  <div className="h-4 bg-gray-300 rounded w-3/4" />
                  <div className="h-4 bg-gray-300 rounded w-1/2" />
                  <div className="flex gap-2 mt-auto">
                    <div className="h-10 w-1/2 bg-gray-300 rounded" />
                    <div className="h-10 w-1/2 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ))
          : displayedProducts.map((product) => (
              <div
                key={product._id || product.id}
                className="group bg-white border border-gray-200 rounded shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="relative h-60 w-full bg-gray-50 p-5">
                  <span className="absolute top-3 left-3 bg-gray-800 text-white text-xs px-3 py-1 rounded font-semibold uppercase tracking-wide shadow z-10">
                    {product.category}
                  </span>
                  <Link href={`/products/${product._id || product.id}`}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </Link>
                </div>

                <div className="px-4 py-3 flex flex-col gap-2 flex-grow bg-gray-100">
                  <h2 className="text-base font-semibold text-gray-800 line-clamp-2">{product.name}</h2>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center space-x-2">
                      <p className="text-emerald-600 font-bold text-sm">${(product.price * 0.8).toFixed(2)}</p>
                      <p className="text-gray-400 text-sm line-through">${product.price.toFixed(2)}</p>
                    </div>
                    <div className="text-yellow-500 text-sm">
                      {'★'.repeat(Math.round(product.rating?.rate || 4))}
                      <span className="ml-1 text-xs text-gray-500">({product.rating?.count || 120})</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-1/2 bg-gray-700 hover:bg-gray-900 text-white py-2 rounded flex items-center justify-center gap-1 text-sm font-medium shadow"
                    >
                      <FiShoppingCart className="text-base" />
                      Add
                    </button>

                    <Link
                      href={`/products/${product._id || product.id}`}
                      className="w-1/2 bg-white hover:bg-gray-200 text-gray-800 py-2 rounded flex items-center justify-center gap-1 text-sm font-medium border border-gray-300 shadow"
                    >
                      Shop
                    </Link>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </main>
  );
}
