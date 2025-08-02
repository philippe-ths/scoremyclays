'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useScoring } from '@/context/scoring-context';
import type { SessionSetupForm } from '@/types';

import { SessionSetupModal } from './session-setup-modal';

export function NewSessionButton() {
  const [showModal, setShowModal] = useState(false);
  const { startNewSession } = useScoring();
  const router = useRouter();

  const handleStartSession = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleSessionStart = (data: SessionSetupForm) => {
    // Start new session in scoring context
    startNewSession(data);

    // Close modal
    setShowModal(false);

    // Navigate to scoring page for position setup
    router.push('/scoring');
  };

  return (
    <>
      <Button
        onClick={handleStartSession}
        size='touch-lg'
        className='w-full bg-clay-primary hover:bg-clay-primary-light text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2'
      >
        <span role='img' aria-label='Target'>
          🎯
        </span>
        <span>Start New Session</span>
      </Button>

      <SessionSetupModal
        isOpen={showModal}
        onClose={handleModalClose}
        onStartSession={handleSessionStart}
      />
    </>
  );
}
