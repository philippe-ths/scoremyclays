'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PositionSetup } from '@/components/scoring/position-setup';
import { useScoring } from '@/context/scoring-context';
import {
  calculateSessionScore,
  calculatePercentage,
  getPositionProgress,
} from '@/lib/utils';
import { SPORTING_CLAYS_CONFIG } from '@/types';
import type { ShotResult } from '@/types';

export default function ScoringPage() {
  const { state, setupPosition, recordShot, undoLastShot, completePosition } =
    useScoring();
  const router = useRouter();
  const [lastAction, setLastAction] = useState<ShotResult | null>(null);

  // Redirect to home if no session is active
  useEffect(() => {
    if (!state.currentSession) {
      console.log('⚠️ No current session, redirecting to home in 2 seconds...');
      // Add delay to see what's happening
      setTimeout(() => {
        router.push('/');
      }, 2000);
      return;
    }
    console.log('✅ Current session exists:', state.currentSession);
  }, [state.currentSession, router]);

  // Handle scoring a shot
  const handleScore = (result: ShotResult) => {
    setLastAction(result);
    recordShot(result);

    // Clear the last action after animation
    setTimeout(() => setLastAction(null), 300);
  };

  // Handle undo
  const handleUndo = () => {
    undoLastShot();
  };

  // Handle position setup
  const handlePositionSetup = (positionName: string) => {
    setupPosition(positionName);
  };

  // Handle position completion
  const handleCompletePosition = () => {
    completePosition();
  };

  const handlePause = () => {
    // TODO: Implement pause functionality
    // Save current state or show pause modal
  };

  // Early return if no session
  if (!state.currentSession) {
    return null;
  }

  const currentSession = state.currentSession;
  const currentPosition = currentSession.positions[state.currentPosition];

  // Auto-advance to next position setup when current position is complete
  useEffect(() => {
    if (
      currentPosition &&
      currentPosition.isComplete &&
      state.currentPosition < SPORTING_CLAYS_CONFIG.POSITIONS_PER_SESSION - 1
    ) {
      // Move to next position after a brief delay
      const timer = setTimeout(() => {
        // The context will handle moving to the next position
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentPosition?.isComplete, state.currentPosition]);

  // If no current position, show position setup
  if (!currentPosition || !state.isScoring) {
    return (
      <div className='min-h-screen bg-clay-bg'>
        <Header />
        <main className='container mx-auto px-4 py-6'>
          <PositionSetup
            currentPosition={state.currentPosition + 1}
            sessionInfo={{
              groundName: currentSession.groundName,
              shooterName: currentSession.shooterName,
            }}
            onPositionSetup={handlePositionSetup}
          />
        </main>
      </div>
    );
  }

  // Calculate current stats
  const positionProgress = getPositionProgress(currentPosition);
  const totalSessionScore = calculateSessionScore(currentSession.positions);
  const totalSessionTargets = currentSession.positions.reduce(
    (total, pos) => total + pos.shots.length,
    0
  );
  const sessionPercentage = calculatePercentage(
    totalSessionScore,
    totalSessionTargets
  );

  // Calculate position stats
  const positionHits = currentPosition.shots.filter(
    shot => shot.result === 'hit'
  ).length;
  const positionMisses = currentPosition.shots.filter(
    shot => shot.result === 'miss'
  ).length;
  const positionNoBirds = currentPosition.shots.filter(
    shot => shot.result === 'no-bird'
  ).length;

  return (
    <div className='min-h-screen bg-clay-bg'>
      <Header />

      <main className='container mx-auto px-4 py-6 space-y-6'>
        {/* Session Info */}
        <Card className='card-secondary p-4'>
          <div className='flex justify-between items-center text-sm'>
            <span className='font-semibold text-clay-text-primary'>
              {currentSession.groundName}
            </span>
            <span className='text-clay-text-secondary'>
              {currentSession.shooterName}
            </span>
          </div>
        </Card>

        {/* Score Overview Card */}
        <Card className='card-primary p-6'>
          <div className='grid grid-cols-2 gap-4 mb-4'>
            <div className='text-center'>
              <div className='text-3xl font-bold text-clay-primary'>
                {totalSessionScore}
              </div>
              <div className='text-sm text-clay-text-secondary'>
                Session Score
              </div>
            </div>
            <div className='text-center'>
              <div className='text-3xl font-bold text-clay-accent'>
                {sessionPercentage}%
              </div>
              <div className='text-sm text-clay-text-secondary'>Hit Rate</div>
            </div>
          </div>

          <div className='grid grid-cols-3 gap-2 text-center text-sm'>
            <div>
              <div className='font-semibold text-green-600'>{positionHits}</div>
              <div className='text-clay-text-secondary'>Position Hits</div>
            </div>
            <div>
              <div className='font-semibold text-red-600'>{positionMisses}</div>
              <div className='text-clay-text-secondary'>Misses</div>
            </div>
            <div>
              <div className='font-semibold text-orange-600'>
                {positionNoBirds}
              </div>
              <div className='text-clay-text-secondary'>No Birds</div>
            </div>
          </div>
        </Card>

        {/* Position Progress */}
        <Card className='card-secondary p-4'>
          <div className='flex justify-between items-center mb-2'>
            <h3 className='font-semibold text-clay-text-primary'>
              Position {currentPosition.number} of{' '}
              {SPORTING_CLAYS_CONFIG.POSITIONS_PER_SESSION}
            </h3>
            <span className='text-sm text-clay-text-secondary'>
              {currentPosition.name}
            </span>
          </div>

          <div className='flex justify-between items-center mb-2 text-sm'>
            <span className='text-clay-text-secondary'>
              Target {positionProgress.current + 1} of{' '}
              {SPORTING_CLAYS_CONFIG.TARGETS_PER_POSITION}
            </span>
            <span className='font-semibold text-clay-text-primary'>
              Score: {currentPosition.score}/{positionProgress.current}
            </span>
          </div>

          <div className='w-full bg-clay-surface rounded-full h-2'>
            <div
              className='bg-clay-accent h-2 rounded-full transition-all duration-300'
              style={{
                width: `${positionProgress.percentage}%`,
              }}
            />
          </div>
        </Card>

        {/* Scoring Buttons */}
        <div className='space-y-4'>
          <div className='grid grid-cols-1 gap-4'>
            <Button
              variant='hit'
              size='touch-lg'
              onClick={() => handleScore('hit')}
              disabled={currentPosition.isComplete}
              className={`w-full h-24 text-2xl font-bold ${
                lastAction === 'hit' ? 'animate-pulse' : ''
              }`}
            >
              HIT
            </Button>

            <Button
              variant='miss'
              size='touch-lg'
              onClick={() => handleScore('miss')}
              disabled={currentPosition.isComplete}
              className={`w-full h-24 text-2xl font-bold ${
                lastAction === 'miss' ? 'animate-pulse' : ''
              }`}
            >
              MISS
            </Button>

            <Button
              variant='no-bird'
              size='touch-lg'
              onClick={() => handleScore('no-bird')}
              disabled={currentPosition.isComplete}
              className={`w-full h-24 text-2xl font-bold ${
                lastAction === 'no-bird' ? 'animate-pulse' : ''
              }`}
            >
              NO BIRD
            </Button>
          </div>

          {/* Position Management */}
          {positionProgress.current >=
            SPORTING_CLAYS_CONFIG.TARGETS_PER_POSITION &&
            !currentPosition.isComplete && (
              <div className='mt-6'>
                <Button
                  variant='default'
                  size='touch-lg'
                  onClick={handleCompletePosition}
                  className='w-full bg-green-600 hover:bg-green-700 text-white font-bold'
                >
                  Complete Position {currentPosition.number}
                </Button>
              </div>
            )}

          {/* Position Complete Feedback */}
          {currentPosition.isComplete && (
            <Card className='card-secondary border-2 border-green-500 bg-green-50 p-4 mt-6'>
              <div className='text-center'>
                <div className='text-lg font-bold text-green-800 mb-2'>
                  🎯 Position {currentPosition.number} Complete!
                </div>
                <div className='text-sm text-green-700'>
                  Score: {currentPosition.score}/
                  {SPORTING_CLAYS_CONFIG.TARGETS_PER_POSITION} (
                  {calculatePercentage(
                    currentPosition.score,
                    SPORTING_CLAYS_CONFIG.TARGETS_PER_POSITION
                  )}
                  %)
                </div>
                {state.currentPosition <
                  SPORTING_CLAYS_CONFIG.POSITIONS_PER_SESSION - 1 && (
                  <div className='text-sm text-green-600 mt-2'>
                    Moving to next position...
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className='grid grid-cols-2 gap-4 mt-6'>
            <Button
              variant='outline'
              size='touch'
              onClick={handleUndo}
              disabled={!state.canUndo || currentPosition.isComplete}
              className='font-semibold'
            >
              UNDO
            </Button>

            <Button
              variant='secondary'
              size='touch'
              onClick={handlePause}
              className='font-semibold'
            >
              PAUSE
            </Button>
          </div>
        </div>

        {/* Position History */}
        {currentSession.positions.filter(p => p.isComplete).length > 0 && (
          <Card className='card-secondary p-4'>
            <h3 className='font-semibold text-clay-text-primary mb-3'>
              Completed Positions
            </h3>
            <div className='grid grid-cols-5 gap-2'>
              {currentSession.positions
                .filter(p => p.isComplete)
                .map(position => (
                  <div key={position.id} className='text-center'>
                    <div className='bg-clay-surface rounded-lg p-2'>
                      <div className='font-bold text-clay-primary'>
                        {position.score}/
                        {SPORTING_CLAYS_CONFIG.TARGETS_PER_POSITION}
                      </div>
                      <div className='text-xs text-clay-text-secondary'>
                        {position.name}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
