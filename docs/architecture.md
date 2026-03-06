# Architecture

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Mobile Framework | React Native + Expo (managed workflow) | RN 0.83, Expo 55 |
| Language | TypeScript | 5.9 |
| Routing | Expo Router (file-based) | 55.0 |
| Local Database | SQLite via PowerSync | — |
| Sync Engine | PowerSync | web 1.34, native 1.30 |
| Backend | Supabase (PostgreSQL + Auth) | 2.49 |
| Build & Deploy | Expo EAS Build | — |

## Provider Hierarchy

The app wraps all screens in a provider chain that initialises the database and auth before rendering any UI:

```
RootLayout
  └─ DatabaseProvider          ← initialises PowerSync, provides db context
       └─ AuthProvider         ← creates/loads guest user, provides user context
            └─ AppContent      ← gates on isReady + isLoading, then renders Stack
```

`AppContent` shows a loading spinner until both the database and auth providers are ready. Only then does the Expo Router `Stack` mount.

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

Six tables defined in `db/schema.ts`:

| Table | Purpose | Key Indexes |
|-------|---------|-------------|
| `users` | User profile (display name, email) | — |
| `rounds` | Shooting sessions (ground, date, status) | — |
| `squads` | Links a round to its group of shooters | — |
| `shooter_entries` | Individual shooters within a squad | `squad_id` |
| `stands` | Shooting positions within a round | `round_id` |
| `target_results` | Individual shot results (the atomic scoring unit) | `stand_id`, `shooter_entry_id` |

Entity relationships:

```
User → Round → Squad → ShooterEntry
                  Round → Stand → TargetResult ← ShooterEntry
```

Each `TargetResult` records who scored it (`recorded_by`) and from which device (`device_id`), enabling conflict resolution when multiple devices record simultaneously.

## Key Directories

```
app/              Expo Router screens (tabs + dynamic routes)
  (tabs)/         Tab navigation (Home, New Round, History, Profile)
  round/[id]/     Per-round screens (Setup, Score, Summary)
components/       Reusable UI components
db/               Database layer
  schema.ts       PowerSync schema definition
  queries/        Typed SQL query functions (rounds, squads, stands, scoring)
  openDatabase.*  Platform-specific database initialisation
lib/              Utilities, constants, and types
  types.ts        Domain enums and entity interfaces
  constants.ts    Colours, spacing, presentation labels
  supabase.ts     Supabase client configuration
providers/        React context providers
  DatabaseProvider.tsx  ← PowerSync init
  AuthProvider.tsx      ← Supabase auth state UI syncing
  SyncProvider.tsx      ← Manages sync UI (status & errors)
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
