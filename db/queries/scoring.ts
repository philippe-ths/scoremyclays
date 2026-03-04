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
  return db.getAll<TargetResultRecord>(
    'SELECT * FROM target_results WHERE stand_id = ? AND shooter_entry_id = ? ORDER BY target_number, bird_number',
    [standId, shooterEntryId],
  );
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
): Promise<{ kills: number; total: number }> {
  const row = await db.getOptional<{ kills: number; total: number }>(
    `SELECT
       COALESCE(SUM(CASE WHEN tr.result = 'KILL' THEN 1 ELSE 0 END), 0) as kills,
       COUNT(tr.id) as total
     FROM target_results tr
     JOIN stands s ON tr.stand_id = s.id
     WHERE s.round_id = ? AND tr.shooter_entry_id = ?`,
    [roundId, shooterEntryId],
  );
  return row ?? { kills: 0, total: 0 };
}
