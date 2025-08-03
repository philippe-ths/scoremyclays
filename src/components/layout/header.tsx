'use client';

import { usePowerSync } from '@/context/powersync-context';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  className?: string;
}

export function Header({
  title = 'ScoreMyClays',
  showBackButton = false,
  onBack,
  className,
}: HeaderProps) {
  const { isConnected, error } = usePowerSync();

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-top',
        className
      )}
    >
      <div className='container flex h-16 items-center justify-between px-4'>
        <div className='flex items-center space-x-4'>
          {showBackButton && (
            <button
              onClick={onBack}
              className='flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent'
              aria-label='Go back'
            >
              <svg
                className='h-5 w-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 19l-7-7 7-7'
                />
              </svg>
            </button>
          )}
          <h1 className='text-xl font-semibold text-foreground'>{title}</h1>
        </div>

        {/* Sync Status Indicator */}
        <div className='flex items-center space-x-2'>
          <div className='flex items-center space-x-1'>
            <div
              className={cn(
                'h-2 w-2 rounded-full',
                isConnected
                  ? 'bg-green-500'
                  : error
                    ? 'bg-red-500'
                    : 'bg-yellow-500'
              )}
            />
            <span className='text-xs text-muted-foreground hidden sm:inline'>
              {isConnected ? 'Online' : error ? 'Error' : 'Offline'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
