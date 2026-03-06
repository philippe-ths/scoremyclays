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

### Current State

The app currently operates in **local-only mode**. The `SyncProvider` exists but is hardcoded to `status: 'offline'`. PowerSync sync to Supabase is not yet wired up — it will be enabled in a future milestone when Supabase infrastructure is configured.

Guest mode (the current default) keeps all data on-device with no sync. When account creation is enabled, users who sign in will have their data synced via PowerSync.

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

When multiple devices record scores for the same round simultaneously, conflicts are resolved by the PowerSync conflict handler:

1. **Designated scorer wins** — records from the user who created the round take priority
2. **Earlier timestamp wins** — if neither record is from the designated scorer, the earlier `created_at` timestamp is used
3. **Logged, not surfaced** — conflicts are logged for debugging but not shown to the user unless data loss would occur

This relies on the `recorded_by` and `device_id` fields on every `TargetResult` row.

## Future: Sync Enablement

When Supabase infrastructure is configured, enabling sync will involve:

1. Configure Supabase project with PostgreSQL schema mirroring the local schema
2. Enable Row Level Security (RLS) — users can only access their own rounds and rounds where they appear as a shooter
3. Configure PowerSync sync rules scoped to the authenticated user
4. Wire up `SyncProvider` to report real sync status (offline / syncing / synced)
5. Implement guest-to-account upgrade path (associate local data with new account)
