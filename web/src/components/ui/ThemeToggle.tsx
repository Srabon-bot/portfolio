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

import { useEffect, useState } from "react";

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

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTheme(
      document.documentElement.classList.contains("dark") ? "dark" : "light"
    );
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage unavailable (private mode) — choice lives for the session only */
    }
  };

  /* Which icon to render post-hydration: show the paper you will switch TO */
  const icon = mounted && theme === "dark" ? <SunIcon /> : <MoonIcon />;
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
