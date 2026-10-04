import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth-utils";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  const { session, error } = await requireSession(req);
  if (error) return error;

  const client = await clientPromise;
  const db = client.db();

  const [user, userProfile] = await Promise.all([
    db.collection("user").findOne(
      { _id: new ObjectId(session.user.id) },
      { projection: { passwordHash: 0 } }
    ),
    db.collection("userprofiles").findOne({ userId: session.user.id }),
  ]);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    _id:       user._id.toString(),
    name:      user.name      ?? null,
    email:     user.email     ?? null,
    image:     user.image     ?? null,
    role:      user.role      ?? "customer",
    phone:     userProfile?.phone     ?? null,
    addresses: userProfile?.addresses ?? [],
    createdAt: user.createdAt ?? null,
  });
}
