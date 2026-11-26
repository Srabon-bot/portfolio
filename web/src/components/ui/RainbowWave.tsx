/*
 * Decorative wave field — the original CodePen's 25 diagonal, staggered
 * glow columns, rebuilt from site tokens so both themes get the same sweep
 * in palette C colours (lavender / electric blue / mint).
 *
 * Geometry, loop length and per-column timing follow the pen exactly;
 * only hue, opacity and accessibility (aria-hidden, reduced motion) are
 * adapted for the portfolio.
 */
import type { CSSProperties } from "react";

const LENGTH = 25;
const LOOP_SECONDS = 45;

/* Site equivalents of the pen's purple / blue / green trio. */
const HUES = [
  "var(--color-lavender)",
  "var(--color-accent)",
  "var(--color-mint)",
] as const;

const columns = Array.from({ length: LENGTH }, (_, index) => {
  const n = index + 1;
  return {
    key: n,
    style: {
      "--wave-color": HUES[index % HUES.length],
      /* The pen shortens each column's loop by half a step per column. */
      "--wave-duration": `${LOOP_SECONDS - (LOOP_SECONDS / LENGTH / 2) * n}s`,
      /* Negative delays pre-advance the columns into a continuous wave. */
      "--wave-delay": `${-((n / LENGTH) * LOOP_SECONDS)}s`,
    } as CSSProperties,
  };
});

export function RainbowWave() {
  return (
    <div aria-hidden="true" className="rainbow-wave">
      {columns.map((column) => (
        <div
          key={column.key}
          className="rainbow-wave__column"
          style={column.style}
        />
      ))}
    </div>
  );
}
