# ScoreMyClays - Project Specification

## Purpose

This document defines the foundation for building ScoreMyClays, a mobile app for recording clay pigeon shooting scores. The app must work fully offline and sync data between devices when connectivity is available.

This is a production app targeting iOS and Android app stores.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Mobile Framework | React Native + Expo (managed workflow) | Cross-platform iOS/Android from single codebase |
| Local Database | SQLite (via expo-sqlite or op-sqlite) | On-device offline storage |
| Backend Database | Supabase (PostgreSQL) | Cloud storage, auth, realtime |
| Sync Engine | PowerSync | Bidirectional sync between local SQLite and Supabase Postgres |
| Build and Deploy | Expo EAS Build | App store submissions for iOS and Android |
| Language | TypeScript | Type safety across the project |

### Why These Choices

- **React Native + Expo**: Single codebase, large ecosystem, EAS handles app store builds without local Xcode/Android Studio setup.
- **Supabase**: Open source, PostgreSQL-based, includes auth and row-level security. Avoids vendor lock-in.
- **PowerSync**: Purpose-built for the local-SQLite-to-Postgres sync problem. Handles offline-first with conflict resolution. Avoids building custom sync logic.
- **TypeScript**: Non-negotiable for a production app of this complexity.

---

## Core Concept

Shooters go to a shooting ground, form a squad (1-6 people), and shoot a round of sporting clays. The round consists of multiple stands. At each stand, targets (clays) are thrown with a specific presentation. Each target is either a kill (hit) or a loss (miss). One person in the squad records scores for the others on their device.

The app must work with zero connectivity from the moment a session starts. Sync happens opportunistically when a connection becomes available.

---

## Domain Terminology

Use these terms consistently throughout the codebase. Do not substitute generic terms.

| Term | Meaning |
|------|---------|
| **Round** | A complete shooting session (e.g., 100 birds) |
| **Stand** | A physical shooting position (also called Station or Peg). A round has multiple stands. |
| **Target** | A single clay pigeon thrown from a trap (also called Bird or Clay) |
| **Kill** | Target was hit/broken |
| **Loss** | Target was missed |
| **Trap** | The machine that throws targets (also called House) |
| **Presentation** | The type of target flight. See Presentation Types below. |
| **Flight** | A group of targets thrown at a stand |
| **Squad** | A group of 1-6 shooters taking a round together |
| **Scorer** | The person recording results on their device (usually another squad member) |

### Presentation Types

These are the common sporting clay presentations. Store as an enum.

| Presentation | Description |
|-------------|-------------|
| CROSSER | Target flies across the shooter's front, left-to-right or right-to-left |
| DRIVEN | Target comes toward the shooter, rising then falling overhead |
| INCOMING | Target approaches the shooter at various angles |
| GOING_AWAY | Target moves away from the shooter |
| QUARTERING_AWAY | Target moves away at an angle |
| QUARTERING_TOWARDS | Target approaches at an angle |
| TEAL | Target rises steeply upward (springing teal) |
| DROPPING | Target falls or descends |
| LOOPER | Target rises then curves downward |
| RABBIT | Target rolls/bounces along the ground |
| BATTUE | Thin target that turns and drops mid-flight |
| CHANDELLE | Target rises and curves to one side |
| SPRINGING | Target launches upward at an angle |

### Target Configuration Per Stand

Each stand has a defined target setup:

| Config | Meaning |
|--------|---------|
| SINGLE | One target thrown per turn |
| REPORT_PAIR | Two targets. Second launched on the sound of the first shot. |
| SIMULTANEOUS_PAIR | Two targets launched at the same time |
| FOLLOWING_PAIR | Two targets from the same trap launched in quick succession |

For pairs, each individual target within the pair must be tracked separately (first bird, second bird) with its own kill/loss result.

---

## Data Model

### Entity Relationship
```
User
  has many Rounds
    has one Squad (with 1-6 ShooterEntries)
    has many Stands (ordered)
      has a Presentation config
      has many Targets (ordered)
        each has a result per ShooterEntry (kill/loss/no-shot)
```

### Core Entities

#### User
```
id:           UUID (generated locally)
display_name: string
email:        string (nullable, only if registered)
created_at:   timestamp
```

#### Round
```
id:             UUID (generated locally)
created_by:     UUID (User.id)
ground_name:    string (free text for now)
date:           date
total_targets:  integer
status:         enum [IN_PROGRESS, COMPLETED, ABANDONED]
notes:          string (nullable)
created_at:     timestamp
updated_at:     timestamp
```

#### Squad
```
id:       UUID (generated locally)
round_id: UUID (Round.id)
```

#### ShooterEntry
```
id:                UUID (generated locally)
squad_id:          UUID (Squad.id)
user_id:           UUID (nullable, linked if the shooter has an account)
shooter_name:      string (display name, required even if user_id is set)
position_in_squad: integer (1-6)
```

#### Stand
```
id:                  UUID (generated locally)
round_id:            UUID (Round.id)
stand_number:        integer (order in the round)
target_config:       enum [SINGLE, REPORT_PAIR, SIMULTANEOUS_PAIR, FOLLOWING_PAIR]
presentation:        enum [see Presentation Types above]
presentation_notes:  string (nullable, free text for additional detail)
num_targets:         integer (total targets at this stand)
```

#### TargetResult
```
id:               UUID (generated locally)
stand_id:         UUID (Stand.id)
shooter_entry_id: UUID (ShooterEntry.id)
target_number:    integer (order within the stand)
bird_number:      integer (1 for singles, 1 or 2 for pairs)
result:           enum [KILL, LOSS, NO_SHOT]
recorded_by:      UUID (User.id of the scorer)
device_id:        string (unique device identifier)
created_at:       timestamp
```

### Key Design Decisions

1. **UUIDs generated locally.** Every entity gets a UUID created on-device. This avoids needing a server to issue IDs, which is essential for offline-first.

2. **TargetResult is the atomic scoring unit.** Each individual bird gets its own row. For a simultaneous pair, that is two TargetResult rows (bird_number 1 and 2).

3. **recorded_by and device_id on TargetResult.** This tracks who recorded what and from which device, which is critical for conflict resolution.

4. **ShooterEntry is separate from User.** A shooter in a squad might not have an account. They just need a name. If they do have an account, user_id links them so their history aggregates.

5. **NO_SHOT result.** Covers mechanical failures, safety stops, or any case where a target was thrown but not scored as kill or loss.

---

## Offline-First Architecture

### Principles

1. The local SQLite database is the source of truth on each device.
2. The app never requires connectivity to function. All CRUD operations happen locally.
3. PowerSync handles bidirectional sync to Supabase when a connection is available.
4. Sync is eventual. The UI never blocks waiting for sync.

### Session Creation (Offline)

1. User opens app, taps "New Round."
2. App generates a UUID for the round locally.
3. User enters ground name, date, and sets up stands.
4. User adds shooters to the squad by name (no account required for other shooters).
5. Scoring begins. All data writes go to local SQLite.
6. No connectivity needed at any point in this flow.

### Sync Behaviour

- PowerSync maintains a local SQLite replica that mirrors the Supabase Postgres schema.
- When online, PowerSync syncs local changes to Supabase and pulls remote changes.
- Sync is automatic and runs in the background. The user does not trigger it manually.
- Sync status should be visible in the UI (a simple indicator: synced / syncing / offline).

### Conflict Resolution Strategy

**Designated scorer wins.** The recorded_by field identifies who recorded each TargetResult. In the unlikely case of two devices recording TargetResults for the same shooter at the same stand and target, the conflict resolution rule is:

1. If one record comes from the designated scorer (the person who created the round), that record wins.
2. If neither is the designated scorer, the record with the earlier created_at timestamp wins.
3. Conflicts should be logged for debugging but not surfaced to the user unless data loss would occur.

PowerSync supports custom conflict resolution rules. Implement the above logic in the PowerSync conflict handler.

---

## MVP Scope

The MVP delivers exactly this and nothing more.

### In Scope

- User can create a round (offline)
- User can set up stands with presentation type and target configuration
- User can add shooters to a squad (by name, no account needed)
- User can record kill/loss/no-shot for each target at each stand
- Running score totals update in real time during a round
- Completed rounds are stored locally
- User can view past rounds and scores
- Basic user profile (name, optional email)
- Auth via Supabase (email/password, Google sign-in)
- Guest mode (use the app without creating an account, data stays local only)
- Offline-first with PowerSync sync when online
- Sync status indicator in the UI
- Deploys to iOS and Android via Expo EAS

### Out of Scope (Future)

- Analytics and performance charts
- Social features, friends, leaderboards
- Club and ground management
- Weather tracking
- Equipment tracking
- In-app messaging
- Subscription/payment tiers
- Web portal
- Push notifications

---

## Project Structure
```
score-my-clays/
  app/                        # Expo Router screens
    (tabs)/                   # Tab navigation
      index.tsx               # Home / recent rounds
      new-round.tsx           # Create round flow
      history.tsx             # Past rounds
      profile.tsx             # User profile
    round/
      [id]/
        setup.tsx             # Stand and squad setup
        score.tsx             # Active scoring interface
        summary.tsx           # Round summary
    _layout.tsx
  components/                 # Reusable UI components
  db/                         # Database layer
    schema.ts                 # PowerSync schema definition
    migrations/               # SQLite migrations
    queries/                  # Typed query functions
  hooks/                      # Custom React hooks
  lib/                        # Utilities, constants, types
    types.ts                  # TypeScript types and enums
    constants.ts              # App constants
    supabase.ts               # Supabase client config
  providers/                  # Context providers
    AuthProvider.tsx
    DatabaseProvider.tsx
    SyncProvider.tsx
  app.config.ts               # Expo config
  package.json
  tsconfig.json
```

Uses Expo Router for file-based routing.

---

## UI Requirements

These are non-negotiable for the scoring interface:

1. **Large tap targets.** Minimum 48x48dp, preferably larger. Shooters may be wearing gloves.
2. **High contrast.** Must be readable in direct sunlight. Dark text on light backgrounds, or offer a high-contrast mode.
3. **Minimal taps to record a score.** From the scoring screen, recording a kill or loss for a target should be a single tap.
4. **Clear visual feedback.** Distinct colours for kill (green) and loss (red). Audible/haptic feedback on tap.
5. **No scrolling during active scoring.** The current stand's scoring interface should fit on one screen.
6. **Running total always visible.** Current score out of total possible should be persistent on the scoring screen.

---

## Auth Flow

1. **First launch:** User chooses "Create Account" or "Continue as Guest."
2. **Guest mode:** App generates a local-only user with a UUID. All data stays on device. Sync is disabled.
3. **Account creation:** Email/password or Google sign-in via Supabase Auth. Enables sync.
4. **Guest to account upgrade:** User can later create an account. Local data is associated with the new account and begins syncing.

---

## Supabase Schema Notes

The Supabase Postgres schema should mirror the data model above. Key points:

- Enable Row Level Security (RLS) on all tables.
- Users can only read/write their own data (where created_by = auth.uid or where they are a participant in the squad).
- The PowerSync sync rules should scope data to the authenticated user's rounds and any rounds where they appear as a ShooterEntry.
- Use Supabase migrations for schema management.

---

## Getting Started (for the coding AI)

### Step 1: Project Init

Create Expo project with TypeScript template. Install dependencies: PowerSync SDK, Supabase client, Expo Router, expo-sqlite.

### Step 2: Database Layer

Define PowerSync schema matching the data model. Set up local SQLite with PowerSync. Create typed query functions for all CRUD operations.

### Step 3: Auth

Configure Supabase Auth (email/password + Google). Implement guest mode with local-only user. Build AuthProvider context.

### Step 4: Core Screens

New Round flow (round creation, stand setup, squad setup). Scoring interface (the most critical screen, spend the most time here). Round summary. Round history.

### Step 5: Sync

Configure PowerSync connection to Supabase. Implement sync rules scoped to user data. Add sync status indicator. Test offline/online transitions.

### Step 6: Build and Deploy

Configure EAS Build for iOS and Android. Set up app signing. Test on physical devices.

---

## Architecture Notes

### Stand Presentation Limitation

The current model assumes one presentation per stand. Some sporting layouts have stands where different pairs have different presentations (e.g., stand 5 throws a crosser pair and then a driven pair). If this proves too limiting, the fix is to add a Flight entity between Stand and TargetResult, where each flight has its own presentation. Kept simple for MVP.

### Squad Entity

The Squad entity looks thin (just an id and round_id). This is intentional. It exists so the relationship is clean and extensible. Later additions like squad creation time, squad status, or a designated scorer field will not require a schema migration.

### Offline Session Joining

Starting a session with zero connectivity means devices need to generate session IDs locally (UUIDs). The "joining a session" flow when offline requires either pre-arranging before losing signal, or using a mechanism like QR code or short code exchange. This flow needs careful UX design during implementation.