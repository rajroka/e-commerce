'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { StarIcon } from '@hugeicons/core-free-icons';
import { useCartStore } from '@/store/cartStore';
import { useSession } from '@/lib/auth-client';
import { useModalStore } from '@/store/modalStore';
import toast from 'react-hot-toast';

const STROKE = 1.5;
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLOR_MAP: Record<string, string> = {
  red: '#ef4444', green: '#22c55e', blue: '#3b82f6',
  yellow: '#eab308', purple: '#a855f7', orange: '#f97316',
  pink: '#ec4899', black: '#111827', white: '#f9fafb',
};

interface Props {
  product: any;
  badge?: string;   // e.g. "Bestseller"
  className?: string;
}

export default function ProductCard({ product: p, badge, className = '' }: Props) {
  const { data: session } = useSession();
  const { openLogin }     = useModalStore();
  const addToCart         = useCartStore(s => s.addToCart);

  const [qty,         setQty]         = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const rating      = Math.round(p.rating ?? 4);
  const hasDiscount = p.discountPct > 0;
  const sale        = hasDiscount ? (p.price * (1 - p.discountPct / 100)).toFixed(2) : null;
  const displayPrice = sale ?? p.price;

  // colours from product or fallback palette
  const colors: string[] = Array.isArray(p.colors) && p.colors.length
    ? p.colors
    : ['green', 'red'];

  const availableSizes: string[] = Array.isArray(p.sizes) && p.sizes.length
    ? p.sizes
    : SIZES;

  const handleCart = () => {
    if (!session) { openLogin(); return; }
    addToCart({
      id:       p._id || p.id,
      name:     p.name,
      image:    p.image,
      price:    parseFloat(displayPrice),
      quantity: qty,
      stock:    p.stock ?? undefined,
      size:     selectedSize ?? undefined,
    });
    toast.success('Added to cart!');
  };

  return (
    <div className={`bg-white rounded-2xl border border-gray-200 flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}>

      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {badge && (
          <span className="absolute top-3 left-3 z-10 bg-gray-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
            {badge}
          </span>
        )}
        <Link href={`/products/${p._id || p.id}`} className="absolute inset-0">
          <Image
            src={p.image}
            alt={p.name}
            fill
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
            className="object-cover"
          />
        </Link>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">

        {/* Name + Price */}
        <div className="flex items-start justify-between gap-2">
          <Link href={`/products/${p._id || p.id}`}>
            <p className="text-sm font-bold text-gray-900 leading-snug hover:text-red-500 transition-colors line-clamp-2">
              {p.name}
            </p>
          </Link>
          <div className="flex-shrink-0 text-right">
            <span className="text-sm font-black text-gray-900">${displayPrice}</span>
            {sale && <p className="text-[11px] text-gray-400 line-through">${p.price}</p>}
          </div>
        </div>

        {/* Stars + Qty stepper */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-0.5">
            {[1,2,3,4,5].map(j => (
              <HugeiconsIcon key={j} icon={StarIcon} size={12}
                color={j <= rating ? '#facc15' : '#e5e7eb'} strokeWidth={STROKE} />
            ))}
          </div>
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2 py-1">
            <button
              onClick={() => setQty(q => Math.max(1, q - 1))}
              className="text-gray-500 hover:text-gray-900 text-sm font-bold w-4 text-center leading-none"
              aria-label="Decrease"
            >−</button>
            <span className="text-sm font-semibold text-gray-900 w-4 text-center tabular-nums">{qty}</span>
            <button
              onClick={() => setQty(q => Math.min(p.stock ?? 99, q + 1))}
              className="text-gray-500 hover:text-gray-900 text-sm font-bold w-4 text-center leading-none"
              aria-label="Increase"
            >+</button>
          </div>
        </div>

        {/* Description */}
        {p.description && (
          <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{p.description}</p>
        )}

        {/* Sizes */}

        {/* Colors */}


        {/* Add to cart */}
        <button
          onClick={handleCart}
          className="mt-auto w-full py-2.5 border border-gray-900 text-gray-900 text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-gray-900 hover:text-white transition-colors duration-200"
        >
          Add to Cart
        </button>

      </div>
    </div>
  );
}
