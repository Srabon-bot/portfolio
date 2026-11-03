/*
 * SectionHeading — the title bar used at the top of every section.
 *
 * Editorial treatment (hallmark redesign):
 * - Optional numbered mono kicker row above the title, e.g. "01 — Selected Work".
 * - Fraunces serif title (applied globally via the h2 base rule).
 * - 34×3px gold foil underline bar below the title.
 * - Optional subtitle in muted color.
 */

interface SectionHeadingProps {
  title: string;
  /** Chapter index rendered in mono, e.g. "01" alongside the kicker label */
  index?: string;
  /** Small mono label rendered next to the index, e.g. "Selected Work" */
  kicker?: string;
  subtitle?: string;
  id?: string;          /* used for anchor links in the top nav */
}

export function SectionHeading({ title, index, kicker, subtitle, id }: SectionHeadingProps) {
  return (
    <div className="mb-10" id={id}>
      {(index || kicker) && (
        <p className="kicker mb-3 flex items-center gap-2">
          {index && <span aria-hidden="true">{index}</span>}
          {kicker && (
            <>
              <span aria-hidden="true" style={{ opacity: 0.5 }}>—</span>
              <span>{kicker}</span>
            </>
          )}
        </p>
      )}

      <h2
        className="font-bold text-text"
        style={{ fontSize: "clamp(1.5rem, 1.2rem + 1vw, 2rem)" }}
      >
        {title}
      </h2>

      {/* The gold foil underline bar — 34px wide, 3px tall */}
      <div
        aria-hidden="true"
        style={{
          width: "34px",
          height: "3px",
          background: "var(--color-accent)",
          borderRadius: "2px",
          marginTop: "8px",
        }}
      />

      {subtitle && (
        <p className="mt-3 text-muted text-sm md:text-base">{subtitle}</p>
      )}
    </div>
  );
}
