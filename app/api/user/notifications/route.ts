import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connect from '@/lib/db';
import UserProfile from '@/lib/modals/UserProfile';

async function getSession(req: NextRequest) {
  await connect();
  return auth.api.getSession({ headers: req.headers });
}

const DEFAULTS = {
  orderUpdates: true,
  promotions:   false,
  newArrivals:  false,
  priceDrops:   true,
  emailEnabled: true,
  pushEnabled:  false,
};

// ─── GET /api/user/notifications ──────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const profile = await UserProfile.findOne({ userId: session.user.id }).lean<any>();
  return NextResponse.json({ notifications: profile?.notifications ?? DEFAULTS });
}

// ─── PATCH /api/user/notifications ────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const allowed = Object.keys(DEFAULTS);
  const updates: Record<string, boolean> = {};

  for (const key of allowed) {
    if (key in body && typeof body[key] === 'boolean') {
      updates[`notifications.${key}`] = body[key];
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields provided' }, { status: 400 });
  }

  const profile = await UserProfile.findOneAndUpdate(
    { userId: session.user.id },
    { $set: updates },
    { upsert: true, new: true }
  ).lean<any>();

  return NextResponse.json({ ok: true, notifications: profile?.notifications ?? DEFAULTS });
}
