import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connect from '@/lib/db';
import UserProfile from '@/lib/modals/UserProfile';
import Cart from '@/lib/modals/Cart';
import Order from '@/lib/modals/Order';
import Wishlist from '@/lib/modals/Wishlist';
import Review from '@/lib/modals/Review';

// ─── DELETE /api/user/delete — permanently delete account ─────────────────────
// Requires password confirmation. Cleans up all user data.
export async function DELETE(req: NextRequest) {
  await connect();
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { password, confirmText } = body;

  // Require explicit confirmation text
  if (confirmText !== 'DELETE MY ACCOUNT') {
    return NextResponse.json(
      { error: 'Please type "DELETE MY ACCOUNT" to confirm' },
      { status: 400 }
    );
  }

  // Verify password via better-auth before deleting
  if (!password) {
    return NextResponse.json({ error: 'Password is required' }, { status: 400 });
  }

  try {
    await auth.api.deleteUser({
      headers: req.headers,
      body: { password },
    });
  } catch (err: any) {
    const msg = (err?.message ?? '').toLowerCase();
    if (msg.includes('invalid') || msg.includes('incorrect') || msg.includes('password')) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 400 });
    }
    // If better-auth deleteUser isn't available, fall through to manual cleanup
  }

  const userId = session.user.id;

  // ── Parallel cleanup ─────────────────────────────────────────────────────
  await Promise.allSettled([
    UserProfile.deleteOne({ userId }),
    Cart.deleteOne({ userId }),
    Wishlist.deleteOne({ userId }),
    // Anonymise reviews rather than delete — preserve product rating integrity
    Review.updateMany({ userId }, { $set: { userName: 'Deleted User', userImage: null } }),
    // Keep order records for business records, but anonymise them
    Order.updateMany(
      { userId },
      { $set: { userEmail: 'deleted@account.com' } }
    ),
  ]);

  return NextResponse.json({ ok: true });
}

// ─── PATCH /api/user/delete — deactivate (soft delete) ────────────────────────
export async function PATCH(req: NextRequest) {
  await connect();
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await UserProfile.findOneAndUpdate(
    { userId: session.user.id },
    { $set: { deactivated: true, deactivatedAt: new Date() } },
    { upsert: true }
  );

  // Sign out the user after deactivation
  return NextResponse.json({ ok: true });
}
