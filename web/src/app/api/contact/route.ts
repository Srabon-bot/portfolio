/*
 * POST /api/contact — serverless contact form handler.
 *
 * Works WITHOUT the Express backend by forwarding to Formspree's free tier.
 * Set FORMSPREE_ENDPOINT in Vercel env vars:
 *   https://formspree.io/f/YOUR_FORM_ID
 *
 * If FORMSPREE_ENDPOINT is not set, falls back to saving to DB via the
 * Express API (Phase 2+ behaviour).
 *
 * Rate-limited at the Formspree layer (50 submissions/month on free tier).
 * Honeypot field ("website") is checked here as a second layer of defence.
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message, website } = body;

    /* ── Honeypot check ───────────────────────────────────────────── */
    if (website) {
      /* Bot filled the hidden field — pretend success */
      return NextResponse.json({ ok: true });
    }

    /* ── Basic validation ─────────────────────────────────────────── */
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    /* ── Formspree (works on Vercel free tier, no backend needed) ─── */
    const formspreeEndpoint = process.env.FORMSPREE_ENDPOINT;
    if (formspreeEndpoint) {
      const fRes = await fetch(formspreeEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (!fRes.ok) {
        const errData = await fRes.json().catch(() => ({}));
        console.error("Formspree error:", errData);
        return NextResponse.json(
          { error: "Failed to deliver message. Please email me directly." },
          { status: 502 }
        );
      }

      return NextResponse.json({ ok: true });
    }

    /* ── Fallback: forward to Express API ─────────────────────────── */
    const apiBase = process.env.NEXT_PUBLIC_API_URL;
    if (apiBase) {
      try {
        const apiRes = await fetch(`${apiBase}/contact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message, website: "" }),
          signal: AbortSignal.timeout(8000),
        });

        if (!apiRes.ok) {
          const errData = await apiRes.json().catch(() => ({}));
          return NextResponse.json(
            { error: errData.error || "Failed to send message." },
            { status: apiRes.status }
          );
        }

        return NextResponse.json({ ok: true });
      } catch {
        /* Backend unreachable (offline/cold start) — degrade gracefully
           instead of surfacing a generic 500 to the sender. */
        return NextResponse.json(
          {
            error:
              "Message service unreachable right now. Please email srabon361@gmail.com directly.",
          },
          { status: 503 }
        );
      }
    }

    /* ── No backend configured ─────────────────────────────────────── */
    return NextResponse.json(
      {
        error:
          "Contact service not configured. Please email srabon361@gmail.com directly.",
      },
      { status: 503 }
    );
  } catch (err: unknown) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Internal error. Please try again later." },
      { status: 500 }
    );
  }
}
