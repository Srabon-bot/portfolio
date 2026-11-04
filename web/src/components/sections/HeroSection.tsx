"use client";

/*
 * HeroSection — the first thing a visitor sees.
 *
 * Layout (PRD §6.2):
 *   Left side: speech-bubble badge "It's me", name (large, tracked),
 *               role label (small caps, accent-soft),
 *               one-line tagline,
 *               Download Resume BlobButton with blob behind it.
 *   Right side: large circular avatar image.
 *
 * On mobile: avatar stacks above the text (flex-col-reverse so avatar
 * appears at the top on small screens — PRD §5.6).
 *
 * PRD NON-NEGOTIABLE: There is exactly ONE CTA button — "Download Resume".
 * There is NO "Let's talk" button. The Contact section is reached via nav.
 */

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Container } from "@/components/ui/Container";
import type { Profile } from "@/types";

interface HeroSectionProps {
  profile: Profile;
}

/* Animation variants for fade-and-rise on mount (subtle, respects reduced-motion) */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: "easeOut" },
  }),
};

/* Core stack chips featured in the hero for recruiters */
const HERO_STACK = ["React", "Next.js", "TypeScript", "Node.js", "MongoDB"];

export function HeroSection({ profile }: HeroSectionProps) {
  const reduceMotion = useReducedMotion();
  return (
    <section
      id="hero"
      aria-label="Introduction"
      className="relative section-pad lg:min-h-[calc(100dvh-3.5rem)] flex items-center"
      style={{ scrollMarginTop: "4.5rem" }}
    >
      <Container>
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 lg:items-center" style={{ gap: "clamp(2rem, 1.3rem + 2.6vw, 3rem)" }}>

        {/* ── Left / Bottom: text content ───────────────────────────── */}
        <div className="flex flex-col" style={{ gap: "var(--space-block)" }}>

          {/* (kicker row + masthead + rule are below) */}

          {/* Kicker row — editorial "issue" marker */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-3 self-start"
          >
            <span className="kicker flex items-center gap-2">
              <span
                aria-hidden="true"
                className="inline-block w-2 h-2 rotate-45 flex-shrink-0"
                style={{ background: "var(--color-accent)" }}
              />
              It&apos;s me
            </span>
            <span
              aria-hidden="true"
              className="inline-block h-px w-10"
              style={{ background: "var(--color-accent)", opacity: 0.5 }}
            />
          </motion.div>

          {/* Name — masthead-scale serif display (Fraunces via h1 rule) */}
          <motion.h1
            custom={0.1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="font-semibold leading-[1.05] text-text"
            style={{
              fontSize: "clamp(2.5rem, 1.4rem + 4.2vw, 4.25rem)",
              letterSpacing: "-0.01em",
            }}
          >
            {profile.displayName}
          </motion.h1>

          {/* Engraved gold hairline under the masthead */}
          <motion.div
            aria-hidden="true"
            custom={0.15}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="rule-gold"
          />

          {/* Role label — small-caps style, accent-soft, tracked (PRD §5.3) */}
          <motion.p
            custom={0.2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="kicker font-semibold"
            style={{ color: "var(--color-accent-soft)", letterSpacing: "0.18em" }}
            aria-label={`Role: ${profile.role}`}
          >
            {/* Show role in upper-case for visual weight; screen reader uses aria-label */}
            {profile.role.toUpperCase()}
          </motion.p>

          {/* Tagline — one-line value statement */}
          <motion.p
            custom={0.3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-base md:text-lg leading-relaxed max-w-md"
            style={{ color: "var(--color-muted)" }}
          >
            {profile.tagline}
          </motion.p>

          {/* Core stack chips in hero */}
          <motion.div
            custom={0.35}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-center gap-2 pt-1"
            aria-label="Core tech stack"
          >
            {HERO_STACK.map((tech) => (
              <Chip key={tech} label={tech} size="sm" />
            ))}
          </motion.div>

          {/* Two CTAs: View projects (primary) + Download resume (secondary) */}
          <motion.div
            custom={0.4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2"
          >
            <Button variant="primary" href="#projects">
              View projects
            </Button>
            <Button variant="secondary" href="/resume.pdf" download>
              <svg
                width="16" height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download resume
            </Button>
          </motion.div>

          {/* Signature block — engraved social monograms, visible on every breakpoint */}
          <motion.nav
            custom={0.45}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            aria-label="Quick social links"
            className="flex items-center gap-1 pt-1"
          >
            <span
              aria-hidden="true"
              className="inline-block w-1.5 h-1.5 flex-shrink-0 mr-2"
              style={{ transform: "rotate(45deg)", background: "var(--color-accent)" }}
            />
            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn (opens in a new tab)"
                className="flex items-center justify-center w-11 h-11 text-faint hover:text-accent-soft transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            )}
            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub (opens in a new tab)"
                className="flex items-center justify-center w-11 h-11 text-faint hover:text-accent-soft transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            )}
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                aria-label={`Email: ${profile.email}`}
                className="flex items-center justify-center w-11 h-11 text-faint hover:text-accent-soft transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <polyline points="2,7 12,13 22,7" />
                </svg>
              </a>
            )}
          </motion.nav>
        </div>

        {/* ── Right / Top: Squared Animated Hero Image ───────────────── */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex justify-center lg:justify-end"
        >
          {/* Outer floating wrapper — levitation only when motion is welcome */}
          <motion.div
            className="relative group cursor-pointer"
            animate={reduceMotion ? undefined : { y: [-7, 7, -7] }}
            transition={
              reduceMotion
                ? undefined
                : {
                    duration: 5.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }
            }
            whileHover={
              reduceMotion ? undefined : {
                scale: 1.025,
                transition: { duration: 0.3, ease: "easeOut" },
              }
            }
          >
            {/* Gradient border frame — squared with sleek modern rounded corners */}
            <div
              className="relative p-[3px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-300"
              style={{
                background:
                  "var(--gradient-frame)",
                boxShadow: "0 20px 40px -15px rgba(13,13,12,0.35)",
              }}
            >
              {/* Inner container holding the squared image */}
              <div
                className="relative rounded-[14px] overflow-hidden"
                style={{
                  width: "clamp(120px, 22vw, 280px)",
                  height: "clamp(120px, 22vw, 280px)",
                  background: "var(--color-surface)",
                }}
              >
                <Image
                  src={profile.avatarUrl ?? "/avatar-placeholder.jpg"}
                  alt={`${profile.displayName}'s photo`}
                  fill
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  priority   /* above-the-fold image — load it eagerly */
                  sizes="(max-width: 1024px) 22vw, 280px"
                />

                {/* Subtle dark gradient overlay at bottom edge for contrast */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"
                  aria-hidden="true"
                />

                {/* Tech corner accents */}
                <div
                  aria-hidden="true"
                  className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-accent/50 rounded-tl-sm pointer-events-none"
                />
                <div
                  aria-hidden="true"
                  className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-accent/50 rounded-br-sm pointer-events-none"
                />
              </div>
            </div>

            {/* Top-left code pill badge */}
            <motion.div
              aria-hidden="true"
              className="absolute -top-3 -left-3 md:-top-3.5 md:-left-3.5 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-lg pointer-events-none"
              style={{
                background: "var(--color-surface-2)",
                border: "1px solid var(--color-border)",
              }}
              animate={{
                y: [0, 3, 0],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: 0.8,
              }}
            >
              <span className="text-xs font-mono font-medium text-accent-soft">
                &lt;dev /&gt;
              </span>
            </motion.div>

            {/* Bottom-right live status badge */}
            <motion.div
              className="absolute -bottom-3 -right-3 md:-bottom-3.5 md:-right-3.5 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xl pointer-events-none"
              style={{
                background: "var(--color-surface-2)",
                border: "1px solid var(--color-border)",
              }}
              animate={{
                y: [0, -3, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: 0.3,
              }}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ background: "var(--color-success)" }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ background: "var(--color-success)" }}
                />
              </span>
              <span className="text-xs font-medium text-text tracking-wide">
                Open to work
              </span>
            </motion.div>
          </motion.div>
        </motion.div>

        </div>
      </Container>
    </section>
  );
}
