/*
 * POST /api/admin/login — the only way into the hidden console.
 *
 * Flow:
 *   1. In-memory rate limit (5 attempts / 15 min / IP — per warm instance,
 *      plus a deliberate ~400ms bcrypt cost).
 *   2. Email must match ADMIN_EMAIL (env) — single-admin console.
 *   3. Auth doc bootstrap-on-first-login: if the DB has no Admin doc yet,
 *      the ADMIN_PASSWORD_HASH from the environment seeds it, so the very
 *      first login both verifies you AND writes the account to Atlas.
 *   4. bcrypt compare → sign JWT → httpOnly cookie (middleware takes it
 *      from there).
 */

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { Admin } from "@/lib/models/Admin";
import { signSession, attachSessionCookie } from "@/lib/auth";

/* Naive per-instance rate limiter: enough for a one-admin console */
const attempts = new Map<string, { count: number; first: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now - rec.first > WINDOW_MS) {
    attempts.set(ip, { count: 1, first: now });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_ATTEMPTS;
}

export async function POST(req: NextRequest) {
  /* Deliberate jitter cost even for the fastest-bot path */
  await new Promise((r) => setTimeout(r, 300 + Math.random() * 300));

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in 15 minutes." },
      { status: 429 }
    );
  }

  let email = "";
  let password = "";
  try {
    const body = await req.json();
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  const adminHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !adminHash) {
    console.error("[login] ADMIN_EMAIL / ADMIN_PASSWORD_HASH not set");
    return NextResponse.json(
      { error: "Admin console not configured." },
      { status: 503 }
    );
  }

  if (email !== adminEmail || !password.length) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  /* DB-backed credential check: accept EITHER the env hash (canonical,
     used to bootstrap the Admin doc on first login) OR the hash already
     stored in Atlas (used after password rotation in the console).
     CRITICAL: never persist a hash until the password is verified. */
  const passwordHash: string = adminHash;
  let dbHash: string | null = null;
  try {
    if (await connectDB()) {
      const existing = await Admin.findOne({ email: adminEmail }).lean<{
        passwordHash: string;
      }>();
      if (existing?.passwordHash) dbHash = existing.passwordHash;
    }
  } catch (err) {
    console.error("[login] Atlas unavailable — env-hash fallback:", err);
  }

  const againstEnv = bcrypt.compareSync(password, passwordHash as string);
  const againstDb = dbHash ? bcrypt.compareSync(password, dbHash) : false;
  if (!againstEnv && !againstDb) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  /* Verified — now bootstrap the doc once (env hash is the canonical one) */
  if (!dbHash || againstEnv) {
    try {
      if (await connectDB()) {
        await Admin.updateOne(
          { email: adminEmail },
          { $set: { passwordHash: adminHash as string } },
          { upsert: true }
        );
      }
    } catch (err) {
      /* Non-fatal: session still valid this instance */
      console.error("[login] doc sync failed:", err);
    }
  }

  const token = await signSession(adminEmail);
  if (!token) {
    console.error("[login] ADMIN_JWT_SECRET missing");
    return NextResponse.json(
      { error: "Session service misconfigured." },
      { status: 503 }
    );
  }

  const res = NextResponse.json({ ok: true });
  return attachSessionCookie(res, token);
}
