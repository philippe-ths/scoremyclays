import { createContext, useContext, type ReactNode } from 'react';
import type { User } from '@/lib/types';

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
  // TODO: Wire up Supabase auth + guest mode
  const value: AuthContextValue = {
    user: null,
    isGuest: true,
    isLoading: false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
