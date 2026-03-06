import type { AbstractPowerSyncDatabase } from '@powersync/common';
import type { Stand, PresentationType, TargetConfig } from '@/lib/types';

export async function createStand(
  db: AbstractPowerSyncDatabase,
  params: {
    id: string;
    round_id: string;
    stand_number: number;
    target_config: TargetConfig;
    presentation: PresentationType;
    presentation_notes: string | null;
    num_targets: number;
  },
): Promise<void> {
  await db.execute(
    'INSERT INTO stands (id, round_id, stand_number, target_config, presentation, presentation_notes, num_targets) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [params.id, params.round_id, params.stand_number, params.target_config, params.presentation, params.presentation_notes, params.num_targets],
  );
}

export async function listStands(
  db: AbstractPowerSyncDatabase,
  roundId: string,
): Promise<Stand[]> {
  return db.getAll<Stand>('SELECT * FROM stands WHERE round_id = ? ORDER BY stand_number', [roundId]);
}

export async function getStand(
  db: AbstractPowerSyncDatabase,
  id: string,
): Promise<Stand | null> {
  return db.getOptional<Stand>('SELECT * FROM stands WHERE id = ?', [id]);
}

export async function updateStand(
  db: AbstractPowerSyncDatabase,
  id: string,
  params: Partial<Pick<Stand, 'target_config' | 'presentation' | 'presentation_notes' | 'num_targets'>>,
): Promise<void> {
  const sets: string[] = [];
  const values: any[] = [];
  if (params.target_config !== undefined) { sets.push('target_config = ?'); values.push(params.target_config); }
  if (params.presentation !== undefined) { sets.push('presentation = ?'); values.push(params.presentation); }
  if (params.presentation_notes !== undefined) { sets.push('presentation_notes = ?'); values.push(params.presentation_notes); }
  if (params.num_targets !== undefined) { sets.push('num_targets = ?'); values.push(params.num_targets); }
  if (sets.length === 0) return;
  values.push(id);
  await db.execute(`UPDATE stands SET ${sets.join(', ')} WHERE id = ?`, values);
}

export async function deleteStand(
  db: AbstractPowerSyncDatabase,
  id: string,
): Promise<void> {
  await db.execute('DELETE FROM stands WHERE id = ?', [id]);
}
