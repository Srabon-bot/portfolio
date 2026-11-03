import type { Metadata } from "next";
import Link from "next/link";
import { getProfile } from "@/lib/api";

export const metadata: Metadata = {
  title: "Resume — Shahriar Hossain Srabon | Full-Stack Developer",
  description:
    "Curriculum Vitae of Shahriar Hossain Srabon, final-semester CSE student and MERN full-stack developer in Dhaka, Bangladesh.",
};

/*
 * /resume — HTML preview of the CV with a prominent download button.
 *
 * Download: the .docx file is served directly from /public so it works
 * on Vercel with zero backend dependency. When the Express API is live
 * and a resumeUrl is set via Cloudinary, that URL takes precedence.
 *
 * PRD §6: "Resume: one-click download of an up-to-date PDF."
 */
export default async function ResumePage() {
  const profile = await getProfile();

  /*
   * Download URL priority:
   *  1. Cloudinary URL uploaded via admin (set in profile.resumeUrl)
   *  2. Static .docx in /public (works on Vercel, no backend needed)
   */
  const downloadUrl =
    profile.resumeUrl && !profile.resumeUrl.startsWith("PLACEHOLDER")
      ? profile.resumeUrl
      : "/Shahriar_Hossain_Srabon_Resume.pdf";

  const downloadFilename = "Shahriar_Hossain_Srabon_Resume.pdf";

  return (
    <div className="min-h-screen py-12 px-4 md:px-8" style={{ background: "var(--color-bg)" }}>

      {/* ── Top bar: back link + download button ───────────────── */}
      <div
        className="max-w-4xl mx-auto flex items-center justify-between mb-8 pb-4 border-b"
        style={{ borderColor: "var(--color-border)" }}
      >
        <Link
          href="/"
          className="text-sm font-medium hover:text-accent-soft transition-colors flex items-center gap-1.5"
          style={{ color: "var(--color-muted)" }}
        >
          ← Back to Portfolio
        </Link>

        <div className="flex items-center gap-4">
          <a
            href="/Shahriar_Hossain_Srabon_Resume.docx"
            download="Shahriar_Hossain_Srabon_Resume.docx"
            className="text-xs font-medium hover:text-white transition-colors underline"
            style={{ color: "var(--color-muted)" }}
            title="Download Word (.docx) format"
          >
            DOCX format
          </a>
          <a
            href={downloadUrl}
            download={downloadFilename}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
            style={{ background: "var(--color-accent)" }}
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

      {/* ── CV Card ────────────────────────────────────────────── */}
      <main
        className="max-w-4xl mx-auto rounded-2xl p-8 md:p-14 shadow-2xl border flex flex-col gap-10"
        style={{
          background: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >

        {/* ── Header: name + contact ──────────────────────────── */}
        <div
          className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-8 border-b"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Shahriar Hossain Srabon
            </h1>
            <p className="text-lg font-semibold" style={{ color: "var(--color-accent-soft)" }}>
              Full-Stack Developer (MERN)
            </p>
            <p className="text-sm max-w-md leading-relaxed" style={{ color: "var(--color-muted)" }}>
              {profile.tagline}
            </p>
          </div>

          <div className="flex flex-col gap-2 text-xs md:text-sm md:text-right" style={{ color: "var(--color-muted)" }}>
            <p>📍 {profile.location}</p>
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

        {/* ── 1. Education ─────────────────────────────────────── */}
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-accent-soft flex items-center gap-2">
            <span>🎓</span> Education
          </h2>
          <div className="flex flex-col gap-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h3 className="text-base font-bold text-white">
                B.Sc. in Computer Science &amp; Engineering
              </h3>
              <span
                className="text-xs px-2.5 py-0.5 rounded-full self-start sm:self-auto"
                style={{
                  background: "rgba(245,165,36,0.12)",
                  color: "var(--color-accent-soft)",
                  border: "1px solid rgba(245,165,36,0.3)",
                }}
              >
                In Progress · Final Semester
              </span>
            </div>
            <p className="text-sm" style={{ color: "var(--color-muted)" }}>
              University of Information Technology &amp; Sciences (UITS), Dhaka, Bangladesh
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-faint)" }}>
              March 2023 — January 2027 (Expected)
            </p>
          </div>
        </section>

        {/* ── 2. Honors & Awards ───────────────────────────────── */}
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-accent-soft flex items-center gap-2">
            <span>🏆</span> Honors &amp; Awards
          </h2>
          <div
            className="p-4 rounded-xl flex flex-col gap-1.5"
            style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h3 className="text-base font-bold text-white">
                Grand Prize Winner — KAIST Global Training Program
              </h3>
              <span className="text-xs text-accent-soft font-semibold">🥇 First Place</span>
            </div>
            <p className="text-xs md:text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
              Awarded grand prize for developing <strong>Haal Khata</strong>, a voice-first credit
              ledger for local Bangladeshi shopkeepers supporting Bangla, English, and Korean voice
              inputs with a 100% on-device rule-based NLP engine.
            </p>
          </div>
        </section>

        {/* ── 3. Technical Skills ──────────────────────────────── */}
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-accent-soft flex items-center gap-2">
            <span>🛠️</span> Technical Skills
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {[
              { label: "Frontend",           skills: "React, Next.js, TypeScript, JavaScript, Tailwind CSS, HTML5, CSS3" },
              { label: "Backend (MERN)",     skills: "Node.js, Express, MongoDB, REST APIs, JWT Authentication" },
              { label: "Tools & Deployment", skills: "Git, GitHub, Vercel, Render, Linux, VS Code, Cloudinary" },
              { label: "ML & Data Research", skills: "Python, TensorFlow, PyTorch, scikit-learn, Pandas, NumPy, SQL" },
            ].map(({ label, skills }) => (
              <div
                key={label}
                className="p-3.5 rounded-xl flex flex-col gap-1"
                style={{ background: "var(--color-surface-2)" }}
              >
                <span className="text-xs font-semibold uppercase" style={{ color: "var(--color-faint)" }}>{label}</span>
                <p className="text-white font-medium">{skills}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. Featured Engineering Projects ─────────────────── */}
        <section className="flex flex-col gap-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-accent-soft flex items-center gap-2">
            <span>💼</span> Featured Engineering Projects
          </h2>

          {/* Project 1 — Haal Khata */}
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h3 className="text-base font-bold text-white">
                Haal Khata (হাল খাতা) — Voice-First Digital Ledger
              </h3>
              <a
                href="https://haal-khata.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold hover:underline self-start sm:self-auto"
                style={{ color: "var(--color-accent-soft)" }}
              >
                haal-khata.vercel.app ↗
              </a>
            </div>
            <p className="text-xs" style={{ color: "var(--color-faint)" }}>
              Stack: React 19, TypeScript, Vite, Tailwind CSS, Dexie (IndexedDB), Neon Postgres, Vercel Edge Functions
            </p>
            <ul className="list-disc list-inside text-xs md:text-sm flex flex-col gap-1 mt-1" style={{ color: "var(--color-muted)" }}>
              <li>Grand Prize winner at the KAIST Global Training Program — voice-first ledger for Bangladesh&apos;s neighborhood shopkeepers.</li>
              <li>100% on-device rule-based Bangla/English/Korean NLP extraction with zero external API dependency, works fully offline.</li>
              <li>Multi-device sync via Neon Postgres + Vercel Edge Functions with soft-delete reconciliation.</li>
            </ul>
          </div>

          {/* Project 2 — BazarDor */}
          <div className="flex flex-col gap-1.5 pt-4 border-t" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h3 className="text-base font-bold text-white">
                BazarDor (বাজার দর) — Commodity Price Tracker
              </h3>
              <a
                href="https://assignment-7-kw2m.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold hover:underline self-start sm:self-auto"
                style={{ color: "var(--color-accent-soft)" }}
              >
                Live Demo ↗
              </a>
            </div>
            <p className="text-xs" style={{ color: "var(--color-faint)" }}>
              Stack: Next.js, React 19, TypeScript, MongoDB, Better Auth, Tailwind CSS, DaisyUI
            </p>
            <ul className="list-disc list-inside text-xs md:text-sm flex flex-col gap-1 mt-1" style={{ color: "var(--color-muted)" }}>
              <li>Real-time commodity price tracker for Bangladesh with Bangla calendar, category filters, and market-wide price comparisons.</li>
              <li>Secure multi-provider authentication via Better Auth (email/password, Google, GitHub OAuth).</li>
              <li>Daily price movement analysis showing top risers &amp; fallers across wholesale and retail hubs.</li>
            </ul>
          </div>

          {/* Project 3 — FitLog */}
          <div className="flex flex-col gap-1.5 pt-4 border-t" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h3 className="text-base font-bold text-white">
                FitLog 🏋️ — Workout Library &amp; Session Planner
              </h3>
              <a
                href="https://assignment-6-fit-log-weld.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold hover:underline self-start sm:self-auto"
                style={{ color: "var(--color-accent-soft)" }}
              >
                Live Demo ↗
              </a>
            </div>
            <p className="text-xs" style={{ color: "var(--color-faint)" }}>
              Stack: Next.js 16, React 19, TypeScript, Tailwind CSS, DaisyUI, Lucide React
            </p>
            <ul className="list-disc list-inside text-xs md:text-sm flex flex-col gap-1 mt-1" style={{ color: "var(--color-muted)" }}>
              <li>Exercise library spanning all major muscle groups with difficulty ratings, equipment tags, and step-by-step instructions.</li>
              <li>Live session analytics: real-time total duration and calorie tracking with local storage persistence.</li>
              <li>Capped daily workout planner with instant progress check-offs and a bookmarked &apos;Saved&apos; list.</li>
            </ul>
          </div>

          {/* Project 4 — Yutnori */}
          <div className="flex flex-col gap-1.5 pt-4 border-t" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h3 className="text-base font-bold text-white">
                Yutnori (윷놀이) 3D — Korean Board Game Engine
              </h3>
              <a
                href="https://yutnori-ten.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold hover:underline self-start sm:self-auto"
                style={{ color: "var(--color-accent-soft)" }}
              >
                yutnori-ten.vercel.app ↗
              </a>
            </div>
            <p className="text-xs" style={{ color: "var(--color-faint)" }}>
              Stack: React, React Three Fiber, Three.js, TypeScript, Zustand, Vite, Vitest
            </p>
            <ul className="list-disc list-inside text-xs md:text-sm flex flex-col gap-1 mt-1" style={{ color: "var(--color-muted)" }}>
              <li>Complete traditional rules engine with physics-based 3D yut stick toss and hover-to-preview landing path indicators.</li>
              <li>Heuristic AI opponent with 3 difficulty modes (Easy / Medium / Hard) plus local pass-and-play multiplayer.</li>
              <li>Full trilingual localization (English, Korean 한국어, Bangla বাংলা) with 100% Vitest rule-engine coverage.</li>
            </ul>
          </div>
        </section>

        {/* ── 5. Research & ML ─────────────────────────────────── */}
        <section
          className="flex flex-col gap-3 pt-6 border-t"
          style={{ borderColor: "var(--color-border)" }}
        >
          <h2 className="text-sm font-bold uppercase tracking-widest text-accent-soft flex items-center gap-2">
            <span>🔬</span> Research &amp; Machine Learning
          </h2>
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-bold text-white">
              Deep Learning for River Basin Discharge &amp; Flood Risk Forecasting in Bangladesh
            </h3>
            <p className="text-xs" style={{ color: "var(--color-faint)" }}>
              Research Projects · Python, TensorFlow, scikit-learn, PyTorch, GIS
            </p>
            <p className="text-xs md:text-sm leading-relaxed mt-1" style={{ color: "var(--color-muted)" }}>
              Developed sequence-to-sequence LSTM forecasting models for northern Bangladesh river
              discharge basins and geospatial flood risk classification indices. Published as open
              research repositories on GitHub.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}
