import React from 'react';
import { Button } from '@/components/ui/button';

interface PositionSetupProps {
  currentPosition: number;
  sessionInfo: { groundName: string; shooterName: string };
  onPositionSetup: (name: string) => void;
}

export function PositionSetup({
  currentPosition,
  sessionInfo,
  onPositionSetup,
}: PositionSetupProps) {
  const [positionName, setPositionName] = React.useState('');

  const handleSetup = () => {
    if (positionName.trim()) {
      onPositionSetup(positionName.trim());
      setPositionName('');
    }
  };

  return (
    <div className='p-4 space-y-6'>
      {/* Position Counter */}
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-bold text-clay-text-primary'>
          Position {currentPosition} of 10
        </h2>
        <div className='flex items-center space-x-2'>
          <span className='text-sm text-clay-text-secondary'>
            {sessionInfo.groundName} - {sessionInfo.shooterName}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className='w-full bg-clay-border rounded-full h-2.5'>
        <div
          className='bg-clay-primary h-2.5 rounded-full'
          style={{ width: `${(currentPosition / 10) * 100}%` }}
        />
      </div>

      {/* Position Name Input */}
      <div className='space-y-2'>
        <label
          htmlFor='positionName'
          className='block text-sm font-semibold text-clay-text-primary'
        >
          Position Name
        </label>
        <input
          id='positionName'
          type='text'
          value={positionName}
          onChange={e => setPositionName(e.target.value)}
          placeholder='Enter position name'
          className='w-full h-12 px-4 py-3 text-base border-2 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-clay-primary/20 border-clay-border bg-clay-surface-elevated focus:border-clay-primary hover:border-clay-primary/60'
        />
      </div>

      {/* Start Position Button */}
      <Button
        onClick={handleSetup}
        size='touch-lg'
        className='w-full bg-clay-primary hover:bg-clay-primary-light text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200'
      >
        Start Position {currentPosition}
      </Button>
    </div>
  );
}
