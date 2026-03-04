import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { usePowerSync } from '@powersync/react';

type SyncStatus = 'offline' | 'syncing' | 'synced';

interface SyncContextValue {
  status: SyncStatus;
  lastSyncedAt: Date | null;
}

const SyncContext = createContext<SyncContextValue>({
  status: 'offline',
  lastSyncedAt: null,
});

export function SyncProvider({ children }: { children: ReactNode }) {
  const db = usePowerSync();
  const [status, setStatus] = useState<SyncStatus>('offline');
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  useEffect(() => {
    if (!db) return;

    const updateStatus = () => {
      const s = db.currentStatus;
      if (!s?.connected) {
        setStatus('offline');
      } else if (s.dataFlowStatus?.downloading || s.dataFlowStatus?.uploading) {
        setStatus('syncing');
      } else {
        setStatus('synced');
        setLastSyncedAt(s.lastSyncedAt ?? null);
      }
    };

    // Check initial status
    updateStatus();

    // Listen for status changes
    const dispose = db.registerListener({
      statusChanged: updateStatus,
    });

    return () => {
      dispose?.();
    };
  }, [db]);

  const value: SyncContextValue = {
    status,
    lastSyncedAt,
  };

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
}

export function useSync() {
  return useContext(SyncContext);
}
