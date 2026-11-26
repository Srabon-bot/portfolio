"use client";

/*
 * SectionHeading — the title bar used at the top of every section.
 *
 * Clay Playful treatment:
 * - Optional index chip (ink-outlined white pebble, e.g. "01") above the title
 * - Optional bold uppercase kicker label, e.g. "Selected Work"
 * - Fredoka title (applied globally via the h2 base rule)
 * - Chunky rounded pastel underline bar (playful marker)
 * - Optional subtitle in muted color.
 *
 * Scroll entrance (all five numbered sections share this component):
 * the chip pops with the clay overshoot curve, the text settles upward,
 * and the marker draws itself from the left. Transform/opacity only, once,
 * and fully disabled when the OS asks for reduced motion (Framer Motion
 * does not obey the CSS kill-switch, so the gate lives here too).
 *
 * One IntersectionObserver on the heading element drives all five children;
 * each child owns its own `animate` label so no variant propagation is
 * needed (variant inheritance is easy to break with nested motion nodes).
 */

import { useRef } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { EASE_CLAY, revealViewport } from "@/lib/motion";

interface SectionHeadingProps {
  title: string;
  /** Section number rendered inside the pebble chip, e.g. "01" */
  index?: string;
  /** Bold uppercase label rendered next to the pebble, e.g. "Selected Work" */
  kicker?: string;
  subtitle?: string;
  id?: string;          /* used for anchor links in the top nav */
}

const rise = (y: number, duration: number, delay: number): Variants => ({
  hidden: { opacity: 0, y },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration, delay, ease: "easeOut" },
  },
});

const chipVariants: Variants = {
  hidden: { opacity: 0, scale: 0.82 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.32, ease: EASE_CLAY },
  },
};

const markerVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.48, delay: 0.16, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const kickerVariants = rise(10, 0.4, 0.04);
const titleVariants = rise(12, 0.42, 0.08);
const subtitleVariants = rise(8, 0.4, 0.12);

export function SectionHeading({ title, index, kicker, subtitle, id }: SectionHeadingProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, revealViewport);

  /*
   * Server and client must render identical markup or hydration throws.
   * So the props never branch on reduceMotion: under reduced motion the
   * [data-motion] CSS rule pins every piece to its settled state, and the
   * zero-duration transition below keeps Framer from doing visible work.
   */
  const anim = (variants: Variants) => ({
    variants,
    "data-motion": "",
    initial: "hidden" as const,
    animate: inView ? ("visible" as const) : ("hidden" as const),
    transition: reduceMotion ? { duration: 0 } : undefined,
  });

  return (
    <div ref={ref} className="mb-10" id={id}>
      {(index || kicker) && (
        <motion.p {...anim(kickerVariants)} className="kicker flex items-center gap-2.5 mb-4">
          {index && (
            <motion.span
              {...anim(chipVariants)}
              aria-hidden="true"
              className="inline-flex items-center justify-center px-2.5 py-0.5 text-xs"
              style={{
                background: "var(--color-surface)",
                color: "var(--color-text)",
                border: "2.5px solid var(--color-ink)",
                borderRadius: "9999px",
                boxShadow: "2px 2px 0 var(--color-ink-shadow)",
              }}
            >
              {index}
            </motion.span>
          )}
          {kicker && <span>{kicker}</span>}
        </motion.p>
      )}

      <motion.h2
        {...anim(titleVariants)}
        className="font-bold text-text"
        style={{ fontSize: "clamp(1.5rem, 1.2rem + 1vw, 2rem)" }}
      >
        {title}
      </motion.h2>

      {/* Chunky rounded pastel underline — playful marker */}
      <motion.div
        {...anim(markerVariants)}
        aria-hidden="true"
        style={{
          width: "64px",
          height: "7px",
          background: "linear-gradient(90deg, var(--color-peach), var(--color-sky))",
          borderRadius: "9999px",
          marginTop: "10px",
          boxShadow: "2px 2px 0 color-mix(in srgb, var(--color-ink-shadow) 30%, transparent)",
          transformOrigin: "left center",
        }}
      />

      {subtitle && (
        <motion.p {...anim(subtitleVariants)} className="mt-3 text-muted text-sm md:text-base">
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
