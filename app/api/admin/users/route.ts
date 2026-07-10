import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

// GET /api/admin/users — admin: list all users
export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const client = await clientPromise;
  const db = client.db();
  const users = await db
    .collection('user')
    .find({})
    .project({ passwordHash: 0 })
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json({ users });
}

// PATCH /api/admin/users — admin: update a user's role
export async function PATCH(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { userId, role } = await request.json();
  if (!userId || !['admin', 'user'].includes(role)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();
  const { ObjectId } = await import('mongodb');

  await db
    .collection('user')
    .updateOne({ _id: new ObjectId(userId) }, { $set: { role } });

  return NextResponse.json({ ok: true });
}
