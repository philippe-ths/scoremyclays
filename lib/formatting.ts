import { PRESENTATION_LABELS, TARGET_CONFIG_LABELS } from './constants';
import { RoundStatus, type ClubPosition, type ClubStand, type PresentationType, type Stand, type TargetConfig } from './types';

type StandLike = Pick<Stand | ClubStand, 'stand_number' | 'target_config' | 'presentation' | 'num_targets'>;

const ROUND_STATUS_LABELS: Record<RoundStatus, string> = {
  [RoundStatus.SETUP]: 'Setup',
  [RoundStatus.IN_PROGRESS]: 'In Progress',
  [RoundStatus.COMPLETED]: 'Completed',
  [RoundStatus.ABANDONED]: 'Abandoned',
};

export function formatRoundStatusLabel(status: RoundStatus | string): string {
  return ROUND_STATUS_LABELS[status as RoundStatus] ?? status;
}

export function formatStandDetail(stand: StandLike): string {
  const config = TARGET_CONFIG_LABELS[stand.target_config as TargetConfig] ?? stand.target_config;
  const presentation = PRESENTATION_LABELS[stand.presentation as PresentationType] ?? stand.presentation;
  return `${config} · ${presentation} · ${stand.num_targets} targets`;
}

export function formatPositionTitle(position: Pick<ClubPosition, 'position_number' | 'name'>): string {
  return `Position ${position.position_number}${position.name ? ` — ${position.name}` : ''}`;
}
