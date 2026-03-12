import { createMockDb } from '../../helpers/mockDb';
import { isUserIdAvailable, updateUserProfile } from '@/db/queries/users';

describe('isUserIdAvailable', () => {
  it('returns true when user_id is not taken', async () => {
    const db = createMockDb();
    (db.getOptional as jest.Mock).mockResolvedValue({ count: 0 });

    const available = await isUserIdAvailable(db, 'new_handle');

    expect(available).toBe(true);
    const [sql] = (db.getOptional as jest.Mock).mock.calls[0];
    expect(sql).toContain('LOWER(user_id) = LOWER(?)');
  });

  it('returns false when user_id is taken', async () => {
    const db = createMockDb();
    (db.getOptional as jest.Mock).mockResolvedValue({ count: 1 });

    const available = await isUserIdAvailable(db, 'existing_handle');
    expect(available).toBe(false);
  });

  it('returns true when query returns null', async () => {
    const db = createMockDb();
    (db.getOptional as jest.Mock).mockResolvedValue(null);

    const available = await isUserIdAvailable(db, 'any_handle');
    expect(available).toBe(true);
  });
});

describe('updateUserProfile', () => {
  it('builds dynamic SQL for multiple fields', async () => {
    const db = createMockDb();

    await updateUserProfile(db, 'user1', {
      display_name: 'New Name',
      discoverable: 1,
    });

    expect(db.execute).toHaveBeenCalledTimes(1);
    const [sql, params] = (db.execute as jest.Mock).mock.calls[0];
    expect(sql).toContain('display_name = ?');
    expect(sql).toContain('discoverable = ?');
    expect(sql).toContain('updated_at = ?');
    expect(params[0]).toBe('New Name');
    expect(params[1]).toBe(1);
    // updated_at timestamp
    expect(typeof params[2]).toBe('string');
    // id at end
    expect(params[params.length - 1]).toBe('user1');
  });

  it('does not execute when no fields provided', async () => {
    const db = createMockDb();

    await updateUserProfile(db, 'user1', {});

    expect(db.execute).not.toHaveBeenCalled();
  });
});
