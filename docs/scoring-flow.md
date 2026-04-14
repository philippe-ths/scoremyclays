# Scoring Flow

This document explains how the scoring state machine works — from entering the scoring screen to completing a round.

## The State Machine

Scoring advances through a nested loop with free navigation across positions and stands:

```
Select a position (PositionPicker):
  Select a stand (StandSelector):
    Select a shooter (ShooterPicker):
      For each target (1 to num_targets):
        For each bird (1 to birds_per_target):
          → Record KILL, LOSS, or NO_SHOT
      When stand complete for this shooter → return to ShooterPicker
    When all shooters complete → return to PositionPicker
```

The scorer taps one button per bird. The app handles all advancement automatically.

## Scoring Navigation

The scoring screen uses a 4-phase state machine:

| Phase | Component | Purpose |
|-------|-----------|---------|
| `position-picker` | `PositionPicker` | Shows all club positions with status badges indicating completeness |
| `stand-selector` | `StandSelector` | Shows stands within the selected position |
| `shooter-picker` | `ShooterPicker` | Shows shooters within the current stand with a progress bar and scoring status |
| `scoring` | Score buttons | KILL / LOSS / NO SHOT buttons for recording shots |

The scorer can pick any position and stand in any order.

When a scorer selects a stand, the app first checks the local database for a stand that may have arrived via sync from another user. If none exists, it creates one using a deterministic UUID derived from `round_id` and `club_stand_id`, ensuring all devices produce the same stand ID. The insert uses `INSERT OR IGNORE` for idempotency.

## Birds Per Target

The number of birds per target depends on the stand's target configuration:

| Target Config | Birds Per Target |
|---------------|-----------------|
| SINGLE | 1 |
| REPORT_PAIR | 2 |
| SIMULTANEOUS_PAIR | 2 |
| FOLLOWING_PAIR | 2 |

For pair configurations, each bird is tracked separately. A Report Pair target produces two `TargetResult` rows: bird 1 and bird 2, each with its own KILL/LOSS result.

## State Variables

The scoring screen tracks four position variables:

| Variable | Meaning |
|----------|---------|
| `shooterIdx` | Index into the ordered list of shooters |
| `targetNum` | Current target number (1-based, up to `num_targets`) |
| `birdNum` | Current bird within the target (1-based, up to `birds_per_target`) |
| `killCount` | Running kill count for the current shooter at the current stand |

## State Transitions

After the scorer taps KILL, LOSS, or NO_SHOT:

1. **Next bird**: If `birdNum < birds_per_target`, increment `birdNum`.
2. **Next target**: If all birds for this target are recorded and `targetNum < num_targets`, increment `targetNum` and reset `birdNum` to 1.
3. **Stand complete**: If all targets for this shooter at this stand are done, the "Stand Complete" overlay appears showing the score (e.g., "9/10").

From the Stand Complete overlay:

4. **Next shooter**: Tap "Choose Next Shooter" to return to the ShooterPicker and select another shooter at the same stand.
5. **Position complete**: When all shooters at all stands in a position are done, return to PositionPicker.
6. **Finish round**: When all positions are complete, the round status is set to `COMPLETED` and the app navigates to the Summary screen.

```
Record shot
    │
    ├─ more birds? → advance birdNum
    │
    ├─ more targets? → advance targetNum, reset birdNum
    │
    └─ stand done → show Stand Complete overlay
                        │
                        └─ return to ShooterPicker → choose next shooter or next position
```

## Database Writes

Each tap writes a single `TargetResult` row:

| Field | Value |
|-------|-------|
| `id` | New UUID (random for target results, deterministic for stand creation) |
| `stand_id` | Current stand's ID |
| `round_id` | Current round's ID (denormalized for efficient querying) |
| `shooter_entry_id` | Current shooter's ID |
| `target_number` | Current target number |
| `bird_number` | Current bird number |
| `result` | KILL, LOSS, or NO_SHOT |
| `recorded_by` | The scorer's user ID |
| `device_id` | Device identifier for conflict resolution |

All writes go to the local SQLite database. No network call is needed.

## Reactive Sync Updates

The scoring screen uses PowerSync's `db.watch()` to reactively update the UI as data syncs from other devices, without requiring a manual refresh:

| Watcher | Query | Updates |
|---------|-------|---------|
| Stands | `stands WHERE round_id = ?` | `createdStandMap` — reflects stands created by other users |
| Shooter entries | `shooter_entries WHERE squad_id = ?` | `shooters` list — new squad members appear automatically |
| Shooter statuses | `target_results WHERE stand_id = ?` | Shooter progress badges (not-started / in-progress / completed) |
| Live score | `target_results WHERE stand_id = ? AND shooter_entry_id = ?` | Kill count and target position for the current shooter |

This means when one user scores a shooter, other users on the same round see the status update in real time.

## Mid-Round Resume

If the app is closed and reopened during a round, the scoring screen reloads existing `TargetResult` rows for the current stand and shooter. It calculates:

- How many targets have been recorded
- The last target and bird numbers
- The running kill count

It then positions the state machine at the next unrecorded bird so scoring can continue where it left off.

## Offline Conflict Detection & Resolution

Any squad member can score for any shooter. If two devices later sync overlapping records for the same shot, the client detects that duplicate `(shooter_entry_id, target_number, bird_number)` combination and treats it as a conflict.

The app handles conflicts in four stages:

1. **Deduplication during active scoring:** `smcGetResultsForStandAndShooter` orders rows by `created_at` and keeps only the first record for each target and bird so the scorer can continue without the state machine skipping ahead.
2. **Conflict-aware totals:** `smcGetShooterRoundScore` flags shooters with duplicates and suppresses their rolled-up totals until the duplicates are resolved.
3. **UI warnings:** The scoring screen shows a `Sync Issue` warning for the active shooter, and the summary screen marks conflicted shooters explicitly.
4. **Organizer resolution:** The round creator can open the conflict-resolution screen, choose the winning record for each duplicated shot, and delete the losing rows from `target_results`.

This workflow relies on the `recorded_by`, `device_id`, and `created_at` fields on each `TargetResult` row.

## Haptic Feedback

Each score button tap triggers haptic feedback (`ImpactFeedbackStyle.Medium`) via `expo-haptics`. On web, where haptics are unavailable, the call gracefully degrades to a no-op.
