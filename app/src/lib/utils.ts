import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { type Session, type Position, type Shot, type ShotResult, SPORTING_CLAYS_CONFIG } from "@/types"

// Tailwind class merger utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Score calculation utilities
export function calculatePositionScore(shots: Shot[]): number {
  return shots.filter(shot => shot.result === 'hit').length
}

export function calculateSessionScore(positions: Position[]): number {
  return positions.reduce((total, position) => total + position.score, 0)
}

export function calculatePercentage(score: number, total: number): number {
  if (total === 0) return 0
  return Math.round((score / total) * 100)
}

export function getPositionProgress(position: Position): {
  current: number
  total: number
  percentage: number
} {
  const current = position.shots.length
  const total = SPORTING_CLAYS_CONFIG.TARGETS_PER_POSITION
  const percentage = calculatePercentage(current, total)
  
  return { current, total, percentage }
}

export function getSessionProgress(session: Session): {
  positionsComplete: number
  totalPositions: number
  targetsShot: number
  totalTargets: number
  percentage: number
} {
  const positionsComplete = session.positions.filter(p => p.isComplete).length
  const totalPositions = SPORTING_CLAYS_CONFIG.POSITIONS_PER_SESSION
  
  const targetsShot = session.positions.reduce(
    (total, position) => total + position.shots.length, 
    0
  )
  const totalTargets = SPORTING_CLAYS_CONFIG.TOTAL_TARGETS
  
  const percentage = calculatePercentage(session.totalScore, targetsShot)
  
  return {
    positionsComplete,
    totalPositions,
    targetsShot,
    totalTargets,
    percentage,
  }
}

// Session utilities
export function isSessionComplete(session: Session): boolean {
  return session.positions.length === SPORTING_CLAYS_CONFIG.POSITIONS_PER_SESSION &&
         session.positions.every(position => position.isComplete)
}

export function isPositionComplete(position: Position): boolean {
  return position.shots.length === SPORTING_CLAYS_CONFIG.TARGETS_PER_POSITION
}

export function canRecordShot(position: Position): boolean {
  return position.shots.length < SPORTING_CLAYS_CONFIG.TARGETS_PER_POSITION
}

export function getNextTargetNumber(position: Position): number {
  return position.shots.length + 1
}

// Validation utilities
export function validateShooterName(name: string): string | null {
  if (!name || name.trim().length === 0) {
    return "Shooter name is required"
  }
  if (name.trim().length < 2) {
    return "Shooter name must be at least 2 characters"
  }
  if (name.trim().length > 50) {
    return "Shooter name must be less than 50 characters"
  }
  return null
}

export function validateGroundName(name: string): string | null {
  if (!name || name.trim().length === 0) {
    return "Shooting ground name is required"
  }
  if (name.trim().length < 2) {
    return "Ground name must be at least 2 characters"
  }
  if (name.trim().length > 100) {
    return "Ground name must be less than 100 characters"
  }
  return null
}

export function validatePositionName(name: string): string | null {
  if (!name || name.trim().length === 0) {
    return "Position name is required"
  }
  if (name.trim().length < 1) {
    return "Position name cannot be empty"
  }
  if (name.trim().length > 50) {
    return "Position name must be less than 50 characters"
  }
  return null
}

// Date and time utilities
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  
  if (diffInHours < 1) {
    return 'Just now'
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)} hours ago`
  } else if (diffInHours < 168) { // 7 days
    return `${Math.floor(diffInHours / 24)} days ago`
  } else {
    return formatDate(date)
  }
}

// ID generation utilities
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function generateSessionId(): string {
  return `session-${generateId()}`
}

export function generatePositionId(): string {
  return `position-${generateId()}`
}

export function generateShotId(): string {
  return `shot-${generateId()}`
}

// Storage key utilities
export const STORAGE_KEYS = {
  CURRENT_SESSION: 'scoremyclays-current-session',
  SESSIONS_CACHE: 'scoremyclays-sessions-cache',
  APP_SETTINGS: 'scoremyclays-settings',
  SYNC_STATUS: 'scoremyclays-sync-status',
} as const

// Shot result utilities
export function getShotResultColor(result: ShotResult): string {
  switch (result) {
    case 'hit':
      return 'text-green-600'
    case 'miss':
      return 'text-red-600'
    case 'no-bird':
      return 'text-blue-600'
    default:
      return 'text-gray-600'
  }
}

export function getShotResultIcon(result: ShotResult): string {
  switch (result) {
    case 'hit':
      return '✓'
    case 'miss':
      return '✗'
    case 'no-bird':
      return '○'
    default:
      return '?'
  }
}

// Performance utilities
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}