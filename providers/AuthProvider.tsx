import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { usePowerSync } from '@powersync/react';
import * as Crypto from 'expo-crypto';
import type { User } from '@/lib/types';
import { useDatabase } from './DatabaseProvider';
import { supabase } from '@/lib/supabase';
import type { AuthSession } from '@supabase/supabase-js';

export interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  profileComplete: boolean; // true if user_id is set
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  profileComplete: false,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isReady } = useDatabase();
  const db = usePowerSync();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Initialize auth state and listen to changes
  useEffect(() => {
    if (!isReady || !db) {
      console.log('Waiting for database to be ready...');
      return;
    }

    let mounted = true;

    (async () => {
      try {
        // Get current session
        const { data } = await supabase.auth.getSession();
        if (mounted) {
          setSession(data.session);
          if (data.session?.user) {
            // Fetch or create local user record
            await syncUserWithDatabase(data.session.user.id, data.session.user.email || null);
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error during session fetch';
        console.error('Error fetching session:', errorMessage);
        setAuthError(errorMessage);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    })();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (mounted) {
        setSession(newSession);
        if (newSession?.user && event !== 'SIGNED_OUT') {
          // Sync user with database on sign in/refresh
          await syncUserWithDatabase(newSession.user.id, newSession.user.email || null);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    });

    return () => {
      mounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, [isReady]);

  /**
   * Sync Supabase auth user with local database User table.
   * If the local record is missing (e.g. cache cleared), fetches profile
   * from Supabase remote before falling back to a blank record.
   */
  async function syncUserWithDatabase(userId: string, email: string | null) {
    if (!db) {
      console.warn('Database not available, skipping user sync');
      return;
    }
    
    try {
      // Check if user exists in local database
      const existing = await db.getOptional<User>(
        'SELECT * FROM users WHERE id = ?',
        [userId]
      );

      if (existing) {
        setUser(existing);
        return;
      }

      // Not found locally — try fetching from Supabase remote
      let remoteProfile: Partial<User> | null = null;
      try {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        if (data) {
          remoteProfile = data;
        }
      } catch (fetchErr) {
        console.warn('Could not fetch remote profile, creating blank record:', fetchErr);
      }

      const now = new Date().toISOString();
      const newUser: User = {
        id: userId,
        display_name: remoteProfile?.display_name || '',
        email: remoteProfile?.email ?? email,
        user_id: remoteProfile?.user_id ?? null,
        discoverable: remoteProfile?.discoverable ?? 0,
        favourite_club_ids: remoteProfile?.favourite_club_ids ?? '[]',
        gear: remoteProfile?.gear ?? '[]',
        created_at: remoteProfile?.created_at ?? now,
        updated_at: remoteProfile?.updated_at ?? now,
      };

      await db.execute(
        `INSERT INTO users (id, display_name, email, user_id, discoverable, favourite_club_ids, gear, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newUser.id,
          newUser.display_name,
          newUser.email,
          newUser.user_id,
          newUser.discoverable,
          newUser.favourite_club_ids,
          newUser.gear,
          newUser.created_at,
          newUser.updated_at,
        ]
      );

      setUser(newUser);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error syncing user';
      console.error('Error syncing user with database:', errorMessage);
      setAuthError(errorMessage);
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw new Error(error.message || 'Sign up failed');
      // Auth state listener will handle the rest
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
      console.error('Sign up error:', errorMessage);
      throw new Error(errorMessage);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw new Error(error.message || 'Sign in failed');
      // Auth state listener will handle the rest
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      console.error('Sign in error:', errorMessage);
      throw new Error(errorMessage);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message || 'Sign out failed');
      setUser(null);
      setSession(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign out failed';
      console.error('Sign out error:', errorMessage);
      throw new Error(errorMessage);
    }
  };

  const refreshUser = async () => {
    if (!user?.id || !db) return;
    try {
      const updated = await db.getOptional<User>(
        'SELECT * FROM users WHERE id = ?',
        [user.id]
      );
      if (updated) setUser(updated);
    } catch (error) {
      console.error('Error refreshing user:', error instanceof Error ? error.message : error);
    }
  };

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: !!session,
    profileComplete: !!user?.user_id,
    signUp,
    signIn,
    signOut,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
