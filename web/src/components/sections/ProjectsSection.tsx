/*
 * ProjectsSection — "My works" grid + "Research and ML" strip.
 *
 * PRD §6.5:
 * - Grid of up to 4 featured ProjectCards (type: full-stack or frontend only).
 * - "View all projects" link if more exist.
 * - Below it, a compact "Research and ML" strip for ml-research projects
 *   (small text cards, title + one line + repo link, no screenshots).
 *
 * This is a Server Component — content is visible without JavaScript.
 */

import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import { ProjectCard } from "@/components/ui/ProjectCard";
import type { Project } from "@/types";

interface ProjectsSectionProps {
  /** Up to 4 featured projects of type full-stack or frontend */
  featuredProjects: Project[];
  /** ML/research projects for the secondary strip */
  mlProjects: Project[];
  /** Total published project count (to show "View all" link) */
  totalPublished?: number;
}

export function ProjectsSection({
  featuredProjects,
  mlProjects,
  totalPublished = 0,
}: ProjectsSectionProps) {
  /* Show "View all" only if there are more projects than the 4 featured */
  const hasMore = totalPublished > featuredProjects.filter((p) => p.status === "published").length;

  return (
    <section
      id="projects"
      aria-label="Projects and case studies"
      className="py-12 sm:py-16 lg:py-24"
      style={{ scrollMarginTop: "4.5rem" }}
    >
      <Container>
        <SectionHeading
          title="Projects"
          index="01"
          kicker="Selected Work"
          subtitle="Featured software projects and applications"
          id="projects-heading"
        />

        {/* Asymmetric editorial gallery — alternating wide (3/5) and narrow (2/5) spreads */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
          {featuredProjects.map((project, i) => (
            <div
              key={project._id}
              className={i % 4 === 0 || i % 4 === 3 ? "md:col-span-3" : "md:col-span-2"}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

      {/* "View all projects" link — shown only when more projects exist */}
      {hasMore && (
        <div className="mt-8 text-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-accent-soft hover:text-accent transition-colors"
          >
            View all projects <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}

      {/* ── Research and ML strip ─────────────────────────────────── */}
      {mlProjects.length > 0 && (
        <div className="mt-14">
          {/* Lower-emphasis heading for the secondary strip */}
          <h3
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: "var(--color-faint)" }}
          >
            Research &amp; ML
          </h3>
          <div className="flex flex-col gap-3">
            {mlProjects.map((project) => (
              /*
               * Small text card — no screenshot, just title + tagline + repo link.
               * PRD §6.5: "small text cards (title, one line, repo link)
               * with no screenshot requirement"
               */
              <div
                key={project._id}
                className="flex items-start justify-between gap-4 px-4 py-3 rounded-xl"
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium" style={{ color: "var(--color-muted)" }}>
                    {project.title}
                  </span>
                  <span className="text-xs ml-3" style={{ color: "var(--color-faint)" }}>
                    {project.tagline}
                  </span>
                </div>
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium flex-shrink-0 hover:text-accent-soft transition-colors"
                    style={{ color: "var(--color-faint)" }}
                    aria-label={`View ${project.title} repository`}
                  >
                    Repo ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      </Container>
    </section>
  );
}
