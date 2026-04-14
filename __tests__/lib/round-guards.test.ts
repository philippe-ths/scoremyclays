import { describe, it, expect } from '@jest/globals';
import { getSetupGuardRedirect, getScoreGuardRedirect } from '@/lib/round-guards';
import { RoundStatus, type Round } from '@/lib/types';

function makeRound(overrides: Partial<Round> = {}): Round {
  return {
    id: 'r1',
    created_by: 'owner-1',
    ground_name: 'Test Ground',
    date: '2026-04-14',
    total_targets: 100,
    status: RoundStatus.SETUP,
    notes: null,
    club_id: null,
    created_at: '2026-04-14T00:00:00Z',
    updated_at: '2026-04-14T00:00:00Z',
    ...overrides,
  };
}

describe('getSetupGuardRedirect', () => {
  it('returns home when round is null', () => {
    expect(getSetupGuardRedirect(null, 'user-1', 'r1')).toBe('/');
  });

  it('allows access for the round owner', () => {
    const round = makeRound({ created_by: 'owner-1' });
    expect(getSetupGuardRedirect(round, 'owner-1', 'r1')).toBeNull();
  });

  it('redirects non-owner to waiting when round is in SETUP', () => {
    const round = makeRound({ status: RoundStatus.SETUP });
    expect(getSetupGuardRedirect(round, 'other-user', 'r1')).toBe('/round/r1/waiting');
  });

  it('redirects non-owner to score when round is IN_PROGRESS', () => {
    const round = makeRound({ status: RoundStatus.IN_PROGRESS });
    expect(getSetupGuardRedirect(round, 'other-user', 'r1')).toBe('/round/r1/score');
  });

  it('redirects non-owner to summary when round is COMPLETED', () => {
    const round = makeRound({ status: RoundStatus.COMPLETED });
    expect(getSetupGuardRedirect(round, 'other-user', 'r1')).toBe('/round/r1/summary');
  });

  it('redirects non-owner to summary when round is ABANDONED', () => {
    const round = makeRound({ status: RoundStatus.ABANDONED });
    expect(getSetupGuardRedirect(round, 'other-user', 'r1')).toBe('/round/r1/summary');
  });
});

describe('getScoreGuardRedirect', () => {
  it('returns home when round is null', () => {
    expect(getScoreGuardRedirect(null, 'user-1', 'r1')).toBe('/');
  });

  it('allows access when round is IN_PROGRESS', () => {
    const round = makeRound({ status: RoundStatus.IN_PROGRESS });
    expect(getScoreGuardRedirect(round, 'owner-1', 'r1')).toBeNull();
  });

  it('redirects owner to setup when round is in SETUP', () => {
    const round = makeRound({ status: RoundStatus.SETUP, created_by: 'owner-1' });
    expect(getScoreGuardRedirect(round, 'owner-1', 'r1')).toBe('/round/r1/setup');
  });

  it('redirects non-owner to waiting when round is in SETUP', () => {
    const round = makeRound({ status: RoundStatus.SETUP, created_by: 'owner-1' });
    expect(getScoreGuardRedirect(round, 'other-user', 'r1')).toBe('/round/r1/waiting');
  });

  it('redirects to summary when round is COMPLETED', () => {
    const round = makeRound({ status: RoundStatus.COMPLETED });
    expect(getScoreGuardRedirect(round, 'owner-1', 'r1')).toBe('/round/r1/summary');
  });

  it('redirects to summary when round is ABANDONED', () => {
    const round = makeRound({ status: RoundStatus.ABANDONED });
    expect(getScoreGuardRedirect(round, 'owner-1', 'r1')).toBe('/round/r1/summary');
  });
});
