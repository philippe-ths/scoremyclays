import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { PowerSyncDatabase } from '@powersync/react-native';
import { PowerSyncContext } from '@powersync/react';
import { AppSchema } from '@/db/schema';

interface DatabaseContextValue {
  isReady: boolean;
}

const DatabaseContext = createContext<DatabaseContextValue>({
  isReady: false,
});

const db = new PowerSyncDatabase({
  schema: AppSchema,
  database: { dbFilename: 'scoremyclays.db' },
});

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    db.init().then(() => setIsReady(true));
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
