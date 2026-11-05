"use client";

/*
 * SkillsTab — add skills, delete, reorder inside the Toolbox lists.
 * API: CRUD via /api/admin/skills (+ PATCH reorder).
 */

import { useState } from "react";
import type { Skill } from "@/types";
import { api } from "@/lib/admin-client";
import { AdminInput, AdminSelect, AdminField, Pill } from "./atoms";

const CATEGORIES = [
  { key: "frontend", label: "Frontend" },
  { key: "backend", label: "Backend" },
  { key: "tools", label: "Tools" },
  { key: "ml-data", label: "ML / Data" },
] as const;

interface SkillsTabProps {
  skills: Skill[];
  onChanged: () => Promise<void> | void;
  notify: (text: string, type?: "success" | "error") => void;
}

export function SkillsTab({ skills, onChanged, notify }: SkillsTabProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Skill["category"]>("frontend");
  const [busy, setBusy] = useState(false);

  async function add() {
    if (!name.trim()) return;
    setBusy(true);
    const { ok, error } = await api("/api/admin/skills", {
      method: "POST",
      body: JSON.stringify({ name: name.trim(), category }),
    });
    setBusy(false);
    if (!ok) return notify(error || "Add failed", "error");
    setName("");
    await onChanged();
    notify("Skill added", "success");
  }

  async function remove(skill: Skill) {
    if (!window.confirm(`Remove skill “${skill.name}”?`)) return;
    const { ok, error } = await api(`/api/admin/skills/${skill._id}`, {
      method: "DELETE",
    });
    if (!ok) return notify(error || "Delete failed", "error");
    await onChanged();
    notify("Skill removed", "success");
  }

  async function move(skill: Skill, delta: number) {
    const list = [...skills];
    const i = list.findIndex((s) => s._id === skill._id);
    const t = i + delta;
    if (i < 0 || t < 0 || t >= list.length) return;
    [list[i], list[t]] = [list[t], list[i]];
    const { ok, error } = await api("/api/admin/skills", {
      method: "PATCH",
      body: JSON.stringify({
        items: list.map((s, idx) => ({ id: s._id, order: idx + 1 })),
      }),
    });
    if (!ok) return notify(error || "Reorder failed", "error");
    await onChanged();
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-[10px] p-4 flex flex-col sm:flex-row items-stretch sm:items-end gap-3 border"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
        <AdminField label="New skill">
          <AdminInput value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Framer Motion" />
        </AdminField>
        <AdminField label="Group">
          <AdminSelect value={category} onChange={(e) => setCategory(e.target.value as Skill["category"])}>
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </AdminSelect>
        </AdminField>
        <button
          type="button"
          onClick={add}
          disabled={busy || !name.trim()}
          className="min-h-11 px-4 rounded-lg text-xs font-mono font-semibold text-on-accent hover:opacity-90 disabled:opacity-60 cursor-pointer"
          style={{ background: "var(--color-accent)" }}
        >
          Add skill
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {CATEGORIES.map(({ key, label }) => {
          const group = skills.filter((s) => s.category === key);
          if (!group.length) return null;
          return (
            <div key={key}
              className="rounded-[10px] p-4 flex flex-col gap-2 border"
              style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
              <Pill tone="gold">{label}</Pill>
              {group.map((s) => {
                const gIdx = skills.findIndex((x) => x._id === s._id);
                return (
                  <div key={s._id} className="flex items-center gap-2">
                    <span className="text-sm text-text flex-1 min-w-0 truncate">{s.name}</span>
                    <button type="button" onClick={() => move(s, -1)} disabled={gIdx === 0}
                      aria-label={`Move ${s.name} up`}
                      className="min-w-11 min-h-11 text-xs font-mono text-muted hover:text-accent-soft disabled:opacity-30 cursor-pointer">
                      Up
                    </button>
                    <button type="button" onClick={() => move(s, 1)} disabled={gIdx === skills.length - 1}
                      aria-label={`Move ${s.name} down`}
                      className="min-w-11 min-h-11 text-xs font-mono text-muted hover:text-accent-soft disabled:opacity-30 cursor-pointer">
                      Down
                    </button>
                    <button type="button" onClick={() => remove(s)}
                      className="min-w-11 min-h-11 text-xs font-mono text-danger hover:opacity-80 cursor-pointer">
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
