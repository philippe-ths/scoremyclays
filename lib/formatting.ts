import { PRESENTATION_LABELS, TARGET_CONFIG_LABELS } from './constants';
import type { ClubPosition, ClubStand, PresentationType, Stand, TargetConfig } from './types';

type StandLike = Pick<Stand | ClubStand, 'stand_number' | 'target_config' | 'presentation' | 'num_targets'>;

export function formatStandDetail(stand: StandLike): string {
  const config = TARGET_CONFIG_LABELS[stand.target_config as TargetConfig] ?? stand.target_config;
  const presentation = PRESENTATION_LABELS[stand.presentation as PresentationType] ?? stand.presentation;
  return `${config} · ${presentation} · ${stand.num_targets} targets`;
}

export function formatPositionTitle(position: Pick<ClubPosition, 'position_number' | 'name'>): string {
  return `Position ${position.position_number}${position.name ? ` — ${position.name}` : ''}`;
}
