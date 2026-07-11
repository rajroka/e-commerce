'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useModalStore } from '@/store/modalStore';
import { useCartStore } from '@/store/cartStore';
import FirstSignupmodal from './FirstSignupmodal';
import { useSession } from '@/lib/auth-client';
import { toast } from 'react-hot-toast';

interface Product {
  id: string;
  image: string;
  title: string;
  price: number;
  description?: string;
  category?: string;
  name?: string;
  stock?: number;
}

const FinalProduct: React.FC<{ sortedProducts: Product[] }> = ({ sortedProducts }) => {
  const { data: session } = useSession();
  const { openLogin }     = useModalStore();
  const addToCart         = useCartStore((s) => s.addToCart);

  const handleAddToCart = (product: Product) => {
    if (!session) {
      toast.error('Please sign in to add items to cart', { position: 'top-right' });
      openLogin();
      return;
    }
    addToCart({
      id:       product.id,
      name:     product.title || product.name || '',
      image:    product.image,
      price:    product.price,
      quantity: 1,
      stock:    product.stock,
    });
    toast.success('Added to cart', { position: 'top-right' });
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10">
      {sortedProducts.map((product) => (
        <div key={product.id} className="group flex rounded flex-col relative bg-transparent">

          {/* Category badge */}
          <div className="absolute top-0 right-0 z-10">
            <span className="bg-white text-xs px-3 py-1 font-medium text-gray-600 border-l border-b border-gray-100 capitalize">
              {product.category || 'New'}
            </span>
          </div>

          {/* Image */}
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100 rounded-t">
            <Link href={`/products/${product.id}`}>
              <Image
                src={product.image}
                alt={product.title || 'Product'}
                loading="lazy"
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-contain p-6 mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Content */}
          <div className="pt-4 flex flex-col flex-grow">
            <div className="flex justify-between items-start gap-2 mb-1">
              <h2 className="text-sm font-semibold text-gray-900 line-clamp-1">
                {product.title || product.name}
              </h2>
              <span className="text-sm font-semibold text-gray-900 flex-shrink-0">
                ${product.price.toFixed(2)}
              </span>
            </div>

            <p className="text-xs text-gray-500 mb-4 line-clamp-1">{product.description}</p>

            <button
              onClick={() => handleAddToCart(product)}
              className="mt-auto w-full bg-gray-900 hover:bg-red-500 rounded text-white text-xs py-3 font-semibold transition-colors active:scale-[0.98]"
            >
              Add to cart — ${product.price.toFixed(2)}
            </button>
          </div>
        </div>
      ))}
      <FirstSignupmodal />
    </div>
  );
};

export default FinalProduct;
