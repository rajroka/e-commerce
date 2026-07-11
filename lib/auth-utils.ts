/**
 * lib/auth-utils.ts
 *
 * Reusable server-side auth helpers for API routes, server components,
 * and server actions.  All helpers accept the raw `ReadonlyHeaders` object
 * that Next.js provides so they are usable in every server context.
 */

import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AppRole = "admin" | "customer" | "user";

export interface AuthSession {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null | undefined;
    role: AppRole;
  };
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
  };
}

// ─── Core session retrieval ───────────────────────────────────────────────────

/**
 * Retrieve the validated session for an API route request.
 * Returns `null` when there is no valid session (not signed in / expired).
 */
export async function getRequestSession(
  req: NextRequest
): Promise<AuthSession | null> {
  const raw = await auth.api.getSession({ headers: req.headers });
  if (!raw) return null;
  return raw as unknown as AuthSession;
}

/**
 * Retrieve the validated session inside a Server Component or Server Action
 * using `next/headers`.  Returns `null` when unauthenticated.
 */
export async function getServerSession(): Promise<AuthSession | null> {
  const raw = await auth.api.getSession({ headers: await nextHeaders() });
  if (!raw) return null;
  return raw as unknown as AuthSession;
}

// ─── API route guards ─────────────────────────────────────────────────────────

/**
 * Assert the request is authenticated.
 * Returns `{ session }` on success or `{ error: NextResponse }` on failure.
 *
 * Usage:
 * ```ts
 * const { session, error } = await requireSession(req);
 * if (error) return error;
 * ```
 */
export async function requireSession(
  req: NextRequest
): Promise<{ session: AuthSession; error: null } | { session: null; error: NextResponse }> {
  const session = await getRequestSession(req);
  if (!session) {
    return {
      session: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { session, error: null };
}

/**
 * Assert the request is authenticated AND the user holds the "admin" role.
 * Returns `{ session }` on success or `{ error: NextResponse }` on failure.
 *
 * Usage:
 * ```ts
 * const { session, error } = await requireAdmin(req);
 * if (error) return error;
 * ```
 */
export async function requireAdmin(
  req: NextRequest
): Promise<{ session: AuthSession; error: null } | { session: null; error: NextResponse }> {
  const session = await getRequestSession(req);

  if (!session) {
    return {
      session: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (session.user.role !== "admin") {
    return {
      session: null,
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { session, error: null };
}

// ─── Server component / action guards ────────────────────────────────────────

/**
 * Assert the current server-component user is authenticated.
 * Redirects to `/sign-in` if not.  Returns the session when authenticated.
 */
export async function requireServerSession(): Promise<AuthSession> {
  const session = await getServerSession();
  if (!session) redirect("/sign-in");
  return session;
}

/**
 * Assert the current server-component user is an admin.
 * Redirects to `/` if not authenticated or not an admin.
 */
export async function requireServerAdmin(): Promise<AuthSession> {
  const session = await getServerSession();
  if (!session) redirect("/sign-in");
  if (session.user.role !== "admin") redirect("/");
  return session;
}

// ─── Role helpers ─────────────────────────────────────────────────────────────

export function isAdmin(session: AuthSession | null): boolean {
  return session?.user.role === "admin";
}

export function isCustomer(session: AuthSession | null): boolean {
  return (
    session?.user.role === "customer" || session?.user.role === "user"
  );
}
