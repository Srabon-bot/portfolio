/*
 * motion.ts — the shared clay motion vocabulary.
 *
 * One source of truth so every animated element on the site shares
 * the same feel: a gentle spring and the soft claymorphism bounce
 * easing (cubic-bezier(0.34, 1.56, 0.64, 1) — the uupm clay recipe).
 *
 * Subtle-professional rules baked in here:
 *   - entrances: transform/opacity only, ≤ ~500ms, never animate layout
 *   - stagger steps are small (50–70ms)
 *   - components must pair these with useReducedMotion() gating — framer
 *     animations do NOT obey the CSS prefers-reduced-motion kill-switch
 */

import type { Variants } from "framer-motion";

/* Soft overshoot bounce — the clay "squeeze" curve */
export const EASE_CLAY: [number, number, number, number] = [0.34, 1.56, 0.64, 1];

/* Gentle spring for micro-interactions (drawer, icon flips, card lifts) */
export const CLAY_SPRING = {
  type: "spring" as const,
  stiffness: 320,
  damping: 24,
  mass: 0.9,
};

/*
 * fadeUp — shared entrance variant.
 * `custom` receives the delay in seconds (index × stagger step callers side).
 * Rise is capped at 16px so entrances feel like a settle, not a slide.
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay, ease: "easeOut" },
  }),
};

/* Standard stagger step between sibling cards */
export const STAGGER = 0.07;

/* Shared viewport config for scroll entrances: fire once, slightly early */
export const revealViewport = { once: true, margin: "-40px" } as const;
