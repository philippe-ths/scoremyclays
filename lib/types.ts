// Domain enums and types for ScoreMyClays

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

export enum InviteStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

// --- Entity interfaces ---

export interface User {
  id: string;
  display_name: string;
  email: string | null;
  user_id: string | null; // unique handle for invites, immutable, null until profile setup complete
  discoverable: number; // 0 or 1, controls display name search visibility
  favourite_club_ids: string; // JSON array stored as text
  gear: string; // JSON array stored as text
  created_at: string;
  updated_at: string;
}

export interface Round {
  id: string;
  created_by: string;
  ground_name: string;
  date: string;
  total_targets: number;
  status: RoundStatus;
  notes: string | null;
  club_id: string | null;
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

export interface EnrichedShooterEntry extends ShooterEntry {
  user_handle: string | null;
}

export interface Stand {
  id: string;
  round_id: string;
  stand_number: number;
  target_config: TargetConfig;
  presentation: PresentationType;
  presentation_notes: string | null;
  num_targets: number;
  club_stand_id: string | null;
  club_position_id: string | null;
}

export interface Club {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
  created_at: string;
}

export interface ClubPosition {
  id: string;
  club_id: string;
  position_number: number;
  name: string | null;
  created_at: string;
}

export interface ClubStand {
  id: string;
  club_position_id: string;
  stand_number: number;
  target_config: TargetConfig;
  presentation: PresentationType;
  presentation_notes: string | null;
  num_targets: number;
  created_at: string;
}

// --- Composite types ---

export type PositionWithStands = ClubPosition & { stands: ClubStand[] };

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

export interface Invite {
  id: string;
  round_id: string;
  inviter_id: string; // User.id
  invitee_id: string; // User.id (UUID) of invitee
  invitee_user_id: string; // User.user_id (handle) of invitee
  status: InviteStatus;
  created_at: string;
}
