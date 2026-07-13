'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  HeartIcon, HeartAddIcon, CheckIcon,
  StarIcon, ShoppingBag01Icon, Message01Icon,
  Share01Icon, ChevronRightIcon,
} from '@hugeicons/core-free-icons';
import { useModalStore }    from '@/store/modalStore';
import { useCartStore }     from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useSession }       from '@/lib/auth-client';
import ReviewSection        from './ReviewSection';
import { getEffectivePrice } from '@/lib/discount';

const STROKE = 1.5;

interface ProductProps {
  product: {
    id:             string;
    title:          string;
    price:          number;
    description:    string;
    category:       string;
    image:          string;
    stock?:         number;
    rating?:        number;
    reviewCount?:   number;
    colors?:        string[];
    sizes?:         string[];
    discountPct?:   number | null;
    discountEndsAt?: string | null;
  };
}

export default function ProductDetailsClient({ product }: ProductProps) {
  const { data: session } = useSession();
  const { openLogin }     = useModalStore();
  const addToCart         = useCartStore(s => s.addToCart);
  const { isInWishlist, toggleWishlist, fetchWishlist } = useWishlistStore();

  const colors = product.colors ?? [];
  const sizes  = product.sizes  ?? [];

  const [mounted,       setMounted]       = useState(false);
  const [addedAnim,     setAddedAnim]     = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(colors[0] ?? null);
  const [selectedSize,  setSelectedSize]  = useState<string | null>(sizes[0]  ?? null);
  const [activeImg,     setActiveImg]     = useState(0);

  useEffect(() => {
    setMounted(true);
    if (session) fetchWishlist();
  }, [session, fetchWishlist]);

  // Reset selections if product changes
  useEffect(() => {
    setSelectedColor(colors[0] ?? null);
    setSelectedSize(sizes[0]   ?? null);
  }, [product.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const { salePrice, originalPrice, discountPct, isSale, savedAmount } = getEffectivePrice({
    price:          product.price,
    discountPct:    product.discountPct,
    discountEndsAt: product.discountEndsAt,
  });
  const discountedPrice = salePrice;
  const wishlisted      = mounted && isInWishlist(product.id);
  const inStock         = product.stock === undefined || product.stock > 0;
  const rating          = product.rating    ?? 4.5;
  const reviewCount     = product.reviewCount ?? 0;
  const soldCount       = Math.max(reviewCount * 3, 42);

  const images = [product.image];

  // Validate variant selection before adding
  const validateVariants = (): boolean => {
    if (colors.length > 0 && !selectedColor) {
      toast.error('Please select a color'); return false;
    }
    if (sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size'); return false;
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!session) { toast.error('Please sign in to add items to cart'); openLogin(); return; }
    if (!inStock)  { toast.error('This product is out of stock'); return; }
    if (!validateVariants()) return;

    addToCart({
      id:       product.id,
      name:     product.title,
      image:    product.image,
      price:    discountedPrice,
      quantity: 1,
      stock:    product.stock,
      color:    selectedColor,
      size:     selectedSize,
    });
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1800);
    toast.success('Added to cart');
  };

  const handleBuyNow = () => {
    if (!session) { toast.error('Please sign in to purchase'); openLogin(); return; }
    if (!inStock)  { toast.error('This product is out of stock'); return; }
    if (!validateVariants()) return;
    handleAddToCart();
  };

  const handleWishlist = () => {
    if (!session) { toast.error('Please sign in to save items'); openLogin(); return; }
    toggleWishlist({
      productId: product.id, name: product.title,
      image: product.image, price: discountedPrice, category: product.category,
    });
  };

  const handleShare = async () => {
    try {
      await navigator.share({ title: product.title, url: window.location.href });
    } catch {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!');
    }
  };

  // Color swatch helper — if it looks like a CSS color render it as a swatch
  const isHexOrCss = (c: string) => /^#|^rgb|^hsl/.test(c);

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
                <div className="flex flex-col gap-2 w-14 flex-shrink-0">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        activeImg === i ? 'border-red-500' : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <Image src={img} alt={`${product.title} view ${i + 1}`} fill
                        className="object-contain p-1" sizes="56px" />
                    </button>
                  ))}
                </div>

                <div className="flex-1 relative aspect-square bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  <Image src={images[activeImg]} alt={product.title} fill priority
                    className="object-contain p-6" sizes="(max-width:1024px) 90vw, 420px" />
                  {inStock && product.stock !== undefined && product.stock < 5 && (
                    <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      Only {product.stock} left
                    </span>
                  )}
                  {!inStock && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-2xl">
                      <span className="bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-full">Out of Stock</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── RIGHT: Product info ── */}
            <div className="flex-1 min-w-0 flex flex-col gap-5">

              {/* Title + rating */}
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">{product.title}</h1>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="text-sm text-gray-500">{soldCount.toLocaleString()}+ Sold</span>
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

              {/* Price */}
              <div className="px-1 py-4">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl font-bold text-gray-900">${salePrice.toFixed(2)}</span>
                  {isSale && (
                    <>
                      <span className="text-base text-gray-400 line-through">${originalPrice.toFixed(2)}</span>
                      <span className="text-sm font-bold text-green-600">{discountPct}% off</span>
                    </>
                  )}
                </div>
                {isSale && (
                  <p className="text-xs text-gray-500 mt-1">Save ${savedAmount.toFixed(2)} on this item</p>
                )}
                {product.discountEndsAt && isSale && (
                  <p className="text-xs text-red-500 font-medium mt-1">
                    Sale ends {new Date(product.discountEndsAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>

              {/* ── Color selector (only if admin defined colors) ── */}
              {colors.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2.5">
                    Color
                    {selectedColor && <span className="font-normal text-gray-500 ml-1.5">— {selectedColor}</span>}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {colors.map(color => {
                      const isCss    = isHexOrCss(color);
                      const isActive = selectedColor === color;
                      return (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          aria-label={`Select color ${color}`}
                          aria-pressed={isActive}
                          className={`transition-all ring-offset-2 rounded-xl border-2 ${
                            isCss
                              ? `w-9 h-9 ${isActive ? 'ring-2 ring-gray-700 border-white' : 'border-transparent hover:ring-2 hover:ring-gray-300'}`
                              : `px-3 py-1.5 text-sm font-medium ${
                                  isActive
                                    ? 'border-gray-900 bg-gray-900 text-white'
                                    : 'border-gray-200 text-gray-600 hover:border-gray-400'
                                }`
                          }`}
                          style={isCss ? { backgroundColor: color } : undefined}
                        >
                          {!isCss && color}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Size selector (only if admin defined sizes) ── */}
              {sizes.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2.5">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        aria-pressed={selectedSize === size}
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
              )}

              {/* Description */}
              <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{product.description}</p>

              {/* Selected variant summary */}
              {(selectedColor || selectedSize) && (
                <p className="text-xs text-gray-400">
                  Selected:{' '}
                  {[selectedColor, selectedSize].filter(Boolean).join(' / ')}
                </p>
              )}

              {/* ── CTA Buttons ── */}
              <div className="flex flex-col gap-3 pt-1">
                <button onClick={handleBuyNow} disabled={!inStock}
                  className={`w-full py-3.5 text-sm font-bold rounded-xl transition-all active:scale-[0.98] ${
                    inStock ? 'bg-red-500 hover:bg-red-600 text-white shadow-sm shadow-red-200' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Buy this Item
                </button>

                <button onClick={handleAddToCart} disabled={!inStock}
                  className={`w-full py-3.5 text-sm font-bold rounded-xl border-2 transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                    inStock
                      ? addedAnim
                        ? 'border-green-500 bg-green-50 text-green-600'
                        : 'border-gray-900 bg-white text-gray-900 hover:bg-gray-50'
                      : 'border-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {addedAnim
                    ? <><HugeiconsIcon icon={CheckIcon} size={16} color="currentColor" strokeWidth={STROKE} /> Added!</>
                    : <><HugeiconsIcon icon={ShoppingBag01Icon} size={16} color="currentColor" strokeWidth={STROKE} /> Add to Bag</>
                  }
                </button>
              </div>

              {/* ── Action row ── */}
              <div className="flex items-center gap-1 pt-1 border-t border-gray-100">
                <ActionBtn
                  icon={<HugeiconsIcon icon={Message01Icon} size={18} color="currentColor" strokeWidth={STROKE} />}
                  label="Chat" onClick={() => toast('Chat coming soon')}
                />
                <div className="w-px h-8 bg-gray-100" />
                <ActionBtn
                  icon={<HugeiconsIcon icon={wishlisted ? HeartIcon : HeartAddIcon} size={18}
                    color={wishlisted ? '#ef4444' : 'currentColor'} strokeWidth={STROKE} />}
                  label="Wishlist" onClick={handleWishlist}
                />
                <div className="w-px h-8 bg-gray-100" />
                <ActionBtn
                  icon={<HugeiconsIcon icon={Share01Icon} size={18} color="currentColor" strokeWidth={STROKE} />}
                  label="Share" onClick={handleShare}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReviewSection productId={product.id} />
      <Toaster position="top-right" />
    </>
  );
}

function ActionBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="flex-1 flex flex-col items-center gap-1 py-3 text-gray-500 hover:text-red-500 transition-colors rounded-xl hover:bg-red-50">
      {icon}
      <span className="text-[11px] font-medium">{label}</span>
    </button>
  );
}
