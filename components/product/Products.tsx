'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import { useSession } from 'next-auth/react';
import { ToastContainer, toast } from 'react-toastify';
import { useModalStore } from '@/store/modalStore';
import { useCartStore } from '@/store/cartStore';

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const { openLogin } = useModalStore();
  const addToCart = useCartStore((state) => state.addToCart);

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
    if (!session) {
      toast.error('Please login to add items to your cart', { autoClose: 2000, position: 'top-right' });
      openLogin();
      return;
    }

    addToCart({
      id: product._id || product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: 1,
    });

    toast.success(`Added "${product.name}" to cart`, { autoClose: 2000, position: 'top-right' });
  };

  const renderStars = (rate: number) => {
    const fullStars = Math.floor(rate);
    const starsArray = Array(5).fill(0).map((_, idx) => (
      <FiStar
        key={idx}
        className={idx < fullStars ? 'text-yellow-400' : 'text-gray-300'}
      />
    ));
    return starsArray;
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Trending Products</h1>
        <Link
          href="/products"
          className="px-6 py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded font-medium transition duration-200 shadow-md"
        >
          View All Products
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading
          ? skeletons.map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
              >
                <div className="h-64 bg-gray-200 w-full" />
                <div className="p-4 flex flex-col gap-3">
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
                className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 flex flex-col overflow-hidden"
              >
                {/* Image */}
                <div className="relative w-full h-64 bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
                  <span className="absolute top-3 left-3 bg-gray-800 text-white text-xs px-2 py-1 rounded font-semibold z-10">
                    {product.category}
                  </span>
                  <Link href={`/products/${product._id || product.id}`} className="w-full h-full relative">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain transition-transform duration-300 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </Link>
                </div>

                {/* Product info */}
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2">{product.name}</h2>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <p className="text-emerald-600 font-bold">${(product.price * 0.8).toFixed(2)}</p>
                      <p className="text-gray-400 text-sm line-through">${product.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm">{renderStars(product.rating?.rate || 4)}</div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-gray-800 hover:bg-gray-900 text-white py-2 rounded flex items-center justify-center gap-2 font-medium transition"
                    >
                      <FiShoppingCart className="text-lg" />
                      Add to Cart
                    </button>
                    <Link
                      href={`/products/${product._id || product.id}`}
                      className="flex-1 border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 py-2 rounded flex items-center justify-center gap-2 font-medium transition"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
      </div>

      <ToastContainer />
    </main>
  );
}
