/*
 * /api/admin/skills — GET all · POST create · PATCH reorder
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Skill } from "@/lib/models/Skill";
import { revalidateContent } from "@/lib/content";
import { requireAdminAuth } from "@/lib/admin-guard";

const CATEGORIES = ["frontend", "backend", "tools", "ml-data"];

export async function GET(req: NextRequest) {
  if (!(await requireAdminAuth(req))) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!(await connectDB())) {
    return NextResponse.json({ error: "Database offline." }, { status: 503 });
  }
  const skills = await Skill.find().sort({ order: 1, name: 1 });
  return NextResponse.json({ skills });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdminAuth(req))) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!(await connectDB())) {
    return NextResponse.json({ error: "Database offline." }, { status: 503 });
  }

  const b = await req.json().catch(() => null);
  const name = typeof b?.name === "string" ? b.name.trim() : "";
  const category = b?.category;
  if (!name || !CATEGORIES.includes(category)) {
    return NextResponse.json(
      { error: "`name` and a valid `category` are required." },
      { status: 400 }
    );
  }
  try {
    const skill = await Skill.create({
      name,
      category,
      icon: typeof b.icon === "string" ? b.icon : undefined,
      order: Number.isFinite(b.order) ? Number(b.order) : 0,
    });
    revalidateContent();
    return NextResponse.json({ skill }, { status: 201 });
  } catch (err: unknown) {
    if ((err as { code?: number })?.code === 11000) {
      return NextResponse.json(
        { error: "That skill already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create skill." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdminAuth(req))) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!(await connectDB())) {
    return NextResponse.json({ error: "Database offline." }, { status: 503 });
  }

  const items = (await req.json().catch(() => null))?.items;
  if (!Array.isArray(items) || !items.length) {
    return NextResponse.json(
      { error: "Expected `items: [{ id, order }]`." },
      { status: 400 }
    );
  }
  await Promise.all(
    items.map((it: { id: string; order: number }) =>
      Skill.findByIdAndUpdate(it.id, { order: Number(it.order) || 0 })
    )
  );
  revalidateContent();
  return NextResponse.json({ ok: true });
}
