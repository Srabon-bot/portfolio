/*
 * /api/admin/education/[id] — PUT update · DELETE (admin gated)
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Education } from "@/lib/models/Education";
import { revalidateContent } from "@/lib/content";
import { requireAdminAuth } from "@/lib/admin-guard";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdminAuth(req))) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!(await connectDB())) {
    return NextResponse.json({ error: "Database offline." }, { status: 503 });
  }
  const { id } = await params;
  if (!/^[a-f\d]{24}$/i.test(id)) {
    return NextResponse.json({ error: "Bad id." }, { status: 400 });
  }

  const b = await req.json().catch(() => null);
  const update: Record<string, unknown> = {};
  [
    "institution", "degree", "period", "location", "description",
  ].forEach((k) => {
    if (k in (b ?? {})) update[k] = String(b[k] ?? "").trim();
  });
  if ("achievements" in (b ?? {}) && Array.isArray(b.achievements)) {
    update.achievements = b.achievements.map(String);
  }
  if ("published" in (b ?? {})) update.published = Boolean(b.published);
  if ("order" in (b ?? {})) update.order = Number(b.order) || 0;

  const doc = await Education.findByIdAndUpdate(id, update, { new: true });
  if (!doc) return NextResponse.json({ error: "Not found." }, { status: 404 });
  revalidateContent();
  return NextResponse.json({ education: doc });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdminAuth(req))) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!(await connectDB())) {
    return NextResponse.json({ error: "Database offline." }, { status: 503 });
  }
  const { id } = await params;
  const doc = await Education.findByIdAndDelete(id);
  if (!doc) return NextResponse.json({ error: "Not found." }, { status: 404 });
  revalidateContent();
  return NextResponse.json({ ok: true });
}
