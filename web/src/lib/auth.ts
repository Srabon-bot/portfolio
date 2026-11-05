/*
 * auth.ts — admin session helpers shared by Route Handlers AND Edge
 * middleware (jose works on both runtimes).
 *
 * The session is a signed JWT stored in an httpOnly cookie:
 *   - JavaScript can never read it (XSS-safe)
 *   - SameSite=Lax keeps cross-site POSTs from riding the session
 *   - 7-day expiry; logging out clears the cookie
 * The only claim is `sub` = admin email. Passwords live hashed (bcrypt)
 * in the Admin model; they never touch tokens.
 */

import { SignJWT, jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const ADMIN_COOKIE = "admin_session";
const SESSION_DAYS = 7;

function getSecret(): Uint8Array | null {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export async function signSession(email: string): Promise<string | null> {
  const secret = getSecret();
  if (!secret) return null;
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(email)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secret);
}

/** Returns the admin email when the cookie carries a valid session */
export async function verifySession(
  email: unknown
): Promise<string | null> {
  if (typeof email !== "string" || !email) return null;
  const secret = getSecret();
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(email, secret);
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

/** Verify the incoming request's admin cookie (works from middleware too) */
export async function sessionFromRequest(
  req: NextRequest
): Promise<string | null> {
  return verifySession(req.cookies.get(ADMIN_COOKIE)?.value);
}

/**
 * Attach the session cookie to a JSON NextResponse (login/logout helpers).
 * httpOnly + Secure in production, Lax everywhere.
 */
export function attachSessionCookie(
  res: NextResponse,
  token: string | null
): NextResponse {
  if (token) {
    res.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_DAYS * 24 * 60 * 60,
    });
  } else {
    res.cookies.set(ADMIN_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
  }
  return res;
}
