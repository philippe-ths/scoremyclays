import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
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

  useEffect(() => {
    db.init().then(async () => {
      await seedClubs(db);
      setIsReady(true);
    });
  }, []);

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
