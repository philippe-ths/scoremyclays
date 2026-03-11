# Offline-First Architecture

ScoreMyClays is designed to work with zero connectivity from the moment a session starts. This document explains why, how, and what trade-offs are involved.

## Why Offline-First

Clay shooting grounds are typically in rural locations with poor or no mobile signal. A scoring app that requires internet connectivity is unusable at the point of need. The app must:

- Create rounds, set up stands, and record scores without any network connection
- Never block the UI waiting for a sync operation
- Sync data to the cloud opportunistically when a connection becomes available

## How It Works

### PowerSync

[PowerSync](https://www.powersync.com/) provides bidirectional sync between a local SQLite database on the device and a Supabase PostgreSQL database in the cloud.

```
Device (SQLite)  ←──PowerSync──→  Supabase (PostgreSQL)
```

- The local SQLite database is the source of truth on each device
- All reads and writes happen against the local database
- PowerSync syncs changes in the background when online
- Sync is eventual — the UI never waits for it

### Local-Only UUIDs

Every entity (rounds, stands, shooters, target results) is assigned a UUID generated locally on the device using `expo-crypto`. This means:

- No server round-trip is needed to create an ID
- Multiple offline devices can create entities without collisions
- When sync happens, local UUIDs are preserved as the primary keys

### Deterministic UUIDs for Shared Resources

Club round stands are a special case: multiple users may independently try to create the same logical stand. To prevent duplicates, club round stands use **deterministic UUIDs** derived from `SHA-256(round_id + club_stand_id)` via `lib/uuid.ts`. This guarantees that every device generates the same ID for the same logical stand, and `INSERT OR IGNORE` makes the creation idempotent. A partial unique index on `stands(round_id, club_stand_id)` provides a database-level safety net.

### Current State

The app operates seamlessly offline, while simultaneously utilizing full **PowerSync multi-device synchronization** whenever authenticated users are online. 

The app requires authentication via Supabase. Once signed in, data is synchronized securely with Supabase via PowerSync routing rules. `SyncProvider` actively surfaces global connection or row-level-security (RLS) data flow errors through UI banners.

## Platform Split

PowerSync uses different packages for web browsers and native platforms (iOS/Android) because their underlying SQLite implementations differ:

| Platform | Package | SQLite Engine |
|----------|---------|---------------|
| Web | `@powersync/web` | wa-sqlite (WASM) |
| iOS / Android | `@powersync/react-native` | Native SQLite |

The app handles this with platform-specific file extensions, which Metro and Expo resolve automatically:

- `db/openDatabase.web.ts` — imports from `@powersync/web`
- `db/openDatabase.native.ts` — imports from `@powersync/react-native`

Both export the same `db` instance with identical schema. All query functions and the `DatabaseProvider` import from `@/db/openDatabase` without knowing which platform they're running on.

The shared schema and query layer import types from `@powersync/common` (not from either platform-specific package), keeping them platform-agnostic.

## Web-Specific Workarounds

Running PowerSync in a web browser via Metro requires three workarounds:

### 1. Babel Transform for `import.meta`

The `@powersync/web` package uses `import.meta.url` internally. Metro does not support ES module `import.meta` syntax. A custom Babel plugin in `babel.config.js` transforms:

```
import.meta  →  { url: globalThis.location?.href ?? '/' }
```

### 2. Web Workers Disabled

PowerSync's web adapter defaults to using a SharedWorker for database operations. This causes issues with Metro's bundling. The workaround is setting `useWebWorker: false` in the database configuration, which runs all database operations on the main thread.

### 3. WASM Asset Pipeline

The wa-sqlite WASM engine needs `.wasm` binary files served as static assets. Metro does not serve unknown file types from `node_modules`. The solution is a `postinstall` script that copies WASM files to the `public/` directory:

```
npx powersync-web copy-assets --output public
```

These files are gitignored (they're build artifacts derived from `node_modules`) and regenerated automatically on `npm install`.

## Conflict Resolution

When multiple devices record scores for the same round simultaneously, duplicate `(shooter_entry_id, target_number, bird_number)` combinations may sync to the same device. The app handles conflicts in four stages:

1. **Deduplication during active scoring**: `getResultsForStandAndShooter` orders rows by `created_at` and keeps only the first record for each target and bird, so the scorer can continue without the state machine skipping ahead.
2. **Conflict-aware totals**: `getShooterRoundScore` flags shooters with duplicates and suppresses their rolled-up totals until the duplicates are resolved.
3. **UI warnings**: The scoring screen shows a "Sync Issue" warning for the active shooter, and the summary screen marks conflicted shooters explicitly.
4. **Organizer resolution**: The round creator can open the conflict-resolution screen (`/round/[id]/conflicts`), choose the winning record for each duplicated shot, and delete the losing rows from `target_results`.

This relies on the `recorded_by`, `device_id`, and `created_at` fields on every `TargetResult` row.

## Sync Implementation

Sync is fully enabled for authenticated users using a combination of Supabase Row Level Security (RLS) policies and PowerSync Sync Rules.

1. **Supabase RLS**: Users can only access their own rounds, rounds where they appear as a shooter, and read-only global data, enforced at the database level by migrated policies.
2. **PowerSync Rules**: Located in `supabase/powersync-sync-rules.yaml`, data is partitioned client-side so users only download their respective slices (e.g. `my_rounds`, `shared_rounds`, `invited_rounds`), avoiding downloading the entire application DB.
3. **Component State**: `SyncProvider` actively reports the user's sync state (`offline`, `syncing`, `synced`) through built-in listeners, and handles error boundary alerts.
4. **App-Level Upload Skips**: Reference tables (`clubs`, `club_positions`, `club_stands`) bypass the sync upload queue explicitly — these are read-only data seeded via Supabase migrations. This prevents users from stalling their own `target_results` uploads attempting to overwrite admin-managed content.

### Future Enhancements

1. Implement guest-to-account upgrade path (associate local data with a newly created account natively).
