/*
 * Chip — a small rounded tag used to display tech stack items.
 *
 * Supports optional `highlight` prop for core stack items (MERN).
 */

import { TechIcon } from "./TechIcon";

interface ChipProps {
  label: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  highlight?: boolean;
  className?: string;
}

export function Chip({
  label,
  size = "md",
  showIcon = true,
  highlight = false,
  className = "",
}: ChipProps) {
  const isCountBadge = label.startsWith("+");

  const sizeClasses = {
    sm: "px-2.5 py-0.5 text-xs gap-1",
    md: "px-3 py-1 text-xs gap-1.5",
    lg: "px-3.5 py-1.5 text-sm gap-2",
  }[size];

  const iconSize = {
    sm: 12,
    md: 14,
    lg: 16,
  }[size];

  const textColor = highlight ? "text-on-pastel" : "text-muted";
  const borderColor = highlight
    ? "var(--color-ink)"
    : "color-mix(in srgb, var(--color-ink) 55%, transparent)";

  return (
    <span
      className={`inline-flex items-center font-bold rounded-[14px] ${textColor} transition-all duration-200 hover:-translate-y-0.5 ${sizeClasses} ${className}`}
      style={{
        background: highlight ? "var(--color-peach)" : "var(--color-surface)",
        border: `2px solid ${borderColor}`,
        boxShadow: highlight
          ? "2px 2px 0 var(--color-ink)"
          : "2px 2px 0 color-mix(in srgb, var(--color-ink) 55%, transparent)",
      }}
    >
      {showIcon && !isCountBadge && <TechIcon name={label} size={iconSize} />}
      <span>{label}</span>
    </span>
  );
}
