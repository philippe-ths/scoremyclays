import { createMockDb } from '../../helpers/mockDb';
import { describe, it, expect, jest } from '@jest/globals';
import { smcCreateRound, smcListRounds, smcUpdateRoundStatus } from '@/db/queries/smc-rounds';
import { RoundStatus, type RoundListItem } from '@/lib/types';

describe('smcCreateRound', () => {
  it('creates rounds in SETUP status', async () => {
    const db = createMockDb();

    await smcCreateRound(db, {
      id: 'round1',
      created_by: 'user1',
      ground_name: 'Club Alpha',
      date: '2026-03-28',
      total_targets: 100,
      club_id: null,
    });

    expect(db.execute).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO rounds'),
      expect.arrayContaining(['round1', 'user1', 'Club Alpha', '2026-03-28', 100, RoundStatus.SETUP]),
    );
  });
});

describe('smcListRounds', () => {
  it('requests conflict-aware rounds for owner or participant', async () => {
    const db = createMockDb();
    const rows: RoundListItem[] = [
      {
        id: 'round1',
        created_by: 'user1',
        ground_name: 'Club Alpha',
        date: '2026-03-28',
        total_targets: 100,
        status: RoundStatus.COMPLETED,
        notes: null,
        club_id: null,
        created_at: '2026-03-28T10:00:00Z',
        updated_at: '2026-03-28T10:00:00Z',
        has_unresolved_conflicts: 1,
      },
    ];
    (db.getAll as any).mockResolvedValue(rows);

    const result = await smcListRounds(db, 'user1');

    expect(result).toEqual(rows);

    const [sql, params] = (db.getAll as any).mock.calls[0];
    expect(sql).toContain('has_unresolved_conflicts');
    expect(sql).toContain('HAVING COUNT(*) > 1');
    expect(params).toEqual(['user1', 'user1']);
  });
});

describe('smcUpdateRoundStatus', () => {
  it('updates round status with timestamp', async () => {
    const db = createMockDb();

    await smcUpdateRoundStatus(db, 'round1', RoundStatus.IN_PROGRESS);

    expect(db.execute).toHaveBeenCalledWith(
      'UPDATE rounds SET status = ?, updated_at = ? WHERE id = ?',
      [RoundStatus.IN_PROGRESS, expect.any(String), 'round1'],
    );
  });
});
