import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { usePowerSync } from '@powersync/react';
import { connector } from '@/providers/DatabaseProvider';

type SyncStatus = 'offline' | 'syncing' | 'synced';

interface SyncContextValue {
  status: SyncStatus;
  lastSyncedAt: Date | null;
  error: Error | null;
  clearError: () => void;
}

const SyncContext = createContext<SyncContextValue>({
  status: 'offline',
  lastSyncedAt: null,
  error: null,
  clearError: () => {},
});

export function SyncProvider({ children }: { children: ReactNode }) {
  const db = usePowerSync();
  const [status, setStatus] = useState<SyncStatus>('offline');
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Listen for upload errors explicitly from our connector
    const removeListener = connector.addErrorListener((err) => {
      setError(err);
    });

    return () => {
      removeListener();
    };
  }, []);

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
      
      // Also potentially surface connection/download errors
      const flowError = s?.dataFlowStatus?.downloadError ?? s?.dataFlowStatus?.uploadError;
      if (flowError && !error) {
        setError(flowError);
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
  }, [db, error]);

  const value: SyncContextValue = {
    status,
    lastSyncedAt,
    error,
    clearError: () => setError(null),
  };

  return (
    <SyncContext.Provider value={value}>
      {children}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>Sync Error: {error.message}</Text>
          <TouchableOpacity onPress={() => setError(null)}>
            <Text style={styles.dismissText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}
    </SyncContext.Provider>
  );
}

const styles = StyleSheet.create({
  errorBanner: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#ffebee',
    borderWidth: 1,
    borderColor: '#ef5350',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorText: {
    color: '#c62828',
    flex: 1,
    fontSize: 14,
    marginRight: 10,
  },
  dismissText: {
    color: '#d32f2f',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export function useSync() {
  return useContext(SyncContext);
}
