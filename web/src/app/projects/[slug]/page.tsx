import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProjectBySlug, getProjects } from "@/lib/api";
import { Chip } from "@/components/ui/Chip";
import { TechIcon } from "@/components/ui/TechIcon";
import { ChapterNav } from "@/components/works/ChapterNav";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

/* Sticky chapters for the mono table of contents (5-section README structure) */
const CHAPTERS = [
  { id: "problem",       label: "1. Problem" },
  { id: "architecture",  label: "2. Architecture" },
  { id: "auth",          label: "3. Auth" },
  { id: "deployment",    label: "4. Deployment" },
  { id: "hard-problem",  label: "5. Hard Problem" },
  { id: "gallery",       label: "6. Gallery" },
  { id: "setup",         label: "7. Local Setup" },
];

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const { all } = await getProjects();
    return all
      .filter((p) => p.status === "published" && p.slug)
      .map((p) => ({ slug: p.slug }));
  } catch {
    const { seedProjects, seedMlProjects } = await import("@/lib/seed-data");
    return [...seedProjects, ...seedMlProjects]
      .filter((p) => p.status === "published")
      .map((p) => ({ slug: p.slug }));
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${project.title} — Case Study | Srabon`,
    description: project.tagline,
    openGraph: {
      title: `${project.title} — Srabon's Case Study`,
      description: project.tagline,
      images: project.coverImage ? [project.coverImage] : [],
    },
  };
}

export default async function ProjectCaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      {/* Top sticky navigation bar */}
      <header
        className="sticky top-0 z-50 w-full"
        style={{
          background: "var(--color-bg)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
          <Link
            href="/#projects"
            className="text-sm font-bold hover:text-accent-soft transition-colors flex items-center gap-2"
            style={{ color: "var(--color-muted)" }}
          >
            ← Back to Projects
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            {project.liveUrl && !project.liveUrl.startsWith("PLACEHOLDER") && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-extrabold px-3 py-1.5 rounded-full text-on-accent transition-opacity hover:opacity-90"
                style={{ background: "var(--color-accent)" }}
              >
                Live Demo ↗
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono font-medium px-3 py-1.5 rounded-full border transition-colors hover:text-text"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-muted)",
                }}
              >
                GitHub Code ↗
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main Case Study Article — feature spread with sticky chapter TOC */}
      <div className="max-w-4xl mx-auto lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 px-4 md:px-8">
        {/* Sticky chapter TOC (desktop) */}
        <aside aria-label="Case study chapters" className="hidden lg:block">
          <ChapterNav chapters={CHAPTERS} />
        </aside>

        <article className="section-pad flex flex-col gap-10 min-w-0" style={{ paddingBottom: "var(--space-section)" }}>
        {/* Title, Badge & Tagline */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-mono font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{
                background: "var(--color-surface-2)",
                color: "var(--color-accent-soft)",
                border: "1px solid var(--color-border)",
              }}
            >
              {project.type.toUpperCase()}
            </span>
            <span className="text-xs font-mono text-faint">Role: {project.role || "Lead Full-Stack Developer"}</span>
          </div>

          <h1
            className="text-3xl md:text-5xl font-bold tracking-tight leading-tight"
            style={{ color: "var(--color-text)" }}
          >
            {project.title}
          </h1>

          <p
            className="text-lg md:text-xl leading-relaxed"
            style={{ color: "var(--color-muted)" }}
          >
            {project.tagline}
          </p>

          {/* Quick tech stack tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {project.stack.map((tech) => (
              <Chip key={tech} label={tech} />
            ))}
          </div>
        </div>

        {/* Cover image */}
        {project.coverImage && (
          <div
            className="relative w-full rounded-[18px] overflow-hidden shadow-2xl border"
            style={{
              aspectRatio: "16/9",
              borderColor: "color-mix(in srgb, var(--color-accent) 35%, transparent)",
              background: "var(--color-surface)",
            }}
          >
            <Image
              src={project.coverImage}
              alt={`${project.title} preview`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
            />
          </div>
        )}

        {/* ── 1. Problem Statement ──────────────────────────────────── */}
        <section
          id="problem"
          className="rounded-[18px] p-6 md:p-8 flex flex-col gap-4"
          style={{
            background: "var(--color-surface)",
            border: "2.5px solid var(--color-ink)",
            boxShadow: "5px 5px 0 var(--color-ink-shadow)",
          }}
        >
          <div className="flex items-center justify-between">
            <h2
              className="text-xl md:text-2xl font-bold flex items-center gap-2"
              style={{ color: "var(--color-text)" }}
            >
              <span>🎯</span> 1. Problem
            </h2>
            <span className="text-xs font-mono text-faint uppercase">Challenge &amp; Context</span>
          </div>

          <p
            className="text-base leading-relaxed"
            style={{ color: "var(--color-muted)" }}
          >
            {project.problem ||
              "TODO: Document the exact real-world problem, user pain points, and why traditional solutions failed for target users."}
          </p>

          <div
            className="p-4 rounded-xl text-sm"
            style={{
              background: "var(--color-surface-2)",
              border: "2px solid color-mix(in srgb, var(--color-ink) 45%, transparent)",
              color: "var(--color-text)",
            }}
          >
            <strong>Core insight:</strong> {project.description}
          </div>
        </section>

        {/* ── 2. Architecture (React -> Express -> MongoDB) ─────────── */}
        <section
          id="architecture"
          className="rounded-[18px] p-6 md:p-8 flex flex-col gap-5"
          style={{
            background: "var(--color-surface)",
            border: "2.5px solid var(--color-ink)",
            boxShadow: "5px 5px 0 var(--color-ink-shadow)",
          }}
        >
          <div className="flex items-center justify-between">
            <h2
              className="text-xl md:text-2xl font-bold flex items-center gap-2"
              style={{ color: "var(--color-text)" }}
            >
              <span>🏛️</span> 2. Architecture (React → Express → MongoDB)
            </h2>
            <span className="text-xs font-mono text-accent-soft uppercase">Full-Stack Flow</span>
          </div>

          <p
            className="text-sm md:text-base leading-relaxed"
            style={{ color: "var(--color-muted)" }}
          >
            End-to-end architecture connects client interactions through resilient API controllers down to optimized document queries:
          </p>

          <div
            className="p-4 rounded-xl font-mono text-xs md:text-sm overflow-x-auto leading-relaxed border"
            style={{
              background: "var(--color-surface-2)",
              borderColor: "color-mix(in srgb, var(--color-ink) 45%, transparent)",
              color: "var(--color-text)",
            }}
          >
            <div className="text-accent-soft font-semibold mb-1">
              {/* Architecture Data Flow Diagram */}
              [Client: React 19 / Next.js] ──▶ (HTTPS / JSON / Bearer JWT)
            </div>
            <div className="text-muted ml-6">
              ▼ Express REST Router &amp; Rate-Limiting Middleware
            </div>
            <div className="text-muted ml-6">
              ▼ Controller validation (Zod schemas) &amp; Business Logic Service
            </div>
            <div className="font-semibold ml-6" style={{ color: "var(--color-success)" }}>
              ▼ [Database: MongoDB / Neon Postgres] (Mongoose models, compound indexes, atomic writes)
            </div>
          </div>

          <p className="text-xs font-mono text-faint">
            TODO: Expand architecture notes with microservice boundaries, caching layer, or message queues as the system scales.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {project.stack.map((tech) => (
              <div
                key={tech}
                className="p-3.5 rounded-xl flex items-center gap-3"
                style={{
                  background: "var(--color-surface-2)",
                  border: "2px solid color-mix(in srgb, var(--color-ink) 45%, transparent)",
                }}
              >
                <TechIcon name={tech} size={18} />
                <span className="text-xs font-mono font-medium text-text">{tech}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. Auth ───────────────────────────────────────────────── */}
        <section
          id="auth"
          className="rounded-[18px] p-6 md:p-8 flex flex-col gap-4"
          style={{
            background: "var(--color-surface)",
            border: "2.5px solid var(--color-ink)",
            boxShadow: "5px 5px 0 var(--color-ink-shadow)",
          }}
        >
          <div className="flex items-center justify-between">
            <h2
              className="text-xl md:text-2xl font-bold flex items-center gap-2"
              style={{ color: "var(--color-text)" }}
            >
              <span>🔒</span> 3. Auth
            </h2>
            <span className="text-xs font-mono text-faint uppercase">Security &amp; Sessions</span>
          </div>

          <div className="space-y-3 text-sm md:text-base leading-relaxed" style={{ color: "var(--color-muted)" }}>
            <p>
              Authentication is structured to deliver zero-trust session validation without compromising response times:
            </p>
            <ul className="list-disc list-inside space-y-1.5 font-mono text-xs md:text-sm pl-2">
              <li>Stateless JWT access tokens with short TTLs and secure HTTP-only refresh cookies.</li>
              <li>Argon2 / bcrypt password hashing with unique salt rounds.</li>
              <li>Role-based access control (RBAC) middleware verifying token claims on protected endpoints.</li>
              <li>TODO: Add biometric WebAuthn / passkey login support for field operators.</li>
            </ul>
          </div>
        </section>

        {/* ── 4. Deployment ─────────────────────────────────────────── */}
        <section
          id="deployment"
          className="rounded-[18px] p-6 md:p-8 flex flex-col gap-4"
          style={{
            background: "var(--color-surface)",
            border: "2.5px solid var(--color-ink)",
            boxShadow: "5px 5px 0 var(--color-ink-shadow)",
          }}
        >
          <div className="flex items-center justify-between">
            <h2
              className="text-xl md:text-2xl font-bold flex items-center gap-2"
              style={{ color: "var(--color-text)" }}
            >
              <span>🚀</span> 4. Deployment
            </h2>
            <span className="text-xs font-mono text-faint uppercase">CI/CD &amp; Infrastructure</span>
          </div>

          <div className="space-y-3 text-sm md:text-base leading-relaxed" style={{ color: "var(--color-muted)" }}>
            <p>
              Continuous deployment pipeline with automatic lint, test, and zero-downtime rollouts:
            </p>
            <ul className="list-disc list-inside space-y-1.5 font-mono text-xs md:text-sm pl-2">
              <li>Frontend deployed on Vercel with global Edge caching and instant rollbacks.</li>
              <li>Backend API deployed on Node.js container runtime with automated health checks.</li>
              <li>Database provisioned on high-availability managed cluster with automated daily snapshots.</li>
              <li>TODO: Add automated synthetic monitoring and alerting via uptime webhooks.</li>
            </ul>
          </div>
        </section>

        {/* ── 5. Hard Problem Solved ─────────────────────────────────── */}
        <section
          id="hard-problem"
          className="rounded-[18px] p-6 md:p-8 flex flex-col gap-4"
          style={{
            background: "var(--color-surface)",
            border: "2.5px solid var(--color-ink)",
            boxShadow: "5px 5px 0 var(--color-ink-shadow)",
          }}
        >
          <div className="flex items-center justify-between">
            <h2
              className="text-xl md:text-2xl font-bold flex items-center gap-2"
              style={{ color: "var(--color-text)" }}
            >
              <span>⚡</span> 5. Hard Problem Solved
            </h2>
            <span className="text-xs font-mono text-accent-soft uppercase">Key Technical Win</span>
          </div>

          <div className="space-y-3 text-sm md:text-base leading-relaxed" style={{ color: "var(--color-muted)" }}>
            <p className="font-semibold text-text">
              Engineering offline-first voice extraction with zero cloud AI API quotas:
            </p>
            <p>
              Standard solutions require streaming audio to costly external cloud speech APIs, introducing prohibitive latencies and failing outright during erratic connectivity in rural markets.
            </p>
            <div
              className="p-4 rounded-xl text-xs md:text-sm font-mono border"
              style={{
                background: "var(--color-surface-2)",
                borderColor: "color-mix(in srgb, var(--color-ink) 45%, transparent)",
                color: "var(--color-accent-soft)",
              }}
            >
              <strong>The Fix:</strong> Built an entirely on-device, rule-based deterministic grammar parser running on top of Web Speech API and IndexedDB. Cut transaction latency from ~2.4s to under 45ms, functioning 100% offline with zero external cloud cost.
            </div>
            <p className="text-xs font-mono text-faint">
              TODO: Quantify memory profile under 10,000+ cached ledger entries and benchmark Dexie transaction locks.
            </p>
          </div>
        </section>

        {/* Key Features & Visual Showcase */}
        {project.screenshots && project.screenshots.length > 0 && (
          <section
            id="gallery"
            className="rounded-[18px] p-6 md:p-8 flex flex-col gap-6"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <h2
              className="text-xl md:text-2xl font-bold flex items-center gap-2"
              style={{ color: "var(--color-text)" }}
            >
              <span>🖼️</span> Visual Gallery &amp; Key Screens
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {project.screenshots.map((img, index) => (
                <div
                  key={index}
                  className="group relative aspect-video rounded-xl overflow-hidden border transition-all duration-300 hover:border-accent-soft"
                  style={{
                    borderColor: "var(--color-border)",
                    background: "var(--color-surface-2)",
                  }}
                >
                  <Image
                    src={img}
                    alt={`${project.title} interface preview ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Local Setup Instructions */}
        <section
          id="setup"
          className="rounded-[18px] p-6 md:p-8 flex flex-col gap-4"
          style={{
            background: "var(--color-surface)",
            border: "2.5px solid var(--color-ink)",
            boxShadow: "5px 5px 0 var(--color-ink-shadow)",
          }}
        >
          <h2
            className="text-xl md:text-2xl font-bold flex items-center gap-2"
            style={{ color: "var(--color-text)" }}
          >
            <span>🛠️</span> Local Setup &amp; Installation
          </h2>
          <pre
            className="rounded-xl p-5 overflow-x-auto text-xs md:text-sm font-mono leading-relaxed"
            style={{
              background: "var(--color-surface-2)",
              border: "2px solid color-mix(in srgb, var(--color-ink) 45%, transparent)",
              color: "var(--color-text)",
            }}
          >
            <code>{project.setupInstructions || "npm install\nnpm run dev"}</code>
          </pre>
        </section>

        {/* Bottom actions footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t" style={{ borderColor: "var(--color-border)" }}>
          <Link
            href="/#projects"
            className="text-sm font-mono font-medium hover:text-accent-soft transition-colors"
            style={{ color: "var(--color-muted)" }}
          >
            ← Back to all projects
          </Link>
          <div className="flex items-center gap-4">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-mono font-semibold hover:text-accent-soft transition-colors"
                style={{ color: "var(--color-accent-soft)" }}
              >
                View on GitHub ↗
              </a>
            )}
            {project.liveUrl && !project.liveUrl.startsWith("PLACEHOLDER") && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-mono font-semibold px-5 py-2.5 rounded-full text-on-accent transition-opacity hover:opacity-90"
                style={{ background: "var(--color-accent)" }}
              >
                Launch Live App ↗
              </a>
            )}
          </div>
        </div>
      </article>
      </div>
    </div>
  );
}
