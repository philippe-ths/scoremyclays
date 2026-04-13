import { RoundStatus, type Round } from '@/lib/types';

/**
 * Returns a redirect path if the current user should not access the setup screen,
 * or null if access is allowed (user is the round owner).
 */
export function getSetupGuardRedirect(
  round: Round | null,
  userId: string,
  roundId: string,
): string | null {
  if (!round) return '/';

  if (round.created_by !== userId) {
    if (round.status === RoundStatus.IN_PROGRESS) {
      return `/round/${roundId}/score`;
    }
    if (round.status === RoundStatus.COMPLETED || round.status === RoundStatus.ABANDONED) {
      return `/round/${roundId}/summary`;
    }
    return `/round/${roundId}/waiting`;
  }

  return null;
}

/**
 * Returns a redirect path if the round is not in the correct status for the scoring screen,
 * or null if access is allowed (round is IN_PROGRESS).
 */
export function getScoreGuardRedirect(
  round: Round | null,
  userId: string,
  roundId: string,
): string | null {
  if (!round) return '/';

  if (round.status !== RoundStatus.IN_PROGRESS) {
    if (round.status === RoundStatus.SETUP) {
      const isOwner = round.created_by === userId;
      return isOwner ? `/round/${roundId}/setup` : `/round/${roundId}/waiting`;
    }
    return `/round/${roundId}/summary`;
  }

  return null;
}
