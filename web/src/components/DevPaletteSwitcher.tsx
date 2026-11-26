"use client";

/*
 * DevPaletteSwitcher — TEMPORARY exploration tool, not part of the theme.
 *
 * Mounted only when NEXT_PUBLIC_PALETTE_SWITCH=1 (see layout.tsx), so a
 * normal `next build` never includes it. It flips data-palette on <html>
 * between the three candidate palettes defined in globals.css and remembers
 * the choice in localStorage["palette"].
 *
 * Remove with the unused palette blocks once a direction is chosen.
 */

import { useEffect, useState } from "react";

const STORAGE_KEY = "palette";

const PALETTES = [
  { id: "a", name: "A · Dusk Ledger", swatches: ["#EFE8DA", "#16284C", "#FFB92E"] },
  { id: "b", name: "B · Violet Foil", swatches: ["#FCFFFF", "#723CD6", "#EDB158"] },
  { id: "c", name: "C · Neon Night", swatches: ["#FDFEFF", "#0297DE", "#FC734D"] },
] as const;

export function DevPaletteSwitcher() {
  const [active, setActive] = useState<string>("a");

  useEffect(() => {
    let saved = "a";
    try {
      saved = localStorage.getItem(STORAGE_KEY) ?? "a";
    } catch {
      /* private mode — fall through to the default */
    }
    setActive(saved);
    document.documentElement.dataset.palette = saved;
  }, []);

  function pick(id: string) {
    setActive(id);
    document.documentElement.dataset.palette = id;
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* nothing to persist to */
    }
  }

  return (
    <div
      role="group"
      aria-label="Palette preview (temporary)"
      className="fixed bottom-20 left-4 z-[9999] flex flex-col gap-1 rounded-2xl p-2 shadow-lg md:bottom-4"
      style={{
        background: "var(--color-surface)",
        border: "2px solid var(--color-ink)",
      }}
    >
      <span
        className="px-1 pb-0.5 text-xs font-extrabold uppercase tracking-widest"
        style={{ color: "var(--color-faint)" }}
      >
        Palette
      </span>

      {PALETTES.map((p) => {
        const isActive = active === p.id;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => pick(p.id)}
            aria-pressed={isActive}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-bold transition-colors"
            style={{
              background: isActive
                ? "color-mix(in srgb, var(--color-accent) 22%, transparent)"
                : "transparent",
              color: "var(--color-text)",
            }}
          >
            <span className="flex gap-0.5" aria-hidden="true">
              {p.swatches.map((c) => (
                <span
                  key={c}
                  className="h-3 w-3 rounded-full"
                  style={{
                    background: c,
                    border:
                      "1px solid color-mix(in srgb, var(--color-ink) 35%, transparent)",
                  }}
                />
              ))}
            </span>
            {p.name}
          </button>
        );
      })}
    </div>
  );
}
