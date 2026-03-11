import { createMockDb } from '../../helpers/mockDb';
import { checkDuplicateInvite, listIncomingInvitesForUser } from '@/db/queries/invites';
import { InviteStatus, type Invite } from '@/lib/types';

const mockInvite: Invite = {
  id: 'inv1',
  round_id: 'round1',
  inviter_id: 'user1',
  invitee_id: 'user2',
  invitee_user_id: '@phil',
  status: InviteStatus.PENDING,
  created_at: '2026-01-01T00:00:00Z',
};

describe('checkDuplicateInvite', () => {
  it('returns existing invite when duplicate found', async () => {
    const db = createMockDb();
    (db.getOptional as jest.Mock).mockResolvedValue(mockInvite);

    const result = await checkDuplicateInvite(db, 'round1', '@phil');

    expect(result).toEqual(mockInvite);
    expect(db.getOptional).toHaveBeenCalledWith(
      expect.stringContaining('round_id = ?'),
      ['round1', '@phil'],
    );
  });

  it('returns null when no duplicate exists', async () => {
    const db = createMockDb();
    (db.getOptional as jest.Mock).mockResolvedValue(null);

    const result = await checkDuplicateInvite(db, 'round1', '@new_user');
    expect(result).toBeNull();
  });
});

describe('listIncomingInvitesForUser', () => {
  it('filters by status when provided', async () => {
    const db = createMockDb();
    (db.getAll as jest.Mock).mockResolvedValue([mockInvite]);

    await listIncomingInvitesForUser(db, '@phil', InviteStatus.PENDING);

    const [sql, params] = (db.getAll as jest.Mock).mock.calls[0];
    expect(sql).toContain('status = ?');
    expect(params).toContain(InviteStatus.PENDING);
  });

  it('returns all invites when no status filter', async () => {
    const db = createMockDb();
    (db.getAll as jest.Mock).mockResolvedValue([mockInvite]);

    await listIncomingInvitesForUser(db, '@phil');

    const [sql, params] = (db.getAll as jest.Mock).mock.calls[0];
    expect(sql).not.toContain('status = ?');
    expect(params).toEqual(['@phil']);
  });
});
