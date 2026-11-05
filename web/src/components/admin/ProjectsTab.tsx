"use client";

/*
 * ProjectsTab — create / edit / reorder / delete the Table of Works.
 * Single-accordion editor: exactly one project is open at a time so the
 * case-study fields never fight for screen space. Saves PUT only the
 * whitelist API /api/admin/projects/[id] accepts; creates POST /api/admin
 * /projects; reorder PATCHes the whole order array (lists are small).
 * Server writes revalidate the public site instantly via the content tag.
 */

import { useMemo, useState } from "react";
import { api } from "@/lib/admin-client";
import type { Project } from "@/types";
import {
  AdminInput,
  AdminSelect,
  AdminTextarea,
  AdminField,
  Pill,
  linesTo,
} from "./atoms";
import { UploadBox } from "./UploadBox";

interface ProjectsTabProps {
  projects: Project[];
  onChanged: () => Promise<void> | void;
  notify: (text: string, type?: "success" | "error") => void;
}

export function ProjectsTab({ projects, onChanged, notify }: ProjectsTabProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<Project>>({});
  const [saving, setSaving] = useState(false);

  /* A fresh project with required text pre-seeded so create is one click */
  const blankDraft = useMemo<Partial<Project>>(
    () => ({
      title: "New project",
      tagline: "One-line value statement",
      problem: "What problem does this solve?",
      description: "",
      role: "Solo Developer",
      type: "full-stack",
      status: "draft",
      featured: false,
      stack: [],
      features: [],
      screenshots: [],
    }),
    []
  );

  function toggle(project: Project | null, draftState?: Partial<Project>) {
    if (openId && !project) return setOpenId(null);
    if (project && project._id === openId) return setOpenId(null);
    setOpenId(project?._id ?? "new");
    setDraft(draftState ?? project ?? blankDraft);
  }

  async function createProject() {
    setSaving(true);
    const { ok, error } = await api("/api/admin/projects", {
      method: "POST",
      body: JSON.stringify(blankDraft),
    });
    setSaving(false);
    if (!ok) return notify(error || "Create failed", "error");
    await onChanged();
    const fresh = (await fetch("/api/admin/projects", {
      credentials: "same-origin",
    })
      .then((r) => r.json())
      .catch(() => ({ projects: [] }))) as { projects?: Project[] };
    const made = fresh.projects?.at(-1);
    notify("Project created as a draft", "success");
    if (made) toggle(made);
  }

  async function save(project: Project) {
    setSaving(true);
    const { ok, error } = await api(
      `/api/admin/projects/${project._id}`,
      {
        method: "PUT",
        body: JSON.stringify(draft),
      }
    );
    setSaving(false);
    if (!ok) return notify(error || "Save failed", "error");
    notify("Saved — live on the site", "success");
    await onChanged();
  }

  async function remove(project: Project) {
    if (
      !window.confirm(`Delete “${project.title}” permanently? This cannot be undone.`)
    ) {
      return;
    }
    const { ok, error } = await api(
      `/api/admin/projects/${project._id}`,
      { method: "DELETE" }
    );
    if (!ok) return notify(error || "Delete failed", "error");
    notify("Project deleted", "success");
    if (openId === project._id) setOpenId(null);
    await onChanged();
  }

  async function move(index: number, delta: number) {
    const list = [...projects];
    const target = index + delta;
    if (target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target], list[index]];
    const { ok, error } = await api("/api/admin/projects", {
      method: "PATCH",
      body: JSON.stringify({
        items: list.map((p, i) => ({ id: p._id, order: i + 1 })),
      }),
    });
    if (!ok) return notify(error || "Reorder failed", "error");
    await onChanged();
  }

  const { features, stack } = draft;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-xs text-muted">
          {projects.length} projects · editing publishes instantly
        </p>
        <button
          type="button"
          onClick={createProject}
          disabled={saving}
          className="min-h-11 px-4 rounded-lg text-xs font-mono font-semibold text-on-accent hover:opacity-90 disabled:opacity-60 cursor-pointer"
          style={{ background: "var(--color-accent)" }}
        >
          + New project
        </button>
      </div>

      {projects.map((p, i) =>
        openId === p._id ? (
          <div
            key={p._id}
            className="rounded-[10px] p-4 md:p-5 flex flex-col gap-4 border"
            style={{
              background: "var(--color-surface)",
              borderColor: "color-mix(in srgb, var(--color-accent) 40%, var(--color-border))",
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono font-semibold" style={{ color: "var(--color-accent-soft)" }}>
                Editing — {p.title}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => save(p)}
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
              <AdminField label="Title">
                <AdminInput
                  value={draft.title ?? ""}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                />
              </AdminField>
              <AdminField label="Tagline" hint="One sentence: what it does">
                <AdminInput
                  value={draft.tagline ?? ""}
                  onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
                />
              </AdminField>
              <AdminField label="Role">
                <AdminInput
                  value={draft.role ?? ""}
                  onChange={(e) => setDraft({ ...draft, role: e.target.value })}
                />
              </AdminField>
              <AdminField label="Slug" hint={p.slug}>
                <AdminInput
                  value={draft.slug ?? p.slug}
                  onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                />
              </AdminField>
              <AdminField label="Type">
                <AdminSelect
                  value={draft.type ?? "full-stack"}
                  onChange={(e) =>
                    setDraft({ ...draft, type: e.target.value as Project["type"] })
                  }
                >
                  <option value="full-stack">Full-Stack</option>
                  <option value="frontend">Frontend</option>
                  <option value="ml-research">ML Research</option>
                </AdminSelect>
              </AdminField>
              <AdminField label="Status">
                <AdminSelect
                  value={draft.status ?? "draft"}
                  onChange={(e) =>
                    setDraft({ ...draft, status: e.target.value as Project["status"] })
                  }
                >
                  <option value="draft">Draft (hidden)</option>
                  <option value="published">Published (visible)</option>
                </AdminSelect>
              </AdminField>
              <AdminField label="Live URL">
                <AdminInput
                  value={draft.liveUrl ?? ""}
                  onChange={(e) => setDraft({ ...draft, liveUrl: e.target.value })}
                />
              </AdminField>
              <AdminField label="Repository URL">
                <AdminInput
                  value={draft.repoUrl ?? ""}
                  onChange={(e) => setDraft({ ...draft, repoUrl: e.target.value })}
                />
              </AdminField>
            </div>

            <label
              className="text-xs text-muted flex items-center gap-2"
              style={{
                color: "var(--color-muted)",
              }}
            >
              <input
                type="checkbox"
                checked={Boolean(draft.featured)}
                onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
                className="w-4 h-4"
              />
              Featured on the home page gallery
            </label>

            <AdminField label="Problem" hint="Case-study chapter 1">
              <AdminTextarea
                value={draft.problem ?? ""}
                onChange={(e) => setDraft({ ...draft, problem: e.target.value })}
              />
            </AdminField>

            <AdminField label="Description" hint="Case-study narrative">
              <AdminTextarea
                value={draft.description ?? ""}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                className="min-h-[110px]"
              />
            </AdminField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminField label="Features" hint="One per line">
                <AdminTextarea
                  value={(features ?? []).join("\n")}
                  onChange={(e) => setDraft({ ...draft, features: linesTo(e) })}
                  className="min-h-[90px]"
                />
              </AdminField>
              <AdminField label="Stack" hint="One per line">
                <AdminTextarea
                  value={(stack ?? []).join("\n")}
                  onChange={(e) => setDraft({ ...draft, stack: linesTo(e) })}
                  className="min-h-[90px]"
                />
              </AdminField>
            </div>

            <AdminField label="Cover image">
              <UploadBox
                label="Cover"
                currentUrl={draft.coverImage}
                onUploaded={(url) => setDraft({ ...draft, coverImage: url })}
              />
            </AdminField>

            <AdminField label="Screenshots" hint="Upload adds to the gallery">
              <div className="flex flex-col gap-2">
                {(draft.screenshots ?? []).map((s, si) => (
                  <div key={si} className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s}
                      alt=""
                      className="w-14 h-9 object-cover rounded-md border"
                      style={{ borderColor: "var(--color-border)" }}
                    />
                    <span className="text-xs font-mono text-faint truncate flex-1 min-w-0">
                      {safeTail(s)}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          screenshots: (draft.screenshots ?? []).filter(
                            (_, x) => x !== si
                          ),
                        })
                      }
                      className="min-h-11 min-w-11 text-xs font-mono text-danger cursor-pointer"
                      aria-label={`Remove screenshot ${si + 1}`}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <UploadBox
                  label="Add screenshot"
                  onUploaded={(url) =>
                    setDraft({
                      ...draft,
                      screenshots: [...(draft.screenshots ?? []), url],
                    })
                  }
                />
              </div>
            </AdminField>

            <AdminField label="Local setup" hint="Case-study chapter 7">
              <AdminTextarea
                value={draft.setupInstructions ?? ""}
                onChange={(e) =>
                  setDraft({ ...draft, setupInstructions: e.target.value })
                }
              />
            </AdminField>
            <AdminField label="What I would improve">
              <AdminTextarea
                value={draft.improvements ?? ""}
                onChange={(e) =>
                  setDraft({ ...draft, improvements: e.target.value })
                }
              />
            </AdminField>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => remove(p)}
                className="min-h-11 px-4 rounded-lg text-xs font-mono font-semibold text-danger cursor-pointer hover:opacity-80"
              >
                Delete project
              </button>
            </div>
          </div>
        ) : (
          /* ── Collapsed row ──────────────────────────────────────────── */
          <div
            key={p._id}
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
              onClick={() => toggle(p)}
              className="flex-1 min-w-0 text-left cursor-pointer"
            >
              <span className="block text-sm font-semibold text-text truncate">
                {p.title}
              </span>
              <span className="block text-xs text-faint truncate">
                {p.stack.join(" · ")}
              </span>
            </button>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Pill tone={p.status === "published" ? "success" : "quiet"}>
                {p.status === "published" ? "Live" : "Draft"}
              </Pill>
              {p.featured && <Pill tone="gold">Featured</Pill>}
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                aria-label={`Move ${p.title} up`}
                className="min-w-11 min-h-11 text-xs font-mono text-muted hover:text-accent-soft disabled:opacity-30 cursor-pointer"
              >
                Up
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === projects.length - 1}
                aria-label={`Move ${p.title} down`}
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

function safeTail(url: string): string {
  try {
    return new URL(url).pathname.split("/").pop() ?? url;
  } catch {
    return url;
  }
}
