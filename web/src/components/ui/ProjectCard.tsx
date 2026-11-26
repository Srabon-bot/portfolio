"use client";

/*
 * ProjectCard — one featured project, shown as a full-width list card.
 *
 * The home page used to place these in an asymmetric 3/5 + 2/5 gallery,
 * which made card width imply rank. A single-column list gives every
 * featured project the same visual weight, so the order alone communicates
 * importance.
 *
 * Hiring-ready features:
 * - 16:9 screenshot (image left on desktop, stacked on mobile)
 * - Numbered plate + type label, matching the site's numbered index voice
 * - One-line tagline / outcome
 * - Core tech stack chips
 * - Direct links: Live demo, Source code, and Case study
 */

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Chip } from "./Chip";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  /** Zero-based position in the featured list — renders as 01, 02, … */
  index?: number;
}

const TYPE_LABEL: Record<Project["type"], string> = {
  "full-stack": "Full-Stack",
  frontend: "Frontend",
  "ml-research": "Research & ML",
};

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const reduceMotion = useReducedMotion();
  const isPlaceholder =
    project.title.startsWith("PLACEHOLDER") || project.status === "draft";

  /* One-line value statement — the problem belongs in the case study */
  const summary = project.outcome ?? project.tagline;

  return (
    <motion.article
      whileHover={isPlaceholder || reduceMotion ? {} : { y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] overflow-hidden rounded-card group"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "2.5px solid var(--color-ink)",
        boxShadow: "5px 5px 0 var(--color-ink-shadow)",
        opacity: isPlaceholder ? 0.6 : 1,
      }}
    >
      {/* 16:9 Cover Screenshot */}
      <div
        className="relative w-full aspect-video md:aspect-auto overflow-hidden border-b-[2.5px] md:border-b-0 md:border-r-[2.5px] md:min-h-[300px]"
        style={{
          background: "var(--color-surface-2)",
          borderColor: "var(--color-ink)",
        }}
      >
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={`${project.title} screenshot`}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <span className="text-faint text-xs font-bold">
              {isPlaceholder ? "PLACEHOLDER PROJECT" : "Screenshot preview"}
            </span>
          </div>
        )}

        {/* Numbered plate — same index voice as the all-projects list */}
        <span
          aria-hidden="true"
          className="absolute top-3 left-3 inline-flex items-center justify-center min-w-9 h-9 px-2 rounded-full text-xs font-extrabold tabular-nums text-on-pastel"
          style={{
            background: "var(--color-mint)",
            border: "2px solid var(--color-ink)",
            boxShadow: "2px 2px 0 var(--color-ink-shadow)",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Key metric chip overlay */}
        {project.metric && (
          <div
            className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold text-on-pastel"
            style={{
              background: "var(--color-mint)",
              border: "2px solid var(--color-ink)",
              boxShadow: "2px 2px 0 var(--color-ink-shadow)",
            }}
          >
            {project.metric}
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 min-w-0 p-5 md:p-7 gap-3">
        <p
          className="text-xs font-extrabold uppercase tracking-wider"
          style={{ color: "var(--color-accent-soft)" }}
        >
          {TYPE_LABEL[project.type]}
        </p>

        <h3
          className="text-xl md:text-2xl font-bold text-text leading-snug break-words"
          style={{ overflowWrap: "anywhere" }}
        >
          <Link
            href={`/projects/${project.slug}`}
            className="hover:text-accent-soft transition-colors"
          >
            {project.title}
          </Link>
        </h3>

        {/* One-line value statement */}
        <p
          className="text-muted text-sm md:text-base line-clamp-2 leading-relaxed break-words"
          style={{ overflowWrap: "anywhere" }}
        >
          {summary}
        </p>

        {/* Stack chips */}
        <div className="flex flex-wrap gap-1.5 mt-1">
          {project.stack.slice(0, 4).map((tech) => (
            <Chip key={tech} label={tech} size="sm" />
          ))}
          {project.stack.length > 4 && (
            <Chip label={`+${project.stack.length - 4}`} size="sm" />
          )}
        </div>

        {/* Links row */}
        {!isPlaceholder && (
          <div
            className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-3 border-t-2 mt-auto"
            style={{ borderColor: "var(--color-surface-2)" }}
          >
            {project.liveUrl && !project.liveUrl.startsWith("PLACEHOLDER") && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Live demo of ${project.title}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-accent-soft hover:text-text transition-colors"
              >
                <span>Live demo</span>
              </a>
            )}

            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Source code for ${project.title}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-muted hover:text-text transition-colors"
              >
                <span>Code</span>
              </a>
            )}

            {/* Link to case study */}
            <Link
              href={`/projects/${project.slug}`}
              aria-label={`Read case study for ${project.title}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-muted hover:text-accent-soft transition-colors sm:ml-auto"
            >
              <span>Case study</span>
            </Link>
          </div>
        )}
      </div>
    </motion.article>
  );
}
