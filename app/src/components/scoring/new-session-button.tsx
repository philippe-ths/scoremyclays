'use client';

import React, { useState } from 'react';

import { Button } from '@/components/ui/button';

import { SessionSetupModal } from './session-setup-modal';

export function NewSessionButton() {
  const [showModal, setShowModal] = useState(false);

  const handleStartSession = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleSessionStart = (_data: {
    groundName: string;
    shooterName: string;
  }) => {
    // Handle session start logic here
    setShowModal(false);
    // TODO: Navigate to scoring page or update app state
  };

  return (
    <>
      <Button
        onClick={handleStartSession}
        size='touch-lg'
        className='w-full bg-green-600 hover:bg-green-700 text-white font-bold'
      >
        Start New Session
      </Button>

      <SessionSetupModal
        isOpen={showModal}
        onClose={handleModalClose}
        onStartSession={handleSessionStart}
      />
    </>
  );
}
