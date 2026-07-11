/**
 * proxy.ts — Next.js 16 Edge Proxy for route protection
 *
 * The Edge runtime has no Node.js APIs, so we cannot import lib/auth.ts here
 * (it opens a MongoDB connection at module load time).
 *
 * Instead we call the better-auth session endpoint via an internal HTTP fetch.
 * The cookieCache means better-auth returns the cached session from the signed
 * cookie without a DB round-trip for requests within the 5-minute window.
 *
 * Strategy:
 *  - /dashboard/* and /admin/*  → admin only
 *  - /profile /cart /wishlist /checkout /success /orders → auth required
 *  - /sign-in /sign-up          → redirect away if already signed in
 *  - Everything else            → public
 */

import { NextRequest, NextResponse } from "next/server";

// ─── Route matchers ───────────────────────────────────────────────────────────

const ADMIN_ROUTES     = ["/dashboard", "/admin"];
const PROTECTED_ROUTES = ["/profile", "/cart", "/wishlist", "/checkout", "/success", "/orders"];
const AUTH_ROUTES      = ["/sign-in", "/sign-up"];

function matchesPrefix(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

// ─── Session fetch (Edge-safe) ────────────────────────────────────────────────

interface SessionUser {
  id: string;
  email: string;
  role?: string;
}

async function getEdgeSession(request: NextRequest): Promise<SessionUser | null> {
  // Fast-exit: no session cookie present — skip the network call entirely.
  const hasCookie =
    request.cookies.has("better-auth.session_token") ||
    request.cookies.has("__Secure-better-auth.session_token");

  if (!hasCookie) return null;

  try {
    // Build the absolute URL for the internal API call.
    const base   = request.nextUrl.origin;
    const apiUrl = `${base}/api/auth/get-session`;

    const res = await fetch(apiUrl, {
      headers: {
        // Forward the browser cookies so better-auth can read the session token.
        cookie: request.headers.get("cookie") ?? "",
        // Prevent the proxy call itself from being intercepted recursively.
        "x-proxy-internal": "1",
      },
      // No caching — we always need the freshest role info.
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return (data?.user as SessionUser) ?? null;
  } catch {
    // Network or parse error — fail open (treat as unauthenticated).
    return null;
  }
}

// ─── Proxy function ───────────────────────────────────────────────────────────

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip the session check for the auth API itself to avoid recursive loops.
  if (pathname.startsWith("/api/auth")) return NextResponse.next();

  // Also skip our own internal proxy header to avoid recursion.
  if (request.headers.get("x-proxy-internal") === "1") return NextResponse.next();

  const user            = await getEdgeSession(request);
  const isAuthenticated = !!user;
  const isAdmin         = user?.role === "admin";

  // ── 1. Admin routes ─────────────────────────────────────────────────────────
  if (matchesPrefix(pathname, ADMIN_ROUTES)) {
    if (!isAuthenticated) return redirectToSignIn(request, pathname);
    if (!isAdmin)         return NextResponse.redirect(new URL("/?error=forbidden", request.url));
    return NextResponse.next();
  }

  // ── 2. Auth-required routes ──────────────────────────────────────────────────
  if (matchesPrefix(pathname, PROTECTED_ROUTES)) {
    if (!isAuthenticated) return redirectToSignIn(request, pathname);
    return NextResponse.next();
  }

  // ── 3. Auth pages — redirect already-signed-in users away ───────────────────
  if (matchesPrefix(pathname, AUTH_ROUTES)) {
    if (isAuthenticated) {
      const cb = request.nextUrl.searchParams.get("callbackUrl");
      const target = cb ? decodeURIComponent(cb) : isAdmin ? "/dashboard" : "/";
      return NextResponse.redirect(new URL(target, request.url));
    }
    return NextResponse.next();
  }

  // ── 4. Public routes ─────────────────────────────────────────────────────────
  return NextResponse.next();
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function redirectToSignIn(request: NextRequest, pathname: string): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = "/sign-in";
  url.searchParams.set("callbackUrl", encodeURIComponent(pathname));
  return NextResponse.redirect(url);
}

// ─── Matcher ─────────────────────────────────────────────────────────────────
// Keep the matcher broad — the proxy function itself skips /api/auth/* above.

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)).*)",
  ],
};
