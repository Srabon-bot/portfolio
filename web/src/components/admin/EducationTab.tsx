"use client";

/*
 * EducationTab — create / edit / reorder / delete academic cards.
 * POST requires `institution` + `degree` (API 400s otherwise), so the
 * create form asks for both before the button enables. Achievements are
 * authored one per line in a textarea. Published cards appear on the
 * public site; drafts stay admin-only.
 */

import { useState } from "react";
import type { Education } from "@/types";
import { api } from "@/lib/admin-client";
import { AdminInput, AdminTextarea, AdminField, Pill } from "./atoms";

interface EducationTabProps {
  education: Education[];
  onChanged: () => Promise<void> | void;
  notify: (text: string, type?: "success" | "error") => void;
}

export function EducationTab({ education, onChanged, notify }: EducationTabProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<Education>>({});
  const [saving, setSaving] = useState(false);

  /* Create form — separate small state; requires both API-mandated fields */
  const [newInstitution, setNewInstitution] = useState("");
  const [newDegree, setNewDegree] = useState("");

  async function create() {
    if (!newInstitution.trim() || !newDegree.trim()) return;
    setSaving(true);
    const { ok, error } = await api("/api/admin/education", {
      method: "POST",
      body: JSON.stringify({
        institution: newInstitution,
        degree: newDegree,
        published: false, /* author it first, publish when ready */
      }),
    });
    setSaving(false);
    if (!ok) return notify(error || "Create failed", "error");
    setNewInstitution("");
    setNewDegree("");
    notify("Education card created as a draft", "success");
    await onChanged();
  }

  function openEdit(card: Education) {
    setOpenId(card._id);
    setDraft({
      institution: card.institution,
      degree: card.degree,
      period: card.period,
      location: card.location ?? "",
      description: card.description ?? "",
      achievements: card.achievements,
      published: card.published,
    });
  }

  async function save(card: Education) {
    setSaving(true);
    const { ok, error } = await api(`/api/admin/education/${card._id}`, {
      method: "PUT",
      body: JSON.stringify(draft),
    });
    setSaving(false);
    if (!ok) return notify(error || "Save failed", "error");
    notify("Saved — live on the site", "success");
    setOpenId(null);
    await onChanged();
  }

  async function togglePublished(card: Education) {
    const { ok, error } = await api(`/api/admin/education/${card._id}`, {
      method: "PUT",
      body: JSON.stringify({ published: !card.published }),
    });
    if (!ok) return notify(error || "Update failed", "error");
    notify(card.published ? "Hidden from the site" : "Published to the site", "success");
    await onChanged();
  }

  async function remove(card: Education) {
    if (!window.confirm(`Delete “${card.degree}” permanently?`)) return;
    const { ok, error } = await api(`/api/admin/education/${card._id}`, {
      method: "DELETE",
    });
    if (!ok) return notify(error || "Delete failed", "error");
    notify("Education card deleted", "success");
    if (openId === card._id) setOpenId(null);
    await onChanged();
  }

  async function move(index: number, delta: number) {
    const list = [...education];
    const target = index + delta;
    if (target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target], list[index]];
    const { ok, error } = await api("/api/admin/education", {
      method: "PATCH",
      body: JSON.stringify({
        items: list.map((c, i) => ({ id: c._id, order: i + 1 })),
      }),
    });
    if (!ok) return notify(error || "Reorder failed", "error");
    await onChanged();
  }

  return (
    <div className="flex flex-col gap-3">
      {/* ── Create form ──────────────────────────────────────────────── */}
      <div
        className="rounded-[10px] p-4 flex flex-col sm:flex-row items-stretch sm:items-end gap-3 border"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
      >
        <AdminField label="Institution">
          <AdminInput
            value={newInstitution}
            onChange={(e) => setNewInstitution(e.target.value)}
            placeholder="e.g. University of Information Technology & Sciences"
          />
        </AdminField>
        <AdminField label="Degree">
          <AdminInput
            value={newDegree}
            onChange={(e) => setNewDegree(e.target.value)}
            placeholder="e.g. BSc in Computer Science & Engineering"
          />
        </AdminField>
        <button
          type="button"
          onClick={create}
          disabled={saving || !newInstitution.trim() || !newDegree.trim()}
          className="min-h-11 px-4 rounded-lg text-xs font-mono font-semibold text-on-accent hover:opacity-90 disabled:opacity-60 cursor-pointer"
          style={{ background: "var(--color-accent)" }}
        >
          Add card
        </button>
      </div>

      <p className="text-xs text-muted">
        {education.length} cards · drafts are hidden from the public site
      </p>

      {education.map((card, i) =>
        openId === card._id ? (
          /* ── Open editor ─────────────────────────────────────────── */
          <div
            key={card._id}
            className="rounded-[10px] p-4 md:p-5 flex flex-col gap-4 border"
            style={{
              background: "var(--color-surface)",
              borderColor: "color-mix(in srgb, var(--color-accent) 40%, var(--color-border))",
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className="text-xs font-mono font-semibold"
                style={{ color: "var(--color-accent-soft)" }}
              >
                Editing — {card.institution}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => save(card)}
                  disabled={saving}
                  className="min-h-11 px-4 rounded-lg text-xs font-mono font-semibold text-on-accent hover:opacity-90 disabled:opacity-60 cursor-pointer"
                  style={{ background: "var(--color-accent)" }}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setOpenId(null)}
                  className="min-h-11 px-4 rounded-lg text-xs font-mono font-semibold text-text cursor-pointer transition-colors hover:border-accent"
                  style={{
                    background: "var(--color-surface-2)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminField label="Institution">
                <AdminInput
                  value={draft.institution ?? ""}
                  onChange={(e) => setDraft({ ...draft, institution: e.target.value })}
                />
              </AdminField>
              <AdminField label="Degree">
                <AdminInput
                  value={draft.degree ?? ""}
                  onChange={(e) => setDraft({ ...draft, degree: e.target.value })}
                />
              </AdminField>
              <AdminField label="Period" hint='e.g. "March 2023 — January 2027 (Expected)"'>
                <AdminInput
                  value={draft.period ?? ""}
                  onChange={(e) => setDraft({ ...draft, period: e.target.value })}
                />
              </AdminField>
              <AdminField label="Location">
                <AdminInput
                  value={draft.location ?? ""}
                  onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                />
              </AdminField>
            </div>

            <AdminField label="Description">
              <AdminTextarea
                value={draft.description ?? ""}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                className="min-h-[80px]"
              />
            </AdminField>

            <AdminField label="Achievements" hint="One per line — left empty means none shown">
              <AdminTextarea
                value={(draft.achievements ?? []).join("\n")}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    achievements: e.target.value
                      .split("\n")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                className="min-h-[80px]"
              />
            </AdminField>

            <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: "var(--color-muted)" }}>
              <input
                type="checkbox"
                checked={Boolean(draft.published)}
                onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
                className="w-4 h-4"
              />
              Published (visible on the public site)
            </label>

            <div className="flex justify-between items-center flex-wrap gap-2">
              <button
                type="button"
                onClick={() => togglePublished(card)}
                className="min-h-11 px-4 rounded-lg text-xs font-mono font-semibold text-text cursor-pointer transition-colors hover:border-accent"
                style={{
                  background: "var(--color-surface-2)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {card.published ? "Hide now (quick toggle)" : "Publish now (quick toggle)"}
              </button>
              <button
                type="button"
                onClick={() => remove(card)}
                className="min-h-11 px-4 rounded-lg text-xs font-mono font-semibold text-danger hover:opacity-80 cursor-pointer"
              >
                Delete card
              </button>
            </div>
          </div>
        ) : (
          /* ── Collapsed row ─────────────────────────────────────────── */
          <div
            key={card._id}
            className="rounded-[10px] p-4 flex items-center gap-3 border transition-colors hover:border-accent/40"
            style={{
              background: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <span
              className="font-mono text-xs font-semibold flex-shrink-0"
              style={{ color: "var(--color-accent-soft)" }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => openEdit(card)}
              className="flex-1 min-w-0 text-left cursor-pointer"
            >
              <span className="block text-sm font-semibold text-text truncate">
                {card.degree}
              </span>
              <span className="block text-xs text-faint truncate">
                {card.institution} · {card.period}
              </span>
            </button>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Pill tone={card.published ? "success" : "quiet"}>
                {card.published ? "Live" : "Draft"}
              </Pill>
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                aria-label={`Move ${card.degree} up`}
                className="min-w-11 min-h-11 text-xs font-mono text-muted hover:text-accent-soft disabled:opacity-30 cursor-pointer"
              >
                Up
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === education.length - 1}
                aria-label={`Move ${card.degree} down`}
                className="min-w-11 min-h-11 text-xs font-mono text-muted hover:text-accent-soft disabled:opacity-30 cursor-pointer"
              >
                Down
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
