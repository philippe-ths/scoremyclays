import { createContext, useContext, type ReactNode } from 'react';

type SyncStatus = 'offline' | 'syncing' | 'synced';

interface SyncContextValue {
  status: SyncStatus;
}

const SyncContext = createContext<SyncContextValue>({
  status: 'offline',
});

export function SyncProvider({ children }: { children: ReactNode }) {
  // TODO: Wire up PowerSync sync status
  const value: SyncContextValue = {
    status: 'offline',
  };

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
}

export function useSync() {
  return useContext(SyncContext);
}
