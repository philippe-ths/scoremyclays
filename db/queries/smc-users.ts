import type { AbstractPowerSyncDatabase } from '@powersync/common';
import type { User } from '@/lib/types';

/**
 * Get user by their internal ID (UUID from auth)
 */
export async function smcGetUserById(
  db: AbstractPowerSyncDatabase,
  userId: string,
): Promise<User | null> {
  return db.getOptional<User>('SELECT * FROM users WHERE id = ?', [userId]);
}

/**
 * Get user by their unique user_id handle (e.g., "@phil_marr")
 */
export async function smcGetUserByUserId(
  db: AbstractPowerSyncDatabase,
  userIdHandle: string,
): Promise<User | null> {
  return db.getOptional<User>(
    'SELECT * FROM users WHERE LOWER(user_id) = LOWER(?)',
    [userIdHandle],
  );
}

/**
 * Search users by display name (only returns discoverable users)
 */
export async function smcSearchUsersByDisplayName(
  db: AbstractPowerSyncDatabase,
  displayName: string,
): Promise<User[]> {
  const pattern = `%${displayName}%`;
  return db.getAll<User>(
    'SELECT * FROM users WHERE discoverable = 1 AND display_name LIKE ? ORDER BY display_name',
    [pattern],
  );
}

/**
 * Search users by partial user_id match (works regardless of discoverable setting)
 * This allows users to be found by their handle even if they're not discoverable
 */
export async function smcSearchUsersByUserId(
  db: AbstractPowerSyncDatabase,
  userIdHandle: string,
): Promise<User[]> {
  const pattern = `%${userIdHandle}%`;
  return db.getAll<User>(
    'SELECT * FROM users WHERE LOWER(user_id) LIKE LOWER(?) ORDER BY user_id',
    [pattern],
  );
}

/**
 * Check if a user_id handle is available (not taken)
 */
export async function smcIsUserIdAvailable(
  db: AbstractPowerSyncDatabase,
  userIdHandle: string,
): Promise<boolean> {
  const result = await db.getOptional<{ count: number }>(
    'SELECT COUNT(*) as count FROM users WHERE LOWER(user_id) = LOWER(?)',
    [userIdHandle],
  );
  return !result || result.count === 0;
}

/**
 * Update user profile fields
 */
export async function smcUpdateUserProfile(
  db: AbstractPowerSyncDatabase,
  userId: string,
  updates: {
    display_name?: string;
    user_id?: string;
    discoverable?: number;
    favourite_club_ids?: string;
    gear?: string;
  },
): Promise<void> {
  const now = new Date().toISOString();
  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (updates.display_name !== undefined) {
    fields.push('display_name = ?');
    values.push(updates.display_name);
  }
  if (updates.user_id !== undefined) {
    fields.push('user_id = ?');
    values.push(updates.user_id);
  }
  if (updates.discoverable !== undefined) {
    fields.push('discoverable = ?');
    values.push(updates.discoverable);
  }
  if (updates.favourite_club_ids !== undefined) {
    fields.push('favourite_club_ids = ?');
    values.push(updates.favourite_club_ids);
  }
  if (updates.gear !== undefined) {
    fields.push('gear = ?');
    values.push(updates.gear);
  }

  if (fields.length === 0) return;

  fields.push('updated_at = ?');
  values.push(now);
  values.push(userId);

  const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
  await db.execute(query, values);
}
