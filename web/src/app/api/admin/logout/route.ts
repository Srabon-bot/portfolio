/*
 * POST /api/admin/logout — clears the session cookie.
 */

import { NextResponse } from "next/server";
import { attachSessionCookie } from "@/lib/auth";

export async function POST() {
  return attachSessionCookie(NextResponse.json({ ok: true }), null);
}
