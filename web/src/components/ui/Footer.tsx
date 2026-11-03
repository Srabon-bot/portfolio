/*
 * FooterStrip — four-segment colored strip + links row + copyright.
 *
 * Strip colors: amber family matching --color-accent (see STYLE_REPORT.md §2).
 * PRD §5.4: "FooterStrip: four colored segments, then a row of links and copyright."
 * PRD §5.4 (SocialRail): on mobile, social links are moved into the footer.
 *
 * This is a Server Component — no JS needed.
 */

import Link from "next/link";
import { Container } from "./Container";
import type { Profile } from "@/types";

interface FooterProps {
  profile: Pick<Profile, "email" | "linkedin" | "github" | "instagram">;
}

/* The four strip segment colors — driven by --strip-* theme variables so
   the cream and ink papers each get a matching gold family */
const STRIP_VARS = ["var(--strip-1)", "var(--strip-2)", "var(--strip-3)", "var(--strip-4)"] as const;

export function Footer({ profile }: FooterProps) {
  const currentYear = new Date().getFullYear();

  /* Social links — same as SocialRail but rendered inline for mobile */
  const socialLinks = [
    { label: "LinkedIn", href: profile.linkedin },
    { label: "GitHub",   href: profile.github   },
    { label: "Email",    href: `mailto:${profile.email}` },
    ...(profile.instagram ? [{ label: "Instagram", href: profile.instagram }] : []),
  ];

  /* Footer nav links */
  const footerNav = [
    { label: "Projects",   href: "#projects"   },
    { label: "Skills",     href: "#skills"     },
    { label: "Education",  href: "#education"  },
    { label: "About",      href: "#about"      },
    { label: "Contact",    href: "#contact"    },
    { label: "Resume",     href: "/resume"     },
  ];

  return (
    <footer aria-label="Site footer" className="relative z-10">
      {/* Four-segment color strip */}
      <div className="flex h-2 w-full" aria-hidden="true">
        {STRIP_VARS.map((color, i) => (
          <div
            key={color}
            className="flex-1"
            style={{ background: color }}
          />
        ))}
      </div>

      {/* Main footer content */}
      <div
        className="py-12"
        style={{ background: "var(--color-surface)" }}
      >
        <Container className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Left: branding — matches TopBar SRABON wordmark */}
          <div className="text-center md:text-left">
            <Link
              href="/"
              aria-label="Go to home"
              className="inline-block transition-colors hover:text-accent-soft"
              style={{
                fontFamily:    "var(--font-fraunces), Georgia, serif",
                fontWeight:    800,
                fontSize:      "1.15rem",
                letterSpacing: "0.18em",
                color:         "var(--color-text)",
              }}
            >
              SRABON
            </Link>
            <p className="text-xs mt-1 font-mono" style={{ color: "var(--color-faint)" }}>
              Full-Stack Developer (MERN) · Dhaka, Bangladesh
            </p>
          </div>

          {/* Center: nav links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 list-none">
              {footerNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs font-mono hover:text-text transition-colors py-2 px-1 min-h-11 inline-flex items-center"
                    style={{ color: "var(--color-faint)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right: social links (visible on mobile too — SocialRail is hidden on mobile) */}
          <nav aria-label="Social media links">
            <ul className="flex flex-wrap justify-center items-center gap-4 list-none">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="text-xs hover:text-accent-soft transition-colors py-2 px-1 min-h-11 inline-flex items-center"
                    style={{ color: "var(--color-faint)" }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Container>

        {/* Copyright row */}
        <p
          className="text-center text-xs mt-8"
          style={{ color: "var(--color-faint)" }}
        >
          © {currentYear} Shahriar Hossain Srabon. Built with Next.js, Express, and MongoDB.
        </p>
      </div>
    </footer>
  );
}
