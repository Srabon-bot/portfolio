/*
 * AboutSection — "README-style card" with photo, currently list, and paragraphs.
 *
 * PRD §6.3: "photo, short 'currently' list (Building, Learning, Fun fact),
 * 2-3 short paragraphs. Include a line about building culturally rooted
 * tech with local impact."
 *
 * Responsive layout (Part B):
 * - Bio text column limited to about 65ch
 * - "Currently" block sits beside bio on lg+, below it on <lg
 * - Section padding: py-12 sm:py-16 lg:py-24
 *
 * This is a Server Component (no "use client") so the content is fully
 * rendered on the server and visible without JavaScript.
 */

import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import type { Profile } from "@/types";

interface AboutSectionProps {
  profile: Profile;
}

export function AboutSection({ profile }: AboutSectionProps) {
  const { currently, aboutParagraphs } = profile;

  /*
   * Editorial spread: the first paragraph becomes the serif pull-quote
   * (ink, large), the rest stay as relaxed body copy. Same content —
   * presentation only.
   */
  const leadParagraph = aboutParagraphs[0];
  const bodyParagraphs = aboutParagraphs.slice(1);

  /* The "currently" list items */
  const currentlyItems = [
    { icon: "🔨", label: "Building", value: currently.building },
    { icon: "📚", label: "Learning", value: currently.learning },
    {
      icon: "⚡",
      label: "Fun fact",
      value: currently.funFact,
      /* Flag PLACEHOLDER values so they are never left in by accident */
      isPlaceholder: currently.funFact.startsWith("PLACEHOLDER"),
    },
  ];

  return (
    <section
      id="about"
      aria-label="About Srabon"
      className="section-pad"
      style={{ scrollMarginTop: "4.5rem" }}
    >
      <Container>
        <SectionHeading
          title="About Me"
          index="03"
          kicker="The Story"
          subtitle="The story behind the code"
          id="about-heading"
        />

        {/* Card wrapper — README-style clay spread, matches PRD §5.4 Card spec */}
        <div
          className="rounded-card p-5 md:p-8 flex flex-col lg:flex-row items-start"
          style={{
            background: "var(--color-surface)",
            border: "2.5px solid var(--color-ink)",
            boxShadow: "6px 6px 0 var(--color-ink)",
            gap: "clamp(2.5rem, 1.5rem + 2.6vw, 4rem)",
          }}
        >
          {/* ── Main text column: bio paragraphs (limited to ~65ch) ─── */}
          <div className="flex flex-col min-w-0" style={{ gap: "var(--space-block)", flex: 1, maxWidth: "65ch", width: "100%" }}>
            {leadParagraph && (
              <p
                className="text-lg md:text-xl font-semibold leading-snug text-text"
                style={{ fontFamily: "var(--font-fredoka), var(--font-nunito), sans-serif", overflowWrap: "anywhere" }}
              >
                {leadParagraph}
              </p>
            )}

            <div aria-hidden="true" className="rule-gold" />

            {bodyParagraphs.map((para, i) => (
              <p
                key={i}
                className="text-sm md:text-base leading-relaxed break-words"
                style={{ color: "var(--color-muted)", overflowWrap: "anywhere" }}
              >
                {para}
              </p>
            ))}

            {/* "How this site is built" panel — PRD §17.5 */}
            <div
              className="mt-4 rounded-2xl p-4"
              style={{
                background: "var(--color-lavender)",
                border: "2px solid var(--color-ink)",
              }}
            >
              <h3 className="text-xs font-extrabold uppercase tracking-wider mb-3" style={{ color: "var(--color-text)" }}>
                How this site is built
              </h3>
              <div className="flex flex-wrap gap-2 text-xs" style={{ color: "var(--color-muted)" }}>
                {[
                  "Next.js (Vercel)",
                  "Express REST API (Render)",
                  "MongoDB Atlas",
                  "JWT admin auth",
                  "Cloudinary uploads",
                  "GitHub import",
                ].map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-full font-semibold"
                    style={{
                      background: "var(--color-surface)",
                      border: "2px solid color-mix(in srgb, var(--color-ink) 45%, transparent)",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <p className="text-xs mt-3 leading-relaxed font-semibold" style={{ color: "var(--color-muted)" }}>
                This portfolio is itself a MERN full-stack project. The admin dashboard,
                GitHub import, contact form, and resume upload are all live features.
              </p>
            </div>
          </div>

          {/* ── Side block: Currently status card (beside on lg, below on <lg) ─── */}
          <div className="flex flex-col gap-6 w-full lg:w-72 flex-shrink-0">
            {/* Status badge card */}
            <div
              className="rounded-2xl p-4 flex items-center gap-3"
              style={{
                background: "var(--color-mint)",
                border: "2.5px solid var(--color-ink)",
                boxShadow: "4px 4px 0 var(--color-ink)",
              }}
            >
              <span className="relative flex h-3 w-3">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ background: "var(--color-success)" }}
                />
                <span
                  className="relative inline-flex rounded-full h-3 w-3"
                  style={{ background: "var(--color-success)" }}
                />
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-extrabold" style={{ color: "var(--color-text)" }}>
                  Final-Semester CSE
                </span>
                <span className="text-xs font-semibold" style={{ color: "var(--color-muted)" }}>
                  UITS, Dhaka • Open to roles
                </span>
              </div>
            </div>

            {/* Currently list */}
            <div
              className="rounded-2xl p-5 flex flex-col gap-4"
              style={{
                background: "var(--color-surface)",
                border: "2.5px solid var(--color-ink)",
                boxShadow: "4px 4px 0 var(--color-ink)",
              }}
            >
              <h3
                className="self-start px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider text-text"
                style={{
                  background: "var(--color-sky)",
                  border: "2px solid var(--color-ink)",
                }}
              >
                Currently
              </h3>
              <ul className="flex flex-col gap-3.5">
                {currentlyItems.map((item) => (
                  <li key={item.label} className="flex items-start gap-2.5">
                    <span className="text-base mt-0.5" aria-hidden="true">{item.icon}</span>
                    <div className="min-w-0">
                      <span className="text-xs font-semibold block" style={{ color: "var(--color-muted)" }}>
                        {item.label}
                      </span>
                      <span
                        className="text-xs leading-relaxed break-words"
                        style={{
                          color: item.isPlaceholder ? "var(--color-faint)" : "var(--color-text)",
                          fontStyle: item.isPlaceholder ? "italic" : "normal",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {item.value}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
