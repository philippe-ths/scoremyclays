# Screens and Routing

ScoreMyClays uses Expo Router for file-based routing. The URL structure maps directly to files in the `app/` directory.

## Route Map

| Route | File | Purpose |
|-------|------|---------|
| `/` | `app/(tabs)/index.tsx` | Home — hero section, recent rounds, new round CTA |
| `/new-round` | `app/(tabs)/new-round.tsx` | Create a new round (ground name, date, target count) |
| `/history` | `app/(tabs)/history.tsx` | Browse all past rounds |
| `/profile` | `app/(tabs)/profile.tsx` | User profile and settings |
| `/round/[id]/setup` | `app/round/[id]/setup.tsx` | Configure stands and squad for a round |
| `/round/[id]/score` | `app/round/[id]/score.tsx` | Active scoring interface |
| `/round/[id]/summary` | `app/round/[id]/summary.tsx` | Final scores and stand breakdown |

## Navigation Structure

```
Tab Bar
  ├─ Home (/)
  ├─ New Round (/new-round)
  ├─ History (/history)
  └─ Profile (/profile)

Stack (pushed on top of tabs)
  ├─ Round Setup (/round/[id]/setup)
  ├─ Scoring (/round/[id]/score)
  └─ Summary (/round/[id]/summary)
```

Tab screens live in `app/(tabs)/` and are always accessible via the bottom tab bar. Round screens are pushed onto a Stack navigator over the tabs.

## User Flow

```
Home ──→ New Round ──→ Setup ──→ Score ──→ Summary ──→ Home
  │                                                       ↑
  └── History ──→ Summary ─────────────────────────────────┘
```

1. **Home**: Shows 5 most recent rounds. Tapping an in-progress round goes to Score; tapping a completed round goes to Summary.
2. **New Round**: User enters ground name, selects date, picks target count (25/50/75/100). Creates round + squad + shooter entry, then navigates to Setup.
3. **Setup**: User adds stands (each with presentation type, target config, number of targets) and additional shooters to the squad. Validates at least one stand exists before allowing scoring to start.
4. **Score**: The core interface. Displays current stand, shooter, and target. Single-tap KILL/LOSS/NO_SHOT buttons record results. Auto-advances through targets → shooters → stands. Shows running score total.
5. **Summary**: Per-shooter score totals and per-stand breakdown with individual shooter scores. "Back to Home" returns to the tab navigator.

## Screen Details

### Home (`app/(tabs)/index.tsx`)

- Hero section with app name and tagline
- Prominent "+ New Round" button
- FlatList of 5 most recent rounds (shows ground name, date, score, status badge)
- Empty state: "No rounds yet" message

### New Round (`app/(tabs)/new-round.tsx`)

- Ground name text input
- Date display (defaults to today)
- Target count selector: 25, 50, 75, 100 (tap to select)
- "Create Round" button — creates round, squad, and initial shooter entry in one transaction

### History (`app/(tabs)/history.tsx`)

- FlatList of all rounds ordered by date (newest first)
- Each row shows ground name, date, total score, status badge
- Status badges: green for Completed, amber for In Progress

### Round Setup (`app/round/[id]/setup.tsx`)

- **Stands section**: List of configured stands. "+ Add Stand" adds a stand with sensible defaults (Single, Crosser, 10 targets).
- **Squad section**: List of shooters with position numbers. Guest user is always Shooter 1.
- "Start Scoring" button — validates at least one stand exists

### Scoring (`app/round/[id]/score.tsx`)

- **Top bar**: Current score (kills/total), stand progress (Stand N of M with presentation label), current shooter name
- **Target indicator**: "Target X of Y" with bird number for pairs
- **Score buttons**: KILL (green), LOSS (red), NO SHOT (grey) — minimum 80px, designed for gloved fingers
- **Stand Complete overlay**: Shows score for that stand/shooter, with "Next Shooter", "Next Stand", or "Finish Round" buttons
- Haptic feedback on each tap (gracefully degrades to no-op on web)
- Resumes mid-round if the app is reopened

### Summary (`app/round/[id]/summary.tsx`)

- Ground name and date header
- Per-shooter score totals (kills out of total targets)
- Stand breakdown: each stand shows presentation type and per-shooter scores
- "Back to Home" button

### Profile (`app/(tabs)/profile.tsx`)

- Display name and guest status indicator
- Placeholder for future account management and settings
