# Project Spec
This document reflects the current implementation and should be updated when core routes, schema, sync rules, or provider behavior changes.

## Product Summary
- ScoreMyClays is an Expo React Native app that records clay shooting round results across mobile and web.
- Users authenticate with Supabase and are routed through profile setup until a user handle is present.
- New rounds are created at a selected club and start with an initial squad containing the creator.
- Scoring is captured per stand, shooter, target number, and bird number with KILL, LOSS, and NO_SHOT outcomes.
- Invites are sent by user handle, and accepted invites add the invitee into the round squad.
- The app is offline-first with local PowerSync SQLite data and sync to Supabase when connected.
- Round summaries show shooter totals and stand breakdowns, and conflict resolution is available to the round organizer.

## Domain Concepts
- User is an authenticated record with internal id and a unique user_id handle used for invites.
- Round is a dated event with created_by, status, and club_id fields.
- Squad is a container for shooter entries scoped to one round.
- ShooterEntry is an ordered participant that may be linked to a user or stored as a name-only shooter.
- Club is a venue record used when creating rounds.
- ClubPosition is an ordered group within a club that contains stands.
- ClubStand is a reusable stand template with target configuration and presentation metadata.
- Stand is a round-specific stand record derived from club stand templates during scoring flow.
- TargetResult is one recorded shot outcome for a shooter on a target and bird index.
- Invite links inviter and invitee to a round with PENDING, ACCEPTED, or DECLINED status.

## Scope
- The app currently includes auth screens for signup, login, and profile setup.
- The main tab surface currently includes home, new round, clubs, history, and profile.
- Users can create rounds at clubs with automatic squad and creator shooter entry creation.
- Round setup currently supports adding name-only shooters, inviting users by handle, and removing shooters with a minimum one-shooter guard.
- Scoring currently supports position selection, stand selection, shooter selection, and shot-by-shot result recording.
- Invites currently support pending list, accept, and decline behavior.
- Summary currently shows shooter totals, stand breakdowns, and organizer-only conflict resolution access.
- In-progress rounds can be resumed from home and history paths.

## Important Constraints
- Squad size is constrained to six shooters in round setup and invite acceptance paths.
- App routing requires profile completion state based on user_id availability before normal non-auth routing.
- Display-name search only returns discoverable users, while handle search works regardless of discoverable flag.
- Clubs, club_positions, and club_stands are treated as read-only during connector upload operations.
- Sync scoping relies on denormalized round_id fields in shooter_entries and target_results.
- Stand creation uses deterministic identifiers and INSERT OR IGNORE behavior to reduce duplicate stand rows.
- Shooter round score returns 0 and 0 when unresolved conflicts exist for that shooter and round.
- Web PowerSync setup runs without web workers and depends on Metro and Babel import.meta handling.

## Architecture Summary
- The implemented architecture is a client-side modular monolith organized as layered application code in one repository.
- The primary layers are route screens, provider orchestration, query modules, and local schema-backed persistence.
- Data flow is offline-first with local PowerSync SQLite as runtime store and a connector syncing CRUD operations to Supabase.
- Runtime behavior is reactive inside the app through auth and database listener callbacks rather than distributed event infrastructure.
- The repository does not contain app-owned microservices, and backend behavior is consumed through Supabase and PowerSync services.

## Key Dependencies
- Expo and React Native provide the cross-platform runtime and build surface for iOS, Android, and web.
- Expo Router provides file-based navigation for auth, tabs, and round flows.
- @powersync/react-native and @powersync/web provide local-first sync-capable SQLite integration.
- @supabase/supabase-js provides auth session management and backend table access used by the connector.
- @journeyapps/react-native-quick-sqlite and @journeyapps/wa-sqlite provide platform SQLite engines.
- expo-crypto provides random UUID generation and deterministic UUID hashing support.
- Jest and ts-jest provide the current TypeScript unit testing harness.

## Project Structure
- app contains route screens for auth, tabs, clubs, invites, profile, and round workflows.
- providers contains database, auth, and sync context orchestration.
- db contains local schema, platform database entrypoints, seeds, and query modules.
- lib contains shared domain types, constants, formatting, UUID, connector, and Supabase client utilities.
- components contains reusable scoring and selection UI components.
- supabase contains SQL migrations and PowerSync sync-rule definitions.
- __tests__ contains query and utility unit tests.
- Core app configuration is defined in app.json, package.json, tsconfig.json, metro.config.js, and babel.config.js.

## Testing Overview
- Tests run with Jest and ts-jest in a Node environment with alias mapping for app imports.
- Current automated coverage includes query modules for clubs, invites, scoring, stands, and users.
- Current automated coverage includes utility behavior for the PowerSync connector and deterministic UUID generation.
- Screen-level, provider-level, and end-to-end user flow tests are not present in the current test suite.