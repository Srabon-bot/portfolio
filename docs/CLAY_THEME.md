# Clay Playful Theme — branch reference (`redesign/clay-playful`)

> Experiment branch: re-skins the portfolio with the uupm.cc "Educational Platform"
> claymorphism recipe + a companion dark mode ("Clay Dusk"). `main` keeps the
> Hallmark Editorial theme untouched. Copy this doc into context before making
> UI changes on this branch.

## 1. Concept
Soft claymorphism with a neubrutalist twist: plump 24px-radius cards, 2.5–3px ink
outlines, hard offset shadows (`6px 6px 0`) that "press" on hover, pastel fills
(peach / sky / mint / lavender), green CTA accents, round Fredoka headings and
soft Nunito body text.
**Dark mode = "Clay Dusk"**: the slate hue family of light ink `#2D3748` pushed
to a dusk range; pastels keep their hue but drop ~20 saturation points;
elevation inverts (page bg is the darkest value, cards sit lighter on top).

## 2. Tokens (`web/src/app/globals.css`)
All token NAMES from the editorial theme are preserved (every component re-skins
from the token file alone). New tokens: `--color-ink` + `--color-ink-shadow`,
`--color-on-accent`, `--color-on-pastel`, pastels `--color-peach/-deep`,
`--color-sky/-deep`, `--color-mint`, `--color-lavender`.
Dark values live in a `.dark {}` block after `:root` (later rule, same
specificity on `html.dark` → wins). `color-scheme` flips per mode.

| Token | Light "Clay" | Dark "Clay Dusk" | Role |
|---|---|---|---|
| `--color-bg` | `#FFF9F5` | `#171C24` | page background |
| `--color-surface` | `#FFFFFF` | `#202731` | clay card faces |
| `--color-surface-2` | `#F1F5F9` | `#2A323F` | chips, inputs, soft fills |
| `--color-border` | `#E2E8F0` | `#3A4451` | soft hairlines |
| `--color-ink` | `#2D3748` | `#93A5BA` | clay OUTLINE stroke (also base ink text) |
| `--color-ink-shadow` | `#2D3748` | `#0B0E13` | hard OFFSET shadows — split from ink |
| `--color-text` | `#2D3748` | `#E9EEF5` | primary text |
| `--color-muted` | `#556680` | `#A5B0BD` | secondary text |
| `--color-faint` | `#5F7186` | `#8F9DA9` | captions, footers |
| `--color-accent` | `#22C55E` | `#22C55E` | green CTA fills, focus ring |
| `--color-accent-soft` | `#15803D` | `#4ADE80` | green TEXT (links, kickers, hovers) |
| `--color-on-accent` | `#2D3748` | `#0B0E13` | ink ON a green fill — never white |
| `--color-on-pastel` | `#2D3748` | `#0B0E13` | ink ON a pastel fill — never near-white |
| pastels | `#FDBCB4` / `#ADD8E6` / `#98FF98` / `#E6E6FA` | `#E89A92` / `#7FB0C7` / `#8FDE9B` / `#C6C6EF` | badge & pill fills |
| success / danger | `#15803D` / `#DC2626` | `#34D399` / `#F87171` | restricted roles |
| strip/gradient vars | light pastels | dark pastels | footer strip, hero frame |

`font-mono` maps to a **system mono stack** (no webfont) — code blocks & admin.

## 3. Contrast (WCAG 2.1, all computed locally — recheck via coolors.co when editing)
Dark: text/bg 14.7 · text/card 12.9 · muted/card 6.8 · faint/card 5.4 ·
accent-soft/card 8.6 · ink-on-green 8.5 · ink-on-pastels 8.2–12.1.
Light: text/bg 11.5 · muted/surface-2 5.3 · faint/bg 4.8 · accent-soft/card 5.0 ·
ink-on-green 5.3 · ink-on-pastels 7.4–9.8. All AA ✅, most AAA.
**Never** put white text on green or near-white text on pastels — both fail
(~2.3 / ~1.9). Use `--color-on-accent` / `--color-on-pastel`.

## 4. Theming mechanics
- Pre-paint theme bootstrap: `components/ThemeBootstrap.tsx` injects the tiny
  script into the SSR `<head>` via Next's `useServerInsertedHTML`, so it runs
  before first paint (no FOUC) while staying **outside the React tree** — a
  raw `<script>` in the layout (or next-themes' approach) trips React 19's
  "Encountered a script tag while rendering React component" dev error, and
  `next/script`'s `beforeInteractive` is deferred until after first paint in
  the app router (`self.__next_s`, async chunks), which would flash. Saved
  choice (`localStorage["theme"]`) → OS preference; adds `.dark` to `<html>`.
- `ThemeToggle` (inline SVG, 44px target, MutationObserver on `<html>`) renders in
  TopBar desktop + mobile drawer, and on `/projects`, case-study, `/resume` bars.
- All hard-offset shadows across components use `var(--color-ink-shadow)`
  (regexp-split from `--color-ink` in one pass); borders keep `--color-ink`.
- Text roles sitting on pastel fills use `text-on-pastel` /
  `var(--color-on-pastel)` (hero badges, skill pills, chips, metric seals,
  drawer numbers, resume pill, back-to-top, education icon stroke).

## 5. Core component recipes
- `.clay-card` — `2.5–3px` ink border, `6px 6px 0 ink-shadow` + inset bottom
  shading; hover shrinks shadow to `4px` + `translate(2px, 2px)` (press).
- `.clay-btn` (+ `-primary` green / `-secondary` white) — same press mechanic,
  3px ink border, 16px radius. `:active` presses deeper.
- `.clay-soft` — borderless soft clay for quiet panels.
- `.paper-shadow` — legacy class, remapped to `4px 4px 0 ink-shadow`.
- `.rule-gold` — legacy class, now a soft pastel gradient capsule divider
  (strip/gradient vars flip in dark).
- `.kicker` — Nunito 800 uppercase label in accent-soft (passes in both modes).
- `.blob`, `.bar-shadow` (dark-boosted) — hero accents / bar float shadow.

## 6. Motion kit (`src/lib/motion.ts` + `ui/Reveal.tsx`)
Shared vocabulary so every element moves with the same feel:
- `EASE_CLAY` `cubic-bezier(0.34, 1.56, 0.64, 1)` (uupm clay bounce),
  `CLAY_SPRING` (stiffness 320 / damping 24), `fadeUp` (16px rise, 450ms),
  `STAGGER` 0.07s, `revealViewport` `{ once: true, margin: "-40px" }`
- `<Reveal>` — client wrapper for scroll entrances; usable inside Server
  Components; renders plain `<div>` under reduced motion.
Rules: transform/opacity only (no CLS) · entrances fire once · ≤ 500ms ·
framer animations MUST be gated with `useReducedMotion()` (the CSS kill-switch
in globals.css does not affect framer) — applied in Hero, Skills, ProjectCard,
TopBar drawer, ThemeToggle, Reveal.
Applied to: Hero (existing choreography, shared variants), skills panels,
project cards + ML rows, education cards, about card + status + currently,
contact cards + form, mobile drawer spring, theme-toggle icon flip.
Deliberately not animated: footer strips, stats pebbles (plain fade), no
parallax/scroll-jacking, no route transitions, no infinite loops outside hero.

## 7. Structure notes / deviations
- Hero gained a `stats` prop (real published-project & skill counts) shown as
  pebble pills — no invented data.
- Skill panel headers render as pastel pill labels (one pastel per box).
- Case-study sections keep the 5-chapter structure; only surfaces are clay.
- Admin is functionally frozen; inherits tokens automatically (incl. dark).
- Dark-clay reference sources: no pre-built dark clay palette existed in the
  uupm.cc 95-palette DB (their style DB also marks claymorphism dark as
  "conditional" — manual contrast work required); Clay Dusk hue was derived
  from the light theme's ink `#2D3748` per Material/NN dark-mode guidance.

## 8. Rules that still hold
inline SVG only · 12px min text · 44px targets · no horizontal scroll (360px
check) · success/danger color restrictions · `prefers-reduced-motion`
respected · content/data frozen · `npm run build` green per commit.
