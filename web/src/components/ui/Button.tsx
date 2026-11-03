"use client";

/*
 * Button — standard button component with solid and outline variants.
 *
 * Keeps the pill shape and Framer Motion hover/tap micro-interactions.
 * Supports primary (filled accent) and secondary (outlined) variants.
 *
 * Usage:
 *   <Button variant="primary" href="#projects">View projects</Button>
 *   <Button variant="secondary" href="/resume.pdf">Download resume</Button>
 */

import { motion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";

export interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary";
  href?: string;          /* If provided, renders as an <a> link */
  download?: boolean;     /* If true + href set, adds the download attribute */
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export function Button({
  children,
  variant = "primary",
  href,
  download = false,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}: ButtonProps) {
  const isPrimary = variant === "primary";

  const baseStyles = isPrimary
    ? "bg-accent text-on-accent hover:bg-accent/90"
    : "bg-surface text-text border border-border hover:border-accent hover:text-accent-soft";

  const inner = (
    <motion.span
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold cursor-pointer select-none transition-all duration-200 text-sm md:text-base ${baseStyles} ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
    >
      {children}
    </motion.span>
  );

  /* Render as a Next.js Link when href is provided, otherwise as a button */
  if (href && !disabled) {
    return (
      <Link
        href={href}
        download={download || undefined}
        className="focus-visible:outline-accent rounded-full inline-block"
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="focus-visible:outline-accent rounded-full bg-transparent border-none p-0 inline-block disabled:cursor-not-allowed"
    >
      {inner}
    </button>
  );
}

/* Backward-compatibility export */
export { Button as BlobButton };
