import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const VALID_ROLES = ["admin", "customer"] as const;

// ─── GET /api/admin/users — list all users ────────────────────────────────────
export async function GET(request: NextRequest) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const client = await clientPromise;
  const db = client.db();

  const users = await db
    .collection("user")
    .find({})
    .project({ passwordHash: 0 })
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json({ users });
}

// ─── PATCH /api/admin/users — update a user's role ───────────────────────────
export async function PATCH(request: NextRequest) {
  const { session, error } = await requireAdmin(request);
  if (error) return error;

  const body = await request.json();
  const { userId, role } = body;

  if (!userId || typeof userId !== "string") {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }
  if (!VALID_ROLES.includes(role)) {
    return NextResponse.json(
      { error: `role must be one of: ${VALID_ROLES.join(", ")}` },
      { status: 400 }
    );
  }

  // Prevent admins from accidentally downgrading themselves
  if (userId === session.user.id && role !== "admin") {
    return NextResponse.json(
      { error: "You cannot remove your own admin role" },
      { status: 400 }
    );
  }

  let objectId: ObjectId;
  try {
    objectId = new ObjectId(userId);
  } catch {
    return NextResponse.json({ error: "Invalid userId format" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  const result = await db
    .collection("user")
    .updateOne({ _id: objectId }, { $set: { role } });

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  console.info(`[admin/users] Role of ${userId} changed to "${role}" by ${session.user.email}`);
  return NextResponse.json({ ok: true });
}

// ─── DELETE /api/admin/users — remove a user ─────────────────────────────────
export async function DELETE(request: NextRequest) {
  const { session, error } = await requireAdmin(request);
  if (error) return error;

  const { userId } = await request.json();

  if (!userId || typeof userId !== "string") {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }
  if (userId === session.user.id) {
    return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
  }

  let objectId: ObjectId;
  try {
    objectId = new ObjectId(userId);
  } catch {
    return NextResponse.json({ error: "Invalid userId format" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  const result = await db.collection("user").deleteOne({ _id: objectId });
  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  console.info(`[admin/users] User ${userId} deleted by ${session.user.email}`);
  return NextResponse.json({ ok: true });
}
