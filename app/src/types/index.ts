// Core clay shooting types
export type ShotResult = 'hit' | 'miss' | 'no-bird'

export interface Shot {
  id: string
  targetNumber: number
  result: ShotResult
  timestamp: Date
}

export interface Position {
  id: string
  number: number
  name: string
  shots: Shot[]
  isComplete: boolean
  score: number // Number of hits
}

export interface Session {
  id: string
  groundName: string
  shooterName: string
  date: Date
  positions: Position[]
  isComplete: boolean
  totalScore: number
  totalTargets: number
  percentage: number
  createdAt: Date
  updatedAt: Date
  syncStatus: 'synced' | 'pending' | 'error'
}

// UI State types
export interface ScoringState {
  currentSession: Session | null
  currentPosition: number // 0-9 for positions 1-10
  currentTarget: number // 0-9 for targets 1-10
  isScoring: boolean
  canUndo: boolean
  lastAction: ShotResult | null
}

export interface AppState {
  sessions: Session[]
  scoring: ScoringState
  isOffline: boolean
  syncStatus: 'idle' | 'syncing' | 'error'
  lastSyncTime: Date | null
}

// Form types
export interface SessionSetupForm {
  groundName: string
  shooterName: string
}

export interface PositionSetupForm {
  name: string
}

// Database types (for PowerSync)
export interface SessionRecord {
  id: string
  ground_name: string
  shooter_name: string
  date: string
  total_score: number
  total_targets: number
  percentage: number
  is_complete: boolean
  created_at: string
  updated_at: string
}

export interface PositionRecord {
  id: string
  session_id: string
  number: number
  name: string
  score: number
  is_complete: boolean
  created_at: string
  updated_at: string
}

export interface ShotRecord {
  id: string
  position_id: string
  target_number: number
  result: ShotResult
  timestamp: string
  created_at: string
}

// Component prop types
export interface ButtonProps {
  variant?: 'hit' | 'miss' | 'no-bird' | 'secondary' | 'primary'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export interface ScoreDisplayProps {
  score: number
  total: number
  percentage?: number
  size?: 'sm' | 'md' | 'lg'
  showPercentage?: boolean
}

// Hook return types
export interface UseScoringReturn {
  state: ScoringState
  startNewSession: (setup: SessionSetupForm) => void
  setupPosition: (name: string) => void
  recordShot: (result: ShotResult) => void
  undoLastShot: () => void
  completePosition: () => void
  completeSession: () => void
  resetSession: () => void
}

export interface UseSessionsReturn {
  sessions: Session[]
  isLoading: boolean
  error: string | null
  refreshSessions: () => Promise<void>
  deleteSession: (sessionId: string) => Promise<void>
}

// Navigation types
export type ScreenName = 
  | 'home'
  | 'session-setup'
  | 'position-setup'
  | 'scoring'
  | 'position-complete'
  | 'session-complete'
  | 'session-history'
  | 'session-detail'

// Constants
export const SPORTING_CLAYS_CONFIG = {
  POSITIONS_PER_SESSION: 10,
  TARGETS_PER_POSITION: 10,
  TOTAL_TARGETS: 100,
} as const

export const SHOT_RESULTS: Record<ShotResult, { label: string; color: string; icon: string }> = {
  hit: { label: 'Hit', color: 'green', icon: '✓' },
  miss: { label: 'Miss', color: 'red', icon: '✗' },
  'no-bird': { label: 'No Bird', color: 'blue', icon: '○' },
} as const