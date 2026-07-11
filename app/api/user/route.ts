import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connect from '@/lib/db';
import UserProfile from '@/lib/modals/UserProfile';

// ─── helpers ──────────────────────────────────────────────────────────────────
async function getSession(req: NextRequest) {
  await connect();
  return auth.api.getSession({ headers: req.headers });
}

// ─── GET /api/user ─────────────────────────────────────────────────────────────
// Returns extended profile (phone, bio, addresses, notifications)
export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const profile = await UserProfile.findOne({ userId: session.user.id }).lean<any>();

  return NextResponse.json({
    // Core better-auth fields
    id:    session.user.id,
    name:  session.user.name,
    email: session.user.email,
    image: session.user.image,
    role:  (session.user as any).role ?? 'user',
    // Extended fields (with defaults if no profile doc exists yet)
    phone:         profile?.phone       ?? '',
    bio:           profile?.bio         ?? '',
    dateOfBirth:   profile?.dateOfBirth ?? '',
    gender:        profile?.gender      ?? '',
    addresses:     profile?.addresses   ?? [],
    notifications: profile?.notifications ?? {
      orderUpdates: true, promotions: false, newArrivals: false,
      priceDrops: true, emailEnabled: true, pushEnabled: false,
    },
  });
}

// ─── PATCH /api/user ────────────────────────────────────────────────────────────
// Updates name, image (Cloudinary URL), phone, bio, dateOfBirth, gender
export async function PATCH(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { name, image, phone, bio, dateOfBirth, gender } = body;

  // ── Validate ───────────────────────────────────────────────────────────────
  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Name must be at least 2 characters' }, { status: 400 });
    }
    if (name.trim().length > 60) {
      return NextResponse.json({ error: 'Name must be 60 characters or fewer' }, { status: 400 });
    }
  }
  if (bio !== undefined && typeof bio === 'string' && bio.length > 300) {
    return NextResponse.json({ error: 'Bio must be 300 characters or fewer' }, { status: 400 });
  }
  if (phone !== undefined && typeof phone === 'string' && phone.length > 0) {
    if (!/^\+?[\d\s\-()]{7,20}$/.test(phone)) {
      return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 });
    }
  }
  if (image !== undefined && typeof image === 'string' && image.length > 0) {
    if (!image.startsWith('https://res.cloudinary.com/') && !image.startsWith('https://lh3.googleusercontent.com/')) {
      return NextResponse.json({ error: 'Invalid image URL' }, { status: 400 });
    }
  }

  // ── Update better-auth user (name + image) ─────────────────────────────────
  const betterAuthUpdates: Record<string, any> = {};
  if (name  !== undefined) betterAuthUpdates.name  = name.trim();
  if (image !== undefined) betterAuthUpdates.image = image;

  if (Object.keys(betterAuthUpdates).length > 0) {
    try {
      await auth.api.updateUser({
        headers: req.headers,
        body:    betterAuthUpdates,
      });
    } catch (err: any) {
      return NextResponse.json(
        { error: err?.message ?? 'Failed to update user' },
        { status: 500 }
      );
    }
  }

  // ── Upsert extended profile ────────────────────────────────────────────────
  const profileUpdates: Record<string, any> = {};
  if (phone       !== undefined) profileUpdates.phone       = phone;
  if (bio         !== undefined) profileUpdates.bio         = bio;
  if (dateOfBirth !== undefined) profileUpdates.dateOfBirth = dateOfBirth;
  if (gender      !== undefined) profileUpdates.gender      = gender;

  const profile = await UserProfile.findOneAndUpdate(
    { userId: session.user.id },
    { $set: profileUpdates },
    { upsert: true, new: true }
  ).lean<any>();

  return NextResponse.json({
    ok:          true,
    name:        betterAuthUpdates.name  ?? session.user.name,
    image:       betterAuthUpdates.image ?? session.user.image,
    phone:       profile?.phone       ?? '',
    bio:         profile?.bio         ?? '',
    dateOfBirth: profile?.dateOfBirth ?? '',
    gender:      profile?.gender      ?? '',
  });
}
