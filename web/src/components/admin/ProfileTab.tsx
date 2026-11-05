"use client";

/*
 * ProfileTab — every listed profile field, incl. avatar upload and the
 * one-click resume replacement (uploads → /api/admin/upload → PUT).
 */

import { useState } from "react";
import type { Profile } from "@/types";
import { api } from "@/lib/admin-client";
import { AdminInput, AdminTextarea, AdminField, Pill } from "./atoms";
import { UploadBox } from "./UploadBox";

interface ProfileTabProps {
  profile: Partial<Profile>;
  onChanged: () => Promise<void> | void;
  notify: (text: string, type?: "success" | "error") => void;
}

export function ProfileTab({ profile, onChanged, notify }: ProfileTabProps) {
  const [draft, setDraft] = useState<Partial<Profile>>(profile);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof Profile>(key: K, value: Profile[K]) {
    setDraft({ ...draft, [key]: value });
  }

  async function saveResume(url: string) {
    setSaving(true);
    const { ok, error } = await api("/api/admin/profile", {
      method: "PUT",
      body: JSON.stringify({
        ...draft,
        resumeUrl: url,
        resumeUpdatedAt: new Date().toISOString(),
      }),
    });
    setSaving(false);
    if (!ok) return notify(error || "Resume switch failed", "error");
    setDraft({ ...draft, resumeUrl: url });
    notify("Resume replaced — downloads update everywhere", "success");
    await onChanged();
  }

  async function save() {
    setSaving(true);
    const { ok, error } = await api("/api/admin/profile", {
      method: "PUT",
      body: JSON.stringify(draft),
    });
    setSaving(false);
    if (!ok) return notify(error || "Save failed", "error");
    notify("Profile saved — live on the site", "success");
    await onChanged();
  }

  const str = (k: keyof Profile): string =>
    (draft[k] as string | undefined) ?? "";

  return (
    <div className="flex flex-col gap-5">
      {/* ── Identity ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminField label="Display name">
          <AdminInput value={str("displayName")} onChange={(e) => set("displayName", e.target.value)} />
        </AdminField>
        <AdminField label="Role">
          <AdminInput value={str("role")} onChange={(e) => set("role", e.target.value)} />
        </AdminField>
        <AdminField label="Tagline">
          <AdminInput value={str("tagline")} onChange={(e) => set("tagline", e.target.value)} />
        </AdminField>
        <AdminField label="Location">
          <AdminInput value={str("location")} onChange={(e) => set("location", e.target.value)} />
        </AdminField>
      </div>

      {/* ── Links + contact ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminField label="Email">
          <AdminInput value={str("email")} onChange={(e) => set("email", e.target.value)} />
        </AdminField>
        <AdminField label="LinkedIn URL">
          <AdminInput value={str("linkedin")} onChange={(e) => set("linkedin", e.target.value)} />
        </AdminField>
        <AdminField label="GitHub URL">
          <AdminInput value={str("github")} onChange={(e) => set("github", e.target.value)} />
        </AdminField>
        <AdminField label="Instagram URL (optional)">
          <AdminInput value={str("instagram")} onChange={(e) => set("instagram", e.target.value)} />
        </AdminField>
      </div>

      {/* ── Bio + currently ──────────────────────────────────────────── */}
      <AdminField label="Bio paragraphs" hint="One paragraph per line — first line becomes the About pull-quote">
        <AdminTextarea
          value={(draft.aboutParagraphs ?? []).join("\n\n")}
          onChange={(e) => set("aboutParagraphs", e.target.value.split("\n\n").map((s) => s.trim()).filter(Boolean))}
          className="min-h-[120px]"
        />
      </AdminField>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AdminField label="Currently building">
          <AdminInput value={draft.currently?.building ?? ""} onChange={(e) => setDraft({ ...draft, currently: { ...(draft.currently ?? { building: "", learning: "", funFact: "" }), building: e.target.value } })} />
        </AdminField>
        <AdminField label="Currently learning">
          <AdminInput value={draft.currently?.learning ?? ""} onChange={(e) => setDraft({ ...draft, currently: { ...(draft.currently ?? { building: "", learning: "", funFact: "" }), learning: e.target.value } })} />
        </AdminField>
        <AdminField label="Fun fact">
          <AdminInput value={draft.currently?.funFact ?? ""} onChange={(e) => setDraft({ ...draft, currently: { ...(draft.currently ?? { building: "", learning: "", funFact: "" }), funFact: e.target.value } })} />
        </AdminField>
      </div>
      {/* ── Avatar + Resume ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className="rounded-[10px] p-4 md:p-5 flex flex-col gap-3 border"
          style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
        >
          <Pill tone="gold">Portrait</Pill>
          <UploadBox
            label="Avatar image"
            currentUrl={str("avatarUrl")}
            onUploaded={(url) => set("avatarUrl", url)}
          />
        </div>

        <div
          className="rounded-[10px] p-4 md:p-5 flex flex-col gap-3 border"
          style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
        >
          <Pill tone="gold">Resume file</Pill>
          <UploadBox
            label="Resume (PDF / DOCX)"
            currentUrl={str("resumeUrl")}
            isImage={false}
            onUploaded={(url) => void saveResume(url)}
          />
          <p className="text-xs text-faint">
            Uploading replaces the downloadable resume everywhere immediately.
          </p>
        </div>
      </div>

      {/* ── SEO ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminField label="SEO title">
          <AdminInput value={str("seoTitle")} onChange={(e) => set("seoTitle", e.target.value)} />
        </AdminField>
        <AdminField label="SEO description">
          <AdminInput value={str("seoDescription")} onChange={(e) => set("seoDescription", e.target.value)} />
        </AdminField>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="min-h-11 px-5 rounded-lg text-xs font-mono font-semibold text-on-accent hover:opacity-90 disabled:opacity-60 cursor-pointer"
          style={{ background: "var(--color-accent)" }}
        >
          {saving ? "Saving…" : "Save profile"}
        </button>
      </div>
    </div>
  );
}
