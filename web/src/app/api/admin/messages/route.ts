/*
 * /api/admin/messages — inbox for the contact form (admin gated).
 *   GET     list newest-first    · PATCH  { id, read } mark read/unread
 *   DELETE  ?id=<id> or { id }
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Message } from "@/lib/models/Message";
import { requireAdminAuth } from "@/lib/admin-guard";

export async function GET(req: NextRequest) {
  if (!(await requireAdminAuth(req))) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!(await connectDB())) {
    return NextResponse.json({ error: "Database offline." }, { status: 503 });
  }
  const messages = await Message.find().sort({ createdAt: -1 }).limit(200);
  const unread = await Message.countDocuments({ read: false });
  return NextResponse.json({ messages, unread });
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdminAuth(req))) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!(await connectDB())) {
    return NextResponse.json({ error: "Database offline." }, { status: 503 });
  }
  const b = await req.json().catch(() => null);
  const id = b?.id;
  if (typeof id !== "string" || !/^[a-f\d]{24}$/i.test(id)) {
    return NextResponse.json({ error: "Bad id." }, { status: 400 });
  }
  const doc = await Message.findByIdAndUpdate(
    id,
    { read: b.read === undefined ? true : Boolean(b.read) },
    { new: true }
  );
  if (!doc) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ message: doc });
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdminAuth(req))) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!(await connectDB())) {
    return NextResponse.json({ error: "Database offline." }, { status: 503 });
  }
  const id =
    req.nextUrl.searchParams.get("id") ??
    (await req.json().catch(() => null))?.id;
  if (typeof id !== "string" || !/^[a-f\d]{24}$/i.test(id)) {
    return NextResponse.json({ error: "Bad id." }, { status: 400 });
  }
  const doc = await Message.findByIdAndDelete(id);
  if (!doc) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
