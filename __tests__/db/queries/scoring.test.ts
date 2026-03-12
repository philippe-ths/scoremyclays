import { createMockDb } from '../../helpers/mockDb';
import {
  smcGetResultsForStandAndShooter,
  smcGetShooterRoundScore,
  smcGetRoundConflicts,
  smcResolveConflict,
} from '@/db/queries/smc-scoring';
import type { TargetResultRecord } from '@/lib/types';
import { ShotResult } from '@/lib/types';

function makeResult(overrides: Partial<TargetResultRecord> = {}): TargetResultRecord {
  return {
    id: 'r1',
    stand_id: 's1',
    shooter_entry_id: 'se1',
    target_number: 1,
    bird_number: 1,
    result: ShotResult.KILL,
    recorded_by: 'u1',
    device_id: 'd1',
    created_at: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

describe('smcGetResultsForStandAndShooter', () => {
  it('deduplicates by keeping first occurrence per target/bird', async () => {
    const db = createMockDb();
    const rows: TargetResultRecord[] = [
      makeResult({ id: 'r1', target_number: 1, bird_number: 1, result: ShotResult.KILL, created_at: '2026-01-01T00:00:00Z' }),
      makeResult({ id: 'r2', target_number: 1, bird_number: 1, result: ShotResult.LOSS, created_at: '2026-01-01T00:01:00Z' }),
      makeResult({ id: 'r3', target_number: 2, bird_number: 1, result: ShotResult.LOSS, created_at: '2026-01-01T00:00:00Z' }),
    ];
    (db.getAll as jest.Mock).mockResolvedValue(rows);

    const result = await smcGetResultsForStandAndShooter(db, 's1', 'se1');

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('r1');
    expect(result[1].id).toBe('r3');
  });

  it('returns all rows when no duplicates exist', async () => {
    const db = createMockDb();
    const rows = [
      makeResult({ target_number: 1, bird_number: 1 }),
      makeResult({ target_number: 1, bird_number: 2 }),
      makeResult({ target_number: 2, bird_number: 1 }),
    ];
    (db.getAll as jest.Mock).mockResolvedValue(rows);

    const result = await smcGetResultsForStandAndShooter(db, 's1', 'se1');
    expect(result).toHaveLength(3);
  });
});

describe('smcGetShooterRoundScore', () => {
  it('returns zero kills and total when conflicts exist', async () => {
    const db = createMockDb();
    (db.getOptional as jest.Mock)
      .mockResolvedValueOnce({ conflict_count: 2 })
      .mockResolvedValueOnce({ kills: 5, total: 10 });

    const result = await smcGetShooterRoundScore(db, 'round1', 'se1');

    expect(result).toEqual({ kills: 0, total: 0, hasConflicts: true });
  });

  it('returns correct kills and total without conflicts', async () => {
    const db = createMockDb();
    (db.getOptional as jest.Mock)
      .mockResolvedValueOnce({ conflict_count: 0 })
      .mockResolvedValueOnce({ kills: 7, total: 10 });

    const result = await smcGetShooterRoundScore(db, 'round1', 'se1');

    expect(result).toEqual({ kills: 7, total: 10, hasConflicts: false });
  });

  it('returns zeros when no results exist', async () => {
    const db = createMockDb();
    (db.getOptional as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    const result = await smcGetShooterRoundScore(db, 'round1', 'se1');

    expect(result).toEqual({ kills: 0, total: 0, hasConflicts: false });
  });
});

describe('smcGetRoundConflicts', () => {
  it('returns empty array when no conflicts', async () => {
    const db = createMockDb();
    (db.getAll as jest.Mock).mockResolvedValue([]);

    const result = await smcGetRoundConflicts(db, 'round1');
    expect(result).toEqual([]);
  });

  it('returns grouped conflict records', async () => {
    const db = createMockDb();
    const dupes = [{ shooter_entry_id: 'se1', target_number: 1, bird_number: 1 }];
    const allResults: TargetResultRecord[] = [
      makeResult({ id: 'r1', shooter_entry_id: 'se1', target_number: 1, bird_number: 1, created_at: '2026-01-01T00:00:00Z' }),
      makeResult({ id: 'r2', shooter_entry_id: 'se1', target_number: 1, bird_number: 1, created_at: '2026-01-01T00:01:00Z' }),
      makeResult({ id: 'r3', shooter_entry_id: 'se1', target_number: 2, bird_number: 1 }),
    ];
    (db.getAll as jest.Mock)
      .mockResolvedValueOnce(dupes)
      .mockResolvedValueOnce(allResults);

    const result = await smcGetRoundConflicts(db, 'round1');

    expect(result).toHaveLength(1);
    expect(result[0].records).toHaveLength(2);
    expect(result[0].records[0].id).toBe('r1');
    expect(result[0].records[1].id).toBe('r2');
  });
});

describe('smcResolveConflict', () => {
  it('deletes specified IDs in a transaction', async () => {
    const db = createMockDb();
    const txExecute = jest.fn().mockResolvedValue(undefined);
    (db.writeTransaction as jest.Mock).mockImplementation(async (cb: any) => {
      await cb({ execute: txExecute });
    });

    await smcResolveConflict(db, 'keep1', ['del1', 'del2']);

    expect(txExecute).toHaveBeenCalledTimes(2);
    expect(txExecute).toHaveBeenCalledWith('DELETE FROM target_results WHERE id = ?', ['del1']);
    expect(txExecute).toHaveBeenCalledWith('DELETE FROM target_results WHERE id = ?', ['del2']);
  });
});
