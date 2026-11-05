/*
 * /api/admin/profile — GET the singleton · PUT upsert (admin gated).
 * PUT merges a whitelist of fields so the console can partial-save.
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Profile } from "@/lib/models/Profile";
import { revalidateContent } from "@/lib/content";
import { requireAdminAuth } from "@/lib/admin-guard";

export async function GET(req: NextRequest) {
  if (!(await requireAdminAuth(req))) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!(await connectDB())) {
    return NextResponse.json({ error: "Database offline." }, { status: 503 });
  }
  const profile = await Profile.findOne();
  return NextResponse.json({ profile });
}

export async function PUT(req: NextRequest) {
  if (!(await requireAdminAuth(req))) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!(await connectDB())) {
    return NextResponse.json({ error: "Database offline." }, { status: 503 });
  }

  const b = await req.json().catch(() => null);
  if (!b) return NextResponse.json({ error: "Invalid body." }, { status: 400 });

  const update: Record<string, unknown> = {};
  [
    "name", "displayName", "role", "tagline", "avatarUrl", "photoUrl",
    "location", "email", "linkedin", "github", "twitter", "telegram",
    "instagram", "resumeUrl", "seoTitle", "seoDescription",
  ].forEach((k) => {
    if (k in b) update[k] = typeof b[k] === "string" ? b[k] : b[k];
  });
  if ("aboutParagraphs" in (b ?? {}) && Array.isArray(b.aboutParagraphs)) {
    update.aboutParagraphs = b.aboutParagraphs.map(String);
  }
  if ("currently" in (b ?? {}) && b.currently && typeof b.currently === "object") {
    update.currently = {
      building: String(b.currently.building ?? ""),
      learning: String(b.currently.learning ?? ""),
      funFact: String(b.currently.funFact ?? ""),
    };
  }
  if ("resumeUpdatedAt" in (b ?? {})) {
    update.resumeUpdatedAt = b.resumeUpdatedAt ? new Date(b.resumeUpdatedAt) : new Date();
  }

  const doc = await Profile.findOneAndUpdate({}, update, {
    new: true,
    upsert: true,
    runValidators: true,
  });
  revalidateContent();
  return NextResponse.json({ profile: doc });
}
