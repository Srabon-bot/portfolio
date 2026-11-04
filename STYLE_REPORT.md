# Srabon Portfolio — Theme & Style Reference (Hallmark Editorial Redesign)

> **Copy this entire document into your context** before making any UI or style changes to the codebase.
> Stack: **Next.js 16 (App Router) · Tailwind CSS v4 · TypeScript · Framer Motion**
> Root: `d:\Projects\portfolio 2.0\web\`
> Full redesign plan & changelog: `docs/REDESIGN_PLAN.md`

---

## 1. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Server + Client Components, Turbopack) |
| CSS | Tailwind CSS **v4** (`@import "tailwindcss"` + `@theme inline` — no `tailwind.config.js`) |
| Fonts | `next/font/google` (Fraunces, Inter, JetBrains Mono — self-hosted, no runtime request) |
| Animation | Framer Motion (`motion.div`, `motion.span`, spring & ease micro-interactions) |
| Icons | Inline SVG only — **strictly no external icon libraries** |
| Language | TypeScript strict |
| Theming | Dual "papers": light **Cream** edition (default) + dark **Ink** edition, class-based |

---

## 2. Color Palette — dual theme

All tokens are defined in `web/src/app/globals.css`. Light values sit in `@theme`
(emitted as `:root` custom properties); the `.dark` block overrides the same variable
names, so **every component is token-bound and re-skins automatically**.

| Token | CSS Variable | Light ("Cream") | Dark ("Ink") | Usage |
|---|---|---|---|---|
| Background | `--color-bg` | `#FBF8F1` | `#16130E` | Page background — warm paper |
| Surface | `--color-surface` | `#F4EFE4` | `#1F1B14` | Cards, modals, drawers |
| Surface 2 | `--color-surface-2` | `#EAE3D4` | `#2A251B` | Chips, inputs, icon badges |
| Border | `--color-border` | `#DCD3C0` | `#3A3324` | Hairline rules, card/input borders |
| Text | `--color-text` | `#2A261C` | `#F3EFE4` | Primary body text (warm ink / cream) |
| Muted | `--color-muted` | `#6E6759` | `#A8A18E` | Secondary text, descriptions |
| Faint | `--color-faint` | `#99927F` | `#7E7765` | Captions, uppercase tags, footer |
| Accent | `--color-accent` | `#A47612` | `#F5A524` | Gold foil — button fills, active bars, focus ring |
| Accent Soft | `--color-accent-soft` | `#8A6210` | `#FFC65C` | Gold TEXT roles: links, hover, active |
| On Accent | `--color-on-accent` | `#FFF9EC` | `#1C1408` | Text ON a gold fill (contrast rule) |
| Success | `--color-success` | `#1F8A4C` | `#4ADE80` | **ONLY** "Open to work" dot + form success |
| Danger | `--color-danger` | `#C0392B` | `#F87171` | **ONLY** form errors & critical alerts |

### Tailwind Usage
Usable directly as Tailwind utility classes:
```
bg-bg          text-text        bg-surface       border-border
text-muted     text-faint       text-accent      text-accent-soft
bg-accent      text-success     text-danger      text-on-accent
```
Opacity modifiers work on token colors (`bg-accent/20`, `bg-success/15`) — use `color-mix`
with tokens for inline styles (`color-mix(in srgb, var(--color-accent) 30%, transparent)`).

### Theme engine rules
- Class-based: `.dark` on `<html>`, plus `@custom-variant dark` in globals.css
- A pre-paint inline script in `layout.tsx` sets the class — priority:
  `localStorage["theme"]` → then OS `prefers-color-scheme`. **No theme flash.**
- The only way to change themes is the `ThemeToggle` component (sun/moon inline SVG)
  present in the TopBar, the mobile drawer, and the sub-page headers; it persists the
  explicit choice. **Do not introduce another theme library.**
- `color-scheme` is `light`/`dark` respectively (native widgets & scrollbars follow).

### Accent contrast rule
Gold fill + white text is forbidden. Text on any `bg-accent` fill uses `text-on-accent`
(cream in light mode, dark ink in dark mode).

### Mode-dependent gradients & strips
- `--gradient-frame` — hero portrait frame gradient (two-tone, defined per paper)
- `--strip-1 … --strip-4` — footer strip gold family (`#A47612 · #C49A32 · #E0C578 · #6B4F0E` in light)

---

## 3. Typography

### Fonts
Three fonts loaded via `next/font/google` in `layout.tsx`:

| Font | Variable | Used for |
|---|---|---|
| **Fraunces** (serif, variable) | `--font-fraunces` | All h1/h2/h3 headings (global base rule), mastheads, pull-quotes, "SRABON" wordmark, works-index titles |
| **Inter** | `--font-inter` | Primary sans body font, paragraphs |
| **JetBrains Mono** | `--font-jetbrains` | The "ledger" voice: kickers, chip labels, tech tags, chapter TOCs, section rails |

### Scale & Minimum Size Rules
- Heading 1 (masthead): Fraunces `clamp(2.5rem, 1.4rem + 4.2vw, 4.25rem)`, weight 600, leading `1.05`.
- Heading 2: `clamp(1.5rem, 1.2rem + 1vw, 2rem)`, font-bold with 34×3px gold underline bar.
- Heading 3: `text-base md:text-lg`, font-bold.
- Body: `text-base` (16px), line-height 1.6.
- Small: `text-xs` (12px) — **Minimum size everywhere**. Never sub-12px (`text-[11px]`).

### Editorial ornaments (globals.css `@layer components`)
- `.kicker` — mono uppercase numbered chapter label (`01 — Selected Work`), gold
- `.rule-gold` — engraved fading gold hairline
- `.paper-shadow` — warm paper shadow, deeper variant in `.dark`

---

## 4. Layout & Spacing

### Section Order (home page, hallmark editorial)
1. **Hero** (`#hero`) — masthead: serif name, gold rules, kicker row, CTAs, portrait with engraved frame
2. **Projects** (`#projects`) — `01 — Selected Work`, asymmetric 3/5–2/5 gallery + Research & ML strip
3. **Skills** (`#skills`) — `02 — My Toolbox`, 2-column engraved panels, MERN highlight chips
4. **About** (`#about`) — `03 — The Story`, serif pull-quote (first bio paragraph) + Currently list
5. **Education** (`#education`) — `04 — Credentials`, engraved cards
6. **Contact** (`#contact`) — `05 — Correspondence`, info cards + accessible form

Numbering continues across **sub-pages**: `/projects` is the unnumbered **Index** (Table of Works),
case studies use chapter TOCs `1. Problem … 7. Local Setup`.

### Breakpoint Strategy (Tailwind v4 defaults)
| Breakpoint | Behavior |
|---|---|
| `< sm` | Single-column everything; CTAs stack; drawer only; sticky bottom "correspondence slip" (social monograms + Resume/Contact); touch targets ≥ 44px |
| `md` | ThemeToggle appears in TopBar (phones flip papers via drawer row); sticky slip hidden; footer in row; asymmetric project spans engage (`md:grid-cols-5`) |
| `lg` | 2-col Hero; case-study study grid + sticky ChapterNav; About "Currently" beside bio |
| `xl` | TopBar inline links + centered Projects link; hamburger/drawer retired (drawer lives < xl); rails visible (`SectionRail` diamonds, `SocialRail`); works index rows two-sided |
| `2xl` | Rail labels on hover/active; container expands to 1200px |

**Nav declutter rule (Part 7):** below `xl` the TopBar carries only wordmark · ThemeToggle (md+) · Resume pill (md+) · hamburger — the drawer is the navigation (numbered mono contents `01…05`, gold Resume pill, email, socials). Like the rails, inline links exist only in the roomy ≥1280px band.

### Fluid Sizing Rules
- **Fluid rhythm (Part 7):** spacing and gutters scale continuously with the viewport via
  `clamp()` tokens — no jumps at breakpoints:
  - `--space-section: clamp(3rem, 2.2rem + 3.2vw, 6rem)` — applied via the `.section-pad`
    component class on every home section + case-study article
  - `--space-block: clamp(1rem, 0.85rem + 0.6vw, 1.5rem)` — card/list/grid block gaps
  - `--pad-container: clamp(1rem, 0.55rem + 1.8vw, 2rem)` — `Container.tsx` gutters (inline style)
  - Hero/About/Contact column gaps use inline `clamp(2rem…3rem)` / `clamp(2.5rem…4rem)`
- Container max-width `1100px` (`2xl::1200px`), centered
- Portrait size: `clamp(120px, 22vw, 280px)`
- Masthead fluid clamp (`clamp(2.5rem, 1.4rem + 4.2vw, 4.25rem)`), H2 clamp
- Small text floored at 12px (`text-xs`) — never below
- Sticky TopBar offset: `scroll-margin-top: 4.5rem` on every section
- Print corners: cards `rounded-[10px]` (`--radius-card`), chips radius 4px pills, inputs/buttons `rounded-lg`
- Overflow prevention: `overflow-wrap: anywhere` on all dynamic titles/descriptions

---

## 5. Components

### ThemeToggle (`ui/ThemeToggle.tsx`)
- Sun/moon inline SVG flip; shows the paper you would switch TO
- Persists to `localStorage["theme"]`; aria-pressed; 44×44 target

### ScrollMarker (`ui/ScrollMarker.tsx`)
- `ProgressRule`: 2px gold hairline, top of viewport, rAF-throttled reading progress
- `BackToTop`: engraved circular arrow after 600px; cleared of the mobile action bar

### Button (`ui/Button.tsx`)
- `primary`: gold fill + `text-on-accent`; `secondary`: surface + hairline border
- Print corners (`rounded-lg`), Framer Motion scale 1.02/0.98

### SectionHeading (`ui/SectionHeading.tsx`)
- Optional `index` + `kicker` → `.kicker`-styled numbered chapter label above title
- Optional subtitle in muted; gold 34×3px underline seal

### ProjectCard (`ui/ProjectCard.tsx`)
- 16:9 `next/image` preview, engr-paper card (`rounded-[10px]`, `paper-shadow`)
- Gold metric seal (`text-accent-soft` on surface-2, accent/40 border)
- Stack chips (mono) + Live / Code / Case-study links

### WorksIndex (`works/WorksIndex.tsx`) — `/projects`
- Client-side filter chips: All / Full-Stack / Frontend / Research & ML (counts inside)
- Numbered rows (`No. 01`), serif titles, mono stack ledger, Live ↗ / Code ↗ / Study →

### ChapterNav (`works/ChapterNav.tsx`) — case studies
- Sticky mono chapter TOC; IntersectionObserver active gold diamond + `aria-current`

### SectionRail (`ui/SectionRail.tsx`) · SocialRail (`ui/SocialRail.tsx`)
- Gold diamond markers with active pulse; engraved labels at 2xl; correct chapter order
- Left social rail: inline SVG, gold hover, inert on mobile (footer renders them)

### TopBar (`ui/TopBar.tsx`) · MobileActionBar (`ui/MobileActionBar.tsx`)
- 3-col bar: Fraunces wordmark | centered Projects link (xl-only) | inline links (xl+) + ThemeToggle (md+) + Resume pill (md+) + hamburger (<xl)
- Warm `paper-shadow` appears after scrolling; drawer = journal contents (numbered mono chapters, gold Resume pill, email, socials, dark-paper row)
- `MobileActionBar` = mobile "correspondence slip" (`md:hidden`): LinkedIn/GitHub monogram icons + gold Resume + Contact buttons, all ≥ 44px

### Hero signature block (`HeroSection.tsx`)
- Engraved social monogram row (gold diamond · LinkedIn · GitHub · Email) at the foot of the
  hero text column — "letter signature" placement, visible on **every** breakpoint,
  crosses the mobile slip + footer + drawer as a third social surface

### ContactSection (`sections/ContactSection.tsx`)
- Contact cards (engraved), honeypot bot trap, spinner, `aria-live` status using
  success/danger ONLY — status pills use `color-mix` with the tokens so both papers pass

---

## 6. What NOT to Do

1. **NO blur/backdrop-blur**: solid surfaces + hairline borders only.
2. **Success & Danger rule**: success ONLY for the "Open to work" dot and form success;
   danger ONLY for form errors and destructive admin actions. No arbitrary new colors —
   use tokens (incl. `color-mix`), never raw hexes outside `globals.css`/`--strip-*`/`--gradient-frame`.
3. **NO icon libraries**: inline SVG with `aria-hidden="true"` only.
4. **NO sub-12px text**: minimum `text-xs` (12px) everywhere.
5. **NO white text on gold**: any accent fill gets `text-on-accent` (both papers).
6. **NO hardcoded `text-white`/`text-black`**: use `text-text` / `text-on-accent`.
7. **NO percentage progress bars in Skills**: grouped mono chips only.
8. **NO horizontal scroll**: verified at 360px; `overflow-wrap: anywhere` on dynamic text.
9. **NO invented personal data**: placeholder content must be flagged (TODO/PLACEHOLDER) and hidden where the sections already do (e.g. Education achievements block).
10. **NO arrow icons in navigation** (TopBar, rails, drawer, footer, mobile bar). Arrows allowed only in content links (hero CTAs, project links, works-index rows).
11. **NO theme flash**: only the pre-paint script touches the theme before hydration; suppressHydrationWarning stays on `<html>`.
12. **Respect `prefers-reduced-motion`**: gate JS-driven motion (e.g. `useReducedMotion()` in HeroSection); CSS handles the rest.

---

## 7. File Map

```
web/
├── public/
│   ├── og.png                     # OpenGraph preview (placeholder, see OG_IMAGE_TODO.txt)
│   ├── resume.pdf / .docx         # Recruiter-facing downloads
│   └── projects/                  # Project screenshots
└── src/
    ├── app/
    │   ├── globals.css            # Tailwind v4 entry + dual-theme tokens + ornaments
    │   ├── layout.tsx             # Root layout: Fraunces/Inter/JetBrains, theme bootstrap, ProgressRule, BackToTop
    │   ├── page.tsx               # Home: Hero → Projects 01 → Skills 02 → About 03 → Education 04 → Contact 05
    │   ├── robots.ts / sitemap.ts
    │   ├── resume/page.tsx        # Letterhead CV view + PDF/DOCX download
    │   ├── projects/page.tsx      # Index — works index header + <WorksIndex/>
    │   ├── projects/[slug]/page.tsx # Case-study spread + sticky ChapterNav (5-section README structure)
    │   └── admin/**               # Private dashboard (functionality frozen, hall-retinted)
    ├── components/
    │   ├── sections/
    │   │   ├── HeroSection.tsx    # Masthead hero (useReducedMotion-gated levitation)
    │   │   ├── ProjectsSection.tsx# 01 — Selected Work: asymmetric gallery + ML strip
    │   │   ├── SkillsSection.tsx  # 02 — My Toolbox panels
    │   │   ├── AboutSection.tsx   # 03 — The Story: pull-quote + Currently
    │   │   ├── EducationSection.tsx # 04 — Credentials
    │   │   └── ContactSection.tsx # 05 — Correspondence
    │   └── ui/
    │   │   ├── Button.tsx  Chip.tsx  Container.tsx  Footer.tsx
    │   │   ├── MobileActionBar.tsx  ProjectCard.tsx  SectionHeading.tsx
    │   │   ├── SectionRail.tsx  SocialRail.tsx  TechIcon.tsx  TopBar.tsx
    │   │   ├── ThemeToggle.tsx    # sun/moon paper switch (localStorage)
    │   │   └── ScrollMarker.tsx   # ProgressRule + BackToTop
    │   └── works/
    │       ├── WorksIndex.tsx     # Numbered table of works + filters
    │       └── ChapterNav.tsx     # Sticky case-study chapter TOC
    ├── lib/ (api.ts, seed-data.ts)
    └── types/index.ts
```
