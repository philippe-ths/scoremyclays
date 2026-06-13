import type { AbstractPowerSyncDatabase } from '@powersync/common';
import { randomUUID } from 'expo-crypto';
import { MAX_SQUAD_SIZE } from '@/lib/constants';
import type { Squad, ShooterEntry, EnrichedShooterEntry } from '@/lib/types';

export type JoinSquadResult =
  | { ok: true; shooterEntryId: string; position: number }
  | { ok: false; reason: 'no_squad' | 'squad_full' };

export async function smcCreateSquad(
  db: AbstractPowerSyncDatabase,
  params: { id: string; round_id: string },
): Promise<void> {
  await db.execute('INSERT INTO squads (id, round_id) VALUES (?, ?)', [params.id, params.round_id]);
}

export async function smcGetSquadByRound(
  db: AbstractPowerSyncDatabase,
  roundId: string,
): Promise<Squad | null> {
  return db.getOptional<Squad>('SELECT * FROM squads WHERE round_id = ?', [roundId]);
}

export async function smcAddShooterEntry(
  db: AbstractPowerSyncDatabase,
  params: {
    id: string;
    squad_id: string;
    round_id: string;
    user_id: string | null;
    shooter_name: string;
    position_in_squad: number;
  },
): Promise<void> {
  await db.execute(
    'INSERT INTO shooter_entries (id, squad_id, round_id, user_id, shooter_name, position_in_squad) VALUES (?, ?, ?, ?, ?, ?)',
    [params.id, params.squad_id, params.round_id, params.user_id, params.shooter_name, params.position_in_squad],
  );
}

/**
 * Adds a shooter to the round's squad behind a single interface that owns the
 * squad-size rule (MAX_SQUAD_SIZE) and the next-position calculation. Used for
 * both linked users (invite accept) and free-text shooters (round setup).
 */
export async function smcJoinSquad(
  db: AbstractPowerSyncDatabase,
  params: { roundId: string; user_id: string | null; shooter_name: string },
): Promise<JoinSquadResult> {
  const squad = await smcGetSquadByRound(db, params.roundId);
  if (!squad) return { ok: false, reason: 'no_squad' };

  const countRow = await db.getOptional<{ count: number }>(
    'SELECT COUNT(*) as count FROM shooter_entries WHERE squad_id = ?',
    [squad.id],
  );
  if (countRow && countRow.count >= MAX_SQUAD_SIZE) {
    return { ok: false, reason: 'squad_full' };
  }

  const maxRow = await db.getOptional<{ max_pos: number }>(
    'SELECT MAX(position_in_squad) as max_pos FROM shooter_entries WHERE squad_id = ?',
    [squad.id],
  );
  const position = (maxRow?.max_pos || 0) + 1;

  const shooterEntryId = randomUUID();
  await smcAddShooterEntry(db, {
    id: shooterEntryId,
    squad_id: squad.id,
    round_id: params.roundId,
    user_id: params.user_id,
    shooter_name: params.shooter_name,
    position_in_squad: position,
  });
  return { ok: true, shooterEntryId, position };
}

export async function smcListShooterEntries(
  db: AbstractPowerSyncDatabase,
  squadId: string,
): Promise<ShooterEntry[]> {
  return db.getAll<ShooterEntry>(
    'SELECT * FROM shooter_entries WHERE squad_id = ? ORDER BY position_in_squad',
    [squadId],
  );
}

export async function smcRemoveShooterEntry(
  db: AbstractPowerSyncDatabase,
  id: string,
): Promise<void> {
  await db.execute('DELETE FROM shooter_entries WHERE id = ?', [id]);
}

export async function smcListShooterEntriesWithUsers(
  db: AbstractPowerSyncDatabase,
  squadId: string,
): Promise<EnrichedShooterEntry[]> {
  return db.getAll<EnrichedShooterEntry>(
    `SELECT se.*, u.user_id AS user_handle
     FROM shooter_entries se
     LEFT JOIN users u ON se.user_id = u.id
     WHERE se.squad_id = ?
     ORDER BY se.position_in_squad`,
    [squadId],
  );
}
