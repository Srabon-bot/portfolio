/*
 * SectionHeading — the title bar used at the top of every section.
 *
 * Clay Playful treatment:
 * - Optional index chip (ink-outlined white pebble, e.g. "01") above the title
 * - Optional bold uppercase kicker label, e.g. "Selected Work"
 * - Fredoka title (applied globally via the h2 base rule)
 * - Chunky rounded pastel underline bar (playful marker)
 * - Optional subtitle in muted color.
 */

interface SectionHeadingProps {
  title: string;
  /** Section number rendered inside the pebble chip, e.g. "01" */
  index?: string;
  /** Bold uppercase label rendered next to the pebble, e.g. "Selected Work" */
  kicker?: string;
  subtitle?: string;
  id?: string;          /* used for anchor links in the top nav */
}

export function SectionHeading({ title, index, kicker, subtitle, id }: SectionHeadingProps) {
  return (
    <div className="mb-10" id={id}>
      {(index || kicker) && (
        <p className="kicker flex items-center gap-2.5 mb-4">
          {index && (
            <span
              aria-hidden="true"
              className="inline-flex items-center justify-center px-2.5 py-0.5 text-xs"
              style={{
                background: "var(--color-surface)",
                color: "var(--color-text)",
                border: "2.5px solid var(--color-ink)",
                borderRadius: "9999px",
                boxShadow: "2px 2px 0 var(--color-ink-shadow)",
              }}
            >
              {index}
            </span>
          )}
          {kicker && <span>{kicker}</span>}
        </p>
      )}

      <h2
        className="font-bold text-text"
        style={{ fontSize: "clamp(1.5rem, 1.2rem + 1vw, 2rem)" }}
      >
        {title}
      </h2>

      {/* Chunky rounded pastel underline — playful marker */}
      <div
        aria-hidden="true"
        style={{
          width: "64px",
          height: "7px",
          background: "linear-gradient(90deg, var(--color-peach), var(--color-sky))",
          borderRadius: "9999px",
          marginTop: "10px",
          boxShadow: "2px 2px 0 color-mix(in srgb, var(--color-ink-shadow) 30%, transparent)",
        }}
      />

      {subtitle && (
        <p className="mt-3 text-muted text-sm md:text-base">{subtitle}</p>
      )}
    </div>
  );
}
