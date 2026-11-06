# Clay Playful Theme — branch reference (`redesign/clay-playful`)

> Experiment branch: re-skins the portfolio with the uupm.cc "Educational Platform"
> claymorphism recipe. `main` keeps the Hallmark Editorial theme untouched.
> Copy this doc into context before making UI changes on this branch.

## 1. Concept
Soft claymorphism with a neubrutalist twist: plump 24px-radius cards, 2.5–3px ink
outlines, hard offset shadows (`6px 6px 0 ink`) that "press" on hover, pastel
fills (peach / sky / mint / lavender), green CTA accents, round Fredoka headings
and soft Nunito body text. Light-only for now.

## 2. Tokens (`web/src/app/globals.css`)
All token NAMES from the editorial theme are preserved (every component re-skins
from the token file alone). New tokens added: `--color-ink` (clay outlines +
shadow color), `--color-peach/-deep`, `--color-sky/-deep`, `--color-mint`,
`--color-lavender`.

| Token | Clay value | Role |
|---|---|---|
| `--color-bg` | `#FFF9F5` | page background (warm cream) |
| `--color-surface` | `#FFFFFF` | clay card faces |
| `--color-surface-2` | `#F1F5F9` | chips, inputs, soft fills |
| `--color-border` | `#E2E8F0` | soft hairlines (rails, dividers) |
| `--color-ink` | `#2D3748` | clay outlines + hard shadow color (also text) |
| `--color-accent` | `#22C55E` | green CTA fills, focus ring |
| `--color-accent-soft` | `#16A34A` | green text roles (links, hovers) |
| `--color-on-accent` | `#FFFFFF` | text on green fills |
| radii | card `24px` · chip `16px` | plump shapes |
| fonts | Fredoka (h1–h3/wordmarks) · Nunito (body) | via `next/font/google` |

`font-mono` maps to a **system mono stack** (no webfont) — used only by code
blocks and admin tooling.

## 3. Core component recipes
- `.clay-card` — `2.5–3px` ink border, `6px 6px 0 ink` shadow + inset bottom
  shading; hover shrinks shadow to `4px` + `translate(2px, 2px)` (press).
- `.clay-btn` (+ `-primary` green / `-secondary` white) — same press mechanic,
  3px ink border, 16px radius. `:active` presses deeper.
- `.clay-soft` — borderless soft clay for quiet panels.
- `.paper-shadow` — legacy class, remapped to `4px 4px 0 ink`.
- `.rule-gold` — legacy class, now a soft pastel gradient capsule divider.
- `.kicker` — Nunito 800 uppercase label; paired with pebble chips in headings.
- `.blob` — organic decorative shape (hero accents).
- `.bar-shadow` — soft floating shadow for the sticky TopBar / mobile dock.

## 4. Structure notes / deviations
- **Dark mode is dormant**: light-only; the pre-paint `THEME_BOOTSTRAP` script,
  ThemeToggle component, and `.dark` token overrides are retired on this branch
  (component file kept but unused). Toggle remains available on `main`.
- Hero gained a `stats` prop (real published-project & skill counts from
  `page.tsx`) rendered as playful pebble pills — no invented data.
- Skill panel headers render as pastel pill labels (peach/sky/mint/lavender).
- Case-study sections keep the 5-chapter structure; only surfaces are clay.
- Admin is functionally frozen; it inherits tokens automatically.

## 5. Rules that still hold
inline SVG only · 12px min text · 44px targets · no horizontal scroll (360px
check) · success/danger color restrictions · `prefers-reduced-motion`
respected · content/data frozen · `npm run build` green per commit.
