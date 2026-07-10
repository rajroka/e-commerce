import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connect from '@/lib/db';
import Review from '@/lib/modals/Review';
import Product from '@/lib/modals/Product';

// GET — fetch reviews for a product
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connect();
  const { id } = await params;
  const reviews = await Review.find({ productId: id }).sort({ createdAt: -1 });
  return NextResponse.json({ reviews }, { status: 200 });
}

// POST — submit a review (authenticated, one per user per product)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connect();
  const { id } = await params;
  const { rating, comment } = await request.json();

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
  }
  if (!comment || comment.trim().length < 3) {
    return NextResponse.json({ error: 'Comment is required' }, { status: 400 });
  }

  try {
    const review = await Review.create({
      productId: id,
      userId: session.user.id,
      userName: session.user.name ?? session.user.email,
      userImage: (session.user as any).image ?? null,
      rating,
      comment: comment.trim(),
    });

    // Recalculate product aggregate rating
    const allReviews = await Review.find({ productId: id });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await Product.findByIdAndUpdate(id, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: allReviews.length,
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (err: any) {
    // Duplicate key = user already reviewed this product
    if (err.code === 11000) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 409 }
      );
    }
    console.error('Review error:', err);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
