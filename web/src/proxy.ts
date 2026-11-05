/*
 * proxy.ts — the bouncer for the hidden admin console.
 * (Next.js 16 renamed the "middleware" file convention to "proxy";
 *  functionality is identical.)
 *
 * - "/admin*" pages: no valid session → /admin/login
 * - "/api/admin*" endpoints (except login/logout): no session → 401 JSON
 * - Every admin path gets `X-Robots-Tag: noindex` so it can never be indexed
 *
 * Edge-runtime rules: jose only, NO mongoose/db imports here.
 */

import { NextRequest, NextResponse } from "next/server";
import { sessionFromRequest } from "@/lib/auth";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  /* ── Noindex, always, for anything admin-ish ───────────────────── */
  const isAdmin =
    pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

  const res = NextResponse.next();
  if (isAdmin) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }

  /* Public exceptions — the login flow itself */
  if (
    pathname === "/admin/login" ||
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/logout"
  ) {
    return res;
  }

  /* ── Everything else requires a session ────────────────────────── */
  const session = await sessionFromRequest(req);
  if (session) return res;

  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json(
      { error: "Not signed in." },
      { status: 401 }
    );
  }

  const loginUrl = new URL("/admin/login", req.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  /* /admin/** pages + /api/admin/** — plus noop matchers stay cheap */
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
