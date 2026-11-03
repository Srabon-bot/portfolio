# Srabon Portfolio — Theme & Style Reference (Hiring Redesign)

> **Copy this entire document into your context** before making any UI or style changes to the codebase.
> Stack: **Next.js 16 (App Router) · Tailwind CSS v4 · TypeScript · Framer Motion**
> Root: `d:\Projects\portfolio 2.0\web\`

---

## 1. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Server + Client Components, Turbopack) |
| CSS | Tailwind CSS **v4** (`@import "tailwindcss"` + `@theme inline` — no `tailwind.config.js`) |
| Fonts | `next/font/google` (Inter, JetBrains Mono, Space Grotesk — self-hosted, no runtime request) |
| Animation | Framer Motion (`motion.div`, `motion.span`, spring & ease micro-interactions) |
| Icons | Inline SVG only — **strictly no external icon libraries** |
| Language | TypeScript strict |

---

## 2. Color Palette

All tokens are defined in `web/src/app/globals.css` under `@theme inline` (Tailwind v4) and as CSS variables:

| Token | CSS Variable | Hex | Usage |
|---|---|---|---|
| Background | `--color-bg` | `#0D0D0C` | Page background — warm near-black |
| Surface | `--color-surface` | `#141413` | Cards, modals, drawers |
| Surface 2 | `--color-surface-2` | `#1C1C19` | Chips, inputs, icon badges, secondary containers |
| Border | `--color-border` | `#2B2B27` | Card, input, divider, and rail borders |
| Text | `--color-text` | `#F3F2EC` | Primary body text — warm off-white |
| Muted | `--color-muted` | `#A5A49B` | Secondary text, descriptions, subtitles |
| Faint | `--color-faint` | `#7E7D73` | Captions, uppercase tags, footer text, rail icons |
| Accent | `--color-accent` | `#F5A524` | Primary amber — button fills, active bars, focus ring |
| Accent Soft | `--color-accent-soft` | `#FFC65C` | Text links, hover states, active indicators |
| On Accent | `--color-on-accent` | `#1C1408` | Text placed ON an accent fill (contrast rule) |
| Success | `--color-success` | `#4ADE80` | **ONLY** for "Open to work" status dot & form success |
| Danger | `--color-danger` | `#F87171` | **ONLY** for form errors & critical alerts |

> **Removed Token:** `--color-blob` has been removed. Fills use solid `--color-accent` or sleek layered gradients.

### Accent contrast rule
Amber is a light fill: never place white text on it. Use `text-on-accent` (`--color-on-accent`, `#1C1408`) on `bg-accent` fills (buttons, MobileActionBar "Resume", contact submit).

### Tailwind Usage
Usable directly as Tailwind utility classes:
```
bg-bg          text-text        bg-surface       border-border
text-muted     text-faint       text-accent      text-accent-soft
bg-accent      text-success     text-danger      text-on-accent
```

### Footer Color Strip
Four decorative segments in the footer top strip:
`#F5A524` · `#FFC65C` · `#FFE0A3` · `#7A5414`

---

## 3. Typography

### Fonts
Three fonts loaded via `next/font/google` in `layout.tsx`:

| Font | Variable | Weights | Used for |
|---|---|---|---|
| **Inter** | `--font-inter` | 400, 500, 600, 700 | Primary sans body font, paragraphs |
| **JetBrains Mono** | `--font-jetbrains` | 400, 500, 600 | Chip labels, uppercase captions, tech tags, hero stack |
| **Space Grotesk** | `--font-grotesk` | variable | All h1/h2/h3 headings (global base rule) and the "SRABON" wordmark |

### Scale & Minimum Size Rules
- Heading 1: `text-4xl md:text-5xl lg:text-6xl`, font-bold, tracking-tight.
- Heading 2: `text-2xl md:text-3xl`, font-bold with 34×3px `--color-accent` underline bar.
- Heading 3: `text-base md:text-lg`, font-bold.
- Body: `text-base` (16px), line-height 1.6.
- Small: `text-xs` (12px) — **Minimum size everywhere**. Never use sub-12px (`text-[11px]`).

---

## 4. Layout & Spacing

### Section Order (Hiring-First Hierarchy)
1. **Hero** (`#hero`) — Introduction, "Open to work" badge, core stack chips, two CTAs.
2. **Projects** (`#projects`) — Featured 16:9 ProjectCards, problem/outcome, metrics, code/demo links.
3. **Skills** (`#skills`) — 2-column balanced grid across 4 groups with MERN highlight chips and legend.
4. **Education & Achievements** (`#education`) — Academic history at UITS and verified honors.
5. **About** (`#about`) — Background, CSE degree status, and live "Currently" list.
6. **Contact** (`#contact`) — Direct links with SVG icons + accessible contact form.

### Breakpoint Strategy (Tailwind v4 Default Breakpoints)

| Breakpoint | Range | Navigation & Layout Behavior |
|---|---|---|
| `< sm` | `< 640px` | Single-column grids everywhere; CTAs stack; Hamburger + drawer navigation; sticky bottom bar active; touch targets ≥ 44×44px. |
| `sm` | `640px – 767px` | 2×2 Skills grid; 2×2 Contact info cards; row CTAs in Hero; sticky bottom bar active. |
| `md` | `768px – 1023px` | Sticky bottom bar hidden; Footer displays in row; TopBar retains hamburger + drawer (< 1024px) to prevent 5 inline links crowding. |
| `lg` | `1024px – 1279px` | TopBar inline links visible; Hamburger hidden; rails hidden (no overlap); 2-column Hero (min-height `100dvh - 3.5rem`); About "Currently" beside bio; Contact form beside cards. |
| `xl` | `1280px – 1535px` | Rails visible (`SectionRail` and `SocialRail`). `SectionRail` renders dots only (no labels) so 1100px content is never overlapped. |
| `2xl` | `≥ 1536px` | `SectionRail` displays horizontal labels on hover/active. Container max width expands up to 1200px. |

### Fluid Sizing Rules
- **Container Padding:** `px-4 sm:px-6 lg:px-8`, max-width `1100px` (`2xl:max-w-[1200px]`), centered.
- **Section Padding:** `py-12 sm:py-16 lg:py-24`.
- **Hero Title Clamp:** `clamp(2rem, 1.2rem + 3.5vw, 3.5rem)`.
- **Section Heading Clamp:** `clamp(1.5rem, 1.2rem + 1vw, 2rem)` with 34×3px `--color-accent` bar.
- **Body Text:** Strict `16px` (`text-base`), line-height 1.6.
- **Hero Avatar Size:** `clamp(120px, 22vw, 280px)`.
- **Block Spacing:** `gap-4 sm:gap-5 lg:gap-6`.
- **Sticky TopBar Offset:** `scrollMarginTop: "4.5rem"` on each section so headings are never covered.
- **Touch Target Minimum:** At least `44×44px` for all interactive elements via `min-h-11` or padding.
- **Overflow Prevention:** `overflow-wrap: anywhere` and `break-words` on all dynamic card titles and descriptions.

---

## 5. Components

### Button (`web/src/components/ui/Button.tsx`)
Replaces legacy `BlobButton`.
- `variant="primary"`: Solid `--color-accent` background with `--color-on-accent` text (amber needs dark text for contrast).
- `variant="secondary"`: Outlined `--color-border`, surface background, hover border accent.
- Micro-interactions: Framer motion `whileHover={{ scale: 1.02 }}`, `whileTap={{ scale: 0.98 }}`.

### ProjectCard (`web/src/components/ui/ProjectCard.tsx`)
- 16:9 screenshot preview with `next/image`.
- One-line problem / outcome statement.
- Optional key metric badge (e.g. "40% faster rendering").
- Stack chips using JetBrains Mono.
- Direct links for Live demo ↗, GitHub code ↗, and Case study →.

### Chip (`web/src/components/ui/Chip.tsx`)
- JetBrains Mono tech badge with `TechIcon`.
- Size options: `sm`, `md` (standard in Skills cards), `lg`.
- `highlight` prop: Core MERN stack items (MongoDB, Express, React, Node.js) styled with `border-color: color-mix(in srgb, var(--color-accent) 50%, transparent)` and `text-text`.

### SkillsSection (`web/src/components/sections/SkillsSection.tsx`)
- 2-column balanced grid (`grid-cols-1 md:grid-cols-2 gap-4 md:gap-5`).
- 4 balanced categories:
  - Frontend (7)
  - Backend & Database (7)
  - Tooling & Deployment (6)
  - AI/ML & Languages (9)
- Core stack (MERN) legend under section subtitle with 8px accent dot.
- Subtle card border hover (`color-mix(in srgb, var(--color-accent) 30%, transparent)`).
- 0.05s staggered entrance animation respecting `prefers-reduced-motion`.

### SectionRail (`web/src/components/ui/SectionRail.tsx`)
- Horizontal tooltips and labels (no vertical `writing-mode`).
- Active indicator dot with pulsing ring.
- IntersectionObserver tracking corresponding to the 6 page sections.

### ContactSection (`web/src/components/sections/ContactSection.tsx`)
- Inline SVG external link icons (`aria-hidden="true"`).
- Working contact form with honeypot bot trap.
- Loading spinner and accessible live region (`aria-live="polite"`).
- State messages using `--color-success` and `--color-danger`.

---

## 6. What NOT to Do

1. **NO blur or backdrop-blur**: Do not use `backdrop-blur-*` or `blur-*` classes anywhere. Use clean, high-contrast solid surfaces (`--color-surface`, `--color-surface-2`) with subtle borders.
2. **Success & Danger rule**: Use `--color-success` (`#34D399`) **ONLY** for the "Open to work" status dot and form success state. Use `--color-danger` (`#F87171`) **ONLY** for form error states. Do not invent arbitrary colors.
3. **NO icon libraries**: Do not install or import Lucide, React Icons, FontAwesome, etc. Write clean inline SVG icons with `aria-hidden="true"`.
4. **NO sub-12px text**: Always maintain a minimum font size of `text-xs` (12px).
5. **NO percentage progress bars in Skills**: Skills are grouped into clean chip tags.
6. **NO horizontal scroll**: Verify `overflow-x: hidden` and check responsiveness at 360px viewport width.
7. **NO invented personal data**: Mark placeholder information with `// TODO:`.
8. **NO arrow icons in navigation**: All nav buttons and links (TopBar wordmark, centered "Projects" link, Resume pill, inline links, mobile drawer, SectionRail, SocialRail, Footer nav links, and MobileActionBar) have NO arrow icons (`↗`, `→`, `->`, `↓`, chevrons). Nav buttons and links show clean text only (plus existing social SVG logos on social links). Where links open in a new tab, accessibility is preserved with `aria-label="Resume (opens in a new tab)"` and `target="_blank" rel="noopener noreferrer"`. Arrows remain permitted only in content components (Hero CTAs, ProjectCard links, Contact cards).

---

## 7. File Map

```
web/
├── public/
│   ├── og.png                     # OpenGraph preview image (placeholder, see OG_IMAGE_TODO.txt)
│   ├── resume.pdf                 # Recruiter-facing PDF resume
│   └── projects/                  # Project screenshots and assets
└── src/
    ├── app/
    │   ├── globals.css            # Tailwind v4 entry point + design tokens (@theme inline)
    │   ├── globals.legacy.css     # Backup reference of legacy theme (not imported)
    │   ├── layout.tsx             # Root layout: Inter + JetBrains Mono + Space Grotesk, SEO metadata
    │   ├── page.tsx               # Home page: Hero -> Projects -> Skills -> Education -> About -> Contact
    │   ├── robots.ts              # Search engine crawler directives
    │   ├── sitemap.ts             # XML sitemap generator
    │   └── projects/[slug]/page.tsx # Detailed case study route (Problem, Architecture, Auth, Deployment, Hard problem)
    ├── components/
    │   ├── sections/
    │   │   ├── HeroSection.tsx    # Introduction, Open to work badge, stack chips, dual CTAs
    │   │   ├── ProjectsSection.tsx# Featured works grid
    │   │   ├── SkillsSection.tsx  # 2-column balanced grid across 4 groups with MERN highlights
    │   │   ├── EducationSection.tsx # Merged Education & Achievements section
    │   │   ├── AboutSection.tsx   # Biography and current pursuits
    │   │   └── ContactSection.tsx # Contact channels and form with accessible status
    │   └── ui/
    │       ├── Button.tsx         # Primary and secondary button component (Framer Motion)
    │       ├── Chip.tsx           # JetBrains Mono tech badge with TechIcon
    │       ├── MobileActionBar.tsx# Mobile-only sticky bottom bar for Resume & Contact
    │       ├── ProjectCard.tsx    # 16:9 card with metric & links
    │       ├── SectionHeading.tsx # Section title + 34x3px accent underline bar
    │       ├── SectionRail.tsx    # Desktop right-side nav with horizontal labels
    │       ├── SocialRail.tsx     # Desktop left-side social links
    │       └── TopBar.tsx         # 3-col navbar with centered Projects link & wordmark
    └── types/
        └── index.ts               # Shared TypeScript interfaces (Project, Profile, Skill, etc.)
```
