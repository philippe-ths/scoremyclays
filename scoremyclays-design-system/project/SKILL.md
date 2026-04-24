---
name: scoremyclays-design
description: Use this skill to generate well-branded interfaces and assets for ScoreMyClays — the UK clay pigeon shooting score tracker — either for production or throwaway prototypes / mocks / decks. Contains essential design guidelines, colors, type, fonts, assets, and a mobile UI kit.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

Key files:
- `README.md` — Product context, content fundamentals, visual foundations, iconography, caveats.
- `colors_and_type.css` — All design tokens (color scales, semantic colors, type scale, spacing, radii, shadows, motion). Import this first.
- `assets/` — Logo, app icon mark, clay-pigeon motif.
- `preview/` — Per-token preview cards you can reference as visual examples.
- `ui_kits/app/` — Working mobile UI kit (iOS-framed, 7 screens). `Components.jsx` + `Screens.jsx`. Copy components out or import wholesale.

If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out and create static HTML files for the user to view. Prefer the tokens from `colors_and_type.css` over inventing new values.

If working on production code, copy assets and read the rules in README.md to become an expert in designing with this brand.

If the user invokes this skill without guidance, ask them what they want to build or design, ask some clarifying questions (surface? flow? screens? variations?), and act as an expert designer who outputs HTML artifacts or production code.

## Quick brand summary
- **Voice:** Confident, sport-literate, direct. Second-person. UK-English vocabulary (*ground*, *stand*, *bird*, *discipline*).
- **Primary color:** Field green `#2c4e22` (`--field-700`).
- **Accent:** Clay orange `#d96515` (`--clay-500`) — used sparingly.
- **Bg:** Warm bone `#faf8f3` (`--bone-50`). Never cold white.
- **Fonts:** Fraunces (display), Inter (UI/body), JetBrains Mono (scores/numbers). All flagged as placeholder substitutions.
- **Shadows:** Warm-tinted (`rgba(24,22,15,...)`), two-layer.
- **Radii:** Cards 16px, sheets 20–28px, pills for primary CTAs.
- **No-go:** neon, bluish-purple gradients, left-border accent cards, decorative emoji, hand-drawn SVG illustrations.
