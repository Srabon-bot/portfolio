"use client";

/*
 * ProjectCard — displays one project in the "My works" grid.
 *
 * Hiring-ready features:
 * - 16:9 screenshot area via next/image
 * - One-line problem / outcome statement
 * - Optional key metric badge (e.g. "40% faster rendering")
 * - Core tech stack chips
 * - Direct links: Live demo, Source code, and Case study
 */

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Chip } from "./Chip";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const isPlaceholder =
    project.title.startsWith("PLACEHOLDER") ||
    project.status === "draft";

  /* Determine problem or outcome text */
  const problemOrOutcome =
    project.outcome ?? project.problem ?? project.tagline;

  return (
    <motion.article
      whileHover={isPlaceholder ? {} : { y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="flex flex-col h-full rounded-card overflow-hidden transition-all duration-200 group"
      style={{
        background: "var(--color-surface)",
        border: "2.5px solid var(--color-ink)",
        boxShadow: "5px 5px 0 var(--color-ink)",
        opacity: isPlaceholder ? 0.6 : 1,
      }}
    >
      {/* 16:9 Cover Screenshot */}
      <div
        className="relative w-full overflow-hidden border-b-[2.5px]"
        style={{
          aspectRatio: "16/9",
          background: "var(--color-surface-2)",
          borderBottomColor: "var(--color-ink)",
        }}
      >
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={`${project.title} screenshot`}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 550px"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <span className="text-faint text-xs font-bold">
              {isPlaceholder ? "PLACEHOLDER PROJECT" : "Screenshot preview"}
            </span>
          </div>
        )}

        {/* Key metric chip overlay */}
        {project.metric && (
          <div
            className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold text-text"
            style={{
              background: "var(--color-mint)",
              border: "2px solid var(--color-ink)",
              boxShadow: "2px 2px 0 var(--color-ink)",
            }}
          >
            {project.metric}
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Title & Metric (if not rendered as overlay) */}
        <div className="flex items-start justify-between gap-2">
          <h3
            className="text-base md:text-lg font-bold text-text leading-snug break-words"
            style={{ overflowWrap: "anywhere" }}
          >
            {project.title}
          </h3>
        </div>

        {/* One-line problem / outcome */}
        <p
          className="text-muted text-xs md:text-sm line-clamp-2 leading-relaxed break-words"
          style={{ overflowWrap: "anywhere" }}
        >
          {problemOrOutcome}
        </p>

        {/* Stack chips */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
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
            className="flex items-center gap-4 pt-3 border-t-2 mt-1"
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
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
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
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </a>
            )}

            {/* Link to case study */}
            <Link
              href={`/projects/${project.slug}`}
              aria-label={`Read case study for ${project.title}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-muted hover:text-accent-soft transition-colors ml-auto"
            >
              <span>Case study</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </div>
    </motion.article>
  );
}
