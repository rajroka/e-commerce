'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { FiShoppingCart } from 'react-icons/fi';
import { useSession } from 'next-auth/react';
import { ToastContainer, toast } from 'react-toastify';
import { useModalStore } from '@/store/modalStore';
import { useCartStore } from '@/store/cartStore'; 

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false); 

  // ✅ Extract status to use the "Status Guard"
  const { status, data: session } = useSession();
  const { openLogin } = useModalStore();

  const addToCart = useCartStore((state) => state.addToCart);
  const setUserId = useCartStore((state) => state.setUserId);

  useEffect(() => {
    setMounted(true);
    
    // ✅ 2. Sync userId to store using the status parameter
    // This prevents the cart from resetting to 0 during page refresh
    setUserId(session?.user?.email || null, status);

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
  }, [session, status, setUserId]);

  const displayedProducts = products.slice(0, 8);
  const skeletons = new Array(8).fill(null);

  const handleAddToCart = (product: any) => {
    if (!session) {
      toast.error('Please login to add items to your cart', { 
        autoClose: 2000, 
        position: 'top-right' 
      });
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

    toast.success(`Added "${product.name}" to cart`, { 
      autoClose: 2000, 
      position: 'top-right' 
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 p-8 md:p-12 lg:p-16 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Trending Products</h1>
            <p className="text-gray-500 text-sm">Discover our most popular items this week.</p>
          </div>
          <Link
            href="/products"
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all duration-300 shadow-lg shadow-indigo-100 transform hover:-translate-y-1"
          >
            View All Products
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {isLoading
            ? skeletons.map((_, idx) => (
                <div
                  key={idx}
                  className="animate-pulse bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
                >
                  <div className="aspect-square bg-gray-100 w-full" />
                  <div className="p-6 flex flex-col gap-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="flex gap-2 mt-4">
                      <div className="h-10 w-full bg-gray-100 rounded-lg" />
                    </div>
                  </div>
                </div>
              ))
            : displayedProducts.map((product) => (
                <div
                  key={product._id || product.id}
                  className="group bg-white border border-gray-50 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col overflow-hidden relative"
                >
                  <div className="relative w-full aspect-square bg-white flex items-center justify-center overflow-hidden p-6">
                    <span className="absolute top-4 left-4 bg-gray-900/10 backdrop-blur-md text-gray-900 text-[10px] px-3 py-1 rounded-full font-bold z-10 uppercase">
                      {product.category}
                    </span>
                    <Link href={`/products/${product._id || product.id}`} className="w-full h-full relative">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain transition-transform duration-500 group-hover:scale-110"
                      />
                    </Link>
                  </div>

                  <div className="p-6 flex flex-col flex-grow bg-white">
                    <h2 className="text-sm font-bold text-gray-800 line-clamp-2 min-h-[2.5rem] group-hover:text-indigo-600 transition-colors">
                      {product.name}
                    </h2>

                    <div className="flex items-center justify-between mt-4 mb-6">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 line-through">${product.price.toFixed(2)}</span>
                        <span className="text-lg font-black text-indigo-600">${(product.price * 0.8).toFixed(2)}</span>
                      </div>
                      <span className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-md font-bold">20% OFF</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 bg-gray-900 hover:bg-indigo-600 text-white py-3 rounded-xl text-xs flex items-center justify-center gap-2 font-bold transition-all duration-300 active:scale-95 shadow-md"
                      >
                        <FiShoppingCart size={16} />
                        Add
                      </button>
                      <Link
                        href={`/products/${product._id || product.id}`}
                        className="px-4 bg-gray-50 hover:bg-gray-100 text-gray-900 py-3 rounded-xl flex items-center justify-center text-xs font-bold border border-gray-100 transition-all duration-300"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>

      <ToastContainer />
    </main>
  );
}