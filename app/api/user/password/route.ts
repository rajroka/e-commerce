import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connect from "@/lib/db";
import { getPasswordError } from "@/lib/password";

// ─── POST /api/user/password — change password ────────────────────────────────
export async function POST(req: NextRequest) {
  await connect();
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { currentPassword, newPassword, confirmPassword } = body;

  // ── Field presence ─────────────────────────────────────────────────────────
  if (!currentPassword || !newPassword || !confirmPassword) {
    return NextResponse.json({ error: "All password fields are required" }, { status: 400 });
  }

  // ── Confirm match ──────────────────────────────────────────────────────────
  if (newPassword !== confirmPassword) {
    return NextResponse.json({ error: "New passwords do not match" }, { status: 400 });
  }

  // ── Same-as-current guard ──────────────────────────────────────────────────
  if (currentPassword === newPassword) {
    return NextResponse.json(
      { error: "New password must be different from your current password" },
      { status: 400 }
    );
  }

  // ── Strength validation (shared rules from lib/password.ts) ───────────────
  const strengthError = getPasswordError(newPassword);
  if (strengthError) {
    return NextResponse.json({ error: strengthError }, { status: 400 });
  }

  // ── Delegate to better-auth ────────────────────────────────────────────────
  try {
    await auth.api.changePassword({
      headers: req.headers,
      body: {
        currentPassword,
        newPassword,
        revokeOtherSessions: true, // invalidate all other devices on password change
      },
    });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    const msg = (err?.message ?? "").toLowerCase();
    if (msg.includes("invalid") || msg.includes("incorrect") || msg.includes("wrong")) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }
    console.error("[password] changePassword error:", err);
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 });
  }
}
