"use client";

/*
 * Reveal — gentle fade-up the first time an element scrolls into view.
 *
 * Server-Component friendly: any server section can import and wrap its
 * cards with <Reveal delay={i * STAGGER}> to get the shared clay entrance
 * without converting the file to a client component.
 *
 * Accessibility: fully disabled when the OS asks for reduced motion
 * (framer-motion ignores the CSS kill-switch in globals.css — it's a JS
 * animator — so the gate lives here too).
 * Performance: transform/opacity only, fires once (viewport once:true).
 */

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { revealViewport } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  /** Entry delay in seconds — use index × STAGGER for sibling cards */
  delay?: number;
  /** Rise distance in px (keep ≤ 20 — a settle, not a slide) */
  y?: number;
  className?: string;
}

export function Reveal({ children, delay = 0, y = 16, className }: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={revealViewport}
      transition={{ duration: 0.45, delay: Math.min(delay, 0.5), ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
