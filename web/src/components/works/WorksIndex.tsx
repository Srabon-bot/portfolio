"use client";

/*
 * WorksIndex — the "Table of Works" for /projects.
 *
 * Editorial index: numbered rows (No. 01 …), serif titles, mono stack
 * ledgers, engraved hairlines, gold hover rules. Client-side filter chips
 * (All / Full-Stack / Frontend / Research & ML) — no backend change.
 */

import Link from "next/link";
import { useState } from "react";
import type { Project } from "@/types";

interface WorksIndexProps {
  projects: Project[];
}

const FILTERS = [
  { id: "all",          label: "All Works" },
  { id: "full-stack",   label: "Full-Stack" },
  { id: "frontend",     label: "Frontend" },
  { id: "ml-research",  label: "Research & ML" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

export function WorksIndex({ projects }: WorksIndexProps) {
  const [filter, setFilter] = useState<FilterId>("all");

  /* Only published, non-placeholder works get a plate number */
  const works = projects
    .filter((p) => p.status === "published")
    .filter((p) => (filter === "all" ? true : p.type === filter));

  const countFor = (id: FilterId) =>
    id === "all"
      ? projects.filter((p) => p.status === "published").length
      : projects.filter((p) => p.status === "published" && p.type === id).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter projects by type">
        {FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={active}
              className="inline-flex items-center gap-2 min-h-11 px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer"
              style={
                active
                  ? {
                      background: "var(--color-accent)",
                      color: "var(--color-on-accent)",
                      border: "2px solid var(--color-ink)",
                      boxShadow: "2px 2px 0 var(--color-ink)",
                    }
                  : {
                      background: "var(--color-surface)",
                      color: "var(--color-muted)",
                      border: "2px solid color-mix(in srgb, var(--color-ink) 45%, transparent)",
                    }
              }
            >
              <span>{f.label}</span>
              <span aria-hidden="true" className={active ? "opacity-70" : "opacity-50"}>
                {countFor(f.id)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Rows */}
      <div className="flex flex-col">
        {works.length === 0 && (
          <p className="text-sm" style={{ color: "var(--color-faint)" }}>
            No works in this category yet.
          </p>
        )}

        {works.map((p, index) => (
          <div
            key={p._id || p.slug}
            className="group grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto] gap-x-4 sm:gap-x-6 gap-y-2 items-center py-5 border-b transition-colors duration-200 hover:bg-surface/60"
            style={{ borderColor: "var(--color-border)" }}
          >
            {/* Plate number */}
            <span
              aria-hidden="true"
              className="text-xs font-extrabold tabular-nums row-span-2 sm:row-span-1 self-start sm:self-center"
              style={{ color: "var(--color-accent-soft)" }}
            >
              No. {String(index + 1).padStart(2, "0")}
            </span>

            {/* Title + tagline + stack ledger */}
            <div className="min-w-0">
              <Link
                href={`/projects/${p.slug}`}
                className="inline-block text-base md:text-lg font-semibold leading-snug text-text hover:text-accent-soft transition-colors break-words"
                style={{
                  fontFamily: "var(--font-fredoka), var(--font-nunito), sans-serif",
                  overflowWrap: "anywhere",
                }}
              >
                {p.title}
              </Link>
              <p
                className="text-xs md:text-sm mt-0.5 line-clamp-2"
                style={{ color: "var(--color-muted)", overflowWrap: "anywhere" }}
              >
                {p.tagline}
              </p>
              <p className="text-xs font-bold mt-1" style={{ color: "var(--color-faint)" }}>
                {p.stack.join(" · ")}
              </p>
            </div>

            {/* Actions */}
            <div className="col-span-2 sm:col-span-1 flex items-center gap-4 justify-self-start sm:justify-self-end">
              {p.liveUrl && !p.liveUrl.startsWith("PLACEHOLDER") && (
                <a
                  href={p.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Live demo of ${p.title} (opens in a new tab)`}
                  className="text-xs font-bold text-accent-soft hover:text-text transition-colors"
                >
                  Live ↗
                </a>
              )}
              {p.repoUrl && (
                <a
                  href={p.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Source code for ${p.title} (opens in a new tab)`}
                  className="text-xs font-bold text-muted hover:text-text transition-colors"
                >
                  Code ↗
                </a>
              )}
              <Link
                href={`/projects/${p.slug}`}
                aria-label={`Read case study for ${p.title}`}
                className="text-xs font-bold text-muted hover:text-accent-soft transition-colors"
              >
                Study →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
