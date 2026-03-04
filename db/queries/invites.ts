import type { AbstractPowerSyncDatabase } from '@powersync/common';
import type { Invite } from '@/lib/types';
import { InviteStatus } from '@/lib/types';

/**
 * Create a new invite
 */
export async function createInvite(
  db: AbstractPowerSyncDatabase,
  params: {
    id: string;
    round_id: string;
    inviter_id: string; // User.id
    invitee_user_id: string; // User.user_id
  },
): Promise<void> {
  const now = new Date().toISOString();
  await db.execute(
    'INSERT INTO invites (id, round_id, inviter_id, invitee_user_id, status, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    [params.id, params.round_id, params.inviter_id, params.invitee_user_id, InviteStatus.PENDING, now],
  );
}

/**
 * Get invite by ID
 */
export async function getInviteById(
  db: AbstractPowerSyncDatabase,
  inviteId: string,
): Promise<Invite | null> {
  return db.getOptional<Invite>('SELECT * FROM invites WHERE id = ?', [inviteId]);
}

/**
 * List all invites for a specific round
 */
export async function listInvitesForRound(
  db: AbstractPowerSyncDatabase,
  roundId: string,
): Promise<Invite[]> {
  return db.getAll<Invite>(
    'SELECT * FROM invites WHERE round_id = ? ORDER BY created_at DESC',
    [roundId],
  );
}

/**
 * List incoming invites for a user (where they are the invitee)
 * Optionally filter by status
 */
export async function listIncomingInvitesForUser(
  db: AbstractPowerSyncDatabase,
  inviteeUserId: string,
  status?: string,
): Promise<Invite[]> {
  if (status) {
    return db.getAll<Invite>(
      'SELECT * FROM invites WHERE invitee_user_id = ? AND status = ? ORDER BY created_at DESC',
      [inviteeUserId, status],
    );
  }
  return db.getAll<Invite>(
    'SELECT * FROM invites WHERE invitee_user_id = ? ORDER BY created_at DESC',
    [inviteeUserId],
  );
}

/**
 * List outgoing invites for a round by a specific user
 */
export async function listOutgoingInvitesForRound(
  db: AbstractPowerSyncDatabase,
  roundId: string,
  inviterId: string,
): Promise<Invite[]> {
  return db.getAll<Invite>(
    'SELECT * FROM invites WHERE round_id = ? AND inviter_id = ? ORDER BY created_at DESC',
    [roundId, inviterId],
  );
}

/**
 * Update invite status (PENDING → ACCEPTED or DECLINED)
 */
export async function updateInviteStatus(
  db: AbstractPowerSyncDatabase,
  inviteId: string,
  status: string,
): Promise<void> {
  await db.execute('UPDATE invites SET status = ? WHERE id = ?', [status, inviteId]);
}

/**
 * Check if an invite already exists between these users for this round
 * Returns the existing invite if found, null otherwise
 */
export async function checkDuplicateInvite(
  db: AbstractPowerSyncDatabase,
  roundId: string,
  inviteeUserId: string,
): Promise<Invite | null> {
  return db.getOptional<Invite>(
    'SELECT * FROM invites WHERE round_id = ? AND invitee_user_id = ? LIMIT 1',
    [roundId, inviteeUserId],
  );
}

/**
 * Get pending invite count for a user
 */
export async function getPendingInviteCount(
  db: AbstractPowerSyncDatabase,
  inviteeUserId: string,
): Promise<number> {
  const result = await db.getOptional<{ count: number }>(
    'SELECT COUNT(*) as count FROM invites WHERE invitee_user_id = ? AND status = ?',
    [inviteeUserId, InviteStatus.PENDING],
  );
  return result?.count ?? 0;
}
