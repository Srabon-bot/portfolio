# Hallmark Editorial — Full Portfolio Redesign Plan

> This is the working plan for the complete redesign. It is executed **in parts**: each part is
> implemented → tested on the dev server → committed by the owner → only then does the next part
> begin. Never start a new part while the previous one is uncommitted.
> This repo copy (`docs/REDESIGN_PLAN.md`) is the changelog source of truth; tick the Status
> section here after each part is committed.

---

## 0. Rules & constraints

- **Content stays exactly the same** — profile, projects, skills, bio, resume, contact info all come from the existing data layer (API + seed data + admin CMS). No copy changes, no invented data.
- **Teacher requirements are acceptance criteria and must survive the redesign:**
  1. All six required sections present (Hero, About, Skills, Projects, Contact, Resume)
  2. Projects: live link + screenshots, 3–4 featured max on home
  3. Case studies keep the 5-section README structure
  4. One-click PDF resume download
  5. Mobile-first, min 12px text, 44px touch targets, no horizontal scroll (360px check)
- Standing style rules preserved: **no blur**, **no icon libraries** (inline SVG only), **no sub-12px text**, **no arrow icons in navigation**, success/danger colors only for their allowed purposes.
- Admin dashboard structure/API is functional-frozen; only retinted.
- After every part: `npm run build` must pass (Turbopack + TypeScript), and the owner
  visually tests on the running dev server before committing.

## 1. Concept

A **"printed engineering journal"** — warm paper, ink typography, gold foil accents,
engraved hairline rules, numbered chapters. Engineered like a developer site: mono labels,
sharp grids, fast, zero blur. One gold thread ties every page (single-accent color branding).
The site ships with **two papers**: a light "Cream" edition (default look) and a **dark "Ink"
edition** — same identity, swapped materials.

## 2. Theme system (dual-mode)

### Strategy
- All colors live as CSS custom properties declared **twice** in `web/src/app/globals.css`:
  once on `:root` (light cream defaults) and once on `.dark` (ink overrides).
- Tailwind v4: add `@custom-variant dark (&:where(.dark, .dark *));`
- A tiny **blocking inline script** in `layout.tsx` sets `dark` on `<html>` before
  first paint (no flash): reads `localStorage["theme"]`, falls back to `prefers-color-scheme`.
- Toggle button (sun/moon inline SVG, aria-label, 44px target) in the TopBar and in the
  mobile drawer. Choice persists in localStorage; no external theme library.

### Palettes

| Token | Cream (light) | Ink (dark) |
|---|---|---|
| `bg` | `#FBF8F1` paper | `#16130E` warm near-black |
| `surface` | `#F4EFE4` | `#1F1B14` |
| `surface-2` | `#EAE3D4` | `#2A251B` |
| `border` | `#DCD3C0` | `#3A3324` |
| `text` | `#2A261C` ink | `#F3EFE4` cream |
| `muted` | `#6E6759` | `#A8A18E` |
| `faint` | `#99927F` | `#7E7765` |
| `accent` | `#A47612` gold foil | `#F5A524` bright foil |
| `accent-soft` (text roles) | `#8A6210` | `#FFC65C` |
| `on-accent` | `#FFF9EC` | `#1C1408` |
| `success` | `#1F8A4C` | `#4ADE80` |
| `danger` | `#C0392B` | `#F87171` |
| scrollbars/focus | gold | gold |
| `color-scheme` | `light` | `dark` |

Because every component uses token classes (`bg-surface`, `text-muted`, `border-border`…),
both modes come nearly free; hardcoded spots (hero frame gradient, footer strip, overlays) get two-tone values.

### Typography
- **Fraunces** (serif, variable, `next/font/google`) — masthead, h1–h3, pull-quotes, wordmark
- **Inter** — body
- **JetBrains Mono** — kickers, chips, tech tags, "ledger" texture
- Headings via global base rule; wordmark Fraunces tight-tracked.

### Motion (Framer Motion, editorial restraint)
- Sections fade-rise ~12px on view, 0.05s stagger, `prefers-reduced-motion` respected
- Gold underline reveal + slight lift on cards; once-only masthead reveal in hero
- Theme toggle: cross-fade of icon, no layout shift

## 3. Parts (execution order)

### Part 0 — Repo plan + baseline ✅
- Copy this plan into the repo as `docs/REDESIGN_PLAN.md` (done).
- Baseline already committed: Terminal Amber checkpoint.

### Part 1 — Foundations: tokens, fonts, theme engine
Files: `web/src/app/globals.css`, `web/src/app/layout.tsx`, new `web/src/components/ui/ThemeToggle.tsx`.
- Dual palettes + `color-scheme`, `@custom-variant dark`, radius tokens (card 10px, chip 4px)
- Fraunces loaded (`--font-display`), Space Grotesk/amber replaced; no-flash script; metadata intact
- ThemeToggle: dual-icon flip button, localStorage + system fallback, placed in TopBar + mobile drawer
- Global ornament utilities: `.rule-gold` hairline, `.kicker` mono caption style
- **Test:** toggle on/off both modes on untouched current components — everything readable, no flash; commit `feat(theme): dual paper/ink token system, Fraunces display, theme toggle`

### Part 2 — UI kit re-treatment (paper components)
Files: `ui/TopBar.tsx`, `ui/SectionRail.tsx`, `ui/SocialRail.tsx`, `ui/Footer.tsx`,
`ui/Button.tsx`, `ui/Chip.tsx`, `ui/MobileActionBar.tsx`, `ui/SectionHeading.tsx`, `ui/ProjectCard.tsx`.
- TopBar: paper header, hairline border, Fraunces wordmark; warm shadow on scroll
- SectionHeading gains **numbered mono kickers** (`prop kicker: string` → `01 — Selected Work`)
- Rails: gold diamond markers, engraved labels, reordered sections (Part 3 order)
- Buttons: gold fill/cream text (light) ⇄ bright gold/dark text (dark) via tokens; soft warm shadow, print corners
- ProjectCard: gold metric seal, underline-reveal links, engraved image frame
- Footer: gold strip `#A47612 · #C49A32 · #E0C578 · #6B4F0E` (light) / brightened set (dark)
- **Test:** both modes on desktop + mobile drawer; commit `style(ui): hallmark paper treatment across UI kit`

### Part 3 — Home page editorial rebuild (structure + reorder)
Files: `web/src/components/sections/*.tsx`, `web/src/app/page.tsx`.
New order: **Hero → Projects `01` → Skills `02` → About `03` → Education `04` → Contact `05`**
- Hero "Masthead": giant Fraunces name, gold rules, role kicker, "Currently" line, CTAs, engraved portrait frame, `<dev />` + status badges kept
- Projects: asymmetric gallery (wide 2/3 + narrow 1/3 alternating), serif titles, mono problem→outcome kicker
- Skills: four engraved group panels; MERN core cluster with gold-foil border
- About: two-column spread — serif pull-quote left, bio + Currently list right
- Education: gold center-rule timeline + achievements as laurels
- Contact: correspondence letter styling, elegant form, contact cards
- Shared: numbered kickers, section fade-rise motion, `scroll-margin-top` kept
- **Test:** all six sections, both modes, 360px→1440px, anchor nav accuracy; commit `feat(home): hallmark editorial section rebuild with new order`

### Part 4 — Sub-pages
Files: `web/src/app/projects/page.tsx`, `web/src/app/projects/[slug]/page.tsx`, `web/src/app/resume/page.tsx`, `web/src/app/admin/**`.
- `/projects`: **Table of Works** — numbered rows (No. 01…), serif title + mono year/stack, gold hover rule, client-side stack filter chips (React / Node / AI-ML…), no backend change
- Case studies: feature-spread layout — serif title + value statement, gold-framed hero screenshot, sticky mono chapter TOC (5 README sections), gold pull-quote on "hard problem"
- `/resume`: letterhead sheet on desk-tone backdrop, print letter styling, PDF CTA
- Admin/login: retint to new palette (structure frozen)
- **Test:** filter + TOC behavior (both modes), resume download works, admin CRUD smoke test; commit `feat(pages): works index, case-study spreads, letterhead resume, admin retint`

### Part 5 — Functionality polish
Files: `ui/ProgressRule.tsx` (new), TopBar, case-study page, sections.
- 2px **gold progress hairline** top of viewport (editorial page marker)
- Back-to-top engraved footnote arrow (a11y `aria-label`)
- Sticky case-study chapter nav active-section highlight
- Motion audit: reduce/gate everything under `prefers-reduced-motion`
- **Test:** scroll behavior + a11y pass (keyboard, focus-visible, aria); commit `feat(ux): progress rule, back-to-top, chapter highlighting`

### Part 6 — Docs & closure
- `STYLE_REPORT.md` rewritten for dual-theme hallmark system (tokens, typography, components, do-nots)
- README design line, `docs/ARCHITECTURE.md` styling line
- Final `npm run build`; full visual QA checklist tick; commit `docs: hallmark redesign style report + references`

## 4. Verification checklist (repeated each part)

- [ ] `npm run build` green (Turbopack + TypeScript)
- [ ] Light and dark modes both readable (no contrast regressions, no white-on-gold / dark-on-dark)
- [ ] No theme flash on first paint; toggle persists across reload
- [ ] 360px / 768px / 1024px / 1440px widths: no horizontal scroll, touch targets ≥ 44px
- [ ] All six required sections reachable; resume PDF downloads; project live/code links work
- [ ] No blur classes introduced; icons inline SVG only; min 12px text; `prefers-reduced-motion` respected

## 5. Rollback

Each part is its own commit (`Part N` message above). Revert any part without losing others:
`git revert <commit>` — or return the whole site to the pre-redesign state:
`git reset --hard <terminal-amber-checkpoint-hash>`.

---

## Status

- [x] Concept approved (owner granted full structural freedom; content frozen)
- [x] Dual dark/light theme approved
- [x] Document written (this file)
- [x] Part 0 — plan committed to repo
- [x] Part 1 — foundations (tokens, fonts, theme engine) — committed
- [x] Part 2 — UI kit treatment — committed
- [x] Part 3 — home editorial rebuild — committed
- [x] Part 4 — sub-pages — committed
- [x] Part 5 — functionality polish — committed
- [x] Part 6 — docs & closure — done
- [x] Part 7 — responsive fluidity — committed
      (fluid rhythm tokens + `.section-pad`; hamburger/drawer at <xl, links xl+; journal drawer; correspondence slip socials; hero signature block; STYLE_REPORT updated)
- [x] Part 8 — Vercel setup — done
      (Atlas M0 cluster + `portfolio_admin` user + `0.0.0.0/0` allowlist; `web/.env` with MONGODB_URI / ADMIN_JWT_SECRET / NEXT_PUBLIC_SITE_URL=portfolio2-0-seven-liart.app → import via Vercel Raw Editor; pre-push audit: contact-API graceful 503 fallback, lint-clean ThemeToggle via `useSyncExternalStore`, body suppressHydrationWarning)
- [x] **Part 9 — Vercel-native admin core** — code complete; owner test + commit pending
      (serverless mongoose w/ global cache; models incl. new Education; jose-JWT httpOnly cookie login w/ bootstrap-on-first-verified-login + rate limit; proxy.ts guard + noindex headers; Blob upload endpoint; full admin CRUD: projects/skills/education/profile/messages + reorder; lib/api.ts → direct Atlas reads w/ `revalidateTag(tag,"max")`; contact → saves to Atlas inbox; admin creds generated in web/.env — env `$` escaping gotcha documented)
- [ ] Part 10 — full editing suite (admin UI)
      (Projects CRUD + case-study editor + screenshot gallery + reorder; Profile form + avatar; Skills reorder; Education editor; Resume replace upload; Messages inbox)

---

## ✅ Rebuild — Part 8 closed 2025-11; Parts 9–10 in flight (original terminal-amber revert point intact).

Full revert to the pre-redesign state: `git reset --hard <terminal-amber-checkpoint-hash>`.
