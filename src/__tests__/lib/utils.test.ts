import { describe, it, expect } from 'vitest';
import {
  generateSessionId,
  generatePositionId,
  generateShotId,
  calculatePositionScore,
  calculateSessionScore,
  calculatePercentage,
  getPositionProgress,
  getSessionProgress,
  isSessionComplete,
  isPositionComplete,
  canRecordShot,
  getNextTargetNumber,
  validateShooterName,
  validateGroundName,
  cn,
} from '@/lib/utils';
import type { Position, Session, Shot } from '@/types';

describe('Clay Shooting Utilities', () => {
  describe('ID Generation', () => {
    it('should generate unique session IDs', () => {
      const id1 = generateSessionId();
      const id2 = generateSessionId();

      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^session_/);
    });

    it('should generate unique position IDs', () => {
      const id1 = generatePositionId();
      const id2 = generatePositionId();

      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^position_/);
    });

    it('should generate unique shot IDs', () => {
      const id1 = generateShotId();
      const id2 = generateShotId();

      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^shot_/);
    });
  });

  describe('Score Calculations', () => {
    it('should calculate position score correctly', () => {
      const position: Position = {
        id: 'test-pos',
        sessionId: 'test-session',
        number: 1,
        shots: [
          {
            id: 'shot1',
            positionId: 'test-pos',
            targetNumber: 1,
            result: 'hit',
            timestamp: new Date(),
          },
          {
            id: 'shot2',
            positionId: 'test-pos',
            targetNumber: 2,
            result: 'miss',
            timestamp: new Date(),
          },
          {
            id: 'shot3',
            positionId: 'test-pos',
            targetNumber: 3,
            result: 'hit',
            timestamp: new Date(),
          },
        ],
        score: 0,
        isComplete: false,
      };

      const score = calculatePositionScore(position.shots);
      expect(score).toBe(2); // 2 hits out of 3 shots
    });

    it('should calculate session score correctly', () => {
      const session: Session = {
        id: 'test-session',
        groundName: 'Test Ground',
        shooterName: 'Test Shooter',
        date: new Date(),
        positions: [
          {
            id: 'pos1',
            sessionId: 'test-session',
            number: 1,
            shots: [
              {
                id: 'shot1',
                positionId: 'pos1',
                targetNumber: 1,
                result: 'hit',
                timestamp: new Date(),
              },
              {
                id: 'shot2',
                positionId: 'pos1',
                targetNumber: 2,
                result: 'hit',
                timestamp: new Date(),
              },
            ],
            score: 2,
            isComplete: true,
          },
          {
            id: 'pos2',
            sessionId: 'test-session',
            number: 2,
            shots: [
              {
                id: 'shot3',
                positionId: 'pos2',
                targetNumber: 1,
                result: 'miss',
                timestamp: new Date(),
              },
              {
                id: 'shot4',
                positionId: 'pos2',
                targetNumber: 2,
                result: 'hit',
                timestamp: new Date(),
              },
            ],
            score: 1,
            isComplete: true,
          },
        ],
        isComplete: false,
        totalScore: 0,
        percentage: 0,
      };

      const score = calculateSessionScore(session.positions);
      expect(score).toBe(3); // 2 + 1 = 3 total hits
    });

    it('should calculate percentage correctly', () => {
      expect(calculatePercentage(20, 25)).toBe(80);
      expect(calculatePercentage(25, 25)).toBe(100);
      expect(calculatePercentage(0, 25)).toBe(0);
      expect(calculatePercentage(0, 0)).toBe(0); // Edge case: no targets
    });

    it('should handle edge cases in calculations', () => {
      // Empty position
      const emptyPosition: Position = {
        id: 'empty-pos',
        sessionId: 'test-session',
        number: 1,
        shots: [],
        score: 0,
        isComplete: false,
      };
      expect(calculatePositionScore(emptyPosition.shots)).toBe(0);

      // Empty session
      const emptySession: Session = {
        id: 'empty-session',
        groundName: 'Test Ground',
        shooterName: 'Test Shooter',
        date: new Date(),
        positions: [],
        isComplete: false,
        totalScore: 0,
        percentage: 0,
      };
      expect(calculateSessionScore(emptySession.positions)).toBe(0);
    });
  });

  describe('Clay Shooting Business Rules', () => {
    it('should handle no-bird results correctly', () => {
      const position: Position = {
        id: 'test-pos',
        sessionId: 'test-session',
        number: 1,
        shots: [
          {
            id: 'shot1',
            positionId: 'test-pos',
            targetNumber: 1,
            result: 'hit',
            timestamp: new Date(),
          },
          {
            id: 'shot2',
            positionId: 'test-pos',
            targetNumber: 2,
            result: 'no-bird',
            timestamp: new Date(),
          },
          {
            id: 'shot3',
            positionId: 'test-pos',
            targetNumber: 3,
            result: 'miss',
            timestamp: new Date(),
          },
        ],
        score: 0,
        isComplete: false,
      };

      const score = calculatePositionScore(position.shots);
      // No-bird should not count toward score calculation
      expect(score).toBe(1); // Only the hit counts
    });
  });
});
