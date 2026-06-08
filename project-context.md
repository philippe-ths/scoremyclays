# Project Context

## Product Summary
- ScoreMyClays is an offline-first mobile app for recording sporting clays (clay pigeon) shooting scores.
- Primary users are clay shooters and squads scoring rounds at shooting grounds that often have poor or no mobile signal.
- The core flow is: create a round from a club layout or custom stands, score each bird as kill/loss/no-shot per shooter, then view round summaries.
- All data is stored locally and syncs to the cloud when connectivity returns.
- The app runs on iOS, Android, and web from a single Expo codebase.

## Domain Concepts
- A `Round` is a scoring session at a ground with status SETUP, IN_PROGRESS, COMPLETED, or ABANDONED.
- A `Squad` groups up to `MAX_SQUAD_SIZE` (6) shooters within a round.
- A `ShooterEntry` is one shooter's position in a squad, optionally linked to a registered user.
- A `Stand` is a shooting position in a round with a target configuration and a presentation type.
- A `TargetResultRecord` records one bird's outcome (KILL, LOSS, NO_SHOT) for a shooter at a stand, append-only and tagged with the recording device.
- `Club`, `ClubPosition`, and `ClubStand` are read-only reference data describing pre-configured ground layouts.
- An `Invite` links a round to an invited user by handle with status PENDING, ACCEPTED, or DECLINED.
- A `User` has an immutable `user_id` handle used for invites and a `discoverable` flag controlling search visibility.
- `PresentationType` and `TargetConfig` are enums describing how a target flies and how its birds are presented.
- A scoring conflict is two or more target results for the same shooter, target, and bird, produced when multiple devices score the same shot.

## Scope
- Supports email/password authentication through Supabase with a required profile-setup step that assigns the user handle.
- Supports creating rounds from seeded club layouts or from custom stand setups.
- Supports scoring a squad of up to six shooters on a single device, per stand and per bird.
- Supports inviting other users to a round by handle and accepting or declining invites.
- Supports round summaries with per-shooter totals and per-stand breakdowns.
- Detects scoring conflicts and provides a resolution screen that keeps one record and deletes the duplicates.
- Stores all data locally in SQLite and syncs CRUD operations to Supabase through PowerSync when connected.
- Reference tables (`clubs`, `club_positions`, `club_stands`) sync server-to-client only and are never uploaded.

## Important Constraints
- The app must function fully offline; sync is opportunistic and resumes when connectivity returns.
- Maximum squad size is six shooters (`MAX_SQUAD_SIZE`).
- Minimum interactive tap target size is 48px (`MIN_TAP_TARGET_SIZE`).
- Supabase and PowerSync credentials come from `EXPO_PUBLIC_*` environment variables and are absent by default.
- Missing credentials only emit a warning, allowing the app to run local-only without sync or invites.
- `target_results` rows are append-only; corrections happen by adding rows and resolving conflicts, not by editing in place.
- A user's `user_id` handle is immutable once set.
- Row-level security policies on Supabase govern which rows each user may read and write.

## Architecture Summary
- The app is a client-side modular monolith with an offline-first data layer and no custom backend server.
- Expo Router provides file-based routing under `app/` with typed routes enabled.
- The provider chain is `DatabaseProvider` then `AuthProvider` then `SyncProvider`, wrapping the screen stack.
- `DatabaseProvider` initializes the PowerSync database and connects or disconnects sync in response to Supabase auth-state changes.
- Local persistence is SQLite through PowerSync, opened via a platform-split module (`openDatabase.native.ts` versus `openDatabase.web.ts`).
- `SupabaseConnector` uploads queued local CRUD operations to Supabase, skips read-only reference tables, and surfaces non-retryable errors to a banner.
- Sync rules in `supabase/powersync-sync-rules.yaml` define per-user buckets for own profile, owned rounds, shared rounds, invited rounds, sent and received invites, and global reference data.
- All screen reads and writes go through typed query functions in `db/queries/`, keeping screens decoupled from SQL.

## Key Dependencies
- `expo` and `react-native`: the mobile and web app framework and runtime.
- `expo-router`: file-based navigation with typed routes.
- `@powersync/react-native`, `@powersync/web`, and `@powersync/common`: the offline-first local SQLite database and sync engine, split by platform.
- `@journeyapps/react-native-quick-sqlite` and `@journeyapps/wa-sqlite`: the native and web SQLite backends that PowerSync drives.
- `@supabase/supabase-js`: the backend client for authentication and the sync upload target (PostgreSQL plus Auth).
- `@react-native-async-storage/async-storage`: persists the Supabase session on native, while web uses `localStorage`.
- `expo-crypto`: SHA-256 hashing for deterministic UUID generation and seeding.
- `expo-haptics`: tactile feedback during scoring.
- `react-native-reanimated` and `react-native-worklets`: the animation runtime.
- `typescript` in strict mode: the language and type checker.
- `jest` with `ts-jest`: the test runner.

## Project Structure
- `app/`: Expo Router screens, including the `(tabs)` group, `auth/` screens, and the `round/[id]/` and `clubs/[id]/` workflows.
- `app/_layout.tsx`: root layout that mounts the provider chain and enforces auth-based redirects.
- `app/(tabs)/`: bottom-tab screens for home, clubs, history, new-round, and profile.
- `app/round/[id]/`: per-round screens for setup, waiting, score, conflicts, and summary.
- `app/auth/`: login, signup, and profile-setup screens.
- `providers/`: React context providers for database initialization, authentication, and sync status.
- `db/schema.ts`: the PowerSync client schema defining all local tables and indexes.
- `db/openDatabase.native.ts`, `db/openDatabase.web.ts`, `db/openDatabase.d.ts`: platform-split PowerSync database entry points.
- `db/queries/`: typed query modules per domain area (`smc-clubs`, `smc-invites`, `smc-rounds`, `smc-scoring`, `smc-squads`, `smc-stands`, `smc-users`).
- `db/seed-clubs.ts`: seeds reference club layouts into the local database.
- `lib/types.ts`: domain enums and entity interfaces.
- `lib/constants.ts`: app limits and the design-system color, spacing, typography tokens, and label maps.
- `lib/powersync-connector.ts`: the `SupabaseConnector` that uploads local changes to Supabase.
- `lib/supabase.ts`: the Supabase client configured with platform-specific session storage.
- `lib/round-guards.ts`: pure functions deciding screen-access redirects by round status and ownership.
- `lib/formatting.ts`: display formatting helpers.
- `lib/uuid.ts`: deterministic SHA-256-based UUID generation.
- `components/`: reusable UI (`LoadingPlaceholder`, `PositionPicker`, `ShooterPicker`, `StandSelector`, `UserSearch`).
- `supabase/migrations/`: PostgreSQL schema and row-level-security migrations applied on the Supabase backend.
- `supabase/powersync-sync-rules.yaml`: the PowerSync bucket definitions pasted into the PowerSync dashboard.
- `docs/`: domain, architecture, routing, scoring, offline-first, testing, and query-API reference documentation.
- `reports/codebase-review.md`: a checked-in codebase review report.
- `__tests__/`: Jest tests mirroring `db/queries/` and `lib/`, plus shared test helpers.
- `assets/`: app icons and images.

## Testing Overview
- Tests run with Jest using the `ts-jest` preset in a node environment via `npm test`.
- `jest.config.ts` matches `__tests__/**/*.test.ts` and maps the `@/` path alias to the repo root.
- Coverage centers on the query layer (`db/queries/`) and the pure `lib/` helpers (formatting, round-guards, uuid, powersync-connector).
- `__tests__/helpers/mockDb.ts` provides an in-memory database stub used by the query tests.
- React components, screens, and the live PowerSync and Supabase sync paths have no automated tests.
- TypeScript runs in strict mode, but `package.json` defines no separate type-check or lint script.

## Maintenance Checklist
- Update this file when tables in `db/schema.ts`, the sync rules, or domain enums in `lib/types.ts` change.
- Update this file when routes under `app/` or the provider chain change.
- Update this file when dependencies in `package.json` are added or removed.
- Update this file when the test setup or coverage materially changes.
- Keep every line a single sentence and the file under 300 lines.
