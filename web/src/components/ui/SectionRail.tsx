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
                    className={`hidden 2xl:inline-block text-xs font-bold uppercase tracking-wider transition-all duration-200 select-none ${
                      active
                        ? "opacity-100 text-accent-soft translate-x-0"
                        : "opacity-0 group-hover:opacity-100 text-muted translate-x-1 group-hover:translate-x-0"
                    }`}
                  >
                    {link.label}
                  </span>

                  {/* Clay dot indicator */}
                  <span
                    aria-hidden="true"
                    className="relative flex items-center justify-center w-4 h-4 flex-shrink-0"
                  >
                    <span
                      style={{
                        width: active ? "14px" : "10px",
                        height: active ? "14px" : "10px",
                        borderRadius: "50%",
                        background: active
                          ? "var(--color-peach)"
                          : "var(--color-surface-2)",
                        border: "2px solid var(--color-ink)",
                        boxShadow: active
                          ? "2px 2px 0 var(--color-ink)"
                          : "none",
                      }}
                      className={`block transition-all duration-200 ${active ? "animate-bounce" : ""}`}
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
