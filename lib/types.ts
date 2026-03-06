// Domain enums and types for ScoreMyClays
// Source of truth: SCORE_MY_CLAYS_SPEC.md

// --- Enums ---

export enum PresentationType {
  CROSSER = 'CROSSER',
  DRIVEN = 'DRIVEN',
  INCOMING = 'INCOMING',
  GOING_AWAY = 'GOING_AWAY',
  QUARTERING_AWAY = 'QUARTERING_AWAY',
  QUARTERING_TOWARDS = 'QUARTERING_TOWARDS',
  TEAL = 'TEAL',
  DROPPING = 'DROPPING',
  LOOPER = 'LOOPER',
  RABBIT = 'RABBIT',
  BATTUE = 'BATTUE',
  CHANDELLE = 'CHANDELLE',
  SPRINGING = 'SPRINGING',
}

export enum TargetConfig {
  SINGLE = 'SINGLE',
  REPORT_PAIR = 'REPORT_PAIR',
  SIMULTANEOUS_PAIR = 'SIMULTANEOUS_PAIR',
  FOLLOWING_PAIR = 'FOLLOWING_PAIR',
}

export enum RoundStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ABANDONED = 'ABANDONED',
}

export enum ShotResult {
  KILL = 'KILL',
  LOSS = 'LOSS',
  NO_SHOT = 'NO_SHOT',
}

// --- Entity interfaces ---

export interface User {
  id: string;
  display_name: string;
  email: string | null;
  created_at: string;
}

export interface Round {
  id: string;
  created_by: string;
  ground_name: string;
  date: string;
  total_targets: number;
  status: RoundStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Squad {
  id: string;
  round_id: string;
}

export interface ShooterEntry {
  id: string;
  squad_id: string;
  user_id: string | null;
  shooter_name: string;
  position_in_squad: number;
}

export interface Stand {
  id: string;
  round_id: string;
  stand_number: number;
  target_config: TargetConfig;
  presentation: PresentationType;
  presentation_notes: string | null;
  num_targets: number;
}

export interface TargetResultRecord {
  id: string;
  stand_id: string;
  shooter_entry_id: string;
  target_number: number;
  bird_number: number;
  result: ShotResult;
  recorded_by: string;
  device_id: string;
  created_at: string;
}
