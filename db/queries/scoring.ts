import type { TargetResultRecord, ShotResult } from '@/lib/types';

// Stub: Record a target result
export async function recordTargetResult(_params: {
  id: string;
  stand_id: string;
  shooter_entry_id: string;
  target_number: number;
  bird_number: number;
  result: ShotResult;
  recorded_by: string;
  device_id: string;
}): Promise<void> {
  throw new Error('Not implemented');
}

// Stub: Get results for a stand and shooter
export async function getResultsForStandAndShooter(
  _standId: string,
  _shooterEntryId: string,
): Promise<TargetResultRecord[]> {
  throw new Error('Not implemented');
}

// Stub: Get all results for a stand
export async function getResultsForStand(
  _standId: string,
): Promise<TargetResultRecord[]> {
  throw new Error('Not implemented');
}

// Stub: Get all results for a round (via stand IDs)
export async function getResultsForRound(
  _roundId: string,
): Promise<TargetResultRecord[]> {
  throw new Error('Not implemented');
}

// Stub: Update a target result
export async function updateTargetResult(
  _id: string,
  _result: ShotResult,
): Promise<void> {
  throw new Error('Not implemented');
}

// Stub: Get score totals for a shooter in a round
export async function getShooterRoundScore(
  _roundId: string,
  _shooterEntryId: string,
): Promise<{ kills: number; total: number }> {
  throw new Error('Not implemented');
}
