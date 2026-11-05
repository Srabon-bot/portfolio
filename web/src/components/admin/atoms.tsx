"use client";

/*
 * atoms.tsx — shared form atoms for the admin console.
 * Token-bound styling only (never bg-accent without text-on-accent),
 * 12px minimum text, print-corner radii, no blur.
 */

import type { ChangeEvent, ReactNode } from "react";

export const inputClass =
  "w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors";
export const inputStyle: React.CSSProperties = {
  background: "var(--color-surface-2)",
  border: "1px solid var(--color-border)",
  color: "var(--color-text)",
};

export function AdminField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-faint">
        {label}
      </span>
      {children}
      {hint && (
        <span className="text-xs text-faint normal-case tracking-normal">
          {hint}
        </span>
      )}
    </label>
  );
}

export function AdminInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className ?? ""}`} style={inputStyle} />;
}

export function AdminTextarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className={`${inputClass} min-h-[64px] leading-relaxed ${props.className ?? ""}`}
      style={inputStyle}
    />
  );
}

export function AdminSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputClass} ${props.className ?? ""}`} style={inputStyle} />;
}

/* Small mono pill used for statuses (draft/published, unread, etc.) */
export function Pill({
  tone,
  children,
}: {
  tone: "gold" | "quiet" | "success" | "danger";
  children: ReactNode;
}) {
  const bg =
    tone === "gold"
      ? "color-mix(in srgb, var(--color-accent) 14%, transparent)"
      : tone === "success"
        ? "color-mix(in srgb, var(--color-success) 14%, transparent)"
        : tone === "danger"
          ? "color-mix(in srgb, var(--color-danger) 14%, transparent)"
          : "var(--color-surface-2)";
  const color =
    tone === "gold"
      ? "var(--color-accent-soft)"
      : tone === "success"
        ? "var(--color-success)"
        : tone === "danger"
          ? "var(--color-danger)"
          : "var(--color-muted)";
  const border =
    tone === "gold"
      ? "color-mix(in srgb, var(--color-accent) 30%, transparent)"
      : tone === "success"
        ? "color-mix(in srgb, var(--color-success) 40%, transparent)"
        : tone === "danger"
          ? "color-mix(in srgb, var(--color-danger) 40%, transparent)"
          : "var(--color-border)";
  return (
    <span
      className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
      style={{ background: bg, color, border: `1px solid ${border}` }}
    >
      {children}
    </span>
  );
}

/* Split a one-per-line textarea string into a clean array */
export function linesTo(
  e: ChangeEvent<HTMLTextAreaElement>
): string[] {
  return e.target.value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}
