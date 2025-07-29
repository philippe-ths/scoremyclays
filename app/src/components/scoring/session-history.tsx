'use client';

import React, { useEffect, useState } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { formatDate, getRelativeTime, groupSessionsByGround } from '@/lib/utils';
import type { Session } from '@/types';

export function SessionHistory() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const storedSessions = localStorage.getItem('scoring_sessions');
        if (storedSessions) {
          const parsed = JSON.parse(storedSessions) as Session[];
          setSessions(parsed);
        }
      } catch {
        // Handle error silently in production
      } finally {
        setIsLoading(false);
      }
    };

    void loadSessions(); // Properly handle the promise
  }, []);

  // Currently unused but may be needed later for grouped display
  const _groupedSessions = groupSessionsByGround(sessions);

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <h2 className='text-xl font-semibold'>Session History</h2>
        <div className='space-y-3'>
          {[1, 2, 3].map(i => (
            <Card key={i} className='animate-pulse'>
              <CardContent className='p-4'>
                <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
                <div className='h-3 bg-gray-200 rounded w-1/2'></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className='text-center py-12'>
        <div className='mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
          <svg
            className='w-12 h-12 text-gray-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
            />
          </svg>
        </div>
        <h3 className='text-lg font-medium text-gray-900 mb-2'>
          No sessions yet
        </h3>
        <p className='text-gray-500 mb-4'>
          Start your first scoring session to see it here
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-semibold text-clay-primary'>
        Session History
      </h2>
      <div className='space-y-3'>
        {sessions.map(session => {
          // Calculate hits and misses from session data
          const totalHits = session.totalScore || 0;
          const totalShots = session.totalTargets || 0;
          const totalMisses = totalShots - totalHits;
          const percentage =
            totalShots > 0 ? Math.round((totalHits / totalShots) * 100) : 0;

          return (
            <Card key={session.id} className='card-primary'>
              <CardContent className='p-4'>
                <div className='flex justify-between text-sm text-clay-text-secondary'>
                  <span>{formatDate(session.date)}</span>
                  <span>{getRelativeTime(session.date)}</span>
                </div>
                <div className='mt-2 text-clay-text-primary'>
                  <span className='font-bold'>{totalHits}</span> hits,{' '}
                  <span className='font-bold'>{totalMisses}</span> misses
                  <span className='ml-2 text-clay-accent'>({percentage}%)</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
