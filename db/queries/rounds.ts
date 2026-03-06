import type { Round, RoundStatus } from '@/lib/types';

// Stub: Create a new round
export async function createRound(_params: {
  id: string;
  created_by: string;
  ground_name: string;
  date: string;
  total_targets: number;
}): Promise<void> {
  // TODO: Implement with PowerSync database
  throw new Error('Not implemented');
}

// Stub: Get a round by ID
export async function getRound(_id: string): Promise<Round | null> {
  throw new Error('Not implemented');
}

// Stub: List rounds for a user
export async function listRounds(_userId: string): Promise<Round[]> {
  throw new Error('Not implemented');
}

// Stub: Update round status
export async function updateRoundStatus(
  _id: string,
  _status: RoundStatus,
): Promise<void> {
  throw new Error('Not implemented');
}

// Stub: Update round notes
export async function updateRoundNotes(
  _id: string,
  _notes: string,
): Promise<void> {
  throw new Error('Not implemented');
}
