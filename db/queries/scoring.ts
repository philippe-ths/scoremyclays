import type { AbstractPowerSyncDatabase } from '@powersync/common';
import type { TargetResultRecord, ShotResult } from '@/lib/types';

export async function recordTargetResult(
  db: AbstractPowerSyncDatabase,
  params: {
    id: string;
    stand_id: string;
    round_id: string;
    shooter_entry_id: string;
    target_number: number;
    bird_number: number;
    result: ShotResult;
    recorded_by: string;
    device_id: string;
  },
): Promise<void> {
  const now = new Date().toISOString();
  await db.execute(
    'INSERT INTO target_results (id, stand_id, round_id, shooter_entry_id, target_number, bird_number, result, recorded_by, device_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [params.id, params.stand_id, params.round_id, params.shooter_entry_id, params.target_number, params.bird_number, params.result, params.recorded_by, params.device_id, now],
  );
}

export async function getResultsForStandAndShooter(
  db: AbstractPowerSyncDatabase,
  standId: string,
  shooterEntryId: string,
): Promise<TargetResultRecord[]> {
  const rows = await db.getAll<TargetResultRecord>(
    'SELECT * FROM target_results WHERE stand_id = ? AND shooter_entry_id = ? ORDER BY target_number, bird_number, created_at ASC',
    [standId, shooterEntryId],
  );

  const deduped: TargetResultRecord[] = [];
  const seen = new Set<string>();

  for (const row of rows) {
    const key = `${row.target_number}_${row.bird_number}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(row);
    }
  }

  return deduped;
}

export async function getResultsForStand(
  db: AbstractPowerSyncDatabase,
  standId: string,
): Promise<TargetResultRecord[]> {
  return db.getAll<TargetResultRecord>(
    'SELECT * FROM target_results WHERE stand_id = ? ORDER BY target_number, bird_number',
    [standId],
  );
}

export async function getResultsForRound(
  db: AbstractPowerSyncDatabase,
  roundId: string,
): Promise<TargetResultRecord[]> {
  return db.getAll<TargetResultRecord>(
    `SELECT tr.* FROM target_results tr
     JOIN stands s ON tr.stand_id = s.id
     WHERE s.round_id = ?
     ORDER BY s.stand_number, tr.target_number, tr.bird_number`,
    [roundId],
  );
}

export async function updateTargetResult(
  db: AbstractPowerSyncDatabase,
  id: string,
  result: ShotResult,
): Promise<void> {
  await db.execute('UPDATE target_results SET result = ? WHERE id = ?', [result, id]);
}

export async function getShooterRoundScore(
  db: AbstractPowerSyncDatabase,
  roundId: string,
  shooterEntryId: string,
): Promise<{ kills: number; total: number; hasConflicts: boolean }> {
  const conflictCheck = await db.getOptional<{ conflict_count: number }>(
    `WITH ShotCounts AS (
       SELECT target_number, bird_number, COUNT(*) as cnt
       FROM target_results
       WHERE round_id = ? AND shooter_entry_id = ?
       GROUP BY target_number, bird_number
     )
     SELECT COUNT(*) as conflict_count FROM ShotCounts WHERE cnt > 1`,
    [roundId, shooterEntryId],
  );

  const hasConflicts = (conflictCheck?.conflict_count ?? 0) > 0;

  const row = await db.getOptional<{ kills: number; total: number }>(
    `SELECT
       COALESCE(SUM(CASE WHEN tr.result = 'KILL' THEN 1 ELSE 0 END), 0) as kills,
       COUNT(tr.id) as total
     FROM target_results tr
     JOIN stands s ON tr.stand_id = s.id
     WHERE s.round_id = ? AND tr.shooter_entry_id = ?`,
    [roundId, shooterEntryId],
  );

  return {
    kills: hasConflicts ? 0 : (row?.kills ?? 0),
    total: hasConflicts ? 0 : (row?.total ?? 0),
    hasConflicts,
  };
}

export interface ConflictedShotGroup {
  shooter_entry_id: string;
  target_number: number;
  bird_number: number;
  records: TargetResultRecord[];
}

export async function getRoundConflicts(
  db: AbstractPowerSyncDatabase,
  roundId: string,
): Promise<ConflictedShotGroup[]> {
  const dupes = await db.getAll<{ shooter_entry_id: string; target_number: number; bird_number: number }>(
    `SELECT
       shooter_entry_id,
       target_number,
       bird_number
     FROM target_results
     WHERE round_id = ?
     GROUP BY shooter_entry_id, target_number, bird_number
     HAVING COUNT(*) > 1`,
    [roundId],
  );

  if (dupes.length === 0) {
    return [];
  }

  const allResults = await getResultsForRound(db, roundId);

  return dupes.map((dupe) => ({
    ...dupe,
    records: allResults
      .filter(
        (row) =>
          row.shooter_entry_id === dupe.shooter_entry_id &&
          row.target_number === dupe.target_number &&
          row.bird_number === dupe.bird_number,
      )
      .sort((left, right) => new Date(left.created_at).getTime() - new Date(right.created_at).getTime()),
  }));
}

export async function resolveConflict(
  db: AbstractPowerSyncDatabase,
  keepId: string,
  deleteIds: string[],
): Promise<void> {
  void keepId;

  await db.writeTransaction(async (tx) => {
    for (const id of deleteIds) {
      await tx.execute('DELETE FROM target_results WHERE id = ?', [id]);
    }
  });
}
