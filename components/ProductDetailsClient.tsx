'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  HeartIcon, HeartAddIcon, ShoppingCart01Icon, CheckIcon,
  StarIcon, ShoppingBag01Icon, Message01Icon,
  Share01Icon, ArrowLeft01Icon, ChevronRightIcon,
} from '@hugeicons/core-free-icons';
import { useModalStore } from '@/store/modalStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useSession } from '@/lib/auth-client';
import ReviewSection from './ReviewSection';

const STROKE = 1.5;

const SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL'] as const;
type SizeValue = typeof SIZES[number];

interface ProductProps {
  product: {
    id: string;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    stock?: number;
    rating?: number;
    reviewCount?: number;
  };
}

export default function ProductDetailsClient({ product }: ProductProps) {
  const { data: session } = useSession();
  const { openLogin }     = useModalStore();
  const addToCart = useCartStore(s => s.addToCart);
  const { isInWishlist, toggleWishlist, fetchWishlist } = useWishlistStore();

  const [mounted,      setMounted]      = useState(false);
  const [addedAnim,    setAddedAnim]    = useState(false);
  const [selectedSize, setSelectedSize] = useState<SizeValue | null>(null);
  const [activeImg,    setActiveImg]    = useState(0);

  useEffect(() => {
    setMounted(true);
    if (session) fetchWishlist();
  }, [session, fetchWishlist]);

  // Derived values
  const discountPct     = 10;
  const discountedPrice = parseFloat((product.price * (1 - discountPct / 100)).toFixed(2));
  const savedAmount     = parseFloat((product.price - discountedPrice).toFixed(2));
  const wishlisted      = mounted && isInWishlist(product.id);
  const inStock         = product.stock === undefined || product.stock > 0;
  const rating          = product.rating ?? 4.5;
  const reviewCount     = product.reviewCount ?? 0;
  const soldCount       = Math.max(reviewCount * 3, 42); // estimate from reviews

  // Thumbnail images — in production these would come from the DB
  const images = [product.image, product.image, product.image, product.image];

  const handleBuyNow = () => {
    if (!session) { toast.error('Please sign in to purchase'); openLogin(); return; }
    if (!inStock)  { toast.error('This product is out of stock'); return; }
    handleAddToCart();
    // In production: router.push('/cart') after adding
  };

  const handleAddToCart = () => {
    if (!session) { toast.error('Please sign in to add items to cart'); openLogin(); return; }
    if (!inStock)  { toast.error('This product is out of stock'); return; }
    addToCart({
      id: product.id, name: product.title, image: product.image,
      price: discountedPrice, quantity: 1, stock: product.stock,
    });
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1800);
    toast.success('Added to cart');
  };

  const handleWishlist = () => {
    if (!session) { toast.error('Please sign in to save items'); openLogin(); return; }
    toggleWishlist({ productId: product.id, name: product.title, image: product.image, price: discountedPrice, category: product.category });
  };

  const handleShare = async () => {
    try {
      await navigator.share({ title: product.title, url: window.location.href });
    } catch {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!');
    }
  };

  return (
    <>
      <div className="min-h-[calc(100vh-64px)] bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-5 flex-wrap">
            <Link href="/" className="hover:text-red-500 transition-colors">Home</Link>
            <HugeiconsIcon icon={ChevronRightIcon} size={12} color="currentColor" strokeWidth={STROKE} />
            <Link href="/products" className="hover:text-red-500 transition-colors">Products</Link>
            <HugeiconsIcon icon={ChevronRightIcon} size={12} color="currentColor" strokeWidth={STROKE} />
            <span className="text-gray-600 capitalize">{product.category}</span>
            <HugeiconsIcon icon={ChevronRightIcon} size={12} color="currentColor" strokeWidth={STROKE} />
            <span className="text-gray-700 font-medium line-clamp-1 max-w-[200px]">{product.title}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-8">

            {/* ── LEFT: Image gallery ── */}
            <div className="lg:w-[420px] flex-shrink-0">
              <div className="flex gap-3">
                {/* Thumbnails */}
                <div className="flex flex-col gap-2 w-14 flex-shrink-0">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        activeImg === i ? 'border-red-500' : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <Image src={img} alt={`${product.title} view ${i + 1}`} fill
                        className="object-contain p-1" sizes="56px" />
                    </button>
                  ))}
                </div>

                {/* Main image */}
                <div className="flex-1 relative aspect-square bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  <Image src={images[activeImg]} alt={product.title} fill priority
                    className="object-contain p-6" sizes="(max-width:1024px) 90vw, 420px" />

                  {/* Stock badge */}
                  {inStock && product.stock !== undefined && product.stock < 5 && (
                    <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      Only {product.stock} left
                    </span>
                  )}
                  {!inStock && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-2xl">
                      <span className="bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-full">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── RIGHT: Product info ── */}
            <div className="flex-1 min-w-0 flex flex-col gap-5">

              {/* Title */}
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
                  {product.title}
                </h1>

                {/* Sold count + stars */}
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="text-sm text-gray-500">
                    {soldCount.toLocaleString()}+ Sold
                  </span>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(s => (
                      <HugeiconsIcon key={s} icon={StarIcon} size={14}
                        color={s <= Math.round(rating) ? '#f59e0b' : '#e5e7eb'} strokeWidth={STROKE} />
                    ))}
                    <span className="text-sm font-semibold text-gray-700 ml-1">{rating.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <span className="text-sm text-gray-500">{reviewCount} Reviews</span>
                </div>
              </div>

              {/* Price block */}
              <div className="px-1 py-4">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl font-bold text-gray-900">
                    ${discountedPrice.toFixed(2)}
                  </span>
                  <span className="text-base text-gray-400 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-sm font-bold text-green-600">
                    {discountPct}% off
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Save ${savedAmount.toFixed(2)} on this item
                </p>
              </div>

              {/* Color / variant selector */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2.5">Color</p>
                <div className="flex gap-2">
                  {[
                    { label: 'Black', bg: 'bg-gray-900', ring: 'ring-gray-900' },
                    { label: 'White', bg: 'bg-gray-100', ring: 'ring-gray-300' },
                  ].map((color, i) => (
                    <button key={color.label}
                      aria-label={`Select ${color.label}`}
                      className={`w-9 h-9 rounded-xl ${color.bg} border-2 border-transparent ring-offset-2 transition-all ${
                        i === 0 ? `ring-2 ${color.ring}` : 'hover:ring-2 hover:ring-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Size selector */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-sm font-semibold text-gray-700">Select Size</p>
                  <button className="text-xs text-red-500 font-medium hover:underline">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 text-sm font-medium rounded-xl border-2 transition-all ${
                        selectedSize === size
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-200 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                {product.description}
              </p>

              {/* ── CTA Buttons ── */}
              <div className="flex flex-col gap-3 pt-1">
                <button
                  onClick={handleBuyNow}
                  disabled={!inStock}
                  className={`w-full py-3.5 text-sm font-bold rounded-xl transition-all active:scale-[0.98] ${
                    inStock
                      ? 'bg-red-500 hover:bg-red-600 text-white shadow-sm shadow-red-200'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Buy this Item
                </button>

                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className={`w-full py-3.5 text-sm font-bold rounded-xl border-2 transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                    inStock
                      ? addedAnim
                        ? 'border-green-500 bg-green-50 text-green-600'
                        : 'border-gray-900 bg-white text-gray-900 hover:bg-gray-50'
                      : 'border-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {addedAnim ? (
                    <><HugeiconsIcon icon={CheckIcon} size={16} color="currentColor" strokeWidth={STROKE} /> Added!</>
                  ) : (
                    <><HugeiconsIcon icon={ShoppingBag01Icon} size={16} color="currentColor" strokeWidth={STROKE} /> Add to Bag</>
                  )}
                </button>
              </div>

              {/* ── Action row: Chat / Wishlist / Share ── */}
              <div className="flex items-center gap-1 pt-1 border-t border-gray-100">
                <ActionBtn icon={<HugeiconsIcon icon={Message01Icon} size={18} color="currentColor" strokeWidth={STROKE} />} label="Chat" onClick={() => toast('Chat coming soon')} />
                <div className="w-px h-8 bg-gray-100" />
                <ActionBtn icon={<HugeiconsIcon icon={wishlisted ? HeartIcon : HeartAddIcon} size={18} color={wishlisted ? '#ef4444' : 'currentColor'} strokeWidth={STROKE} />} label="Wishlist" onClick={handleWishlist} />
                <div className="w-px h-8 bg-gray-100" />
                <ActionBtn icon={<HugeiconsIcon icon={Share01Icon} size={18} color="currentColor" strokeWidth={STROKE} />} label="Share" onClick={handleShare} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <ReviewSection productId={product.id} />
      <Toaster position="top-right" />
    </>
  );
}

// Small helper component
function ActionBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="flex-1 flex flex-col items-center gap-1 py-3 text-gray-500 hover:text-red-500 transition-colors rounded-xl hover:bg-red-50">
      {icon}
      <span className="text-[11px] font-medium">{label}</span>
    </button>
  );
}
