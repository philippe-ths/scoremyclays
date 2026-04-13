import type { AbstractPowerSyncDatabase } from '@powersync/common';
import { RoundStatus, type Round, type RoundListItem } from '@/lib/types';

export async function smcCreateRound(
  db: AbstractPowerSyncDatabase,
  params: {
    id: string;
    created_by: string;
    ground_name: string;
    date: string;
    total_targets: number;
    club_id?: string | null;
  },
): Promise<void> {
  const now = new Date().toISOString();
  await db.execute(
    'INSERT INTO rounds (id, created_by, ground_name, date, total_targets, status, notes, club_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [params.id, params.created_by, params.ground_name, params.date, params.total_targets, RoundStatus.SETUP, null, params.club_id ?? null, now, now],
  );
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
