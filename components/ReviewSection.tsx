'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { HugeiconsIcon } from '@hugeicons/react';
import { StarIcon, SendingOrderIcon, LoaderPinwheelIcon } from '@hugeicons/core-free-icons';
import { ShoppingBag } from 'lucide-react';

const STROKE = 1.5;

interface Review {
  _id: string; userId: string; userName: string;
  userImage?: string; rating: number; comment: string; createdAt: string;
}

export default function ReviewSection({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const [reviews,      setReviews]      = useState<Review[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [submitting,   setSubmitting]   = useState(false);
  const [rating,       setRating]       = useState(0);
  const [hovered,      setHovered]      = useState(0);
  const [comment,      setComment]      = useState('');
  const [hasPurchased, setHasPurchased] = useState<boolean | null>(null); // null = checking

  useEffect(() => {
    fetch(`/api/products/${productId}/reviews`)
      .then(r => r.json()).then(d => setReviews(d.reviews ?? []))
      .finally(() => setLoading(false));
  }, [productId]);

  // Check if the logged-in user has purchased this product
  useEffect(() => {
    if (!session) { setHasPurchased(false); return; }
    fetch('/api/orders')
      .then(r => r.json())
      .then(d => {
        const orders: any[] = d.orders ?? [];
        const bought = orders.some(
          o =>
            ['confirmed', 'processing', 'shipped', 'delivered'].includes(o.status) &&
            o.items?.some((item: any) => item.productId === productId)
        );
        setHasPurchased(bought);
      })
      .catch(() => setHasPurchased(false));
  }, [session, productId]);

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const alreadyReviewed = session
    ? reviews.some(r => r.userId === (session.user as any).id)
    : false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session)               { toast.error('Please sign in to leave a review'); return; }
    if (!hasPurchased)          { toast.error('You can only review products you have purchased'); return; }
    if (rating === 0)           { toast.error('Please select a star rating'); return; }
    if (comment.trim().length < 3) { toast.error('Comment is too short'); return; }
    setSubmitting(true);
    try {
      const res  = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? 'Failed to submit'); return; }
      setReviews(prev => [data.review, ...prev]);
      setRating(0); setComment('');
      toast.success('Review submitted!');
    } finally { setSubmitting(false); }
  };

  const renderWriteSection = () => {
    if (!session) {
      return (
        <p className="text-sm text-gray-500 border border-dashed border-gray-300 p-6 text-center rounded-xl">
          <Link href="/sign-in" className="text-gray-900 font-semibold underline">Sign in</Link> to leave a review.
        </p>
      );
    }

    if (alreadyReviewed) {
      return (
        <div className="border border-green-200 bg-green-50 rounded-xl p-5 text-center">
          <p className="text-sm font-semibold text-green-700">You've already reviewed this product.</p>
          <p className="text-xs text-green-600 mt-1">Thank you for your feedback!</p>
        </div>
      );
    }

    if (hasPurchased === null) {
      return (
        <div className="flex items-center gap-2 text-sm text-gray-400 py-4">
          <HugeiconsIcon icon={LoaderPinwheelIcon} size={16} color="currentColor" strokeWidth={STROKE} className="animate-spin" />
          Checking purchase history…
        </div>
      );
    }

    if (!hasPurchased) {
      return (
        <div className="border border-dashed border-gray-200 rounded-xl p-6 text-center space-y-2">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag size={18} className="text-gray-400" />
          </div>
          <p className="text-sm font-semibold text-gray-700">Purchase required</p>
          <p className="text-xs text-gray-500">
            Only customers who have bought this product can leave a review.
          </p>
          <Link href="/products"
            className="inline-block mt-1 text-xs font-semibold text-red-500 hover:underline">
            Browse products →
          </Link>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2">Your Rating</label>
          <div className="flex gap-1">
            {[1,2,3,4,5].map(s => (
              <button key={s} type="button" onClick={() => setRating(s)}
                onMouseEnter={() => setHovered(s)} onMouseLeave={() => setHovered(0)}
                className="transition-transform hover:scale-110">
                <HugeiconsIcon icon={StarIcon} size={24}
                  color={s <= (hovered || rating) ? '#facc15' : '#e5e7eb'} strokeWidth={STROKE} />
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2">Your Review</label>
          <textarea rows={4} value={comment} onChange={e => setComment(e.target.value)}
            placeholder="Share your experience with this product…" maxLength={1000}
            className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:border-red-400 outline-none transition resize-none" />
          <p className="text-xs text-gray-400 mt-1 text-right">{comment.length}/1000</p>
        </div>
        <button type="submit" disabled={submitting}
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-red-500 text-white text-sm font-semibold transition rounded-xl disabled:opacity-60">
          {submitting
            ? <><HugeiconsIcon icon={LoaderPinwheelIcon} size={14} color="white" strokeWidth={STROKE} className="animate-spin" />Submitting…</>
            : <><HugeiconsIcon icon={SendingOrderIcon} size={14} color="white" strokeWidth={STROKE} />Submit Review</>}
        </button>
      </form>
    );
  };

  return (
    <section className="bg-white border-t border-gray-100 py-16 px-4 sm:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
            <p className="text-sm text-gray-500 mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
          </div>
          {reviews.length > 0 && (
            <div className="sm:ml-auto flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <HugeiconsIcon key={s} icon={StarIcon} size={18}
                    color={s <= Math.round(avgRating) ? '#facc15' : '#e5e7eb'} strokeWidth={STROKE} />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-900">{avgRating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Write review */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-5">Write a Review</h3>
            {renderWriteSection()}
          </div>

          {/* Reviews list */}
          <div className="space-y-6">
            {loading ? (
              [1,2].map(i => <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-xl" />)
            ) : reviews.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8 border border-dashed border-gray-200 rounded-xl">
                No reviews yet. Be the first!
              </p>
            ) : reviews.map(review => (
              <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0">
                <div className="flex items-center gap-3 mb-3">
                  {review.userImage
                    ? <Image src={review.userImage} alt={review.userName} width={32} height={32} className="rounded-full" />
                    : <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                        {review.userName.charAt(0).toUpperCase()}
                      </div>
                  }
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{review.userName}</p>
                    <div className="flex gap-0.5 mt-0.5">
                      {[1,2,3,4,5].map(s => (
                        <HugeiconsIcon key={s} icon={StarIcon} size={11}
                          color={s <= review.rating ? '#facc15' : '#e5e7eb'} strokeWidth={STROKE} />
                      ))}
                    </div>
                  </div>
                  <span className="ml-auto text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


