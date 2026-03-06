import { createContext, useContext, type ReactNode } from 'react';

interface DatabaseContextValue {
  isReady: boolean;
}

const DatabaseContext = createContext<DatabaseContextValue>({
  isReady: false,
});

export function DatabaseProvider({ children }: { children: ReactNode }) {
  // TODO: Initialize PowerSync database with AppSchema
  const value: DatabaseContextValue = {
    isReady: false,
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  return useContext(DatabaseContext);
}
