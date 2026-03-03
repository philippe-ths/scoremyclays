# Scoring Flow

This document explains how the scoring state machine works — from entering the scoring screen to completing a round.

## The State Machine

Scoring advances through a nested loop:

```
For each stand (ordered by stand_number):
  For each shooter (ordered by position_in_squad):
    For each target (1 to num_targets):
      For each bird (1 to birds_per_target):
        → Record KILL, LOSS, or NO_SHOT
```

The scorer taps one button per bird. The app handles all advancement automatically.

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

The scoring screen tracks five position variables:

| Variable | Meaning |
|----------|---------|
| `standIdx` | Index into the ordered list of stands |
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

4. **Next shooter**: If more shooters remain, advance `shooterIdx`, reset `targetNum` and `birdNum` to 1.
5. **Next stand**: If all shooters are done at this stand but more stands remain, advance `standIdx`, reset `shooterIdx`, `targetNum`, and `birdNum`.
6. **Finish round**: If all stands are complete for all shooters, the round status is set to `COMPLETED` and the app navigates to the Summary screen.

```
Record shot
    │
    ├─ more birds? → advance birdNum
    │
    ├─ more targets? → advance targetNum, reset birdNum
    │
    └─ stand done → show Stand Complete overlay
                        │
                        ├─ more shooters? → advance shooterIdx, reset targets
                        │
                        ├─ more stands? → advance standIdx, reset shooter + targets
                        │
                        └─ all done → mark round COMPLETED → navigate to Summary
```

## Database Writes

Each tap writes a single `TargetResult` row:

| Field | Value |
|-------|-------|
| `id` | New UUID (generated locally via `expo-crypto`) |
| `stand_id` | Current stand's ID |
| `shooter_entry_id` | Current shooter's ID |
| `target_number` | Current target number |
| `bird_number` | Current bird number |
| `result` | KILL, LOSS, or NO_SHOT |
| `recorded_by` | The scorer's user ID |
| `device_id` | Device identifier for conflict resolution |

All writes go to the local SQLite database. No network call is needed.

## Mid-Round Resume

If the app is closed and reopened during a round, the scoring screen reloads existing `TargetResult` rows for the current stand and shooter. It calculates:

- How many targets have been recorded
- The last target and bird numbers
- The running kill count

It then positions the state machine at the next unrecorded bird so scoring can continue where it left off.

## Conflict Resolution

When multiple devices record results for the same round (e.g., two scorers), conflicts are resolved by:

1. The designated scorer's records take priority (the user who created the round).
2. If neither record is from the designated scorer, the earlier `created_at` timestamp wins.
3. Conflicts are logged but not surfaced to the user unless data loss would occur.

This is implemented in the PowerSync conflict handler and relies on the `recorded_by` and `device_id` fields on each `TargetResult`.

## Haptic Feedback

Each score button tap triggers haptic feedback (`ImpactFeedbackStyle.Medium`) via `expo-haptics`. On web, where haptics are unavailable, the call gracefully degrades to a no-op.
