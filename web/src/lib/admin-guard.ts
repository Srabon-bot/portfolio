/*
 * admin-guard.ts — belt-and-braces check that runs *inside* every
 * /api/admin handler (middleware already gates the path, but never
 * trust one gate for mutating endpoints).
 */

import type { NextRequest } from "next/server";
import { sessionFromRequest } from "./auth";

export async function requireAdminAuth(
  req: NextRequest
): Promise<string | null> {
  return sessionFromRequest(req);
}
