'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from 'react';

import {
  generateSessionId,
  generatePositionId,
  generateShotId,
  calculatePositionScore,
  calculateSessionScore,
  calculatePercentage,
  isPositionComplete,
  STORAGE_KEYS,
} from '@/lib/utils';
import type {
  Session,
  Position,
  Shot,
  ScoringState,
  ShotResult,
  SessionSetupForm,
} from '@/types';

// Action types for scoring reducer
type ScoringAction =
  | { type: 'START_SESSION'; payload: SessionSetupForm }
  | { type: 'SETUP_POSITION'; payload: string }
  | { type: 'RECORD_SHOT'; payload: ShotResult }
  | { type: 'UNDO_SHOT' }
  | { type: 'COMPLETE_POSITION' }
  | { type: 'COMPLETE_SESSION' }
  | { type: 'RESET_SESSION' }
  | { type: 'LOAD_SESSION'; payload: Session | null };

const initialState: ScoringState = {
  currentSession: null,
  currentPosition: 0,
  currentTarget: 0,
  isScoring: false,
  canUndo: false,
  lastAction: null,
};

function scoringReducer(
  state: ScoringState,
  action: ScoringAction
): ScoringState {
  switch (action.type) {
    case 'START_SESSION': {
      const session: Session = {
        id: generateSessionId(),
        groundName: action.payload.groundName.trim(),
        shooterName: action.payload.shooterName.trim(),
        date: new Date(),
        positions: [],
        isComplete: false,
        totalScore: 0,
        totalTargets: 0,
        percentage: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        syncStatus: 'pending',
      };

      return {
        ...state,
        currentSession: session,
        currentPosition: 0,
        currentTarget: 0,
        isScoring: false,
        canUndo: false,
        lastAction: null,
      };
    }

    case 'SETUP_POSITION': {
      if (!state.currentSession) return state;

      const position: Position = {
        id: generatePositionId(),
        number: state.currentSession.positions.length + 1,
        name: action.payload.trim(),
        shots: [],
        isComplete: false,
        score: 0,
      };

      const updatedSession = {
        ...state.currentSession,
        positions: [...state.currentSession.positions, position],
        updatedAt: new Date(),
      };

      return {
        ...state,
        currentSession: updatedSession,
        currentPosition: updatedSession.positions.length - 1,
        currentTarget: 0,
        isScoring: true,
        canUndo: false,
        lastAction: null,
      };
    }

    case 'RECORD_SHOT': {
      if (!state.currentSession || !state.isScoring) return state;

      const currentPosition =
        state.currentSession.positions[state.currentPosition];
      if (!currentPosition || currentPosition.isComplete) return state;

      const shot: Shot = {
        id: generateShotId(),
        targetNumber: currentPosition.shots.length + 1,
        result: action.payload,
        timestamp: new Date(),
      };

      const updatedShots = [...currentPosition.shots, shot];
      const updatedScore = calculatePositionScore(updatedShots);
      const positionComplete = isPositionComplete({
        ...currentPosition,
        shots: updatedShots,
      });

      const updatedPosition: Position = {
        ...currentPosition,
        shots: updatedShots,
        score: updatedScore,
        isComplete: positionComplete,
      };

      const updatedPositions = state.currentSession.positions.map(
        (pos, index) =>
          index === state.currentPosition ? updatedPosition : pos
      );

      const totalScore = calculateSessionScore(updatedPositions);
      const totalTargets = updatedPositions.reduce(
        (sum, pos) => sum + pos.shots.length,
        0
      );

      const updatedSession: Session = {
        ...state.currentSession,
        positions: updatedPositions,
        totalScore,
        totalTargets,
        percentage: calculatePercentage(totalScore, totalTargets),
        updatedAt: new Date(),
      };

      return {
        ...state,
        currentSession: updatedSession,
        currentTarget: positionComplete ? 0 : updatedShots.length,
        isScoring: !positionComplete,
        canUndo: true,
        lastAction: action.payload,
      };
    }

    case 'UNDO_SHOT': {
      if (!state.currentSession || !state.canUndo) return state;

      const currentPosition =
        state.currentSession.positions[state.currentPosition];
      if (!currentPosition || currentPosition.shots.length === 0) return state;

      const updatedShots = currentPosition.shots.slice(0, -1);
      const updatedScore = calculatePositionScore(updatedShots);

      const updatedPosition: Position = {
        ...currentPosition,
        shots: updatedShots,
        score: updatedScore,
        isComplete: false,
      };

      const updatedPositions = state.currentSession.positions.map(
        (pos, index) =>
          index === state.currentPosition ? updatedPosition : pos
      );

      const totalScore = calculateSessionScore(updatedPositions);
      const totalTargets = updatedPositions.reduce(
        (sum, pos) => sum + pos.shots.length,
        0
      );

      const updatedSession: Session = {
        ...state.currentSession,
        positions: updatedPositions,
        totalScore,
        totalTargets,
        percentage: calculatePercentage(totalScore, totalTargets),
        updatedAt: new Date(),
      };

      return {
        ...state,
        currentSession: updatedSession,
        currentTarget: updatedShots.length,
        isScoring: true,
        canUndo: updatedShots.length > 0,
        lastAction: null,
      };
    }

    case 'COMPLETE_POSITION': {
      return {
        ...state,
        isScoring: false,
        canUndo: false,
        lastAction: null,
      };
    }

    case 'COMPLETE_SESSION': {
      if (!state.currentSession) return state;

      const updatedSession: Session = {
        ...state.currentSession,
        isComplete: true,
        updatedAt: new Date(),
      };

      return {
        ...state,
        currentSession: updatedSession,
        isScoring: false,
        canUndo: false,
        lastAction: null,
      };
    }

    case 'RESET_SESSION': {
      return initialState;
    }

    case 'LOAD_SESSION': {
      if (!action.payload) return initialState;

      const session = action.payload;
      const currentPos = session.positions.findIndex(pos => !pos.isComplete);
      const currentPosition =
        currentPos === -1 ? session.positions.length - 1 : currentPos;
      const position = session.positions[currentPosition];

      return {
        ...state,
        currentSession: session,
        currentPosition: Math.max(0, currentPosition),
        currentTarget: position ? position.shots.length : 0,
        isScoring: position ? !position.isComplete : false,
        canUndo: position ? position.shots.length > 0 : false,
        lastAction: null,
      };
    }

    default:
      return state;
  }
}

interface ScoringContextType {
  state: ScoringState;
  startNewSession: (setup: SessionSetupForm) => void;
  setupPosition: (name: string) => void;
  recordShot: (result: ShotResult) => void;
  undoLastShot: () => void;
  completePosition: () => void;
  completeSession: () => void;
  resetSession: () => void;
}

const ScoringContext = createContext<ScoringContextType | null>(null);

export function ScoringProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(scoringReducer, initialState);

  // Save current session to localStorage whenever it changes
  useEffect(() => {
    if (state.currentSession) {
      try {
        localStorage.setItem(
          STORAGE_KEYS.CURRENT_SESSION,
          JSON.stringify(state.currentSession)
        );
      } catch {
        // Handle error silently or with proper error handling
      }
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
    }
  }, [state.currentSession]);

  // Load current session from localStorage on mount
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
      if (savedSession) {
        const session = JSON.parse(savedSession, (key, value) => {
          // Convert date strings back to Date objects
          if (key === 'date' || key === 'createdAt' || key === 'updatedAt') {
            return new Date(value as string);
          }
          return value as unknown;
        }) as Session;

        dispatch({ type: 'LOAD_SESSION', payload: session });
      }
    } catch {
      // Handle error silently or with proper error handling
    }
  }, [dispatch]);

  const contextValue: ScoringContextType = {
    state,
    startNewSession: setup =>
      dispatch({ type: 'START_SESSION', payload: setup }),
    setupPosition: name => dispatch({ type: 'SETUP_POSITION', payload: name }),
    recordShot: result => dispatch({ type: 'RECORD_SHOT', payload: result }),
    undoLastShot: () => dispatch({ type: 'UNDO_SHOT' }),
    completePosition: () => dispatch({ type: 'COMPLETE_POSITION' }),
    completeSession: () => dispatch({ type: 'COMPLETE_SESSION' }),
    resetSession: () => dispatch({ type: 'RESET_SESSION' }),
  };

  return (
    <ScoringContext.Provider value={contextValue}>
      {children}
    </ScoringContext.Provider>
  );
}

export function useScoring() {
  const context = useContext(ScoringContext);
  if (!context) {
    throw new Error('useScoring must be used within a ScoringProvider');
  }
  return context;
}
