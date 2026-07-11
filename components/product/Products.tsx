'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useModalStore } from '@/store/modalStore';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';
import { useSession } from '@/lib/auth-client';

export default function FeaturedProducts() {
  const [products, setProducts]   = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router             = useRouter();
  const { data: session }  = useSession();
  const { openLogin }      = useModalStore();
  const addToCart          = useCartStore((s) => s.addToCart);

  useEffect(() => {
    axios
      .get('/api/products')
      .then((r) => setProducts(r.data.products || r.data))
      .catch((err) => console.error('Error fetching products:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const requireAuth = (): boolean => {
    if (!session) {
      toast.error('Please sign in first', { position: 'top-right' });
      openLogin();
      return false;
    }
    return true;
  };

  const handleAddToCart = (product: any) => {
    if (!requireAuth()) return;
    addToCart({
      id:       product._id || product.id,
      name:     product.name,
      image:    product.image,
      price:    product.price,
      quantity: 1,
      stock:    product.stock,
    });
    toast.success('Added to cart', { position: 'top-right' });
  };

  const handleBuyNow = (product: any) => {
    if (!requireAuth()) return;
    addToCart({
      id:       product._id || product.id,
      name:     product.name,
      image:    product.image,
      price:    product.price,
      quantity: 1,
      stock:    product.stock,
    });
    router.push('/cart');
  };

  return (
    <section className="bg-gray-50 px-4 md:px-8 lg:px-14 py-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">

        <div className="flex items-center justify-between">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">New Products</h2>
          <Link
            href="/products"
            className="px-4 py-1.5 rounded-full text-sm font-semibold bg-gray-900 hover:bg-black text-white transition-colors"
          >
            All Products
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white flex flex-col rounded-xl animate-pulse">
                  <div className="aspect-[4/5] bg-gray-200 rounded-t-xl" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-9 bg-gray-200 rounded mt-4" />
                  </div>
                </div>
              ))
            : products.slice(0, 4).map((product) => (
                <div
                  key={product._id || product.id}
                  className="bg-white flex flex-col rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden rounded-t-xl">
                    <div className="absolute top-3 right-3 z-10">
                      <span className="bg-white text-xs px-2.5 py-1 rounded-full shadow-sm font-medium text-gray-600 capitalize">
                        {product.badge || 'New'}
                      </span>
                    </div>
                    <Link href={`/products/${product._id}`}>
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </Link>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
                        {product.name}
                      </h3>
                      <span className="text-sm font-bold text-gray-900 flex-shrink-0">
                        ${product.price}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Two-button row */}
                    <div className="mt-auto flex gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 border border-gray-200 hover:border-gray-900 text-gray-700 hover:text-gray-900 py-2.5 text-xs rounded-full font-semibold transition-colors"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleBuyNow(product)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 text-xs rounded-full font-semibold transition-colors active:scale-[0.98]"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
