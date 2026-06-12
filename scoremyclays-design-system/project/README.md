# ScoreMyClays Design System

**Version:** 0.1.0
**For:** ScoreMyClays — a clay pigeon shooting score tracker, analytics, and social app for the UK clays community.

---

## Product Context

ScoreMyClays is a mobile-first app for competitive and recreational clay pigeon shooters. It addresses six core product pillars:

1. **Core Scoring System** — Real-time score entry with offline support (HIT / MISS / No Bird per shot, per stand). Dark mode for outdoor sunlight.
2. **Performance Analytics** — Hit rate trends, strengths/weaknesses by target (Teal, Rabbit, Driven, Quartering), equipment and weather correlations.
3. **Social & Community** — Friend networks, profile feeds, live "shooting now" status, likes/comments on rounds.
4. **Club & Range Integration** — Ground discovery (map + list), tournaments, CPSA-numbered squads, live tournament leaderboards.
5. **Range Mapping & Visualisation** — Aerial views, numbered stand markers, per-stand flight-path diagrams, course layouts.
6. **Training & Development** — Goals, AI-recommended practice drills tailored to weaknesses.

**Users:** UK clay shooters, from casual club members to competition-level (CPSA-registered). Terminology is sport-literal: *stand*, *bird*, *discipline* (Sporting / Trap / Skeet / FITASC), *ground*, *squad*, *tee time*.

**Primary surface:** Mobile web/native app. A marketing/desktop web surface is implied but not yet designed.

---

## Sources

- **Wireframes v2** (approved direction): https://scoremyclays-wireframes.vercel.app/wireframes-v2.html
- **Stated design direction** (from wireframes footer): *"Green primary, photo headers, dark mode scoring, circular stats."*
- No Figma, codebase, or brand book provided yet — this v0.1.0 system is derived from the wireframes + sport context. Please see **CAVEATS** at the bottom.

---

## Index

| File | Purpose |
|---|---|
| `README.md` | This file — overview, fundamentals, visuals, iconography |
| `SKILL.md` | Agent Skills manifest (for Claude Code compatibility) |
| `colors_and_type.css` | All color, type, spacing, radius, shadow, motion tokens |
| `assets/` | Logos, clay-pigeon mark, icon mark |
| `preview/` | Design System tab preview cards |
| `ui_kits/app/` | Mobile app UI kit (JSX components + interactive index.html) |

---

## Content Fundamentals

**Voice:** Confident, sport-literate, friendly. Like a coach who also happens to be a mate at the club. Never condescending; never marketing-fluffy.

**Tone:** Direct and action-oriented. Short verbs: *Start Scoring*, *Save*, *Share*, *Continue Last Session*, *Play Now*, *Challenge to Round*.

**Person:** Second-person ("Your Statistics", "Hello, Ian", "Your Goals", "Needs Focus"). Users see *their* data.

**Casing:**
- Screen titles use **Title Case** ("Round Complete", "Spring Championship", "Practice Drills").
- Primary buttons use **Title Case** ("Start New Round", "Start Scoring", "View Tournament Map").
- **XL scoring buttons use UPPERCASE** for glove-readable punch: `HIT` / `MISS` / `No Bird`.
- Tiny UI labels (tab meta, stat captions) use **Title Case**: "Hit Rate", "Rounds", "Friends".
- Data is **mono/tabular**: `39/50`, `74%`, `CPSA: A1234567`.

**Domain vocabulary (must use):**
- *Stand* (not "station"), *Bird* (a clay target), *Round*, *Discipline*, *Ground* (not "range"), *Squad*, *Tee Time*, *Flight Path*, *PB* (personal best), *Hit / Miss / No Bird*.
- UK disciplines: **Sporting, Trap, Skeet, FITASC**.
- Target types: Teal, Rabbit, Driven, Crosser, Quartering (Away / Towards), Tower.

**Numbers as nouns:** Percentages and scores carry meaning on their own — `78%`, `39/50`, `+3% vs Last Month`, `3.2 miles · ⭐ 4.8`. Pair with a one-word label underneath.

**Emoji usage (sparing, purposeful):**
- 🎯 for achievement moments and PB celebrations ("Shot a new PB at West Kent! 42/50 🎯").
- 🏆 for badges/awards in activity feed.
- 🥇 🥈 🥉 for medals on leaderboards.
- ☀️ ☁️ 🌧️ 💨 for weather conditions.
- ● (unicode dot) for status indicators: `● Offline Ready`, `● LIVE`, `● Live`, `● Scoring now`.
- ▼ for dropdown affordances.
- ↑ ↓ for trend indicators.
- Emojis are **never decorative** — every one carries information.

**Example microcopy that's on-brand:**
- "Track your shooting"  (tagline — 3 words, no verbs beyond the core)
- "Yesterday · 78% · 39/50"  (middot-separated meta, ordered: when · rate · raw)
- "Best at: Teal (+12% vs avg)"  (insight = plain-English claim + parenthetical delta)
- "Focus on picking up Flight A early. The teal rises quickly — mount ahead of the target."  (coaching tips: imperative, technique-specific)

---

## Visual Foundations

### Color mood
Warm countryside. Deep greens (English woodland at field edge), cream paper backgrounds, occasional clay-orange punctuation for accent. Never neon. Never purple/blue gradients. Sunlight-readable in bright outdoor conditions (high contrast, no washed-out pastels).

### Core palette
- **Field Green `--field-700` (#2c4e22)** — primary brand, headers, primary buttons, active states.
- **Clay Orange `--clay-500` (#d96515)** — accent only. Used for HIT indicators, the clay pigeon dot on the logo, "No Bird" status, featured CTAs.
- **Bone `--bone-50` (#faf8f3)** — warm paper background. Not cold white.
- **Powder `--powder-950` (#0a0d08)** — true dark for the scoring mode (outdoor sunlight readability).

### Typography
- **Display: Fraunces** — editorial serif with just enough character for country-club warmth. Used for: screen titles, "Round Complete" moments, big numbers in hero contexts.
- **UI: Inter** — clean, tight, dense. Used for: buttons, tabs, stat cards, nav.
- **Mono: JetBrains Mono** — tabular numbers only. Used for: scores (`39/50`), percentages, CPSA numbers, timers.

### Backgrounds
- **Bone cream** (`--bone-50`) is the default app background. Warm, never sterile.
- **Photo headers** on Profile, Ground Detail, Tournament Detail — landscape aerial photography of shooting grounds, with a green-tinted duotone overlay and text in bone-white.
- No gradients used decoratively. One exception: photo header **protection gradient** (bottom overlay, `rgba(28, 50, 24, 0.0)` → `rgba(28, 50, 24, 0.85)`) for text readability.
- No repeating patterns. No hand-drawn illustrations.

### Corner radii
- Cards: **16px** (`--radius-lg`).
- Larger hero cards / sheets: **20–28px** (`--radius-xl`, `--radius-2xl`).
- Buttons: **pill** (`--radius-pill`) for primary/floating; **10px** for secondary inline.
- Inputs: **10px** (`--radius-md`).
- Badges/chips: **pill**.

### Cards
- White surface (`--bone-0`), 16px radius, 20–24px internal padding.
- Shadow: `--shadow-sm` at rest, `--shadow-md` on hover (web) or press (mobile lift).
- Thin border (`1px solid --border-1`) on light backgrounds for definition without relying on shadow alone.
- **No colored left-border accent cards.** Never.

### Shadows
- Warm-tinted black (`rgba(24, 22, 15, ...)`) rather than cold pure black.
- Layered (two shadows per elevation: a tight near shadow + a soft ambient).
- Scoring/dark-mode uses denser, purer black shadows for contrast.

### Borders
- Default divider: `1px solid --border-1` (`--bone-200`).
- Emphasised: `1px solid --border-2` (`--bone-300`).
- Focus ring: `2px solid --field-500` + `2px offset`.

### Motion
- Easing: `--ease-out` for most UI, `--ease-spring` for score commits / PB celebrations.
- Durations: 120/200/320ms (fast / normal / slow).
- Tab transitions: fade + 4px rise.
- Score entry: quick scale-down on press (0.96), return on release. A brief tick animation when a shot is committed.
- No parallax. No skeuomorphic physics. The vibe is *crisp and confident*, not playful.

### Hover states (web)
- Buttons: darken one step (`--field-700` → `--field-800`).
- Cards: lift (`--shadow-sm` → `--shadow-md`), optional 1px translateY(-1px).
- Text links: color shift from `--field-700` to `--field-800`, underline appears.

### Press states (mobile)
- Buttons: scale to 0.97.
- List rows: flash `--bone-100` background for 120ms.

### Transparency & blur
- Sticky nav: `rgba(250, 248, 243, 0.85)` + `backdrop-filter: blur(12px)`.
- Modal scrims: `rgba(24, 22, 15, 0.5)`.
- Photo protection gradient: described above.
- Otherwise: minimise transparency. Solid surfaces read better outdoors.

### Imagery vibe
- **Warm + golden-hour biased.** UK shooting grounds in morning/afternoon light, heather + woodland edges + misty backgrounds. Never harsh midday. Never processed with cool filters. Slight saturation, no grain.
- Photo treatment: a faint green duotone (`--field-800` multiply at 20%) unifies disparate stock photography into the brand.

### Layout rules
- **Mobile app target width: 430px** (`--mobile-max`).
- Fixed bottom tab bar: 4 tabs (Home, Stats, Social, Profile), 72px tall, solid background with top border.
- Sticky top header on scrollable screens.
- Safe areas respected (notch + home-indicator).
- Scoring mode goes **edge-to-edge** — no tab bar, no standard header.

### Touch targets
- Min tap target: **48×48 px** (`--touch-target`).
- Scoring buttons (HIT/MISS/No Bird): **72px minimum** height (`--touch-xl`) — glove-friendly.

---

## Iconography

ScoreMyClays uses a clean, line-style icon system. Weight: 1.75–2px stroke, rounded caps, 24×24 artboard.

- **Primary icon library: Lucide** (loaded via CDN / `lucide-react`). It matches the brand's sport-friendly, clean, slightly geometric feel and has the breadth needed: `target`, `trophy`, `medal`, `trending-up`, `trending-down`, `map-pin`, `calendar`, `users`, `crosshair`, `wind`, `cloud`, `cloud-rain`, `sun`, `home`, `bar-chart-3`, `message-circle`, `heart`, `share-2`, `user`, `settings`, `bell`, `chevron-down`, `chevron-right`, `arrow-up`, `arrow-down`.
- **Substitution flag:** ⚠️ Lucide is a substitution. The actual ScoreMyClays codebase has not been provided. Once you share it, swap to whichever icon set is already in use.
- **Unicode/text marks used in UI:**
  - ● (live/status dot)
  - ▼ (dropdown affordance)
  - ⭐ (ground rating — intentional, matches review-site conventions)
  - ↑ ↓ (trend)
  - 🥇 🥈 🥉 (leaderboard medals)
  - ☀️ ☁️ 🌧️ 💨 (weather — only on the Equipment & Conditions screen)
  - 🏆 🎯 (achievement moments)
- **Custom marks (in `assets/`):**
  - `logo.svg` — full wordmark with clay-pigeon icon.
  - `icon-mark.svg` — app icon / round avatar version.
  - `clay-pigeon.svg` — the sport motif, used as an inline decoration in empty states and achievement cards.
- **No raster icon PNGs.** Everything vector.
- **No hand-drawn illustrations.** Photography fills the emotive role instead.

---

## Font Substitution Notice

⚠️ **Fraunces**, **Inter**, and **JetBrains Mono** are all loaded from Google Fonts as best-guess substitutes — the wireframes did not specify fonts. If the real ScoreMyClays brand has a different display face (e.g. a specific grotesk, slab, or a bespoke wordmark face), please share the font files and we'll swap `colors_and_type.css` accordingly.

---

## CAVEATS

This is a **v0.1.0** derived purely from the wireframes v2 HTML. I don't yet have:

1. **A Figma file or codebase** — all component dimensions, spacing, and interactions are inferred from wireframe screenshots and the stated direction ("green primary, photo headers, dark mode scoring, circular stats"). Exact values may drift.
2. **Brand fonts** — Fraunces / Inter / JetBrains Mono are placeholders. Needs confirmation.
3. **Brand photography** — The photo-header treatment is specified in principle (green duotone, golden-hour) but no stock is included. UI-kit screens use placeholder gradient blocks where headers go.
4. **Exact icon system** — Lucide is a CDN substitute. Should be swapped for whatever the codebase uses.
5. **Brand logo** — The `logo.svg` in `assets/` is a working mark I composed from the wireframes' name + sport motif. If there's an official logo, replace it.

---

## ASK

**Please help me iterate by sharing, if available:**

- 🔗 **Figma file** for ScoreMyClays (I can pull exact specs, components, and design tokens)
- 📦 **Codebase** (local or GitHub) — so I can match real component structure, real class names, real icon library
- 🖼️ **Official logo files** (SVG preferred) and any brand-book PDF
- 🅰️ **Confirmed typefaces** — if not Fraunces/Inter/JetBrains Mono, please share
- 📸 **Sample brand photography** — a handful of ground photos so the photo-header treatment can be tuned properly

With any one of these, I can tighten v0.1.0 into a production-ready v1.0.0.
