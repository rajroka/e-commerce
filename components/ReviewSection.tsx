'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { FaStar } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';

interface Review {
  _id: string;
  userId: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ReviewSection({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetch(`/api/products/${productId}/reviews`)
      .then((r) => r.json())
      .then((d) => setReviews(d.reviews ?? []))
      .finally(() => setLoading(false));
  }, [productId]);

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) { toast.error('Please sign in to leave a review'); return; }
    if (rating === 0) { toast.error('Please select a star rating'); return; }
    if (comment.trim().length < 3) { toast.error('Comment is too short'); return; }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? 'Failed to submit'); return; }
      setReviews((prev) => [data.review, ...prev]);
      setRating(0);
      setComment('');
      toast.success('Review submitted!');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-white border-t border-gray-100 py-16 px-4 sm:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-10">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-900">Customer Reviews</h2>
            <p className="text-sm text-gray-500 uppercase tracking-widest mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
          </div>
          {reviews.length > 0 && (
            <div className="sm:ml-auto flex items-center gap-2">
              <div className="flex">
                {[1,2,3,4,5].map((s) => (
                  <FaStar key={s} size={18} className={s <= Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-200'} />
                ))}
              </div>
              <span className="text-sm font-bold text-gray-900">{avgRating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Write a review */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-6">Write a Review</h3>
            {!session ? (
              <p className="text-sm text-gray-500 border border-dashed border-gray-300 p-6 text-center rounded">
                <a href="/sign-in" className="text-gray-900 font-bold underline">Sign in</a> to leave a review.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Star rating picker */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-3">Your Rating</label>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        onMouseEnter={() => setHovered(s)}
                        onMouseLeave={() => setHovered(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <FaStar
                          size={24}
                          className={s <= (hovered || rating) ? 'text-yellow-400' : 'text-gray-200'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Your Review</label>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    className="w-full px-3 py-3 border border-gray-300 rounded text-sm placeholder-gray-400 focus:border-black outline-none transition resize-none"
                    maxLength={1000}
                  />
                  <p className="text-[10px] text-gray-400 mt-1 text-right">{comment.length}/1000</p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-black text-white text-sm font-bold uppercase tracking-widest transition rounded disabled:opacity-60"
                >
                  <FiSend size={14} />
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>

          {/* Reviews list */}
          <div className="space-y-6">
            {loading ? (
              [1,2].map(i => <div key={i} className="h-24 bg-gray-100 animate-pulse rounded" />)
            ) : reviews.length === 0 ? (
              <p className="text-sm text-gray-500 uppercase tracking-widest text-center py-8 border border-dashed border-gray-200 rounded">
                No reviews yet. Be the first!
              </p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0">
                  <div className="flex items-center gap-3 mb-3">
                    {review.userImage ? (
                      <Image src={review.userImage} alt={review.userName} width={32} height={32} className="rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                        {review.userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-gray-900">{review.userName}</p>
                      <div className="flex gap-0.5 mt-0.5">
                        {[1,2,3,4,5].map((s) => (
                          <FaStar key={s} size={11} className={s <= review.rating ? 'text-yellow-400' : 'text-gray-200'} />
                        ))}
                      </div>
                    </div>
                    <span className="ml-auto text-[10px] text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
