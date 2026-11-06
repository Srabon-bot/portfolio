"use client";

/*
 * ThemeToggle — flips the site between the two papers:
 * light "Cream" edition and dark "Ink" edition.
 *
 * - First visit follows the OS preference (set pre-paint in layout.tsx).
 * - Every explicit choice is persisted in localStorage["theme"].
 * - Icons are inline SVG only (style rule: no icon libraries).
 * - 44×44px touch target per the style guide.
 */

import { useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CLAY_SPRING } from "@/lib/motion";

type Theme = "light" | "dark";

/* Sun (for switching to light) — inline SVG */
function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

/* Moon (for switching to dark) — inline SVG */
function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

/*
 * The DOM is the single source of truth for the current paper:
 * the pre-paint bootstrap script (layout.tsx) and this toggle both mutate
 * the `dark` class on <html>. We observe it — no setState-in-effect needed.
 */
const observeTheme = (onChange: () => void) => {
  const obs = new MutationObserver(onChange);
  obs.observe(document.documentElement, { attributeFilter: ["class"] });
  return () => obs.disconnect();
};

const THEME_NOOP = () => () => {};

export function ThemeToggle({ className = "" }: { className?: string }) {
  /* false during render + hydration, true as soon as we're on the client */
  const mounted = useSyncExternalStore(
    THEME_NOOP,
    () => true,
    () => false
  );

  const reduceMotion = useReducedMotion();

  const theme = useSyncExternalStore(
    observeTheme,
    () =>
      document.documentElement.classList.contains("dark") ? "dark" : "light",
    () => "light"
  );

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    /* Mutating the class is the state change — the MutationObserver
       notifies React, and every ThemeToggle instance re-renders. */
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage unavailable (private mode) — choice lives for the session only */
    }
  };

  /* Which icon to render post-hydration: show the paper you will switch TO.
     Keyed by theme so the little clay spring flip replays on each toggle;
     reduced-motion users get the plain icon swap. */
  const iconEl = mounted && theme === "dark" ? <SunIcon /> : <MoonIcon />;
  const icon = reduceMotion ? (
    iconEl
  ) : (
    <motion.span
      key={mounted && theme === "dark" ? "sun" : "moon"}
      initial={{ rotate: -60, scale: 0.6, opacity: 0 }}
      animate={{ rotate: 0, scale: 1, opacity: 1 }}
      transition={CLAY_SPRING}
      className="inline-flex"
    >
      {iconEl}
    </motion.span>
  );
  const label = mounted
    ? theme === "dark"
      ? "Switch to light paper"
      : "Switch to dark paper"
    : "Toggle dark paper";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      aria-pressed={mounted ? theme === "dark" : undefined}
      suppressHydrationWarning
      className={`inline-flex items-center justify-center min-w-11 min-h-11 p-2.5 text-text hover:text-accent-soft transition-colors cursor-pointer ${className}`}
    >
      {icon}
    </button>
  );
}
