/*
 * /api/admin/education — GET all · POST create · PATCH reorder
 * NEW in the Vercel-native admin (previously seed-only content).
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Education } from "@/lib/models/Education";
import { revalidateContent } from "@/lib/content";
import { requireAdminAuth } from "@/lib/admin-guard";

export async function GET(req: NextRequest) {
  if (!(await requireAdminAuth(req))) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!(await connectDB())) {
    return NextResponse.json({ error: "Database offline." }, { status: 503 });
  }
  const education = await Education.find().sort({ order: 1 });
  return NextResponse.json({ education });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdminAuth(req))) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!(await connectDB())) {
    return NextResponse.json({ error: "Database offline." }, { status: 503 });
  }

  const b = await req.json().catch(() => null);
  const institution = typeof b?.institution === "string" ? b.institution.trim() : "";
  const degree = typeof b?.degree === "string" ? b.degree.trim() : "";
  if (!institution || !degree) {
    return NextResponse.json(
      { error: "`institution` and `degree` are required." },
      { status: 400 }
    );
  }
  const maxOrder = await Education.find().sort({ order: -1 }).limit(1);
  const doc = await Education.create({
    institution,
    degree,
    period: String(b.period ?? "").trim() || "Present",
    location: typeof b.location === "string" ? b.location.trim() : undefined,
    description: typeof b.description === "string" ? b.description : undefined,
    achievements: Array.isArray(b.achievements) ? b.achievements.map(String) : [],
    order: (maxOrder[0]?.order ?? 0) + 1,
    published: b.published === undefined ? true : Boolean(b.published),
  });
  revalidateContent();
  return NextResponse.json({ education: doc }, { status: 201 });
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
      Education.findByIdAndUpdate(it.id, { order: Number(it.order) || 0 })
    )
  );
  revalidateContent();
  return NextResponse.json({ ok: true });
}
