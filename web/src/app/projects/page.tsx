import type { Metadata } from "next";
import Link from "next/link";
import { getProjects } from "@/lib/api";
import { ProjectCard } from "@/components/ui/ProjectCard";

export const metadata: Metadata = {
  title: "All Projects — Shahriar Hossain Srabon",
  description: "Complete list of full-stack, frontend, and machine learning projects by Shahriar Hossain Srabon (Srabon).",
};

export default async function AllProjectsPage() {
  const { all } = await getProjects();

  const fullStack = all.filter((p) => p.type === "full-stack");
  const frontend = all.filter((p) => p.type === "frontend");
  const mlProjects = all.filter((p) => p.type === "ml-research");

  return (
    <div className="min-h-screen py-16 px-4 md:px-8" style={{ background: "var(--color-bg)" }}>
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        {/* Navigation & Header */}
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="text-sm font-medium hover:text-accent-soft transition-colors self-start"
            style={{ color: "var(--color-muted)" }}
          >
            ← Back to Home
          </Link>
          <h1
            className="text-3xl md:text-5xl font-bold tracking-tight"
            style={{ color: "var(--color-text)" }}
          >
            All Works &amp; Engineering Projects
          </h1>
          <p className="text-base md:text-lg max-w-2xl" style={{ color: "var(--color-muted)" }}>
            Explore full-stack MERN systems, frontend 3D game engines, and hydrological ML research models.
          </p>
        </div>

        {/* 1. Full-Stack Applications */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl md:text-2xl font-bold" style={{ color: "var(--color-text)" }}>
              Full-Stack Web Applications
            </h2>
            <span
              className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
              style={{
                background: "var(--color-surface-2)",
                color: "var(--color-accent-soft)",
                border: "1px solid var(--color-border)",
              }}
            >
              {fullStack.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fullStack.map((p) => (
              <ProjectCard key={p._id || p.slug} project={p} />
            ))}
          </div>
        </section>

        {/* 2. Frontend & Creative Tech */}
        {frontend.length > 0 && (
          <section className="flex flex-col gap-6 pt-6 border-t" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex items-center gap-3">
              <h2 className="text-xl md:text-2xl font-bold" style={{ color: "var(--color-text)" }}>
                Frontend &amp; Creative Tech
              </h2>
              <span
                className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                style={{
                  background: "var(--color-surface-2)",
                  color: "var(--color-accent-soft)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {frontend.length}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {frontend.map((p) => (
                <ProjectCard key={p._id || p.slug} project={p} />
              ))}
            </div>
          </section>
        )}

        {/* 3. Research & ML Models */}
        {mlProjects.length > 0 && (
          <section className="flex flex-col gap-6 pt-6 border-t" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex items-center gap-3">
              <h2 className="text-xl md:text-2xl font-bold" style={{ color: "var(--color-text)" }}>
                Research &amp; Machine Learning
              </h2>
              <span
                className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                style={{
                  background: "var(--color-surface-2)",
                  color: "var(--color-faint)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {mlProjects.length}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {mlProjects.map((project) => (
                <div
                  key={project._id || project.slug}
                  className="flex items-start justify-between gap-4 p-5 rounded-xl transition-all duration-200 hover:border-accent/40"
                  style={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-base font-semibold" style={{ color: "var(--color-text)" }}>
                      {project.title}
                    </span>
                    <span className="text-sm" style={{ color: "var(--color-muted)" }}>
                      {project.tagline}
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {project.stack.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 text-xs rounded"
                          style={{
                            background: "var(--color-surface-2)",
                            color: "var(--color-faint)",
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold flex-shrink-0 px-3 py-1.5 rounded-lg border hover:text-text transition-colors"
                      style={{
                        borderColor: "var(--color-border)",
                        color: "var(--color-accent-soft)",
                      }}
                    >
                      Repo ↗
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
