import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { usePowerSync } from '@powersync/react';
import * as Crypto from 'expo-crypto';
import type { User } from '@/lib/types';
import { useDatabase } from './DatabaseProvider';

interface AuthContextValue {
  user: User | null;
  isGuest: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isGuest: true,
  isLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isReady } = useDatabase();
  const db = usePowerSync();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isReady) return;

    (async () => {
      // Check for existing guest user
      const existing = await db.getOptional<User>('SELECT * FROM users LIMIT 1');
      if (existing) {
        setUser(existing);
      } else {
        // Create guest user
        const id = Crypto.randomUUID();
        const now = new Date().toISOString();
        await db.execute(
          'INSERT INTO users (id, display_name, email, created_at) VALUES (?, ?, ?, ?)',
          [id, 'Guest', null, now],
        );
        setUser({ id, display_name: 'Guest', email: null, created_at: now });
      }
      setIsLoading(false);
    })();
  }, [isReady]);

  return (
    <AuthContext.Provider value={{ user, isGuest: true, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
