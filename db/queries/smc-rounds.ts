import type { AbstractPowerSyncDatabase } from '@powersync/common';
import { randomUUID } from 'expo-crypto';
import { RoundStatus, type Round, type RoundListItem } from '@/lib/types';

export interface CreateRoundInput {
  created_by: string;
  creator_name: string;
  ground_name: string;
  date: string;
  total_targets: number;
  club_id?: string | null;
}

export interface CreatedRound {
  roundId: string;
  squadId: string;
}

/**
 * Creates a round together with its squad and the creator's shooter entry in a
 * single atomic transaction. Owns identity generation and timestamps so callers
 * express the intent ("create a round") without assembling the multi-table write.
 */
export async function smcCreateRound(
  db: AbstractPowerSyncDatabase,
  input: CreateRoundInput,
): Promise<CreatedRound> {
  const roundId = randomUUID();
  const squadId = randomUUID();
  const shooterEntryId = randomUUID();
  const now = new Date().toISOString();

  await db.writeTransaction(async (tx) => {
    await tx.execute(
      'INSERT INTO rounds (id, created_by, ground_name, date, total_targets, status, notes, club_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [roundId, input.created_by, input.ground_name, input.date, input.total_targets, RoundStatus.SETUP, null, input.club_id ?? null, now, now],
    );
    await tx.execute('INSERT INTO squads (id, round_id) VALUES (?, ?)', [squadId, roundId]);
    await tx.execute(
      'INSERT INTO shooter_entries (id, squad_id, round_id, user_id, shooter_name, position_in_squad) VALUES (?, ?, ?, ?, ?, ?)',
      [shooterEntryId, squadId, roundId, input.created_by, input.creator_name, 1],
    );
  });

  return { roundId, squadId };
}

export async function smcGetRound(db: AbstractPowerSyncDatabase, id: string): Promise<Round | null> {
  return db.getOptional<Round>('SELECT * FROM rounds WHERE id = ?', [id]);
}

export async function smcListRounds(db: AbstractPowerSyncDatabase, userId: string): Promise<RoundListItem[]> {
  return db.getAll<RoundListItem>(
    `SELECT DISTINCT
       r.*,
       CASE
         WHEN EXISTS (
           SELECT 1
           FROM target_results tr
           WHERE tr.round_id = r.id
           GROUP BY tr.shooter_entry_id, tr.target_number, tr.bird_number
           HAVING COUNT(*) > 1
         ) THEN 1
         ELSE 0
       END AS has_unresolved_conflicts
     FROM rounds r
     LEFT JOIN shooter_entries se ON se.round_id = r.id
     WHERE r.created_by = ? OR se.user_id = ?
     ORDER BY r.created_at DESC`,
    [userId, userId],
  );
}

export async function smcUpdateRoundStatus(
  db: AbstractPowerSyncDatabase,
  id: string,
  status: RoundStatus,
): Promise<void> {
  const now = new Date().toISOString();
  await db.execute('UPDATE rounds SET status = ?, updated_at = ? WHERE id = ?', [status, now, id]);
}

export async function smcUpdateRoundNotes(
  db: AbstractPowerSyncDatabase,
  id: string,
  notes: string,
): Promise<void> {
  const now = new Date().toISOString();
  await db.execute('UPDATE rounds SET notes = ?, updated_at = ? WHERE id = ?', [notes, now, id]);
}
