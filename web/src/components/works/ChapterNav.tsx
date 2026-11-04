"use client";

/*
 * ChapterNav — sticky mono table of contents for case-study spreads.
 * IntersectionObserver highlights the chapter currently in the viewport
 * (gold diamond marker + gold text), same interaction language as SectionRail.
 */

import { useEffect, useState } from "react";

interface ChapterNavProps {
  chapters: { id: string; label: string }[];
}

export function ChapterNav({ chapters }: ChapterNavProps) {
  const [activeId, setActiveId] = useState<string>(chapters[0]?.id ?? "");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    chapters.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [chapters]);

  return (
    <nav
      aria-label="Case study chapters"
      className="sticky top-24 flex flex-col gap-3 py-12"
    >
      <span
        className="text-xs font-mono uppercase tracking-widest"
        style={{ color: "var(--color-faint)" }}
      >
        Chapters
      </span>
      <div aria-hidden="true" className="rule-gold" />
      {chapters.map(({ id, label }) => {
        const active = activeId === id;
        return (
          <a
            key={id}
            href={`#${id}`}
            aria-current={active ? "true" : undefined}
            className="flex items-center gap-2 text-xs font-mono font-medium transition-colors"
            style={{ color: active ? "var(--color-accent-soft)" : "var(--color-muted)" }}
          >
            <span
              aria-hidden="true"
              className="inline-block w-1.5 h-1.5 flex-shrink-0 transition-colors"
              style={{
                transform: "rotate(45deg)",
                background: active ? "var(--color-accent)" : "transparent",
                border: active ? "none" : "1px solid var(--color-border)",
              }}
            />
            <span className="hover:text-accent-soft transition-colors">{label}</span>
          </a>
        );
      })}
    </nav>
  );
}
