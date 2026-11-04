"use client";

/*
 * ScrollMarker — editorial page furniture for scrolling:
 *
 * 1. ProgressRule: a 2px gold hairline across the top of the viewport,
 *    whose length tracks reading progress (the journal's page marker).
 * 2. BackToTop: an engraved footnote arrow that appears after scrolling,
 *    a11y-labelled, 44px touch target, sits above the mobile action bar.
 *
 * Single rAF-throttled scroll listener drives both. No blur, inline SVG only.
 */

import { useEffect, useState } from "react";

/* ── Gold progress hairline ─────────────────────────────────────────── */
export function ProgressRule() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0);
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[60] h-[2px]"
      style={{ background: "transparent" }}
    >
      <div
        className="h-full transition-[transform] duration-100 ease-out"
        style={{
          transform: `scaleX(${progress})`,
          transformOrigin: "left center",
          background: "var(--color-accent)",
        }}
      />
    </div>
  );
}

/* ── Back-to-top footnote arrow ─────────────────────────────────────── */
const SHOW_AFTER = 600; /* px of scroll before it appears */

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      setVisible(window.scrollY > SHOW_AFTER);
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={`fixed right-4 md:right-6 z-40 flex items-center justify-center w-11 h-11 rounded-full border text-muted hover:text-accent-soft hover:border-accent/40 transition-all duration-300 cursor-pointer ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
      }`}
      style={{
        background: "var(--color-surface)",
        borderColor: "var(--color-border)",
        /* Keep clear of the mobile sticky action bar */
        bottom: "calc(84px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="12" y1="19" x2="12" y2="5" />
        <polyline points="5 12 12 5 19 12" />
      </svg>
    </button>
  );
}
