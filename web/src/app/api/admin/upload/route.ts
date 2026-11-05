/*
 * POST /api/admin/upload — Vercel Blob upload for the admin console.
 *
 * Accepts any file the admin needs to publish:
 *   - images: png / jpg / jpeg / webp / gif  (≤ 8 MB)
 *   - resume: pdf / docx                     (≤ 12 MB)
 * Writes to `assets_<random8>/<safe-filename>` with public access
 * and returns the permanent URL for storage in MongoDB.
 *
 * Needs BLOB_READ_WRITE_TOKEN (auto-added by Vercel when you attach a
 * Blob store to the project in the dashboard).
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { put } from "@vercel/blob";
import { requireAdminAuth } from "@/lib/admin-guard";

const IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);
const DOC_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const MAX_IMAGE = 8 * 1024 * 1024;
const MAX_DOC = 12 * 1024 * 1024;

export async function POST(req: NextRequest) {
  if (!(await requireAdminAuth(req))) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Expected multipart form data with a `file` field." },
      { status: 400 }
    );
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json(
      { error: "No file received." },
      { status: 400 }
    );
  }

  const isImage = IMAGE_TYPES.has(file.type);
  const isDoc = DOC_TYPES.has(file.type);
  if (!isImage && !isDoc) {
    return NextResponse.json(
      { error: `Unsupported file type: ${file.type || "unknown"}` },
      { status: 415 }
    );
  }
  const limit = isImage ? MAX_IMAGE : MAX_DOC;
  if (file.size > limit) {
    return NextResponse.json(
      { error: `File too large — max ${limit / (1024 * 1024)} MB for ${file.type}.` },
      { status: 413 }
    );
  }

  try {
    const safeName =
      file.name.replace(/[^\w.-]+/g, "-").replace(/^-+|-+$/g, "") || "upload";
    const blob = await put(
      `assets_${crypto.randomBytes(4).toString("hex")}/${safeName}`,
      file,
      { access: "public", addRandomSuffix: true }
    );
    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
      contentType: file.type,
    });
  } catch (err) {
    console.error("[upload] Blob put failed:", err);
    return NextResponse.json(
      {
        error:
          "Upload storage unavailable. On Vercel, attach a Blob store to this project (Settings → Blob) — locally, run the Vercel CLI link. Details in server logs.",
      },
      { status: 503 }
    );
  }
}
