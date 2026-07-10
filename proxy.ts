import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PATHS = [
  '/dashboard',
  '/add-product',
  '/all-products',
  '/edit-product',
  '/all-orders',
  '/all-users',
  '/analytics',
];

// Session cookie name used by better-auth
const SESSION_COOKIE = 'better-auth.session_token';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // Check for session cookie — edge-runtime compatible, no Node.js imports
  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;

  if (!sessionToken) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Validate session via the better-auth API route (runs on Node.js runtime)
  try {
    const sessionResponse = await fetch(
      new URL('/api/auth/get-session', request.url),
      {
        headers: {
          cookie: request.headers.get('cookie') ?? '',
        },
      }
    );

    if (!sessionResponse.ok) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    const session = await sessionResponse.json();

    if (!session?.user) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    const role = (session.user as { role?: string }).role;
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
}

export const config = {
  matcher: [
    '/dashboard',
    '/add-product',
    '/all-products',
    '/edit-product/:path*',
    '/all-orders',
    '/all-users',
    '/analytics',
  ],
};
