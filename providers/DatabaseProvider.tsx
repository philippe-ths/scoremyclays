import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { View, Text } from 'react-native';
import { PowerSyncContext } from '@powersync/react';
import { db } from '@/db/openDatabase';
import { SupabaseConnector } from '@/lib/powersync-connector';
import { supabase } from '@/lib/supabase';

interface DatabaseContextValue {
  isReady: boolean;
}

const DatabaseContext = createContext<DatabaseContextValue>({
  isReady: false,
});

const connector = new SupabaseConnector();

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let initComplete = false;

    // Listen for auth changes to connect/disconnect sync.
    // INITIAL_SESSION fires synchronously before db.init() finishes,
    // so we store the session and connect after init completes.
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
        if (session) {
          connector.currentSession = session;
          if (initComplete && !db.connected) {
            db.connect(connector).catch(err => console.error('[DB] Connect error:', err));
          }
        }
      } else if (event === 'SIGNED_OUT') {
        connector.currentSession = null;
        await db.disconnect();
      }
    });

    (async () => {
      try {
        await db.init();
        initComplete = true;
        if (mounted) setIsReady(true);

        // Connect now if INITIAL_SESSION already provided a session
        if (connector.currentSession && !db.connected) {
          db.connect(connector).catch(err => console.error('[DB] Connect error:', err));
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error('Database initialization error:', errorMessage);
        if (mounted) setError(errorMessage);
      }
    })();

    return () => {
      mounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, []);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: 'red', marginBottom: 10 }}>Database Error</Text>
        <Text style={{ color: '#666' }}>{error}</Text>
      </View>
    );
  }

  return (
    <DatabaseContext.Provider value={{ isReady }}>
      <PowerSyncContext.Provider value={db}>
        {children}
      </PowerSyncContext.Provider>
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  return useContext(DatabaseContext);
}
