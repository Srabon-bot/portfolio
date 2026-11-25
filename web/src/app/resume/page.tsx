import type { Metadata } from "next";
import Link from "next/link";
import { getProfile } from "@/lib/api";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export const metadata: Metadata = {
  title: "Resume — Md. Shahriar Hossain Srabon | Junior Full-Stack Developer",
  description:
    "Curriculum Vitae of Md. Shahriar Hossain Srabon, final-semester CSE student and MERN full-stack developer in Dhaka, Bangladesh.",
};

/*
 * /resume — HTML preview of the CV with a prominent download button.
 *
 * The page mirrors the downloadable PDF (v4) section for section.
 * Download priority:
 *  1. Cloudinary URL uploaded via admin (set in profile.resumeUrl)
 *  2. Static PDF in /public (works on Vercel, no backend needed)
 */

const PHONE = "+880 1995-544201";

const SKILL_GROUPS = [
  {
    label: "Languages",
    skills: "JavaScript, TypeScript, Python, SQL, C, C++",
  },
  {
    label: "Frontend",
    skills:
      "React, Next.js, HTML5, CSS3, Tailwind CSS, shadcn/ui, DaisyUI, Responsive Design",
  },
  {
    label: "Backend",
    skills:
      "Node.js, Express, REST APIs, API Integration, JWT Authentication and Authorization, Better Auth, Stripe",
  },
  {
    label: "Database",
    skills: "MongoDB, PostgreSQL (Neon), Firebase, IndexedDB (Dexie)",
  },
  {
    label: "Deployment & Tools",
    skills: "Vercel, Render, Git, GitHub, VS Code, Linux",
  },
  {
    label: "Interpersonal",
    skills: "Teamwork, Communication, Problem Solving, Leadership",
  },
];

const PROJECTS = [
  {
    title: "Haal Khata",
    meta: "Grand Prize Winner",
    summary:
      "Offline-first, voice-first digital ledger for Bangladeshi neighborhood shopkeepers who record credit (baki) sales by speaking.",
    stack:
      "React 19, TypeScript, Vite, Tailwind CSS, Dexie (IndexedDB), PostgreSQL (Neon), Vercel Edge Functions",
    bullets: [
      "Speak a sale in Bangla, English or Korean, and the app records the customer, item, amount and cash or credit.",
      "Works without internet, using an on-device voice parser.",
      "Email or Google sign-in, with the ledger syncing across devices.",
    ],
    links: [
      { label: "Live", href: "https://haal-khata.vercel.app" },
      { label: "GitHub", href: "https://github.com/Srabon-bot/kaist-haalkhata" },
    ],
  },
  {
    title: "Yardclub",
    meta: "Two-sided equipment rental marketplace",
    summary:
      "Two-sided equipment rental marketplace for Dhaka and Chattogram, covering machinery, cinema gear, vehicles and event infrastructure.",
    stack:
      "Next.js 16, React 19, TypeScript, Tailwind CSS, Better Auth, Express, MongoDB, Stripe",
    bullets: [
      "Search and filter equipment across six categories and check availability.",
      "Book and pay online with Stripe Checkout.",
      "Owners list equipment, approve bookings and track earnings.",
      "Three role-based dashboards for customers, owners and admins.",
    ],
    links: [
      { label: "Live", href: "https://yardclub-client.vercel.app" },
      { label: "Client", href: "https://github.com/Srabon-bot/yard-club-client" },
      { label: "Server", href: "https://github.com/Srabon-bot/yard-club-server" },
    ],
  },
  {
    title: "Shomaj Shathi",
    meta: "Civic events platform",
    summary:
      "Civic events platform for organizing and joining community service work in Dhaka.",
    stack:
      "Next.js 16, TypeScript, Tailwind CSS, shadcn/ui, Better Auth, JWT, Express, MongoDB",
    bullets: [
      "Create, find and join cleanups, plantations, donation drives and education circles.",
      "Track your participation history.",
      "Email, Google or GitHub sign-in with protected member pages.",
      "Responsive layout with light and dark themes.",
    ],
    links: [
      { label: "Live", href: "https://shomajshathi-app.vercel.app" },
      { label: "Client", href: "https://github.com/Srabon-bot/ShomajShathi-app" },
      { label: "Server", href: "https://github.com/Srabon-bot/ShomajShathi-server" },
    ],
  },
  {
    title: "BazarDor",
    meta: "Commodity price tracker",
    summary:
      "Responsive grocery and commodity price tracker for Bangladesh with a Bangla interface.",
    stack:
      "Next.js, React 19, TypeScript, MongoDB, Better Auth, Tailwind CSS, DaisyUI",
    bullets: [
      "Daily price ticker with risers and fallers.",
      "Category-wise price pages with sorting that treats prices as real numbers.",
      "Sign-in with email, Google or GitHub to open product pages with a market-by-market price comparison.",
    ],
    links: [
      { label: "Live", href: "https://assignment-7-kw2m.vercel.app" },
      { label: "GitHub", href: "https://github.com/Srabon-bot/BazarDor" },
    ],
  },
];

export default async function ResumePage() {
  const profile = await getProfile();

  const downloadUrl =
    profile.resumeUrl && !profile.resumeUrl.startsWith("PLACEHOLDER")
      ? profile.resumeUrl
      : "/Shahriar_Hossain_Srabon_Resume.pdf";

  const downloadFilename = "Md_Shahriar_Hossain_Srabon_Resume.pdf";

  return (
    <div className="min-h-screen py-12 px-4 md:px-8" style={{ backgroundColor: "var(--color-bg)" }}>

      {/* ── Top bar: back link + theme + download buttons ─────────── */}
      <div
        className="max-w-4xl mx-auto flex items-center justify-between mb-8 pb-4 border-b"
        style={{ borderColor: "var(--color-border)" }}
      >
        <Link
          href="/"
          className="text-sm font-medium hover:text-accent-soft transition-colors flex items-center gap-1.5"
          style={{ color: "var(--color-muted)" }}
        >
          Back to Portfolio
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href="/Shahriar_Hossain_Srabon_Resume.docx"
            download="Md_Shahriar_Hossain_Srabon_Resume.docx"
            className="text-xs font-bold hover:text-text transition-colors underline"
            style={{ color: "var(--color-muted)" }}
            title="Download Word (.docx) format"
          >
            DOCX format
          </a>
          <a
            href={downloadUrl}
            download={downloadFilename}
            className="clay-btn clay-btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm"
          >
            {/* Download icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download PDF
          </a>
        </div>
      </div>

      {/* ── Letterhead sheet — clay paper ───────────────────────────── */}
      <main
        className="max-w-4xl mx-auto rounded-card p-8 md:p-14 flex flex-col gap-10"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "2.5px solid var(--color-ink)",
          boxShadow: "6px 6px 0 var(--color-ink-shadow)",
        }}
      >

        {/* ── Header: name + contact ──────────────────────────── */}
        <div
          className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-8 border-b"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-text">
              Md. Shahriar Hossain Srabon
            </h1>
            <p className="text-lg font-semibold" style={{ color: "var(--color-accent-soft)" }}>
              Junior Full-Stack Developer (MERN)
            </p>
          </div>

          <div className="flex flex-col gap-2 text-xs md:text-sm md:text-right" style={{ color: "var(--color-muted)" }}>
            <p>📍 {profile.location}</p>
            <p>
              📞{" "}
              <a href={`tel:${PHONE.replace(/[^+\d]/g, "")}`} className="hover:text-accent-soft transition-colors underline">
                {PHONE}
              </a>
            </p>
            <p>
              ✉️{" "}
              <a href={`mailto:${profile.email}`} className="hover:text-accent-soft transition-colors underline">
                {profile.email}
              </a>
            </p>
            <p>
              💻{" "}
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="hover:text-accent-soft transition-colors underline">
                github.com/Srabon-bot
              </a>
            </p>
            <p>
              🔗{" "}
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-accent-soft transition-colors underline">
                LinkedIn Profile
              </a>
            </p>
          </div>
        </div>

        {/* ── 1. Career Objective ──────────────────────────────── */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-bold uppercase tracking-widest text-accent-soft flex items-center gap-2">
            <span>🎯</span> Career Objective
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
            Final-semester CSE student at UITS who builds and deploys full-stack web apps with
            React, Next.js, Node.js, Express and MongoDB. Grand Prize winner at the KAIST Student
            Volunteer Team x UITS WFK IT Online Training Program. Seeking a junior or intern
            full-stack developer role where I can ship production features and grow into a strong
            MERN engineer.
          </p>
        </section>

        {/* ── 2. Technical Skills ──────────────────────────────── */}
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-accent-soft flex items-center gap-2">
            <span>🛠️</span> Technical Skills
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {SKILL_GROUPS.map(({ label, skills }) => (
              <div
                key={label}
                className="p-3.5 rounded-xl flex flex-col gap-1"
                style={{ background: "var(--color-surface-2)" }}
              >
                <span className="text-xs font-semibold uppercase" style={{ color: "var(--color-faint)" }}>{label}</span>
                <p className="text-text font-medium">{skills}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. Projects ──────────────────────────────────────── */}
        <section className="flex flex-col gap-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-accent-soft flex items-center gap-2">
            <span>💼</span> Projects
          </h2>

          {PROJECTS.map((project, index) => (
            <div
              key={project.title}
              className={index === 0 ? "flex flex-col gap-1.5" : "flex flex-col gap-1.5 pt-4 border-t"}
              style={index === 0 ? undefined : { borderColor: "var(--color-border)" }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-text">{project.title}</h3>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{
                      background: "color-mix(in srgb, var(--color-accent) 12%, transparent)",
                      color: "var(--color-accent-soft)",
                      border: "1px solid color-mix(in srgb, var(--color-accent) 30%, transparent)",
                    }}
                  >
                    {project.meta}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {project.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold hover:underline"
                      style={{ color: "var(--color-accent-soft)" }}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
              <p className="text-xs md:text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
                {project.summary}
              </p>
              <p className="text-xs" style={{ color: "var(--color-faint)" }}>
                Tech: {project.stack}
              </p>
              <ul className="list-disc list-inside text-xs md:text-sm flex flex-col gap-1 mt-1" style={{ color: "var(--color-muted)" }}>
                {project.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* ── 4. Education ─────────────────────────────────────── */}
        <section
          className="flex flex-col gap-4 pt-6 border-t"
          style={{ borderColor: "var(--color-border)" }}
        >
          <h2 className="text-sm font-bold uppercase tracking-widest text-accent-soft flex items-center gap-2">
            <span>🎓</span> Education
          </h2>
          <div className="flex flex-col gap-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h3 className="text-base font-bold text-text">
                B.Sc. in Computer Science and Engineering
              </h3>
              <span
                className="text-xs px-2.5 py-0.5 rounded-full self-start sm:self-auto"
                style={{
                  background: "color-mix(in srgb, var(--color-accent) 12%, transparent)",
                  color: "var(--color-accent-soft)",
                  border: "1px solid color-mix(in srgb, var(--color-accent) 30%, transparent)",
                }}
              >
                CGPA 3.69 / 4.00 · Current
              </span>
            </div>
            <p className="text-sm" style={{ color: "var(--color-muted)" }}>
              University of Information Technology and Sciences (UITS), Dhaka
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-faint)" }}>
              March 2023 to January 2027 (Expected)
            </p>
          </div>
        </section>

        {/* ── 5. Extra-Curricular Activities ───────────────────── */}
        <section
          className="flex flex-col gap-3 pt-6 border-t"
          style={{ borderColor: "var(--color-border)" }}
        >
          <h2 className="text-sm font-bold uppercase tracking-widest text-accent-soft flex items-center gap-2">
            <span>🏅</span> Extra-Curricular Activities
          </h2>
          <ul className="list-disc list-inside text-xs md:text-sm flex flex-col gap-1" style={{ color: "var(--color-muted)" }}>
            <li>
              Grand Prize Winner, 2026 KAIST Student Volunteer Team x UITS WFK IT Online Training
              Program project competition (Haal Khata).
            </li>
          </ul>
        </section>

        {/* ── 6. Languages ─────────────────────────────────────── */}
        <section
          className="flex flex-col gap-3 pt-6 border-t"
          style={{ borderColor: "var(--color-border)" }}
        >
          <h2 className="text-sm font-bold uppercase tracking-widest text-accent-soft flex items-center gap-2">
            <span>🌐</span> Languages
          </h2>
          <p className="text-sm" style={{ color: "var(--color-muted)" }}>
            Bangla (Native) &nbsp;|&nbsp; English (Professional) &nbsp;|&nbsp; Hindi (Conversational)
          </p>
        </section>

      </main>
    </div>
  );
}
