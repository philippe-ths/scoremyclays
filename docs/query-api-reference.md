# Query API Reference

The query layer lives in `db/queries/`. Every function takes an `AbstractPowerSyncDatabase` as its first argument — this is the PowerSync SDK database instance, available via `usePowerSync()` in React components.

All functions are async. All reads return data from the local SQLite database (never from the network). All writes go to local SQLite and are queued for sync via the PowerSync CRUD upload queue.

All exported functions are prefixed with `smc` and live in files prefixed with `smc-` (e.g. `db/queries/smc-clubs.ts`).

---

## smc-clubs.ts

Functions for reading club reference data (clubs, positions, stands). This data is read-only — it's seeded via Supabase migrations and synced down to devices.

### `smcListClubs(db, search?): Promise<Club[]>`

Returns all clubs ordered by name. If `search` is provided, filters by `name LIKE %search%`.

| Param | Type | Required | Description |
|:------|:-----|:---------|:------------|
| `db` | `AbstractPowerSyncDatabase` | Yes | Database instance |
| `search` | `string` | No | Filter clubs by name (case-insensitive LIKE) |

### `smcGetClub(db, id): Promise<Club | null>`

Returns a single club by ID, or null if not found.

### `smcGetClubPositions(db, clubId): Promise<ClubPosition[]>`

Returns all positions for a club, ordered by `position_number`.

### `smcGetClubStandsByPosition(db, positionId): Promise<ClubStand[]>`

Returns all stands within a position, ordered by `stand_number`.

### `smcGetClubWithDetails(db, clubId): Promise<{ club, positions } | null>`

Returns a club with all its positions and stands nested. Convenience function that calls `smcGetClub`, `smcGetClubPositions`, and `smcGetClubStandsByPosition` in sequence.

**Return shape:**
```ts
{
  club: Club;
  positions: (ClubPosition & { stands: ClubStand[] })[];
}
```

---

## smc-rounds.ts

Functions for creating and managing rounds.

### `smcCreateRound(db, params): Promise<void>`

Creates a new round with status `SETUP`. Sets `created_at` and `updated_at` to the current timestamp.

| Param | Type | Required | Description |
|:------|:-----|:---------|:------------|
| `params.id` | `string` | Yes | UUID for the new round |
| `params.created_by` | `string` | Yes | User ID of the creator |
| `params.ground_name` | `string` | Yes | Name of the shooting ground |
| `params.date` | `string` | Yes | Date string (e.g. `2026-03-11`) |
| `params.total_targets` | `number` | Yes | Total target count (25, 50, 75, or 100) |
| `params.club_id` | `string \| null` | No | Club ID if this is a club round |

### `smcGetRound(db, id): Promise<Round | null>`

Returns a single round by ID, or null if not found.

### `smcListRounds(db, userId): Promise<RoundListItem[]>`

Returns all rounds where the user is either the creator or a shooter in the squad. Ordered by `created_at DESC` (newest first). Uses a `LEFT JOIN` on `shooter_entries` and `DISTINCT` to avoid duplicates. Each row includes a computed `has_unresolved_conflicts` flag derived from duplicate target-result groups on the round.

### `smcUpdateRoundStatus(db, id, status): Promise<void>`

Updates a round's status. Sets `updated_at` to the current timestamp.

| Param | Type | Description |
|:------|:-----|:------------|
| `status` | `RoundStatus` | `SETUP`, `IN_PROGRESS`, `COMPLETED`, or `ABANDONED` |

### `smcUpdateRoundNotes(db, id, notes): Promise<void>`

Updates a round's notes field. Sets `updated_at` to the current timestamp.

---

## smc-squads.ts

Functions for managing squads and shooter entries within a round.

### `smcCreateSquad(db, params): Promise<void>`

Creates a new squad linked to a round.

| Param | Type | Description |
|:------|:-----|:------------|
| `params.id` | `string` | UUID for the new squad |
| `params.round_id` | `string` | Round this squad belongs to |

### `smcGetSquadByRound(db, roundId): Promise<Squad | null>`

Returns the squad for a round, or null if none exists. Each round has exactly one squad.

### `smcAddShooterEntry(db, params): Promise<void>`

Adds a shooter to a squad.

| Param | Type | Required | Description |
|:------|:-----|:---------|:------------|
| `params.id` | `string` | Yes | UUID for the new shooter entry |
| `params.squad_id` | `string` | Yes | Squad ID |
| `params.round_id` | `string` | Yes | Round ID (denormalized for sync rules) |
| `params.user_id` | `string \| null` | Yes | User ID if registered user, null if guest |
| `params.shooter_name` | `string` | Yes | Display name for the shooter |
| `params.position_in_squad` | `number` | Yes | Position number (1-based) |

### `smcListShooterEntries(db, squadId): Promise<ShooterEntry[]>`

Returns all shooters in a squad, ordered by `position_in_squad`.

### `smcListShooterEntriesWithUsers(db, squadId): Promise<EnrichedShooterEntry[]>`

Returns all shooters in a squad with their `user_handle` (the `@handle` from the `users` table). Uses a `LEFT JOIN` on `users`. The `user_handle` field is null for guest shooters.

### `smcRemoveShooterEntry(db, id): Promise<void>`

Deletes a shooter entry by ID.

---

## smc-stands.ts

Functions for managing stands within a round.

### `smcCreateStand(db, params): Promise<void>`

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

### `smcListStands(db, roundId): Promise<Stand[]>`

Returns all stands for a round, ordered by `stand_number`.

### `smcGetStand(db, id): Promise<Stand | null>`

Returns a single stand by ID, or null if not found.

### `smcUpdateStand(db, id, params): Promise<void>`

Partially updates a stand. Only the provided fields are updated — omitted fields are unchanged.

| Param | Type | Description |
|:------|:-----|:------------|
| `params.target_config` | `TargetConfig` | Optional |
| `params.presentation` | `PresentationType` | Optional |
| `params.presentation_notes` | `string \| null` | Optional |
| `params.num_targets` | `number` | Optional |

---

## smc-scoring.ts

Functions for recording and querying shot results, calculating scores, and handling conflicts.

### `smcRecordTargetResult(db, params): Promise<void>`

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

### `smcGetResultsForStandAndShooter(db, standId, shooterEntryId): Promise<TargetResultRecord[]>`

Returns shot results for a specific shooter at a specific stand. **Deduplicates** by `(target_number, bird_number)` — if multiple records exist for the same shot (from sync conflicts), only the earliest (`created_at ASC`) is returned. This keeps the scoring state machine stable during active scoring.

### `smcGetResultsForStand(db, standId): Promise<TargetResultRecord[]>`

Returns all shot results for a stand (all shooters). No deduplication — returns raw rows.

### `smcGetResultsForRound(db, roundId): Promise<TargetResultRecord[]>`

Returns all shot results for a round via a join on `stands`. Ordered by `stand_number`, `target_number`, `bird_number`. No deduplication.

### `smcUpdateTargetResult(db, id, result): Promise<void>`

Updates the result of an existing target result row.

### `smcGetShooterRoundScore(db, roundId, shooterEntryId): Promise<{ kills, total, hasConflicts }>`

Calculates a shooter's total score for a round.

**Conflict check:** Before calculating, queries for any `(target_number, bird_number)` groups with `COUNT(*) > 1`. If conflicts exist, returns `{ kills: 0, total: 0, hasConflicts: true }` — the entire score is suppressed to prevent showing inaccurate totals.

**Return shape:**
```ts
{ kills: number; total: number; hasConflicts: boolean }
```

### `smcGetRoundConflicts(db, roundId): Promise<ConflictedShotGroup[]>`

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

### `smcResolveConflict(db, keepId, deleteIds): Promise<void>`

Resolves a conflict by deleting the losing records in a write transaction. The `keepId` is accepted for API clarity but is not used in the query — only the `deleteIds` are deleted.

---

## smc-invites.ts

Functions for managing round invitations between users.

### `smcCreateInvite(db, params): Promise<void>`

Creates a new invite with status `PENDING`. Sets `created_at` to the current timestamp.

| Param | Type | Description |
|:------|:-----|:------------|
| `params.id` | `string` | UUID for the invite |
| `params.round_id` | `string` | Round being invited to |
| `params.inviter_id` | `string` | User ID of the inviter |
| `params.invitee_id` | `string` | User ID (UUID) of the invitee |
| `params.invitee_user_id` | `string` | User handle (`@handle`) of the invitee |

### `smcGetInviteById(db, inviteId): Promise<Invite | null>`

Returns a single invite by ID, or null if not found.

### `smcListInvitesForRound(db, roundId): Promise<Invite[]>`

Returns all invites for a round, ordered by `created_at DESC`.

### `smcListIncomingInvitesForUser(db, inviteeUserId, status?): Promise<Invite[]>`

Returns invites where the user is the invitee. Matches on `invitee_user_id` (the handle, not the UUID). Optionally filters by status.

### `smcListOutgoingInvitesForRound(db, roundId, inviterId): Promise<Invite[]>`

Returns invites sent by a specific user for a specific round.

### `smcUpdateInviteStatus(db, inviteId, status): Promise<void>`

Updates an invite's status (e.g. `PENDING` to `ACCEPTED` or `DECLINED`).

### `smcCheckDuplicateInvite(db, roundId, inviteeUserId): Promise<Invite | null>`

Checks if an invite already exists for this user and round. Returns the existing invite or null. Used to prevent duplicate invites.

### `smcGetPendingInviteCount(db, inviteeUserId): Promise<number>`

Returns the count of pending invites for a user. Used for the notification badge on the home screen.

---

## smc-users.ts

Functions for user lookup, search, and profile management.

### `smcGetUserById(db, userId): Promise<User | null>`

Returns a user by their internal UUID (from Supabase Auth).

### `smcGetUserByUserId(db, userIdHandle): Promise<User | null>`

Returns a user by their `@handle`. Case-insensitive match using `LOWER()`.

### `smcSearchUsersByDisplayName(db, displayName): Promise<User[]>`

Searches users by display name using `LIKE %pattern%`. **Only returns users where `discoverable = 1`** — respects the user's visibility preference.

### `smcSearchUsersByUserId(db, userIdHandle): Promise<User[]>`

Searches users by partial handle match using `LIKE %pattern%`. Case-insensitive. **Returns all users regardless of discoverable setting** — handles are considered public identifiers.

### `smcIsUserIdAvailable(db, userIdHandle): Promise<boolean>`

Returns `true` if the handle is not taken. Case-insensitive check. Used during profile setup to validate handle uniqueness.

### `smcUpdateUserProfile(db, userId, updates): Promise<void>`

Partially updates a user's profile. Only the provided fields are updated. Sets `updated_at` to the current timestamp.

| Param | Type | Description |
|:------|:-----|:------------|
| `updates.display_name` | `string` | Optional |
| `updates.user_id` | `string` | Optional (the `@handle`) |
| `updates.discoverable` | `number` | Optional (0 or 1) |
| `updates.favourite_club_ids` | `string` | Optional (JSON array as text) |
| `updates.gear` | `string` | Optional (JSON array as text) |
