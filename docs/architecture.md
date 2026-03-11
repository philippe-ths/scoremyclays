# Architecture

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Mobile Framework | React Native + Expo (managed workflow) | RN 0.83, Expo 55 |
| Language | TypeScript | 5.9 |
| Routing | Expo Router (file-based) | 55.0 |
| Local Database | SQLite via PowerSync (`react-native-quick-sqlite` on native, `wa-sqlite` on web) | — |
| Sync Engine | PowerSync | web 1.34, native 1.30 |
| Backend | Supabase (PostgreSQL + Auth) | 2.49 |
| Build & Deploy | Expo EAS Build | — |

## Provider Hierarchy

The app wraps all screens in a provider chain that initialises the database and auth before rendering any UI:

```
RootLayout
  └─ DatabaseProvider          ← initialises PowerSync, provides db context
       └─ AuthProvider         ← Supabase auth state, user record sync
            └─ SyncProvider    ← monitors sync status, surfaces errors via UI banner
                 └─ AppContent ← gates on isReady + isLoading, then renders Stack
```

`AppContent` shows a loading spinner until both the database and auth providers are ready. Only then does the Expo Router `Stack` mount. `SyncProvider` wraps `AppContent` to provide sync status (`offline` / `syncing` / `synced`) and display an error banner at the bottom of the screen if sync fails.

## Data Flow

```
PowerSync SQLite (local)
    ↓ db.init()
DatabaseProvider (React context)
    ↓ usePowerSync() hook
Query functions (db/queries/*.ts)
    ↓ typed SQL → typed results
Screens (app/**/*.tsx)
```

All database reads and writes go through typed query functions that accept an `AbstractPowerSyncDatabase` instance. This keeps screens decoupled from the database layer and lets the same queries work on both web and native.

## Platform-Specific Database

PowerSync uses different packages for web and native platforms. The app handles this with platform-specific file extensions:

| File | Platform | Package |
|------|----------|---------|
| `db/openDatabase.web.ts` | Web (browser) | `@powersync/web` |
| `db/openDatabase.native.ts` | iOS / Android | `@powersync/react-native` |

Both export the same `db` instance. Metro and Expo automatically resolve the correct file based on the build target. The shared schema (`db/schema.ts`) and all query functions import from `@powersync/common` so they work with either platform.

## Database Schema

Ten tables defined in `db/schema.ts`:

| Table | Purpose | Key Indexes |
|-------|---------|-------------|
| `users` | User profile (display name, email, user_id handle, gear, favourite clubs) | — |
| `rounds` | Shooting sessions (ground, date, status, optional club_id) | — |
| `squads` | Links a round to its group of shooters | — |
| `shooter_entries` | Individual shooters within a squad | `squad_id`, `round_id` |
| `stands` | Shooting positions within a round (optional club_stand_id, club_position_id) | `round_id` |
| `target_results` | Individual shot results (the atomic scoring unit) | `stand_id`, `round_id`, `shooter_entry_id` |
| `clubs` | Read-only reference: shooting grounds with pre-configured layouts | — |
| `club_positions` | Read-only reference: groups of stands within a club | `club_id` |
| `club_stands` | Read-only reference: pre-configured stands within a position | `club_position_id` |
| `invites` | Round invitations between users | `round_id`, `invitee_user_id`, `invitee_id`, `inviter_id` |

Entity relationships:

```
User → Round → Squad → ShooterEntry
                  Round → Stand → TargetResult ← ShooterEntry
         Round ←─ club_id ─→ Club → ClubPosition → ClubStand
         User ←─ Invite ─→ Round
```

Each `TargetResult` records who scored it (`recorded_by`) and from which device (`device_id`), enabling conflict resolution when multiple devices record simultaneously.

Club-related tables (`clubs`, `club_positions`, `club_stands`) are read-only reference data seeded via Supabase migrations. Changes to these tables are not uploaded from the client.

## Key Directories

```
app/              Expo Router screens (tabs + dynamic routes)
  (tabs)/         Tab navigation (Home, New Round, Clubs, History, Profile)
  auth/           Auth stack (Login, Signup, Profile Setup)
  clubs/[id]/     Club detail screen
  invites/        Invite management screen
  profile/        Profile editing screen
  round/[id]/     Per-round screens (Setup, Score, Conflicts, Summary)
components/       Reusable UI components
  PositionPicker    Select club position (with completeness badges)
  ShooterPicker     Select shooter within a stand (with progress bar)
  StandSelector     Choose which stand to score
  UserSearch        Search users by handle for invites
  LoadingPlaceholder  Centered spinner with optional message
db/               Database layer
  schema.ts       PowerSync schema definition (10 tables)
  queries/        Typed SQL query functions
    rounds.ts       Round CRUD
    squads.ts       Squad and shooter entry management
    stands.ts       Stand CRUD
    scoring.ts      Target results, conflict detection
    clubs.ts        Club, position, and stand lookups
    invites.ts      Invite CRUD and duplicate checks
    users.ts        User search by handle
  openDatabase.*  Platform-specific database initialisation
lib/              Utilities, constants, and types
  types.ts        Domain enums and entity interfaces
  constants.ts    Colours, spacing, presentation labels
  formatting.ts   Display formatting helpers (stand details, position titles)
  uuid.ts         Deterministic UUID generation from SHA-256 hashes
  supabase.ts     Supabase client configuration
  powersync-connector.ts  PowerSync ↔ Supabase sync connector
providers/        React context providers
  DatabaseProvider.tsx  ← PowerSync init
  AuthProvider.tsx      ← Supabase auth state + user record sync
  SyncProvider.tsx      ← Sync status monitoring + error banners
```

## Build Configuration

### Babel (`babel.config.js`)

Uses `babel-preset-expo` plus a custom plugin that transforms `import.meta` references into `globalThis.location.href`. This is required because the `@powersync/web` package uses `import.meta.url` internally, but Metro does not support ES module metadata syntax.

### Metro (`metro.config.js`)

Extends the default Expo Metro config with experimental import support and inline requires enabled.

### App Config (`app.json`)

- Web output mode: `single` (SPA) — avoids server-side rendering which is incompatible with PowerSync's native module imports
- iOS bundle ID: `com.scoremyclays.app`
- Android package: `com.scoremyclays.app`
