'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

// Define proper PowerSync database interface instead of using any
interface PowerSyncDatabase {
  // This would be replaced with actual PowerSync SDK types
  isConnected: boolean;
  execute: (query: string) => Promise<unknown>;
}

interface PowerSyncContextType {
  db: PowerSyncDatabase | null;
  isConnected: boolean;
  isInitialized: boolean;
  error: string | null;
}

const PowerSyncContext = createContext<PowerSyncContextType>({
  db: null,
  isConnected: false,
  isInitialized: false,
  error: null,
});

export function PowerSyncProvider({ children }: { children: React.ReactNode }) {
  const [db] = useState<PowerSyncDatabase | null>(null); // Removed unused setDb
  const [isConnected, setIsConnected] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializePowerSync = async () => {
      try {
        // Get environment variables
        const powerSyncUrl = process.env.NEXT_PUBLIC_POWERSYNC_URL;
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!powerSyncUrl || !supabaseUrl || !supabaseAnonKey) {
          // Development-only logging
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.info(
              'PowerSync not configured - running in offline-only mode'
            );
          }
          setIsInitialized(true);
          return;
        }

        // For MVP, we'll initialize PowerSync when needed
        // In a full implementation, this would use the proper PowerSync SDK
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.info(
            'PowerSync configuration available, ready for initialization'
          );
        }
        setIsConnected(false); // Start in offline mode
        setIsInitialized(true);

        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.info('PowerSync context initialized successfully');
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        setIsInitialized(true);
      }
    };

    void initializePowerSync(); // Properly handle the promise
  }, []);

  const value: PowerSyncContextType = {
    db,
    isConnected,
    isInitialized,
    error,
  };

  return (
    <PowerSyncContext.Provider value={value}>
      {children}
    </PowerSyncContext.Provider>
  );
}

export const usePowerSync = () => {
  const context = useContext(PowerSyncContext);
  if (!context) {
    throw new Error('usePowerSync must be used within a PowerSyncProvider');
  }
  return context;
};
