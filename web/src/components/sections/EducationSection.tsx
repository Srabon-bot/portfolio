/*
 * EducationSection — "Education & Achievements"
 *
 * Merged single section:
 * - Education: verified academic history at UITS.
 * - Achievements sub-block (KAIST program + award): placeholder fields
 *   flagged with TODO. Hidden completely while any field is "TODO" so no
 *   placeholders appear on the live site.
 *
 * Server Component (no "use client") — content is visible without JS.
 */

import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";

interface AchievementsData {
  programName: string;
  dates: string;
  awardName: string;
}

/*
 * TODO: Replace placeholders with verified facts from user.
 * Do not write any unverified text. Never use "Intern", "Developer", or "employed".
 */
const achievements: AchievementsData = {
  programName: "TODO",
  dates: "TODO",
  awardName: "TODO",
};

/* Hide sub-block entirely while any field is still "TODO" or empty */
const hasValidAchievements = Boolean(
  achievements.programName &&
  achievements.programName !== "TODO" &&
  achievements.dates &&
  achievements.dates !== "TODO" &&
  achievements.awardName &&
  achievements.awardName !== "TODO"
);

export function EducationSection() {
  return (
    <section
      id="education"
      aria-labelledby="education-heading"
      className="py-12 sm:py-16 lg:py-24"
      style={{ scrollMarginTop: "4.5rem" }}
    >
      <Container>
        <SectionHeading
          title="Education &amp; Achievements"
          index="04"
          kicker="Credentials"
          subtitle="Academic background and honors"
          id="education-heading"
        />

        <div
          className={`grid grid-cols-1 ${
            hasValidAchievements ? "lg:grid-cols-2" : "max-w-3xl"
          } gap-5`}
        >
          {/* ── Education Card ─────────────────────────────────────── */}
          <div
            className="rounded-[10px] paper-shadow p-5 md:p-8 transition-all duration-300 hover:border-accent/40"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            {/* Top row: icon + institution meta */}
            <div className="flex items-start gap-4 md:gap-5">
              <div
                aria-hidden="true"
                className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center mt-0.5"
                style={{
                  background: "color-mix(in srgb, var(--color-accent) 12%, transparent)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-accent-soft)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-label="Graduation cap"
                >
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3.33 2 8.67 2 12 0v-5" />
                </svg>
              </div>

              {/* Main content block */}
              <div className="flex flex-col gap-3 flex-1 min-w-0">
                {/* Degree title + In Progress badge */}
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3
                    className="text-base md:text-lg font-bold leading-snug"
                    style={{ color: "var(--color-text)" }}
                  >
                    Bachelor of Science in Computer Science &amp; Engineering
                  </h3>

                  {/* "In Progress" status chip */}
                  <span
                    className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{
                      background: "color-mix(in srgb, var(--color-accent) 12%, transparent)",
                      color: "var(--color-accent-soft)",
                      border: "1px solid color-mix(in srgb, var(--color-accent) 30%, transparent)",
                    }}
                  >
                    <span className="relative flex h-1.5 w-1.5">
                      <span
                        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                        style={{ background: "var(--color-accent-soft)" }}
                      />
                      <span
                        className="relative inline-flex rounded-full h-1.5 w-1.5"
                        style={{ background: "var(--color-accent-soft)" }}
                      />
                    </span>
                    In Progress
                  </span>
                </div>

                {/* Institution & location */}
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--color-muted)" }}
                >
                  University of Information Technology &amp; Sciences (UITS)
                  <span className="mx-1.5 opacity-40" aria-hidden="true">
                    &middot;
                  </span>
                  Dhaka, Bangladesh
                </p>

                {/* Timeline row */}
                <div className="flex items-center gap-2">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-faint)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span className="text-xs" style={{ color: "var(--color-faint)" }}>
                    March&nbsp;2023 &mdash; January&nbsp;2027&nbsp;(Expected)
                  </span>
                </div>

                {/* Supporting sentence */}
                <p
                  className="text-xs md:text-sm leading-relaxed mt-0.5"
                  style={{ color: "var(--color-muted)" }}
                >
                  Currently completing my final semester, building a foundation
                  in software engineering, full-stack development, and machine
                  learning.
                </p>
              </div>
            </div>
          </div>

          {/* ── Achievements Sub-block (Hidden while any field is TODO) ── */}
          {hasValidAchievements && (
            <div
              className="rounded-[10px] paper-shadow p-5 md:p-8 transition-all duration-300 hover:border-accent/40"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div className="flex items-start gap-4 md:gap-5">
                <div
                  aria-hidden="true"
                  className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center mt-0.5"
                  style={{
                    background: "color-mix(in srgb, var(--color-accent) 12%, transparent)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-accent-soft)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-label="Award medal"
                  >
                    <circle cx="12" cy="8" r="6" />
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                  </svg>
                </div>

                <div className="flex flex-col gap-3 flex-1 min-w-0">
                  <h3
                    className="text-base md:text-lg font-bold leading-snug"
                    style={{ color: "var(--color-text)" }}
                  >
                    {achievements.awardName}
                  </h3>
                  <p className="text-sm font-medium" style={{ color: "var(--color-muted)" }}>
                    {achievements.programName}
                  </p>
                  <p className="text-xs" style={{ color: "var(--color-faint)" }}>
                    {achievements.dates}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
