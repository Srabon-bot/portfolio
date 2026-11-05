/*
 * GET /api/admin/me — session check used by the dashboard shell.
 * Requires the admin cookie (proxy already guards, this re-verifies).
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-guard";

export async function GET(req: NextRequest) {
  const email = await requireAdminAuth(req);
  if (!email) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  return NextResponse.json({ email });
}
