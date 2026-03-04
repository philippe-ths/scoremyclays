import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { View, Text } from 'react-native';
import { PowerSyncContext } from '@powersync/react';
import { db } from '@/db/openDatabase';
import { seedClubs } from '@/db/seed-clubs';

interface DatabaseContextValue {
  isReady: boolean;
}

const DatabaseContext = createContext<DatabaseContextValue>({
  isReady: false,
});

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    db.init()
      .then(async () => {
        await seedClubs(db);
        setIsReady(true);
      })
      .catch((err) => {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error('Database initialization error:', errorMessage);
        setError(errorMessage);
      });
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
