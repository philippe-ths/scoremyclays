import { createMockDb } from '../../helpers/mockDb';
import { listClubs, getClubWithDetails } from '@/db/queries/clubs';
import type { Club, ClubPosition, ClubStand } from '@/lib/types';
import { TargetConfig, PresentationType } from '@/lib/types';

const mockClub: Club = {
  id: 'club1',
  name: 'Test Club',
  description: 'A test club',
  created_by: 'user1',
  created_at: '2026-01-01T00:00:00Z',
};

describe('listClubs', () => {
  it('filters by search term when provided', async () => {
    const db = createMockDb();
    (db.getAll as jest.Mock).mockResolvedValue([mockClub]);

    await listClubs(db, 'Test');

    const [sql, params] = (db.getAll as jest.Mock).mock.calls[0];
    expect(sql).toContain('LIKE ?');
    expect(params).toEqual(['%Test%']);
  });

  it('returns all clubs when no search term', async () => {
    const db = createMockDb();
    (db.getAll as jest.Mock).mockResolvedValue([mockClub]);

    await listClubs(db);

    const [sql, params] = (db.getAll as jest.Mock).mock.calls[0];
    expect(sql).not.toContain('LIKE');
    expect(params).toBeUndefined();
  });

  it('treats whitespace-only search as no search', async () => {
    const db = createMockDb();
    (db.getAll as jest.Mock).mockResolvedValue([]);

    await listClubs(db, '   ');

    const [sql] = (db.getAll as jest.Mock).mock.calls[0];
    expect(sql).not.toContain('LIKE');
  });
});

describe('getClubWithDetails', () => {
  it('returns null when club not found', async () => {
    const db = createMockDb();
    (db.getOptional as jest.Mock).mockResolvedValue(null);

    const result = await getClubWithDetails(db, 'missing');
    expect(result).toBeNull();
  });

  it('returns club with positions and stands', async () => {
    const db = createMockDb();
    const position: ClubPosition = {
      id: 'pos1',
      club_id: 'club1',
      position_number: 1,
      name: 'Position 1',
      created_at: '2026-01-01T00:00:00Z',
    };
    const stand: ClubStand = {
      id: 'cs1',
      club_position_id: 'pos1',
      stand_number: 1,
      target_config: TargetConfig.SINGLE,
      presentation: PresentationType.CROSSER,
      presentation_notes: null,
      num_targets: 5,
      created_at: '2026-01-01T00:00:00Z',
    };

    (db.getOptional as jest.Mock).mockResolvedValue(mockClub);
    (db.getAll as jest.Mock)
      .mockResolvedValueOnce([position])
      .mockResolvedValueOnce([stand]);

    const result = await getClubWithDetails(db, 'club1');

    expect(result).not.toBeNull();
    expect(result!.club).toEqual(mockClub);
    expect(result!.positions).toHaveLength(1);
    expect(result!.positions[0].stands).toEqual([stand]);
  });
});
