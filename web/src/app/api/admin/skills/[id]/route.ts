/*
 * /api/admin/skills/[id] — PUT update · DELETE remove (admin gated)
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Skill } from "@/lib/models/Skill";
import { revalidateContent } from "@/lib/content";
import { requireAdminAuth } from "@/lib/admin-guard";

const CATEGORIES = ["frontend", "backend", "tools", "ml-data"];

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
  if (typeof b?.name === "string" && b.name.trim()) update.name = b.name.trim();
  if (b?.category && CATEGORIES.includes(b.category)) update.category = b.category;
  if ("icon" in b) update.icon = b.icon || undefined;
  if ("order" in b) update.order = Number(b.order) || 0;

  const skill = await Skill.findByIdAndUpdate(id, update, { new: true });
  if (!skill) return NextResponse.json({ error: "Not found." }, { status: 404 });
  revalidateContent();
  return NextResponse.json({ skill });
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
  const skill = await Skill.findByIdAndDelete(id);
  if (!skill) return NextResponse.json({ error: "Not found." }, { status: 404 });
  revalidateContent();
  return NextResponse.json({ ok: true });
}
