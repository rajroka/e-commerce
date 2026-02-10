'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { useModalStore } from '@/store/modalStore';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';
import { useSession } from '@/lib/auth-client';
import { FaStar } from 'react-icons/fa';

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data: session } = useSession();
  const { openLogin } = useModalStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const setUserId = useCartStore((state) => state.setUserId);

  useEffect(() => {
    setUserId(session?.user?.email || null , status );
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
  }, [session, setUserId]);

  const handleAddToCart = (product: any) => {
    if (!session) {
      toast.error('Please login to add items', { position: 'top-right' });
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
    toast.success(`Added to cart`, { position: 'top-right' });
  };

  return (
    <main className="min-h-screen bg-[#F9F4F5] px-4 md:px-8 lg:px-14  py-12">
      <div className="max-w-7xl flex flex-col gap-4  mx-auto">
         
        <div className='flex items-center justify-between'>
          <span className='text-lg  lg:text-3xl md:text-2xl font-bold '>New products</span>
          <Link href="/products"  className=' px-4 py-1.5 rounded text-sm sm:text-base bg-gray-800 text-white '>All Products 
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  gap-4">
          {isLoading ? (
             <p>Loading...</p> 
          ) : (
            products.slice(0, 4).map((product) => (
              <div key={product.id} className="bg-white flex flex-col rounded  group">
                {/* Image Container */}
                <div className="relative aspect-[4/5] bg-[#EFEFEF] overflow-hidden">
                  {/* Badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-white text-[10px] uppercase tracking-widest px-3 py-1 rounded shadow-sm font-medium">
                      {product.badge || 'new'}
                    </span>
                  </div>
                  
                  <Link href={`/products/${product._id}`}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>

                  
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow">
                
                 

                  {/* Title & Price */}
                  <div className="flex justify-between items-start mb-1">
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-tight">
                      {product.name}
                    </h2>
                    <span className="text-sm font-bold">${product.price}</span>
                  </div>

                  {/* Description/Sub-label */}
                  <p className="text-sm  text-gray-500 mb-4">
                    {product.description}
                  </p>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2 text-[12px] rounded uppercase tracking-[0.2em] font-bold transition-colors mt-auto"
                  >
                    add to cart - ${product.price}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}