"use client";

/*
 * MobileActionBar — sticky bottom navigation bar on mobile only (md:hidden).
 *
 * Provides instant access to "Resume" and "Contact" for hiring managers
 * browsing on mobile devices.
 * Uses a solid background and no blur per style guidelines.
 */

import Link from "next/link";
import type { Profile } from "@/types";

interface MobileActionBarProps {
  profile: Pick<Profile, "resumeUrl">;
}

export function MobileActionBar({}: MobileActionBarProps) {
  return (
    <aside
      aria-label="Quick mobile actions"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pt-3 flex items-center gap-3"
      style={{
        background: "var(--color-surface)",
        borderTop: "1px solid var(--color-border)",
        paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
      }}
    >
      <Link
        href="/resume"
        className="flex-1 inline-flex items-center justify-center min-h-11 py-2.5 px-4 rounded-lg text-xs font-mono font-semibold text-on-accent transition-opacity hover:opacity-90 active:scale-[0.98]"
        style={{ background: "var(--color-accent)" }}
      >
        <span>Resume</span>
      </Link>

      <Link
        href="#contact"
        className="flex-1 inline-flex items-center justify-center min-h-11 py-2.5 px-4 rounded-lg text-xs font-mono font-semibold text-text transition-colors hover:border-accent active:scale-[0.98]"
        style={{
          background: "var(--color-surface-2)",
          border: "1px solid var(--color-border)",
        }}
      >
        <span>Contact</span>
      </Link>
    </aside>
  );
}
