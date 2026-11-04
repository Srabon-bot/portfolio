import type { Metadata } from "next";
import Link from "next/link";
import { getProjects } from "@/lib/api";
import { WorksIndex } from "@/components/works/WorksIndex";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export const metadata: Metadata = {
  title: "All Projects — Shahriar Hossain Srabon",
  description: "Complete list of full-stack, frontend, and machine learning projects by Shahriar Hossain Srabon (Srabon).",
};

/*
 * /projects — "Table of Works" (hallmark editorial).
 * Server component shells the header; WorksIndex (client) handles the
 * numbered rows and the client-side type filters.
 */
export default async function AllProjectsPage() {
  const { all } = await getProjects();

  return (
    <div className="min-h-screen py-12 md:py-16 px-4 md:px-8" style={{ background: "var(--color-bg)" }}>
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        {/* Header row: back link + theme toggle */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            aria-label="Back to home"
            className="text-sm font-medium hover:text-accent-soft transition-colors"
            style={{ color: "var(--color-muted)" }}
          >
            ← Back to Home
          </Link>
          <ThemeToggle />
        </div>

        {/* Masthead */}
        <div className="flex flex-col gap-4">
          <p className="kicker flex items-center gap-2">
            Index
            <span aria-hidden="true" className="inline-block h-px w-10" style={{ background: "var(--color-accent)", opacity: 0.5 }} />
            Complete catalogue
          </p>
          <h1
            className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight"
            style={{ color: "var(--color-text)" }}
          >
            All Works &amp; Engineering Projects
          </h1>
          <div aria-hidden="true" className="rule-gold" />
          <p className="text-base md:text-lg max-w-2xl" style={{ color: "var(--color-muted)" }}>
            Explore full-stack MERN systems, frontend 3D game engines, and hydrological ML research models.
          </p>
        </div>

        {/* Table of Works (client-side filters) */}
        <WorksIndex projects={all} />
      </div>
    </div>
  );
}
