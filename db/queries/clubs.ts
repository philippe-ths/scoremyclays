import type { AbstractPowerSyncDatabase } from '@powersync/common';
import type { Club, ClubPosition, ClubStand } from '@/lib/types';

export async function listClubs(
  db: AbstractPowerSyncDatabase,
  search?: string,
): Promise<Club[]> {
  if (search && search.trim()) {
    const pattern = `%${search.trim()}%`;
    return db.getAll<Club>(
      'SELECT * FROM clubs WHERE name LIKE ? ORDER BY name',
      [pattern],
    );
  }
  return db.getAll<Club>('SELECT * FROM clubs ORDER BY name');
}

export async function getClub(
  db: AbstractPowerSyncDatabase,
  id: string,
): Promise<Club | null> {
  return db.getOptional<Club>('SELECT * FROM clubs WHERE id = ?', [id]);
}

export async function getClubPositions(
  db: AbstractPowerSyncDatabase,
  clubId: string,
): Promise<ClubPosition[]> {
  return db.getAll<ClubPosition>(
    'SELECT * FROM club_positions WHERE club_id = ? ORDER BY position_number',
    [clubId],
  );
}

export async function getClubStandsByPosition(
  db: AbstractPowerSyncDatabase,
  positionId: string,
): Promise<ClubStand[]> {
  return db.getAll<ClubStand>(
    'SELECT * FROM club_stands WHERE club_position_id = ? ORDER BY stand_number',
    [positionId],
  );
}

export async function getClubWithDetails(
  db: AbstractPowerSyncDatabase,
  clubId: string,
): Promise<{
  club: Club;
  positions: (ClubPosition & { stands: ClubStand[] })[];
} | null> {
  const club = await getClub(db, clubId);
  if (!club) return null;

  const positions = await getClubPositions(db, clubId);
  const positionsWithStands = await Promise.all(
    positions.map(async (pos) => {
      const stands = await getClubStandsByPosition(db, pos.id);
      return { ...pos, stands };
    }),
  );

  return { club, positions: positionsWithStands };
}
