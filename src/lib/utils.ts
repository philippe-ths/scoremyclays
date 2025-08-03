import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { Session, Position, Shot, ShotResult } from '@/types';

// Tailwind class merger utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Scoring calculation functions
export function calculatePositionScore(shots: Shot[]): number {
  return shots.filter(shot => shot.result === 'hit').length;
}

export function calculateSessionScore(positions: Position[]): number {
  return positions.reduce((total, position) => total + position.score, 0);
}

export function calculatePercentage(score: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((score / total) * 100);
}

export function getPositionProgress(position: Position): {
  current: number;
  total: number;
  percentage: number;
} {
  const current = position.shots.length;
  const total = 10; // Sporting Clays targets per position
  const percentage = calculatePercentage(current, total);

  return { current, total, percentage };
}

export function getSessionProgress(session: Session): {
  positionsComplete: number;
  totalPositions: number;
  targetsShot: number;
  totalTargets: number;
  percentage: number;
} {
  const positionsComplete = session.positions.filter(p => p.isComplete).length;
  const totalPositions = 10; // Sporting Clays positions per session

  const targetsShot = session.positions.reduce(
    (total, position) => total + position.shots.length,
    0
  );
  const totalTargets = 100; // Total targets in Sporting Clays (10 positions × 10 targets)

  const percentage = calculatePercentage(session.totalScore, targetsShot);

  return {
    positionsComplete,
    totalPositions,
    targetsShot,
    totalTargets,
    percentage,
  };
}

// Session utilities
export function isSessionComplete(session: Session): boolean {
  return (
    session.positions.length === 10 &&
    session.positions.every(position => position.isComplete)
  );
}

export function isPositionComplete(position: Position): boolean {
  return position.shots.length >= 10; // Sporting Clays has 10 shots per position
}

export function canRecordShot(position: Position): boolean {
  return position.shots.length < 10;
}

export function getNextTargetNumber(position: Position): number {
  return position.shots.length + 1;
}

// Validation utilities
export function validateShooterName(name: string): string | null {
  if (!name || name.trim().length === 0) {
    return 'Shooter name is required';
  }
  if (name.trim().length < 2) {
    return 'Shooter name must be at least 2 characters';
  }
  if (name.trim().length > 50) {
    return 'Shooter name must be less than 50 characters';
  }
  return null;
}

export function validateGroundName(name: string): string | null {
  if (!name || name.trim().length === 0) {
    return 'Shooting ground name is required';
  }
  if (name.trim().length < 2) {
    return 'Ground name must be at least 2 characters';
  }
  if (name.trim().length > 100) {
    return 'Ground name must be less than 100 characters';
  }
  return null;
}

export function validatePositionName(name: string): string | null {
  if (!name || name.trim().length === 0) {
    return 'Position name is required';
  }
  if (name.trim().length < 1) {
    return 'Position name cannot be empty';
  }
  if (name.trim().length > 50) {
    return 'Position name must be less than 50 characters';
  }
  return null;
}

// Date and time utilities
export function formatDate(date: Date | string | number): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatTime(date: Date | string | number): string {
  const d = new Date(date);
  return d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getRelativeTime(date: Date | string | number): string {
  const d = new Date(date);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInHours < 48) {
    return 'Yesterday';
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }
}

// ID generation utilities
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function generatePositionId(): string {
  return `position_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function generateShotId(): string {
  return `shot_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Storage key utilities
export const STORAGE_KEYS = {
  CURRENT_SESSION: 'scoring_current_session',
  SESSIONS_CACHE: 'scoring_sessions_cache',
  USER_PREFERENCES: 'scoring_user_preferences',
} as const;

// Shot result utilities
export function getShotResultColor(result: ShotResult): string {
  switch (result) {
    case 'hit':
      return 'text-green-600';
    case 'miss':
      return 'text-red-600';
    case 'no-bird':
      return 'text-blue-600';
    default:
      return 'text-gray-600';
  }
}

export function getShotResultIcon(result: ShotResult): string {
  switch (result) {
    case 'hit':
      return '✓';
    case 'miss':
      return '✗';
    case 'no-bird':
      return '○';
    default:
      return '?';
  }
}

// Performance utilities
export function debounce<T extends (...args: never[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: never[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Group sessions by shooting ground for history display
export function groupSessionsByGround(sessions: Session[]): [string, Session[]][] {
  const grouped = sessions.reduce(
    (acc, session) => {
      const groundName = session.groundName;
      if (!acc[groundName]) {
        acc[groundName] = [];
      }
      acc[groundName].push(session);
      return acc;
    },
    {} as Record<string, Session[]>
  );

  return Object.entries(grouped).sort(([, a], [, b]) => {
    // Sort by most recent session in each group
    const latestA = Math.max(...a.map(s => new Date(s.date).getTime()));
    const latestB = Math.max(...b.map(s => new Date(s.date).getTime()));
    return latestB - latestA;
  });
}
