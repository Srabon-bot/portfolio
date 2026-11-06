/*
 * EducationSection — "Education & Achievements" (04 — Credentials)
 *
 * Data-driven (Part 10): cards come from `getEducation()` via page.tsx —
 * editable in the admin console, seed-fallback preserved offline.
 * Achievements render inline per card; no invented content anywhere:
 * strings admin-authored, achievements list empty-safe.
 *
 * Server Component (no "use client") — content is visible without JS.
 */

import type { Education } from "@/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";

interface EducationSectionProps {
  education: Education[];
}

export function EducationSection({ education }: EducationSectionProps) {
  return (
    <section
      id="education"
      aria-labelledby="education-heading"
      className="section-pad"
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
            education.length > 1 ? "lg:grid-cols-2" : "max-w-3xl"
          } gap-5`}
        >
          {education.map((card) => (
            <article
              key={card._id}
              className="rounded-card p-5 md:p-8 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "var(--color-surface)",
                border: "2.5px solid var(--color-ink)",
                boxShadow: "5px 5px 0 var(--color-ink-shadow)",
              }}
            >
              {/* Top row: icon + content */}
              <div className="flex items-start gap-4 md:gap-5">
                <div
                  aria-hidden="true"
                  className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center mt-0.5"
                  style={{
                    background: "var(--color-sky)",
                    border: "2.5px solid var(--color-ink)",
                    boxShadow: "2.5px 2.5px 0 var(--color-ink-shadow)",
                  }}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-ink)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3.33 2 8.67 2 12 0v-5" />
                  </svg>
                </div>

                <div className="flex flex-col gap-3 flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3
                      className="text-base md:text-lg font-bold leading-snug"
                      style={{ color: "var(--color-text)" }}
                    >
                      {card.degree}
                    </h3>

                    {/* "In Progress" chip only while no end period stated */}
                    {!card.period.toLowerCase().includes("completed") && (
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full flex-shrink-0 text-text"
                        style={{
                          background: "var(--color-mint)",
                          border: "2px solid var(--color-ink)",
                          boxShadow: "2px 2px 0 var(--color-ink-shadow)",
                        }}
                      >
                        <span className="relative flex h-1.5 w-1.5">
                          <span
                            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                            style={{ background: "var(--color-success)" }}
                          />
                          <span
                            className="relative inline-flex rounded-full h-1.5 w-1.5"
                            style={{ background: "var(--color-success)" }}
                          />
                        </span>
                        In Progress
                      </span>
                    )}
                  </div>

                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {card.institution}
                    {card.location && (
                      <>
                        <span
                          className="mx-1.5 opacity-40"
                          aria-hidden="true"
                        >
                          &middot;
                        </span>
                        {card.location}
                      </>
                    )}
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
                    <span
                      className="text-xs"
                      style={{ color: "var(--color-faint)" }}
                    >
                      {card.period}
                    </span>
                  </div>

                  {card.description && (
                    <p
                      className="text-xs md:text-sm leading-relaxed mt-0.5"
                      style={{ color: "var(--color-muted)" }}
                    >
                      {card.description}
                    </p>
                  )}

                  {/* Achievements — clay-dot listed, bold, never empty-visible */}
                  {card.achievements.length > 0 && (
                    <ul
                      className="flex flex-col gap-1.5 mt-1"
                      aria-label="Achievements"
                    >
                      {card.achievements.map((a, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xs font-semibold"
                          style={{ color: "var(--color-muted)" }}
                        >
                          <span
                            aria-hidden="true"
                            className="inline-block w-2.5 h-2.5 flex-shrink-0 mt-0.5 rounded-full"
                            style={{
                              background: "var(--color-peach)",
                              border: "1.5px solid var(--color-ink)",
                            }}
                          />
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
