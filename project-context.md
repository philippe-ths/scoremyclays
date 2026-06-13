## Product Summary

ScoreMyClays is an offline-first mobile and web app for recording sporting clays shooting scores at grounds with poor or no signal.
The primary user is a shooter or squad scorekeeper who records kill/loss/no-shot results for every target during a round.
The core flow is: create a round, add shooters (up to 6 per squad), configure stands, score target-by-target, view a round summary.
Scoring is done on a single device for the whole squad, and results sync to other invited shooters' devices when connectivity returns.

## Domain Concepts

A `User` has an immutable `user_id` handle used to invite them to rounds.
A `Round` is a scored outing, owned by one creator, with a status of SETUP, IN_PROGRESS, COMPLETED, or ABANDONED.
A `Squad` belongs to a round and groups the `ShooterEntry` records recording each participating shooter.
A `ShooterEntry` represents a shooter in a squad, either a real linked user or a free-text name, with a position in squad.
A `Stand` is one numbered scoring station within a round, with a `TargetConfig` and `PresentationType`.
A `TargetResult` records the outcome of one bird at one stand for one shooter, as KILL, LOSS, or NO_SHOT.
A `Club` owns reusable `ClubPosition` layouts, each containing reusable `ClubStand` presets used to pre-populate round stands.
An `Invite` links a round and an invitee handle with status PENDING, ACCEPTED, or DECLINED.
`TargetConfig` values are SINGLE, REPORT_PAIR, SIMULTANEOUS_PAIR, FOLLOWING_PAIR.
`PresentationType` values are CROSSER, DRIVEN, INCOMING, GOING_AWAY, QUARTERING_AWAY, QUARTERING_TOWARDS, TEAL, DROPPING, LOOPER, RABBIT, BATTUE, CHANDELLE, SPRINGING.

## Scope

Supports offline round creation, squad scoring, stand setup, target-by-target entry, round summary, and cross-device sync.
Supports authentication via Supabase email/password with a profile-setup step enforcing a unique handle.
Supports inviting other users to a round by handle and accepting or declining received invites.
Supports pre-populating a round's stands from a saved club layout and creating/editing clubs.
Supports conflict detection and resolution when multiple devices write target results for the same target.
Runs on iOS, Android, and web (React Native Web) from a single Expo Router codebase.
Non-goals: tournament scoring rulesets, league management, ballistics tracking, social feed features.

## Important Constraints

Maximum squad size is 6 shooters per round (`MAX_SQUAD_SIZE` in `lib/constants.ts`).
Minimum tap target size is 48px for interactive controls (`MIN_TAP_TARGET_SIZE` in `lib/constants.ts`, mirrored as `layout.touchTarget` in the design system).
Scoring buttons use the glove-friendly 72px tap target (`TOUCH_XL` in `lib/constants.ts`, `layout.touchXl` in the design system).
The app must function fully offline; all reads and writes go through the local PowerSync SQLite database.
Sync requires `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, and `EXPO_PUBLIC_POWERSYNC_URL` env vars.
A user's `user_id` handle is immutable once set during profile setup.
Row-level security is enforced in Supabase migrations; PowerSync sync rules gate data per user bucket.
A user sees only their own profile, discoverable users, their own rounds, rounds they are a shooter in, rounds they are pending-invited to, and global club reference data.
Git `pre-commit` and `pre-push` hooks under `.githooks/` block commits to `main`/`master` and require a passing validation state file at `.ai-policy/state/validation.status`.

## Architecture Summary

Client-side modular monolith built with React Native + Expo Router, sharing a single codebase across iOS, Android, and web.
Offline-first data layer: PowerSync maintains a local SQLite database that bidirectionally syncs CRUD operations to Supabase Postgres.
Provider chain wraps the app: `SafeAreaProvider` → `DatabaseProvider` (PowerSync init + connect) → `AuthProvider` (Supabase auth + profile state) → `SyncProvider` (sync status banners) → `Stack` router; the root layout gates the splash screen until the design-system fonts have loaded.
Route protection is centralised in `useProtectedRoute` in `app/_layout.tsx`, redirecting based on authenticated and profile-complete state.
Stack headers are turned off globally; each screen renders its own `TopBar` from `components/ui/`, and the bottom tab bar is the custom `TabBar` in `components/ui/TabBar.tsx`.
All database access goes through typed query modules in `db/queries/`; screens do not issue raw SQL.
Platform-specific database entrypoints split via `db/openDatabase.native.ts` (react-native-quick-sqlite) and `db/openDatabase.web.ts` (wa-sqlite WASM).
Auth storage uses `AsyncStorage` on native and `window.localStorage` on web, wired in `lib/supabase.ts`.
Sync is authenticated via `SupabaseConnector` in `lib/powersync-connector.ts`, which the provider passes to `db.connect`.

## Key Dependencies

`expo` (~55) and `expo-router` provide the cross-platform runtime and file-based routing.
`react-native` (0.83) and `react-native-web` render the UI on native and web respectively.
`@powersync/react-native` and `@powersync/web` provide the offline-first local database with server sync.
`@journeyapps/react-native-quick-sqlite` is the native SQLite driver for PowerSync.
`@journeyapps/wa-sqlite` is the WebAssembly SQLite driver used by PowerSync on web (assets copied by `postinstall`).
`@supabase/supabase-js` is the backend client for auth and as the PowerSync backend.
`@react-native-async-storage/async-storage` persists the Supabase session on native.
`@react-navigation/native` underlies Expo Router's navigation stack.
`expo-crypto` provides UUID generation (wrapped by `lib/uuid.ts`).
`expo-haptics` provides tactile feedback on scoring actions.
`expo-linear-gradient` renders the photo-header duotone + protection-gradient treatment.
`react-native-svg` renders the CircularStat ring and the SVG brand marks.
`@expo-google-fonts/fraunces`, `@expo-google-fonts/inter`, and `@expo-google-fonts/jetbrains-mono` supply the three design-system typefaces loaded via `expo-font`.
`jest` with `ts-jest` runs the unit test suite.

## Project Structure

`app/` contains Expo Router route screens; `_layout.tsx` defines providers and the root stack.
`app/(tabs)/` holds the bottom-tab screens: `index` (home), `new-round`, `history`, `clubs`, `profile`.
`app/auth/` holds `login`, `signup`, and `profile-setup` screens.
`app/round/[id]/` holds per-round screens: `setup`, `waiting`, `score`, `conflicts`, `summary`.
`app/clubs/[id]/index.tsx` is the club detail screen; `app/invites/index.tsx` lists received invites; `app/profile/edit.tsx` edits the user profile.
`providers/` contains `DatabaseProvider`, `AuthProvider`, and `SyncProvider`.
`db/schema.ts` declares PowerSync tables: `users`, `rounds`, `squads`, `shooter_entries`, `stands`, `target_results`, `clubs`, `club_positions`, `club_stands`, `invites`.
`db/queries/` contains per-domain query modules: `smc-users`, `smc-rounds`, `smc-squads`, `smc-stands`, `smc-scoring`, `smc-clubs`, `smc-invites`.
`db/openDatabase.{native,web,d}.ts` supply the platform-specific PowerSync database instance.
`db/seed-clubs.ts` seeds reference club data into the local DB.
`lib/types.ts` defines domain enums and TypeScript entity interfaces.
`lib/constants.ts` holds app limits and presentation/target-config display labels.
`lib/design-system/` is the single source of truth for brand tokens (color, type, spacing, radii, shadows, motion) and exposes a `useDesignSystemFonts` hook.
`lib/formatting.ts`, `lib/uuid.ts`, `lib/round-guards.ts`, `lib/supabase.ts`, `lib/powersync-connector.ts` are shared utilities.
`components/ui/` holds the shared design-system primitives consumed by every screen: `Button`, `Card`, `TextInput`, `Badge`, `Chip`, `Segmented`, `TopBar`, `StatTile`, `CircularStat`, `PhotoHeader`, `TabBar`, `BrandMark`, `Screen`, and the `Typography` family.
`components/` holds reusable domain composites: `LoadingPlaceholder`, `PositionPicker`, `ShooterPicker`, `StandSelector`, `UserSearch`.
`supabase/migrations/` holds numbered SQL migrations applied to the Supabase Postgres backend.
`supabase/powersync-sync-rules.yaml` defines bucket rules that the PowerSync Cloud dashboard enforces.
`__tests__/` mirrors source layout for Jest tests, with `__tests__/helpers/mockDb.ts` shared fixtures.
`docs/` contains human reference material: `overview`, `architecture`, `screens-and-routing`, `scoring-flow`, `offline-first`, `testing`, `getting-started`, `query-api-reference`.
`scoremyclays-design-system/` holds the v0.1.0 design-system reference bundle (tokens CSS, HTML previews, UI kit, brand SVGs); its runtime equivalents live in `lib/design-system/` and `components/ui/`.
`assets/` holds images and splash/icon resources, including `assets/brand/` with the logo / icon-mark / clay-pigeon SVGs; `public/` holds web assets including the copied PowerSync WASM.
`ios/` contains the native iOS project; `.vercel/` and `dist/` are build outputs.
`.ai-policy/` contains the deterministic policy hooks, scripts, and the validation state file.
`.githooks/` contains the `pre-commit` and `pre-push` entry scripts installed via `install-hooks.sh`.

## Testing Overview

Test framework is Jest via `ts-jest`, configured in `jest.config.ts` with `testEnvironment: 'node'`.
The canonical test command is `npm test`; no CI workflow files are currently present under `.github/workflows/`.
Unit tests live under `__tests__/` and cover query modules (`db/queries/users`, `rounds`, `squads`, `stands`, `scoring`, `invites`, `clubs`) and selected `lib/` utilities (`uuid`, `formatting`, `round-guards`, `powersync-connector`).
Test mocks of the PowerSync database live in `__tests__/helpers/mockDb.ts`.
There are no automated smoke tests that launch the app, no component/UI tests, no end-to-end tests, and no coverage of screens under `app/`.
Sync rules, Supabase migrations, and cross-device conflict behaviour are not covered by automated tests.

## Maintenance Checklist

Update this file when tables are added, removed, or renamed in `db/schema.ts` or in `supabase/migrations/`.
Update when `supabase/powersync-sync-rules.yaml` bucket definitions change what data each user sees.
Update when a new top-level directory is added or a significant module moves.
Update when a new route file is added under `app/` or an existing route is removed.
Update when a direct dependency is added or removed in `package.json`.
Update when enum values in `lib/types.ts` change or when `lib/constants.ts` limits change.
Update when design-system tokens, primitives, or font loading in `lib/design-system/` or `components/ui/` change in shape.
Update when the provider chain in `app/_layout.tsx` changes.
Update when the test runner, canonical test command, or coverage footprint changes.
