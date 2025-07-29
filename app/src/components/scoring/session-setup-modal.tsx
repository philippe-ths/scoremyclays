'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';

interface SessionSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSession: (data: { groundName: string; shooterName: string }) => void;
}

export function SessionSetupModal({ isOpen, onClose, onStartSession }: SessionSetupModalProps) {
  const [formData, setFormData] = useState({
    groundName: '',
    shooterName: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.groundName.trim() && formData.shooterName.trim()) {
      onStartSession(formData);
      // Reset form
      setFormData({ groundName: '', shooterName: '' });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50'>
      <div className='card-primary'>
        <div className='text-clay-text-primary'>
          Start New Session
        </div>

        <div className='space-y-4'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Shooting Ground Input */}
            <div className='space-y-2'>
              <label
                htmlFor='groundName'
                className='text-sm font-medium text-clay-text-secondary'
              >
                Shooting Ground
              </label>
              <input
                id='groundName'
                type='text'
                required
                value={formData.groundName}
                onChange={e => handleInputChange('groundName', e.target.value)}
                placeholder='e.g., Bisley Shooting Ground'
                className='w-full px-3 py-2 border border-clay-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-clay-accent focus:border-clay-accent'
                autoComplete='organization'
              />
            </div>

            {/* Shooter Name Input */}
            <div className='space-y-2'>
              <label
                htmlFor='shooterName'
                className='text-sm font-medium text-clay-text-secondary'
              >
                Shooter Name
              </label>
              <input
                id='shooterName'
                type='text'
                required
                value={formData.shooterName}
                onChange={e => handleInputChange('shooterName', e.target.value)}
                placeholder='e.g., John Doe'
                className='w-full px-3 py-2 border border-clay-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-clay-accent focus:border-clay-accent'
                autoComplete='name'
              />
            </div>
            <div className='flex justify-end space-x-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={onClose}
                className='font-semibold'
              >
                Cancel
              </Button>
              <Button
                variant='default'
                size='sm'
                type='submit'
                className='font-semibold'
              >
                Start
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
