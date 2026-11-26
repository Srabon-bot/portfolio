/*
 * Decorative wave field — the original CodePen's diagonal, staggered glow
 * sweep, rebuilt from site tokens so both themes get the same motion in
 * palette C colours (lavender / electric blue / mint).
 *
 * The pen draws each beam as a zero-width box with a box-shadow stack;
 * those finite shadows read as hard diagonal lines when 25 of them overlap.
 * Here each beam is a wide, gradient-filled ribbon with masked ends, so the
 * colours blend into a continuous wave instead of striping the page.
 */
import type { CSSProperties } from "react";

const LENGTH = 12;
const LOOP_SECONDS = 45;

/* Site equivalents of the pen's purple / blue / green trio. */
const HUES = [
  "var(--color-lavender)",
  "var(--color-accent)",
  "var(--color-mint)",
] as const;

const ribbons = Array.from({ length: LENGTH }, (_, index) => {
  const n = index + 1;
  return {
    key: n,
    style: {
      "--wave-color": HUES[index % HUES.length],
      /* The pen shortens each beam's loop by half a step per beam. */
      "--wave-duration": `${LOOP_SECONDS - (LOOP_SECONDS / LENGTH / 2) * n}s`,
      /* Negative delays pre-advance the beams into a continuous wave. */
      "--wave-delay": `${-((n / LENGTH) * LOOP_SECONDS)}s`,
    } as CSSProperties,
  };
});

export function RainbowWave() {
  return (
    <div aria-hidden="true" className="rainbow-wave">
      {ribbons.map((ribbon) => (
        <div
          key={ribbon.key}
          className="rainbow-wave__ribbon"
          style={ribbon.style}
        />
      ))}
    </div>
  );
}
