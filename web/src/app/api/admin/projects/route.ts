/*
 * /api/admin/projects — collection endpoint (admin gated).
 *   GET    list all projects incl. drafts (ordered)
 *   POST   create (auto-unique slug)
 *   PATCH  reorder  { items: [{ id, order }] }
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Project } from "@/lib/models/Project";
import { revalidateContent } from "@/lib/content";
import { requireAdminAuth } from "@/lib/admin-guard";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

export async function GET(req: NextRequest) {
  if (!(await requireAdminAuth(req))) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!(await connectDB())) {
    return NextResponse.json({ error: "Database offline." }, { status: 503 });
  }
  const projects = await Project.find().sort({ order: 1, createdAt: 1 });
  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdminAuth(req))) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!(await connectDB())) {
    return NextResponse.json({ error: "Database offline." }, { status: 503 });
  }

  const b = await req.json().catch(() => null);
  if (!b) {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  /* Mirror the schema's required fields with a helpful 400 (not a 500) */
  const missing: string[] = [];
  ["title", "tagline", "problem", "description", "role"].forEach((k) => {
    if (typeof b[k] !== "string" || !b[k].trim()) missing.push(k);
  });
  if (missing.length) {
    return NextResponse.json(
      { error: `Required fields still empty: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  /* Unique slug generation */
  let slug = slugify(b.slug || b.title) || `project-${Date.now()}`;
  if (await Project.findOne({ slug })) {
    let i = 2;
    while (await Project.findOne({ slug: `${slug}-${i}` })) i++;
    slug = `${slug}-${i}`;
  }

  const maxOrder = await Project.find()
    .sort({ order: -1 })
    .limit(1)
    .select("order");
  const order = (maxOrder[0]?.order ?? 0) + 1;

  try {
    const doc = await Project.create({
      slug,
      title: String(b.title).trim(),
      tagline: String(b.tagline ?? "").trim(),
      problem: String(b.problem ?? ""),
      description: String(b.description ?? ""),
      role: String(b.role ?? "Solo Developer"),
      features: Array.isArray(b.features) ? b.features.map(String) : [],
      stack: Array.isArray(b.stack) ? b.stack.map(String) : [],
      liveUrl: b.liveUrl || undefined,
      repoUrl: b.repoUrl || undefined,
      coverImage: b.coverImage || undefined,
      screenshots: Array.isArray(b.screenshots) ? b.screenshots : [],
      setupInstructions: b.setupInstructions || undefined,
      improvements: b.improvements || undefined,
      type:
        ["full-stack", "frontend", "ml-research"].includes(b.type)
          ? b.type
          : "full-stack",
      featured: Boolean(b.featured),
      order,
      status: ["draft", "published"].includes(b.status)
        ? b.status
        : "draft",
    });
    revalidateContent();
    return NextResponse.json({ project: doc }, { status: 201 });
  } catch (err) {
    console.error("[admin/projects] create:", err);
    return NextResponse.json(
      { error: "Failed to create project." },
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

  const b = await req.json().catch(() => null);
  const items = b?.items;
  if (!Array.isArray(items) || !items.length) {
    return NextResponse.json(
      { error: "Expected `items: [{ id, order }]`." },
      { status: 400 }
    );
  }
  try {
    await Promise.all(
      items.map(
        (it: { id: string; order: number }) =>
          Project.findByIdAndUpdate(it.id, { order: Number(it.order) || 0 })
      )
    );
    revalidateContent();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/projects] reorder:", err);
    return NextResponse.json(
      { error: "Failed to reorder." },
      { status: 500 }
    );
  }
}
