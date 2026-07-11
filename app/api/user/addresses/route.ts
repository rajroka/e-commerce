import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connect from '@/lib/db';
import UserProfile, { IAddress } from '@/lib/modals/UserProfile';
import { randomUUID } from 'crypto';

async function getSession(req: NextRequest) {
  await connect();
  return auth.api.getSession({ headers: req.headers });
}

// ─── GET /api/user/addresses ───────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const profile = await UserProfile.findOne({ userId: session.user.id }).lean<any>();
  return NextResponse.json({ addresses: profile?.addresses ?? [] });
}

// ─── POST /api/user/addresses — add a new address ─────────────────────────────
export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { label, fullName, phone, line1, line2, city, state, postalCode, country, isDefault } = body;

  if (!fullName?.trim() || !line1?.trim() || !city?.trim() || !postalCode?.trim() || !country?.trim()) {
    return NextResponse.json({ error: 'fullName, line1, city, postalCode, country are required' }, { status: 400 });
  }

  const newAddress: IAddress = {
    id:         randomUUID(),
    label:      label      ?? 'Home',
    fullName:   fullName.trim(),
    phone:      phone      ?? '',
    line1:      line1.trim(),
    line2:      line2      ?? '',
    city:       city.trim(),
    state:      state      ?? '',
    postalCode: postalCode.trim(),
    country:    country.trim(),
    isDefault:  isDefault  ?? false,
  };

  // If this is set as default, unset others first
  const unsetDefault = isDefault ? { $set: { 'addresses.$[].isDefault': false } } : null;

  const profile = await UserProfile.findOneAndUpdate(
    { userId: session.user.id },
    unsetDefault
      ? { $set: { 'addresses.$[].isDefault': false } }
      : {},
    { upsert: true, new: false }
  );

  await UserProfile.findOneAndUpdate(
    { userId: session.user.id },
    { $push: { addresses: newAddress } },
    { upsert: true, new: true }
  );

  return NextResponse.json({ ok: true, address: newAddress }, { status: 201 });
}

// ─── PATCH /api/user/addresses — update an address ────────────────────────────
export async function PATCH(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { id, ...updates } = body;

  if (!id) return NextResponse.json({ error: 'Address id required' }, { status: 400 });

  // If setting as default, clear others first
  if (updates.isDefault) {
    await UserProfile.updateOne(
      { userId: session.user.id },
      { $set: { 'addresses.$[].isDefault': false } }
    );
  }

  // Update the specific address using positional filtered operator
  const result = await UserProfile.updateOne(
    { userId: session.user.id, 'addresses.id': id },
    {
      $set: Object.fromEntries(
        Object.entries(updates).map(([k, v]) => [`addresses.$.${k}`, v])
      ),
    }
  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: 'Address not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

// ─── DELETE /api/user/addresses?id=xxx ────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Address id required' }, { status: 400 });

  await UserProfile.updateOne(
    { userId: session.user.id },
    { $pull: { addresses: { id } } }
  );

  return NextResponse.json({ ok: true });
}
