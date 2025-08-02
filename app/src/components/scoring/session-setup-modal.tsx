'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';

interface SessionSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSession: (data: { groundName: string; shooterName: string }) => void;
}

export function SessionSetupModal({
  isOpen,
  onClose,
  onStartSession,
}: SessionSetupModalProps) {
  const [formData, setFormData] = useState({
    groundName: '',
    shooterName: '',
  });
  const [errors, setErrors] = useState({
    groundName: '',
    shooterName: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {
      groundName: '',
      shooterName: '',
    };

    if (!formData.groundName.trim()) {
      newErrors.groundName = 'Shooting ground is required';
    } else if (formData.groundName.trim().length < 2) {
      newErrors.groundName = 'Ground name must be at least 2 characters';
    }

    if (!formData.shooterName.trim()) {
      newErrors.shooterName = 'Shooter name is required';
    } else if (formData.shooterName.trim().length < 2) {
      newErrors.shooterName = 'Shooter name must be at least 2 characters';
    }

    setErrors(newErrors);
    return !newErrors.groundName && !newErrors.shooterName;
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate brief loading for better UX
      await new Promise(resolve => setTimeout(resolve, 300));

      onStartSession({
        groundName: formData.groundName.trim(),
        shooterName: formData.shooterName.trim(),
      });

      // Reset form
      setFormData({ groundName: '', shooterName: '' });
      setErrors({ groundName: '', shooterName: '' });
    } catch (error) {
      console.error('Error starting session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({ groundName: '', shooterName: '' });
      setErrors({ groundName: '', shooterName: '' });
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      {/* Backdrop with blur */}
      <div
        className='absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity'
        onClick={handleClose}
        aria-hidden='true'
      />

      {/* Modal */}
      <div className='relative w-full max-w-md mx-auto'>
        <div className='card-elevated shadow-outdoor border-2 border-clay-border'>
          {/* Header */}
          <div className='flex items-center justify-between p-6 pb-4'>
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-clay-primary rounded-full flex items-center justify-center'>
                <span
                  className='text-white text-xl'
                  role='img'
                  aria-label='Target'
                >
                  🎯
                </span>
              </div>
              <div>
                <h2 className='text-xl font-bold text-clay-text-primary'>
                  New Session
                </h2>
                <p className='text-sm text-clay-text-secondary'>
                  Set up your clay shooting session
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='px-6 pb-6 space-y-6'>
            {/* Shooting Ground Input */}
            <div className='space-y-2'>
              <label
                htmlFor='groundName'
                className='block text-sm font-semibold text-clay-text-primary'
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
                className={`w-full h-12 px-4 py-3 text-base border-2 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-clay-primary/20 ${
                  errors.groundName
                    ? 'border-clay-error bg-red-50 focus:border-clay-error'
                    : 'border-clay-border bg-clay-surface-elevated focus:border-clay-primary hover:border-clay-primary/60'
                }`}
                autoComplete='organization'
                disabled={isLoading}

              />
              {errors.groundName && (
                <p className='text-sm text-clay-error font-medium flex items-center space-x-1'>
                  <span>⚠️</span>
                  <span>{errors.groundName}</span>
                </p>
              )}
            </div>

            {/* Shooter Name Input */}
            <div className='space-y-2'>
              <label
                htmlFor='shooterName'
                className='block text-sm font-semibold text-clay-text-primary'
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
                className={`w-full h-12 px-4 py-3 text-base border-2 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-clay-primary/20 ${
                  errors.shooterName
                    ? 'border-clay-error bg-red-50 focus:border-clay-error'
                    : 'border-clay-border bg-clay-surface-elevated focus:border-clay-primary hover:border-clay-primary/60'
                }`}
                autoComplete='name'
                disabled={isLoading}

              />
              {errors.shooterName && (
                <p className='text-sm text-clay-error font-medium flex items-center space-x-1'>
                  <span>⚠️</span>
                  <span>{errors.shooterName}</span>
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col-reverse sm:flex-row sm:justify-end space-y-3 space-y-reverse sm:space-y-0 sm:space-x-3 pt-4'>
              <Button
                type='button'
                variant='outline'
                size='touch'
                onClick={handleClose}
                disabled={isLoading}
                className='w-full sm:w-auto border-2 border-clay-border hover:border-clay-primary/60 hover:bg-clay-surface text-clay-text-primary font-semibold'
              >
                Cancel
              </Button>
              <Button
                type='submit'
                size='touch'
                loading={isLoading}
                disabled={isLoading}
                className='w-full sm:w-auto bg-clay-primary hover:bg-clay-primary-light text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200'
              >
                {isLoading ? 'Starting Session...' : 'Start Session 🎯'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
