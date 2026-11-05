"use client";

/*
 * UploadBox.tsx — the admin's file-to-Blob control.
 * POSTs to /api/admin/upload and hands the returned URL to the parent.
 * Images preview inline; pdf/docx show a filename chip. Inline SVG only.
 */

import { useRef, useState } from "react";

interface UploadBoxProps {
  label: string;
  currentUrl?: string;
  isImage?: boolean;
  disabledHint?: string;
  onUploaded: (url: string) => void;
}

export function UploadBox({
  label,
  currentUrl,
  isImage = true,
  disabledHint,
  onUploaded,
}: UploadBoxProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
        credentials: "same-origin",
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || "Upload failed");
      }
      onUploaded(data.url as string);
    } catch (err: unknown) {
      alert(
        err instanceof Error ? err.message : "Upload failed"
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-faint">
        {label}
      </span>

      <div className="flex items-center gap-2 flex-wrap">
        {isImage && currentUrl ? (
          /* Remote + public-folder icons both preview */
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={currentUrl}
            alt="Preview"
            className="w-20 h-14 object-cover rounded-lg border"
            style={{ borderColor: "var(--color-border)" }}
          />
        ) : currentUrl ? (
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-accent-soft hover:underline break-all min-w-0"
          >
            {new URL(currentUrl).pathname.split("/").pop()}
          </a>
        ) : (
          <span className="text-xs text-faint">No file uploaded</span>
        )}

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading || Boolean(disabledHint)}
          className="min-h-11 px-4 rounded-lg text-xs font-mono font-semibold text-text transition-colors cursor-pointer hover:border-accent"
          style={{
            background: "var(--color-surface-2)",
            border: "1px solid var(--color-border)",
          }}
        >
          {uploading ? "Uploading…" : "Upload"}
        </button>

        <input
          type="text"
          value={currentUrl ?? ""}
          onChange={(e) => onUploaded(e.target.value)}
          placeholder="…or paste a URL (e.g. /public path)"
          aria-label={`${label} URL`}
          className="min-w-0 flex-1 rounded-lg px-3 py-2 text-xs"
          style={{
            background: "var(--color-surface-2)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
          }}
        />
      </div>

      <input
        ref={fileRef}
        type="file"
        className="sr-only"
        accept={isImage ? "image/png,image/jpeg,image/webp,image/gif" : ".pdf,.docx,application/pdf"}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
          e.target.value = ""; /* re-select same file allowed */
        }}
      />
      {disabledHint && (
        <span className="text-xs text-faint">{disabledHint}</span>
      )}
    </div>
  );
}
