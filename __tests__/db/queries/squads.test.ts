import { createMockDb } from '../../helpers/mockDb';
import { describe, it, expect, jest } from '@jest/globals';
import { smcJoinSquad } from '@/db/queries/smc-squads';

jest.mock('expo-crypto', () => ({
  randomUUID: jest.fn(() => 'new-entry-id'),
}));

describe('smcJoinSquad', () => {
  it('returns no_squad when the round has no squad', async () => {
    const db = createMockDb();
    db.getOptional.mockResolvedValueOnce(null); // squad lookup

    const result = await smcJoinSquad(db, {
      roundId: 'r1',
      user_id: 'u1',
      shooter_name: 'Alice',
    });

    expect(result).toEqual({ ok: false, reason: 'no_squad' });
    expect(db.execute).not.toHaveBeenCalled();
  });

  it('returns squad_full at the size limit without inserting', async () => {
    const db = createMockDb();
    db.getOptional
      .mockResolvedValueOnce({ id: 'squad1', round_id: 'r1' }) // squad lookup
      .mockResolvedValueOnce({ count: 6 }); // shooter count at MAX_SQUAD_SIZE

    const result = await smcJoinSquad(db, {
      roundId: 'r1',
      user_id: 'u1',
      shooter_name: 'Alice',
    });

    expect(result).toEqual({ ok: false, reason: 'squad_full' });
    expect(db.execute).not.toHaveBeenCalled();
  });

  it('inserts the shooter at the next position when there is room', async () => {
    const db = createMockDb();
    db.getOptional
      .mockResolvedValueOnce({ id: 'squad1', round_id: 'r1' }) // squad lookup
      .mockResolvedValueOnce({ count: 2 }) // shooter count
      .mockResolvedValueOnce({ max_pos: 2 }); // highest existing position

    const result = await smcJoinSquad(db, {
      roundId: 'r1',
      user_id: null,
      shooter_name: 'Guest',
    });

    expect(result).toEqual({ ok: true, shooterEntryId: 'new-entry-id', position: 3 });
    expect(db.execute).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO shooter_entries'),
      ['new-entry-id', 'squad1', 'r1', null, 'Guest', 3],
    );
  });

  it('starts at position 1 for the first shooter', async () => {
    const db = createMockDb();
    db.getOptional
      .mockResolvedValueOnce({ id: 'squad1', round_id: 'r1' }) // squad lookup
      .mockResolvedValueOnce({ count: 0 }) // empty squad
      .mockResolvedValueOnce({ max_pos: null }); // no existing positions

    const result = await smcJoinSquad(db, {
      roundId: 'r1',
      user_id: 'u1',
      shooter_name: 'Alice',
    });

    expect(result).toEqual({ ok: true, shooterEntryId: 'new-entry-id', position: 1 });
  });
});
