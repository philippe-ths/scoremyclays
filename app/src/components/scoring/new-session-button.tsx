'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { useScoring } from '@/context/scoring-context';

import { SessionSetupModal } from './session-setup-modal';

export function NewSessionButton() {
  const [showSetup, setShowSetup] = useState(false);
  const { state } = useScoring();

  const handleStartNewSession = () => {
    setShowSetup(true);
  };

  const handleResumeSession = () => {
    // TODO: Navigate to scoring screen
    console.log('Resume session:', state.currentSession?.id);
  };

  // If there's a current session in progress, show resume button
  if (state.currentSession && !state.currentSession.isComplete) {
    return (
      <div className='space-y-3'>
        <Button
          onClick={handleResumeSession}
          size='touch-lg'
          className='w-full bg-blue-600 hover:bg-blue-700 text-white'
        >
          Resume Current Session
        </Button>

        <Button
          onClick={handleStartNewSession}
          variant='outline'
          size='touch'
          className='w-full'
        >
          Start New Session
        </Button>

        {showSetup && (
          <SessionSetupModal
            isOpen={showSetup}
            onClose={() => setShowSetup(false)}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <Button
        onClick={handleStartNewSession}
        size='touch-lg'
        className='w-full bg-green-600 hover:bg-green-700 text-white font-bold'
      >
        Start New Session
      </Button>

      {showSetup && (
        <SessionSetupModal
          isOpen={showSetup}
          onClose={() => setShowSetup(false)}
        />
      )}
    </>
  );
}
