import type { Stand, PresentationType, TargetConfig } from '@/lib/types';

// Stub: Create a stand in a round
export async function createStand(_params: {
  id: string;
  round_id: string;
  stand_number: number;
  target_config: TargetConfig;
  presentation: PresentationType;
  presentation_notes: string | null;
  num_targets: number;
}): Promise<void> {
  throw new Error('Not implemented');
}

// Stub: Get stands for a round (ordered by stand_number)
export async function listStands(_roundId: string): Promise<Stand[]> {
  throw new Error('Not implemented');
}

// Stub: Get a single stand by ID
export async function getStand(_id: string): Promise<Stand | null> {
  throw new Error('Not implemented');
}

// Stub: Update a stand
export async function updateStand(
  _id: string,
  _params: Partial<
    Pick<Stand, 'target_config' | 'presentation' | 'presentation_notes' | 'num_targets'>
  >,
): Promise<void> {
  throw new Error('Not implemented');
}

// Stub: Delete a stand
export async function deleteStand(_id: string): Promise<void> {
  throw new Error('Not implemented');
}
