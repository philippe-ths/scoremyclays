# Screens and Routing

ScoreMyClays uses Expo Router for file-based routing. The URL structure maps directly to files in the `app/` directory.

## Route Map

| Route | File | Purpose |
|-------|------|---------|
| `/` | `app/(tabs)/index.tsx` | Home — recent rounds, pending invite notification, new round CTA |
| `/new-round` | `app/(tabs)/new-round.tsx` | Create a new round (custom or club-based) |
| `/clubs` | `app/(tabs)/clubs.tsx` | Browse and search clubs |
| `/history` | `app/(tabs)/history.tsx` | Browse all past rounds |
| `/profile` | `app/(tabs)/profile.tsx` | User profile, gear, favourite clubs, logout |
| `/auth/login` | `app/auth/login.tsx` | Supabase email/password login |
| `/auth/signup` | `app/auth/signup.tsx` | Account registration |
| `/auth/profile-setup` | `app/auth/profile-setup.tsx` | Set immutable user_id handle |
| `/clubs/[id]` | `app/clubs/[id]/index.tsx` | Club detail — positions, stands, "Start Round" CTA |
| `/invites` | `app/invites/index.tsx` | Accept or decline pending round invites |
| `/profile/edit` | `app/profile/edit.tsx` | Edit display name, gear list, favourite clubs |
| `/round/[id]/setup` | `app/round/[id]/setup.tsx` | Configure stands, squad, and invites for a round |
| `/round/[id]/waiting` | `app/round/[id]/waiting.tsx` | Holding screen for non-owner shooters until the owner starts the round |
| `/round/[id]/score` | `app/round/[id]/score.tsx` | Active scoring interface |
| `/round/[id]/conflicts` | `app/round/[id]/conflicts.tsx` | Resolve duplicate shot records (round creator only) |
| `/round/[id]/summary` | `app/round/[id]/summary.tsx` | Final scores and stand breakdown |

## Navigation Structure

```
Auth Stack (shown when not authenticated)
  ├─ Login (/auth/login)
  ├─ Signup (/auth/signup)
  └─ Profile Setup (/auth/profile-setup)

Tab Bar (shown when authenticated + profile complete)
  ├─ Home (/)
  ├─ New Round (/new-round)
  ├─ Clubs (/clubs)
  ├─ History (/history)
  └─ Profile (/profile)

Stack (pushed on top of tabs)
  ├─ Club Detail (/clubs/[id])
  ├─ Invites (/invites)
  ├─ Edit Profile (/profile/edit)
  ├─ Round Setup (/round/[id]/setup)
  ├─ Round Waiting (/round/[id]/waiting)
  ├─ Scoring (/round/[id]/score)
  ├─ Conflicts (/round/[id]/conflicts)
  └─ Summary (/round/[id]/summary)
```

Auth screens are shown when the user is unauthenticated or has not completed profile setup. Tab screens live in `app/(tabs)/` and are always accessible via the bottom tab bar. Round, club, invite, and profile screens are pushed onto a Stack navigator over the tabs.

## User Flow

```
Login ──→ Profile Setup ──→ Home
                              │
    ┌─────────────────────────┤
    │                         │
    ▼                         ▼
New Round ──→ Setup ──→ Score ──→ Summary ──→ Home
                         │  ▲                   ▲
                         │  └── Conflicts ───────┤
                         │                       │
                         │   History ──→ Summary ┘
                         │      │
    Clubs ──→ Club Detail ──────┘
    Invites ──→ Accept ──→ Score
```

1. **Login / Signup**: User authenticates with email/password via Supabase. Redirected automatically by `useProtectedRoute`.
2. **Profile Setup**: First-time users set their immutable `user_id` handle (used for invites). Required before accessing the app.
3. **Home**: Shows recent rounds and a pending invite count. Tapping an in-progress round goes to Score; tapping a completed round goes to Summary.
4. **New Round**: User selects a club and date. Creates round + squad + shooter entry, then navigates to Setup.
5. **Setup**: User views club positions and stands, manages the squad. Can send invites to other users via `UserSearch`.
6. **Score**: The core interface. Uses `PositionPicker` → `StandSelector` → `ShooterPicker` flow. Shows running score total.
7. **Conflicts**: Round creator can view and resolve duplicate shot records from competing devices.
8. **Summary**: Per-shooter score totals and per-position stand breakdown.

## Screen Details

### Home (`app/(tabs)/index.tsx`)

- Prominent "+ New Round" button
- FlatList of recent rounds (shows ground name, date, target count, status badge)
- Pending invite notification with count — tapping navigates to `/invites`
- Empty state: "No rounds yet" message

### New Round (`app/(tabs)/new-round.tsx`)

- Club selection (required) — search and select a club
- Date display (defaults to today)
- "Create Round" button — creates round, squad, and initial shooter entry in one transaction

### Clubs (`app/(tabs)/clubs.tsx`)

- Searchable list of all clubs
- Each row shows club name and description
- Tapping a club navigates to the Club Detail screen

### History (`app/(tabs)/history.tsx`)

- FlatList of all rounds ordered by date (newest first)
- Includes rounds created by the user and rounds where they appear as a shooter
- Each row shows ground name, date, target count, status badge
- Status badges: green for Completed, amber for In Progress

### Profile (`app/(tabs)/profile.tsx`)

- Display name and user handle
- Gear list (managed as JSON array)
- Favourite clubs list
- "Edit Profile" button navigates to `/profile/edit`
- Logout button

### Login (`app/auth/login.tsx`)

- Email and password inputs
- "Sign In" button — authenticates via Supabase
- Link to Signup screen

### Signup (`app/auth/signup.tsx`)

- Email and password inputs
- "Create Account" button — creates Supabase auth user and blank user record
- Link back to Login screen

### Profile Setup (`app/auth/profile-setup.tsx`)

- Shown after first login when `user_id` is not yet set
- User enters their immutable handle (used for receiving invites)
- Redirects to Home on completion

### Club Detail (`app/clubs/[id]/index.tsx`)

- Club name and description
- List of positions, each showing its configured stands (target config, presentation, num targets)
- "Start Round at This Club" button — navigates to New Round with club pre-selected

### Invites (`app/invites/index.tsx`)

- List of pending incoming invites
- Each invite shows round details and inviter name
- Accept / Decline buttons
- Accepting adds the user as a shooter entry in the round's squad

### Edit Profile (`app/profile/edit.tsx`)

- Edit display name
- Manage gear list (add/remove items)
- Manage favourite clubs

### Round Setup (`app/round/[id]/setup.tsx`)

- **Positions section**: Read-only list of club positions and their stands.
- **Squad section**: List of shooters with position numbers. Authenticated user is always Shooter 1.
- **Invite section**: `UserSearch` component to find users by handle and send invites.
- "Start Scoring" button — validates at least one shooter exists

### Round Waiting (`app/round/[id]/waiting.tsx`)

- Shown to non-owner shooters once they accept an invite or open a round that is still in setup
- Displays round details (club, date), owner, club positions and stands, and the current squad
- Uses a reactive query on the round's status and auto-navigates to Scoring when the owner sets the round to `IN_PROGRESS`
- Squad list updates reactively as the owner adds or removes shooters

### Scoring (`app/round/[id]/score.tsx`)

- `PositionPicker` → `StandSelector` → `ShooterPicker` → record shots. `PositionPicker` shows status badges for position completeness.
- **Top bar**: Current score (kills/total), stand number with presentation label, current shooter name
- **Target indicator**: "Target X of Y" with bird number for pairs
- **Score buttons**: KILL (green), LOSS (red), NO SHOT (grey) — minimum 80px, designed for gloved fingers
- **Stand Complete overlay**: Shows score for that stand/shooter, with "Next Shooter", "Next Stand", or "Finish Round" buttons
- Haptic feedback on each tap (gracefully degrades to no-op on web)
- Resumes mid-round if the app is reopened
- Sync conflict warning displayed for affected shooters

### Conflicts (`app/round/[id]/conflicts.tsx`)

- Only accessible to the round creator
- Lists duplicate shot records grouped by (shooter, stand, target, bird)
- For each conflict, shows competing records with recorder name, device, and timestamp
- Round creator selects the winning record; losing rows are deleted

### Summary (`app/round/[id]/summary.tsx`)

- Ground name and date header
- Per-shooter score totals (kills out of total targets)
- Stand breakdown: each stand shows presentation type and per-shooter scores
- Club rounds group stands by position
- Conflicted shooters marked with a warning until conflicts are resolved
- "Back to Home" button
