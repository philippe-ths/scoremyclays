import type { Squad, ShooterEntry } from '@/lib/types';

// Stub: Create a squad for a round
export async function createSquad(_params: {
  id: string;
  round_id: string;
}): Promise<void> {
  throw new Error('Not implemented');
}

// Stub: Get squad by round ID
export async function getSquadByRound(_roundId: string): Promise<Squad | null> {
  throw new Error('Not implemented');
}

// Stub: Add a shooter to a squad
export async function addShooterEntry(_params: {
  id: string;
  squad_id: string;
  user_id: string | null;
  shooter_name: string;
  position_in_squad: number;
}): Promise<void> {
  throw new Error('Not implemented');
}

// Stub: List shooters in a squad
export async function listShooterEntries(
  _squadId: string,
): Promise<ShooterEntry[]> {
  throw new Error('Not implemented');
}

// Stub: Remove a shooter from a squad
export async function removeShooterEntry(_id: string): Promise<void> {
  throw new Error('Not implemented');
}
