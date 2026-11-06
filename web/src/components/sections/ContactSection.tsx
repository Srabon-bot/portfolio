"use client";

/*
 * ContactSection — "Keep in touch" with direct links and an accessible contact form.
 *
 * Hiring-ready features:
 * - Direct contact cards with inline SVG external link icons
 * - Working contact form with honeypot spam protection
 * - Loading state with spinner
 * - Success (var(--color-success)) and error (var(--color-danger)) alerts
 * - Accessible live region (aria-live="polite")
 */

import { useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import type { Profile } from "@/types";

interface ContactSectionProps {
  profile: Pick<Profile, "email" | "linkedin" | "github" | "instagram" | "location">;
}

type FormStatus = "idle" | "loading" | "success" | "error";

export function ContactSection({ profile }: ContactSectionProps) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    /* Honeypot check — silently succeed for spam bots */
    if (data.get("website")) {
      setStatus("success");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const payload = {
        name: data.get("name"),
        email: data.get("email"),
        message: data.get("message"),
        website: data.get("website") || "",
      };

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to send message. Please try again.");
      }

      setStatus("success");
      form.reset();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to connect to contact service.";
      setErrorMessage(msg);
      setStatus("error");
    }
  }

  const contactLinks = [
    {
      label: "Email",
      value: profile.email,
      href: `mailto:${profile.email}`,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      value: "Connect on LinkedIn",
      href: profile.linkedin,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      label: "GitHub",
      value: "Srabon-bot",
      href: profile.github,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
        </svg>
      ),
    },
    {
      label: "Location",
      value: profile.location,
      href: undefined,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2C8.686 2 6 4.686 6 8c0 5.25 6 13 6 13s6-7.75 6-13c0-3.314-2.686-6-6-6z" />
          <circle cx="12" cy="8" r="2.5" />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="contact"
      aria-label="Contact Srabon"
      className="section-pad"
      style={{ scrollMarginTop: "4.5rem" }}
    >
      <Container>
        <SectionHeading
          title="Keep in Touch"
          index="05"
          kicker="Correspondence"
          subtitle="Open to opportunities, collaborations and questions"
          id="contact-heading"
        />

        <div
          className="grid grid-cols-1 lg:grid-cols-2 items-start"
          style={{ gap: "clamp(2.5rem, 1.5rem + 2.6vw, 4rem)" }}
        >
          {/* ── Left / Top: contact info cards (1 col < sm, 2x2 >= sm) ──── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {contactLinks.map((link, i) => {
              const pastels = ["var(--color-peach)", "var(--color-sky)", "var(--color-lavender)", "var(--color-mint)"];
              return (
              <div
                key={link.label}
                className="group rounded-2xl p-4 flex items-center gap-3.5 transition-all duration-300 hover:-translate-y-0.5 min-w-0"
                style={{
                  background: "var(--color-surface)",
                  border: "2.5px solid var(--color-ink)",
                  boxShadow: "4px 4px 0 var(--color-ink-shadow)",
                }}
              >
                <span
                  className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl text-on-pastel"
                  style={{
                    background: pastels[i % pastels.length],
                    border: "2px solid var(--color-ink)",
                  }}
                  aria-hidden="true"
                >
                  {link.icon}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-extrabold uppercase tracking-wider mb-0.5" style={{ color: "var(--color-faint)" }}>
                    {link.label}
                  </p>
                  {link.href ? (
                    <a
                      href={link.href}
                      target={link.href.startsWith("mailto") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm font-bold hover:text-accent-soft transition-colors break-words block"
                      style={{ color: "var(--color-text)", overflowWrap: "anywhere" }}
                    >
                      {link.value}
                    </a>
                  ) : (
                    <p
                      className="text-xs sm:text-sm font-bold break-words"
                      style={{ color: "var(--color-text)", overflowWrap: "anywhere" }}
                    >
                      {link.value}
                    </p>
                  )}
                </div>

                {link.href && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="text-faint group-hover:text-accent-soft transition-colors flex-shrink-0"
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                )}
              </div>
              );
            })}
          </div>

          {/* ── Right: contact form card ──────────────────────────────── */}
          <div
            className="rounded-card p-6 md:p-8"
            style={{
              background: "var(--color-surface)",
              border: "2.5px solid var(--color-ink)",
              boxShadow: "6px 6px 0 var(--color-ink-shadow)",
            }}
          >
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-4"
              aria-label="Send a message"
            >
              {/* Honeypot field */}
              <input
                type="text"
                name="website"
                autoComplete="off"
                tabIndex={-1}
                aria-hidden="true"
                style={{ display: "none" }}
              />

              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact-name" className="text-xs font-extrabold uppercase tracking-wider" style={{ color: "var(--color-faint)" }}>
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your name"
                  className="rounded-[14px] px-4 py-2.5 text-sm font-semibold outline-none transition-all focus:border-accent"
                  style={{
                    background: "var(--color-surface-2)",
                    border: "2px solid var(--color-ink)",
                    color: "var(--color-text)",
                  }}
                  disabled={status === "loading" || status === "success"}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact-email" className="text-xs font-extrabold uppercase tracking-wider" style={{ color: "var(--color-faint)" }}>
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  className="rounded-[14px] px-4 py-2.5 text-sm font-semibold outline-none transition-all focus:border-accent"
                  style={{
                    background: "var(--color-surface-2)",
                    border: "2px solid var(--color-ink)",
                    color: "var(--color-text)",
                  }}
                  disabled={status === "loading" || status === "success"}
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact-message" className="text-xs font-extrabold uppercase tracking-wider" style={{ color: "var(--color-faint)" }}>
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={4}
                  placeholder="What's on your mind?"
                  className="rounded-[14px] px-4 py-2.5 text-sm font-semibold outline-none transition-all focus:border-accent resize-none"
                  style={{
                    background: "var(--color-surface-2)",
                    border: "2px solid var(--color-ink)",
                    color: "var(--color-text)",
                  }}
                  disabled={status === "loading" || status === "success"}
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="clay-btn clay-btn-primary px-6 py-3 min-h-11 text-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none flex items-center justify-center"
                style={{ background: "var(--color-accent)" }}
              >
                {status === "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                    </svg>
                    <span>Sending message…</span>
                  </span>
                ) : (
                  "Send message"
                )}
              </button>

              {/* Accessible live region for status notifications */}
              <div aria-live="polite" className="mt-1">
                {status === "success" && (
                  <p
                    className="text-sm font-medium text-center rounded-xl px-4 py-3 flex items-center justify-center gap-2"
                    role="status"
                    style={{
                      background: "color-mix(in srgb, var(--color-success) 12%, transparent)",
                      color: "var(--color-success)",
                      border: "1px solid color-mix(in srgb, var(--color-success) 30%, transparent)",
                    }}
                  >
                    <span aria-hidden="true">✓</span>
                    <span>Message sent! I will get back to you soon.</span>
                  </p>
                )}

                {status === "error" && (
                  <p
                    className="text-sm font-medium text-center rounded-xl px-4 py-3 flex items-center justify-center gap-2"
                    role="alert"
                    style={{
                      background: "color-mix(in srgb, var(--color-danger) 12%, transparent)",
                      color: "var(--color-danger)",
                      border: "1px solid color-mix(in srgb, var(--color-danger) 30%, transparent)",
                    }}
                  >
                    <span aria-hidden="true">⚠</span>
                    <span>{errorMessage || "Something went wrong. Please try again."}</span>
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}
