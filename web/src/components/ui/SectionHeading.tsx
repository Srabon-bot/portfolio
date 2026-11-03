/*
 * SectionHeading — the title bar used at the top of every section.
 *
 * Renders: a heading tag + a 34×3px accent-colored underline bar below it.
 * Optional subtitle appears in muted color below the bar.
 *
 * PRD §5.3: "Section headings: weight 700, with a 34px by 3px accent underline bar below."
 */

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  id?: string;          /* used for anchor links in the top nav */
}

export function SectionHeading({ title, subtitle, id }: SectionHeadingProps) {
  return (
    <div className="mb-10" id={id}>
      <h2
        className="font-bold text-text"
        style={{ fontSize: "clamp(1.5rem, 1.2rem + 1vw, 2rem)" }}
      >
        {title}
      </h2>

      {/* The accent underline bar — 34px wide, 3px tall, accent amber */}
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
