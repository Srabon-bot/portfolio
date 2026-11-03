"use client";

/*
 * SectionRail — fixed right-side navigation rail (desktop ≥ 1280px).
 *
 * Hiring-ready features:
 * - Horizontal labels with tooltips on hover (no vertical writing-mode)
 * - Gold diamond markers with active pulse / engraved labels on hover
 * - Full IntersectionObserver tracking
 * - Correct section order: Projects, Skills, About, Education, Contact
 */

import { useEffect, useState } from "react";

const sectionLinks = [
  { label: "Projects",   href: "#projects"   },
  { label: "Skills",     href: "#skills"     },
  { label: "About",      href: "#about"      },
  { label: "Education",  href: "#education"  },
  { label: "Contact",    href: "#contact"    },
];

const sectionIds = sectionLinks.map((l) => l.href.slice(1));

export function SectionRail() {
  const [activeId, setActiveId] = useState<string>("projects");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        {
          rootMargin: "-40% 0px -50% 0px",
          threshold: 0,
        }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <aside
      className="hidden xl:flex flex-col items-center gap-4 fixed right-6 top-1/2 -translate-y-1/2 z-40"
      style={{ pointerEvents: "none" }}
      aria-label="Page sections"
    >
      {/* Top vertical guide line */}
      <div
        aria-hidden="true"
        className="w-px"
        style={{ height: "48px", background: "var(--color-border)" }}
      />

      <nav
        aria-label="Section navigation"
        style={{ pointerEvents: "auto" }}
      >
        <ul className="flex flex-col items-end gap-3.5 list-none">
          {sectionLinks.map((link) => {
            const id = link.href.slice(1);
            const active = activeId === id;

            return (
              <li key={link.href} className="relative flex items-center group">
                <a
                  href={link.href}
                  aria-label={`Jump to ${link.label} section`}
                  aria-current={active ? "true" : undefined}
                  className="flex items-center gap-2.5 py-1 px-1.5 focus:outline-none"
                >
                  {/* Horizontal label: visible only at 2xl (dots only at xl to never overlap 1100px content) */}
                  <span
                    className={`hidden 2xl:inline-block text-xs font-mono uppercase tracking-wider transition-all duration-200 select-none ${
                      active
                        ? "opacity-100 text-accent-soft font-semibold translate-x-0"
                        : "opacity-0 group-hover:opacity-100 text-muted translate-x-1 group-hover:translate-x-0"
                    }`}
                  >
                    {link.label}
                  </span>

                  {/* Gold diamond indicator (rotated square) */}
                  <span
                    aria-hidden="true"
                    className="relative flex items-center justify-center w-3.5 h-3.5 flex-shrink-0"
                  >
                    {active && (
                      <span
                        className="animate-ping absolute inline-flex h-full w-full opacity-50"
                        style={{
                          background: "var(--color-accent)",
                          transform: "rotate(45deg)",
                        }}
                      />
                    )}
                    <span
                      style={{
                        width: active ? "8px" : "6px",
                        height: active ? "8px" : "6px",
                        transform: "rotate(45deg)",
                        background: active
                          ? "var(--color-accent)"
                          : "transparent",
                        border: active
                          ? "none"
                          : "1px solid var(--color-border)",
                      }}
                      className="block transition-all duration-200"
                    />
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom vertical guide line */}
      <div
        aria-hidden="true"
        className="w-px"
        style={{ height: "48px", background: "var(--color-border)" }}
      />
    </aside>
  );
}
