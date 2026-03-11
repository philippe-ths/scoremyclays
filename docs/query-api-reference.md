# Query API Reference

The query layer lives in `db/queries/`. Every function takes an `AbstractPowerSyncDatabase` as its first argument — this is the PowerSync SDK database instance, available via `usePowerSync()` in React components.

All functions are async. All reads return data from the local SQLite database (never from the network). All writes go to local SQLite and are queued for sync via the PowerSync CRUD upload queue.

---

## clubs.ts

Functions for reading club reference data (clubs, positions, stands). This data is read-only — it's seeded via Supabase migrations and synced down to devices.

### `listClubs(db, search?): Promise<Club[]>`

Returns all clubs ordered by name. If `search` is provided, filters by `name LIKE %search%`.

| Param | Type | Required | Description |
|:------|:-----|:---------|:------------|
| `db` | `AbstractPowerSyncDatabase` | Yes | Database instance |
| `search` | `string` | No | Filter clubs by name (case-insensitive LIKE) |

### `getClub(db, id): Promise<Club | null>`

Returns a single club by ID, or null if not found.

### `getClubPositions(db, clubId): Promise<ClubPosition[]>`

Returns all positions for a club, ordered by `position_number`.

### `getClubStandsByPosition(db, positionId): Promise<ClubStand[]>`

Returns all stands within a position, ordered by `stand_number`.

### `getClubWithDetails(db, clubId): Promise<{ club, positions } | null>`

Returns a club with all its positions and stands nested. Convenience function that calls `getClub`, `getClubPositions`, and `getClubStandsByPosition` in sequence.

**Return shape:**
```ts
{
  club: Club;
  positions: (ClubPosition & { stands: ClubStand[] })[];
}
```

---

## rounds.ts

Functions for creating and managing rounds.

### `createRound(db, params): Promise<void>`

Creates a new round with status `IN_PROGRESS`. Sets `created_at` and `updated_at` to the current timestamp.

| Param | Type | Required | Description |
|:------|:-----|:---------|:------------|
| `params.id` | `string` | Yes | UUID for the new round |
| `params.created_by` | `string` | Yes | User ID of the creator |
| `params.ground_name` | `string` | Yes | Name of the shooting ground |
| `params.date` | `string` | Yes | Date string (e.g. `2026-03-11`) |
| `params.total_targets` | `number` | Yes | Total target count (25, 50, 75, or 100) |
| `params.club_id` | `string \| null` | No | Club ID if this is a club round |

### `getRound(db, id): Promise<Round | null>`

Returns a single round by ID, or null if not found.

### `listRounds(db, userId): Promise<Round[]>`

Returns all rounds where the user is either the creator or a shooter in the squad. Ordered by `created_at DESC` (newest first). Uses a `LEFT JOIN` on `shooter_entries` and `DISTINCT` to avoid duplicates.

### `updateRoundStatus(db, id, status): Promise<void>`

Updates a round's status. Sets `updated_at` to the current timestamp.

| Param | Type | Description |
|:------|:-----|:------------|
| `status` | `RoundStatus` | `IN_PROGRESS`, `COMPLETED`, or `ABANDONED` |

### `updateRoundNotes(db, id, notes): Promise<void>`

Updates a round's notes field. Sets `updated_at` to the current timestamp.

---

## squads.ts

Functions for managing squads and shooter entries within a round.

### `createSquad(db, params): Promise<void>`

Creates a new squad linked to a round.

| Param | Type | Description |
|:------|:-----|:------------|
| `params.id` | `string` | UUID for the new squad |
| `params.round_id` | `string` | Round this squad belongs to |

### `getSquadByRound(db, roundId): Promise<Squad | null>`

Returns the squad for a round, or null if none exists. Each round has exactly one squad.

### `addShooterEntry(db, params): Promise<void>`

Adds a shooter to a squad.

| Param | Type | Required | Description |
|:------|:-----|:---------|:------------|
| `params.id` | `string` | Yes | UUID for the new shooter entry |
| `params.squad_id` | `string` | Yes | Squad ID |
| `params.round_id` | `string` | Yes | Round ID (denormalized for sync rules) |
| `params.user_id` | `string \| null` | Yes | User ID if registered user, null if guest |
| `params.shooter_name` | `string` | Yes | Display name for the shooter |
| `params.position_in_squad` | `number` | Yes | Position number (1-based) |

### `listShooterEntries(db, squadId): Promise<ShooterEntry[]>`

Returns all shooters in a squad, ordered by `position_in_squad`.

### `listShooterEntriesWithUsers(db, squadId): Promise<EnrichedShooterEntry[]>`

Returns all shooters in a squad with their `user_handle` (the `@handle` from the `users` table). Uses a `LEFT JOIN` on `users`. The `user_handle` field is null for guest shooters.

### `removeShooterEntry(db, id): Promise<void>`

Deletes a shooter entry by ID.

---

## stands.ts

Functions for managing stands within a round.

### `createStand(db, params): Promise<void>`

Creates a new stand. Uses `INSERT OR IGNORE` for idempotency — if a stand with the same ID already exists (e.g. from sync), the insert is silently skipped. This is critical for club rounds where multiple devices generate the same deterministic stand ID.

| Param | Type | Required | Description |
|:------|:-----|:---------|:------------|
| `params.id` | `string` | Yes | UUID (random for custom rounds, deterministic for club rounds) |
| `params.round_id` | `string` | Yes | Round ID |
| `params.stand_number` | `number` | Yes | Ordering position (1-based) |
| `params.target_config` | `TargetConfig` | Yes | `SINGLE`, `REPORT_PAIR`, `SIMULTANEOUS_PAIR`, or `FOLLOWING_PAIR` |
| `params.presentation` | `PresentationType` | Yes | One of 13 presentation types (e.g. `CROSSER`, `TEAL`, `RABBIT`) |
| `params.presentation_notes` | `string \| null` | Yes | Optional description of the presentation |
| `params.num_targets` | `number` | Yes | Number of targets at this stand |
| `params.club_stand_id` | `string \| null` | No | Club stand reference (club rounds only) |
| `params.club_position_id` | `string \| null` | No | Club position reference (club rounds only) |

### `listStands(db, roundId): Promise<Stand[]>`

Returns all stands for a round, ordered by `stand_number`.

### `getStand(db, id): Promise<Stand | null>`

Returns a single stand by ID, or null if not found.

### `updateStand(db, id, params): Promise<void>`

Partially updates a stand. Only the provided fields are updated — omitted fields are unchanged.

| Param | Type | Description |
|:------|:-----|:------------|
| `params.target_config` | `TargetConfig` | Optional |
| `params.presentation` | `PresentationType` | Optional |
| `params.presentation_notes` | `string \| null` | Optional |
| `params.num_targets` | `number` | Optional |

### `deleteStand(db, id): Promise<void>`

Deletes a stand by ID.

---

## scoring.ts

Functions for recording and querying shot results, calculating scores, and handling conflicts.

### `recordTargetResult(db, params): Promise<void>`

Records a single shot result. Sets `created_at` to the current timestamp. This is the most frequently called write in the app — one call per button tap during scoring.

| Param | Type | Description |
|:------|:-----|:------------|
| `params.id` | `string` | UUID (always `Crypto.randomUUID()`) |
| `params.stand_id` | `string` | Stand being scored |
| `params.round_id` | `string` | Round ID (denormalized for sync rules) |
| `params.shooter_entry_id` | `string` | Shooter being scored |
| `params.target_number` | `number` | Target number (1-based, up to `num_targets`) |
| `params.bird_number` | `number` | Bird number within target (1 for singles, 1-2 for pairs) |
| `params.result` | `ShotResult` | `KILL`, `LOSS`, or `NO_SHOT` |
| `params.recorded_by` | `string` | User ID of the person recording (may differ from shooter) |
| `params.device_id` | `string` | Device identifier for conflict resolution |

### `getResultsForStandAndShooter(db, standId, shooterEntryId): Promise<TargetResultRecord[]>`

Returns shot results for a specific shooter at a specific stand. **Deduplicates** by `(target_number, bird_number)` — if multiple records exist for the same shot (from sync conflicts), only the earliest (`created_at ASC`) is returned. This keeps the scoring state machine stable during active scoring.

### `getResultsForStand(db, standId): Promise<TargetResultRecord[]>`

Returns all shot results for a stand (all shooters). No deduplication — returns raw rows.

### `getResultsForRound(db, roundId): Promise<TargetResultRecord[]>`

Returns all shot results for a round via a join on `stands`. Ordered by `stand_number`, `target_number`, `bird_number`. No deduplication.

### `updateTargetResult(db, id, result): Promise<void>`

Updates the result of an existing target result row.

### `getShooterRoundScore(db, roundId, shooterEntryId): Promise<{ kills, total, hasConflicts }>`

Calculates a shooter's total score for a round.

**Conflict check:** Before calculating, queries for any `(target_number, bird_number)` groups with `COUNT(*) > 1`. If conflicts exist, returns `{ kills: 0, total: 0, hasConflicts: true }` — the entire score is suppressed to prevent showing inaccurate totals.

**Return shape:**
```ts
{ kills: number; total: number; hasConflicts: boolean }
```

### `getRoundConflicts(db, roundId): Promise<ConflictedShotGroup[]>`

Finds all conflicted shots in a round. Groups `target_results` by `(shooter_entry_id, target_number, bird_number)` and returns groups with more than one row.

**Return shape:**
```ts
interface ConflictedShotGroup {
  shooter_entry_id: string;
  target_number: number;
  bird_number: number;
  records: TargetResultRecord[];  // sorted by created_at ASC
}
```

### `resolveConflict(db, keepId, deleteIds): Promise<void>`

Resolves a conflict by deleting the losing records in a write transaction. The `keepId` is accepted for API clarity but is not used in the query — only the `deleteIds` are deleted.

---

## invites.ts

Functions for managing round invitations between users.

### `createInvite(db, params): Promise<void>`

Creates a new invite with status `PENDING`. Sets `created_at` to the current timestamp.

| Param | Type | Description |
|:------|:-----|:------------|
| `params.id` | `string` | UUID for the invite |
| `params.round_id` | `string` | Round being invited to |
| `params.inviter_id` | `string` | User ID of the inviter |
| `params.invitee_id` | `string` | User ID (UUID) of the invitee |
| `params.invitee_user_id` | `string` | User handle (`@handle`) of the invitee |

### `getInviteById(db, inviteId): Promise<Invite | null>`

Returns a single invite by ID, or null if not found.

### `listInvitesForRound(db, roundId): Promise<Invite[]>`

Returns all invites for a round, ordered by `created_at DESC`.

### `listIncomingInvitesForUser(db, inviteeUserId, status?): Promise<Invite[]>`

Returns invites where the user is the invitee. Matches on `invitee_user_id` (the handle, not the UUID). Optionally filters by status.

### `listOutgoingInvitesForRound(db, roundId, inviterId): Promise<Invite[]>`

Returns invites sent by a specific user for a specific round.

### `updateInviteStatus(db, inviteId, status): Promise<void>`

Updates an invite's status (e.g. `PENDING` to `ACCEPTED` or `DECLINED`).

### `checkDuplicateInvite(db, roundId, inviteeUserId): Promise<Invite | null>`

Checks if an invite already exists for this user and round. Returns the existing invite or null. Used to prevent duplicate invites.

### `getPendingInviteCount(db, inviteeUserId): Promise<number>`

Returns the count of pending invites for a user. Used for the notification badge on the home screen.

---

## users.ts

Functions for user lookup, search, and profile management.

### `getUserById(db, userId): Promise<User | null>`

Returns a user by their internal UUID (from Supabase Auth).

### `getUserByUserId(db, userIdHandle): Promise<User | null>`

Returns a user by their `@handle`. Case-insensitive match using `LOWER()`.

### `searchUsersByDisplayName(db, displayName): Promise<User[]>`

Searches users by display name using `LIKE %pattern%`. **Only returns users where `discoverable = 1`** — respects the user's visibility preference.

### `searchUsersByUserId(db, userIdHandle): Promise<User[]>`

Searches users by partial handle match using `LIKE %pattern%`. Case-insensitive. **Returns all users regardless of discoverable setting** — handles are considered public identifiers.

### `isUserIdAvailable(db, userIdHandle): Promise<boolean>`

Returns `true` if the handle is not taken. Case-insensitive check. Used during profile setup to validate handle uniqueness.

### `updateUserProfile(db, userId, updates): Promise<void>`

Partially updates a user's profile. Only the provided fields are updated. Sets `updated_at` to the current timestamp.

| Param | Type | Description |
|:------|:-----|:------------|
| `updates.display_name` | `string` | Optional |
| `updates.user_id` | `string` | Optional (the `@handle`) |
| `updates.discoverable` | `number` | Optional (0 or 1) |
| `updates.favourite_club_ids` | `string` | Optional (JSON array as text) |
| `updates.gear` | `string` | Optional (JSON array as text) |
