/*
 * Decorative wave field — the original CodePen's diagonal, staggered glow
 * sweep, rebuilt from site tokens so both themes get the same motion in
 * palette C colours (lavender / electric blue / mint / cantaloupe).
 *
 * The pen draws each beam as a zero-width box with a box-shadow stack;
 * those finite shadows read as hard diagonal lines when many overlap.
 * Here each beam is a wide, gradient-filled ribbon with masked ends, so the
 * colours blend into a continuous wave instead of striping the page.
 *
 * Every hue shares the same opacity tokens, but the pastel tokens carry far
 * less chroma than the accent. A per-hue scale (see globals.css) evens out
 * their perceived weight so the blue doesn't visually swallow the rest.
 */
import type { CSSProperties } from "react";

const LENGTH = 12;
const LOOP_SECONDS = 45;

/* Site equivalents of the pen's rainbow, in wheel order. */
const HUES = [
  { name: "lavender", token: "var(--color-lavender)" },
  { name: "accent", token: "var(--color-accent)" },
  { name: "mint", token: "var(--color-mint)" },
  { name: "peach", token: "var(--color-peach)" },
] as const;

const ribbons = Array.from({ length: LENGTH }, (_, index) => {
  const n = index + 1;
  const hue = HUES[index % HUES.length];
  return {
    key: n,
    hue: hue.name,
    style: {
      "--wave-color": hue.token,
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
          data-hue={ribbon.hue}
          className="rainbow-wave__ribbon"
          style={ribbon.style}
        />
      ))}
    </div>
  );
}
