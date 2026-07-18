'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useModalStore } from '@/store/modalStore';
import { useCartStore } from '@/store/cartStore';
import { useBuyNow } from '@/lib/buyNow';
import { useSession } from '@/lib/auth-client';
import { toast } from 'react-hot-toast';
import { HugeiconsIcon } from '@hugeicons/react';
import { LoaderPinwheelIcon } from '@hugeicons/core-free-icons';
import { getEffectivePrice } from '@/lib/discount';

const STROKE = 1.5;

interface Product {
  id: string;
  image: string;
  title: string;
  price: number;
  description?: string;
  category?: string;
  name?: string;
  stock?: number;
  discountPct?: number | null;
  discountEndsAt?: string | null;
}

const FinalProduct: React.FC<{ sortedProducts: Product[] }> = ({ sortedProducts }) => {
  const { data: session } = useSession();
  const { openLogin }     = useModalStore();
  const addToCart         = useCartStore((s) => s.addToCart);
  const { buyNow, buying } = useBuyNow();
  const isAdmin = (session?.user as any)?.role === 'admin';

  const requireAuth = (): boolean => {
    if (!session) {
      toast.error('Please sign in first', { position: 'top-right' });
      openLogin();
      return false;
    }
    return true;
  };

  const handleAddToCart = (product: Product) => {
    if (!requireAuth()) return;
    const { salePrice } = getEffectivePrice(product);
    addToCart({
      id:       product.id,
      name:     product.title || product.name || '',
      image:    product.image,
      price:    salePrice,
      quantity: 1,
      stock:    product.stock,
    });
    toast.success('Added to cart', { position: 'top-right' });
  };

  const handleBuyNow = (product: Product) => {
    if (!requireAuth()) return;
    const { salePrice } = getEffectivePrice(product);
    buyNow({
      id:    product.id,
      name:  product.title || product.name || '',
      image: product.image,
      price: salePrice,
    });
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
                className="object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Content */}
          <div className="pt-4 flex flex-col flex-grow">
            <div className="flex justify-between items-start gap-2 mb-1">
              <h2 className="text-sm font-semibold text-gray-900 line-clamp-1">
                {product.title || product.name}
              </h2>
              <div className="flex flex-col items-end flex-shrink-0">
                {(() => {
                  const { salePrice, originalPrice, isSale, discountPct } = getEffectivePrice(product);
                  return isSale ? (
                    <>
                      <span className="text-sm font-semibold text-red-500">${salePrice.toFixed(2)}</span>
                      <span className="text-xs text-gray-400 line-through">${originalPrice.toFixed(2)}</span>
                    </>
                  ) : (
                    <span className="text-sm font-semibold text-gray-900">${originalPrice.toFixed(2)}</span>
                  );
                })()}
              </div>
            </div>

            {/* Sale badge */}
            {(() => {
              const { isSale, discountPct } = getEffectivePrice(product);
              return isSale ? (
                <span className="inline-block mb-1 text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded w-fit">
                  {discountPct}% off
                </span>
              ) : null;
            })()}

            <p className="text-xs text-gray-500 mb-4 line-clamp-1">{product.description}</p>

            <div className="mt-auto flex gap-2">
              {!isAdmin && (
                <>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={buying}
                    className="flex-1 border border-gray-200 hover:border-gray-900 text-gray-700 hover:text-gray-900 rounded text-xs py-2.5 font-semibold transition-colors active:scale-[0.98] disabled:opacity-50"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleBuyNow(product)}
                    disabled={buying}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs py-2.5 font-semibold transition-colors active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-1"
                  >
                    {buying
                      ? <HugeiconsIcon icon={LoaderPinwheelIcon} size={11} color="white" strokeWidth={STROKE} className="animate-spin" />
                      : 'Buy Now'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
      {/* First signup promotional modal removed to prevent automatic opening */}
    </div>
  );
};

export default FinalProduct;


