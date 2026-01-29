// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Example: simple redirect check
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
