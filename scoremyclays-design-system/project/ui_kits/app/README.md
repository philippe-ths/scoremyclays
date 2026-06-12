# ScoreMyClays Mobile UI Kit

Interactive recreation of the ScoreMyClays mobile app, derived from the v2 wireframes. Use as a component library for prototyping new mobile flows.

## Structure

- `index.html` — Interactive click-through demo, rendered inside an iOS device frame.
- `kit.css` — All component styles (buttons, cards, tab bar, scoring mode, photo header, etc).
- `ios-frame.jsx` — Device bezel (status bar + home indicator).
- `Components.jsx` — Reusable primitives: `Button`, `Card`, `Segmented`, `Chip`, `StatTile`, `TopBar`, `TabBar`, `CircularStat`, `PhotoHeader`, `RoundRow`, `Activity`.
- `Screens.jsx` — Whole-screen compositions: `HomeScreen`, `RoundSetupScreen`, `ScoringScreen`, `ScorecardScreen`, `StatsScreen`, `SocialScreen`, `ProfileScreen`.

## Flow covered

**Primary scoring flow** (click-through is live):
Home → Start New Round → Round Setup → Start Scoring → Active Scoring (dark mode) → Card → Scorecard → Home

**Tabs:** Home, Stats, Social, Profile.

## Not yet covered

- Tournament detail + live tournament leaderboard
- Ground discovery map
- Flight path diagrams
- Practice drills, goals
- Equipment & conditions

These are described in the wireframes but not yet componentized. Ask to extend the kit when needed.

## Notes

- All components consume tokens from the root `colors_and_type.css`.
- No colour/spacing values are hard-coded outside tokens.
- Scoring mode deliberately goes edge-to-edge (no tab bar) for outdoor use.
