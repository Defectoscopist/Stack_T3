import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * CORS support for the Expo mobile client.
 *
 * The Expo *web* preview runs on a different origin (e.g. http://localhost:8081)
 * than the Next.js backend (http://localhost:3000). Browsers block cross-origin
 * requests unless the server replies with Access-Control-Allow-* headers, so we
 * set them here for all /api/mobile/* routes. Native (non-browser) clients do not
 * need this, but it is harmless for them.
 *
 * All /api/mobile/* endpoints already enforce Bearer auth; allowing any origin is
 * acceptable for a demo because the token is the actual gate.
 */
export function middleware(req: NextRequest) {
  const origin = req.headers.get("origin") ?? "*";

  // Respond to the browser's CORS preflight (OPTIONS) immediately.
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  const res = NextResponse.next();
  res.headers.set("Access-Control-Allow-Origin", origin);
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
}

export const config = {
  matcher: "/api/mobile/:path*",
};