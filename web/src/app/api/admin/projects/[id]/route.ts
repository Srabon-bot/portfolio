/*
 * /api/admin/projects/[id] — update or delete one project (admin gated).
 * PUT uses a strict whitelist; _id / createdAt are never writable.
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Project } from "@/lib/models/Project";
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
  if (!b) return NextResponse.json({ error: "Invalid body." }, { status: 400 });

  /* Whitelist — slug changes are allowed but must stay unique+lowercase */
  const update: Record<string, unknown> = {};
  const strFields = [
    "title", "tagline", "problem", "description", "role",
    "liveUrl", "repoUrl", "coverImage", "setupInstructions", "improvements",
  ] as const;
  strFields.forEach((k) => {
    if (k in b) update[k] = b[k];
  });
  const arrFields = ["features", "stack", "screenshots"] as const;
  arrFields.forEach((k) => {
    if (k in b && Array.isArray(b[k])) update[k] = b[k].map(String);
  });
  if ("type" in b && ["full-stack", "frontend", "ml-research"].includes(b.type))
    update.type = b.type;
  if ("status" in b && ["draft", "published"].includes(b.status))
    update.status = b.status;
  if ("featured" in b) update.featured = Boolean(b.featured);
  if ("order" in b) update.order = Number(b.order) || 0;

  if ("slug" in b && typeof b.slug === "string" && b.slug.trim()) {
    const slug = b.slug.trim().toLowerCase().replace(/[^\w-]+/g, "-");
    const clash = await Project.findOne({ slug, _id: { $ne: id } });
    if (clash) {
      return NextResponse.json(
        { error: `Slug "${slug}" is already used by another project.` },
        { status: 409 }
      );
    }
    update.slug = slug;
  }

  try {
    const doc = await Project.findByIdAndUpdate(id, update, { new: true });
    if (!doc) return NextResponse.json({ error: "Not found." }, { status: 404 });
    revalidateContent();
    return NextResponse.json({ project: doc });
  } catch (err) {
    console.error("[admin/projects/:id] update:", err);
    return NextResponse.json(
      { error: "Failed to update project." },
      { status: 500 }
    );
  }
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
  if (!/^[a-f\d]{24}$/i.test(id)) {
    return NextResponse.json({ error: "Bad id." }, { status: 400 });
  }

  const doc = await Project.findByIdAndDelete(id);
  if (!doc) return NextResponse.json({ error: "Not found." }, { status: 404 });
  revalidateContent();
  return NextResponse.json({ ok: true, deleted: doc.title });
}
