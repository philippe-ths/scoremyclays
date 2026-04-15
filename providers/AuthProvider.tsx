import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { usePowerSync } from '@powersync/react';
import type { User } from '@/lib/types';
import { useDatabase } from './DatabaseProvider';
import { supabase } from '@/lib/supabase';
import type { AuthSession } from '@supabase/supabase-js';
import { breadcrumb } from '@/lib/crashLog';

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
  // Track current user ID in a ref so the auth callback can access it without stale closure
  const userIdRef = useRef<string | null>(null);

  // Keep userIdRef in sync with user state
  useEffect(() => {
    userIdRef.current = user?.id ?? null;
  }, [user]);

  // Initialize auth state and listen to changes
  useEffect(() => {
    if (!isReady) {
      return;
    }
    if (!db) {
      return;
    }

    let mounted = true;

    // Set up auth state listener — also fires INITIAL_SESSION for the current session
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;
      breadcrumb('auth.state', { event, hasSession: !!newSession, uid: newSession?.user?.id });
      setSession(newSession);

      if (newSession?.user && event !== 'SIGNED_OUT') {
        // SIGNED_IN and TOKEN_REFRESHED fire on visibility change — skip re-sync if user is already loaded
        // to avoid transient loading states that unmount the router and reset navigation
        if ((event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') && userIdRef.current === newSession.user.id) {
          return;
        }
        // Keep the router from acting while we resolve the user record
        setIsLoading(true);
        await syncUserWithDatabase(newSession.user.id, newSession.user.email || null);
        if (mounted) setIsLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }

      // Mark loading done after initial session event (handles no-session case)
      if (event === 'INITIAL_SESSION') {
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, [isReady]);

  /**
   * Sync Supabase auth user with local database User table.
   * If PowerSync has already synced the profile, use it.
   * Otherwise query Supabase directly (user just authenticated, so network is available).
   * Only create a blank record if no remote profile exists (true first-time user).
   */
  async function syncUserWithDatabase(userId: string, email: string | null) {
    if (!db) {
      console.warn('Database not available, skipping user sync');
      return;
    }
    
    try {
      // Check if user exists in local database (may have been synced by PowerSync)
      const existing = await db.getOptional<User>(
        'SELECT * FROM users WHERE id = ?',
        [userId]
      );

      if (existing) {
        setUser(existing);
        return;
      }

      // Not found locally — check Supabase for an existing profile.
      // The user just authenticated so network should be available.
      let remoteUser: User | null = null;
      try {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();
        if (data) {
          remoteUser = data as User;
        }
      } catch {
        // Network or query error — fall through to blank record creation
      }

      if (remoteUser) {
        // Profile exists on Supabase — insert it locally so the router
        // sees the real profile state immediately.
        await db.execute(
          `INSERT INTO users (id, display_name, email, user_id, discoverable, favourite_club_ids, gear, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            remoteUser.id,
            remoteUser.display_name,
            remoteUser.email,
            remoteUser.user_id,
            remoteUser.discoverable,
            remoteUser.favourite_club_ids,
            remoteUser.gear,
            remoteUser.created_at,
            remoteUser.updated_at,
          ]
        );
        setUser(remoteUser);
        return;
      }

      // No remote profile — true first-time user. Create a blank record.
      const now = new Date().toISOString();
      const newUser: User = {
        id: userId,
        display_name: '',
        email,
        user_id: null,
        discoverable: 0,
        favourite_club_ids: '[]',
        gear: '[]',
        created_at: now,
        updated_at: now,
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

  // Watch for PowerSync changes to the user record.
  // Handles the case where PowerSync syncs the real profile after initial load.
  const watchedUserId = useRef<string | null>(null);
  useEffect(() => {
    if (!db || !user?.id) return;
    // Avoid re-subscribing for the same user
    if (watchedUserId.current === user.id) return;
    watchedUserId.current = user.id;

    const abort = new AbortController();
    const userId = user.id;

    db.watch(
      'SELECT * FROM users WHERE id = ?',
      [userId],
      {
        onResult(results) {
          const updated = results.rows?._array?.[0];
          if (updated) {
            setUser(updated as User);
          }
        },
      },
      { signal: abort.signal }
    );

    return () => {
      watchedUserId.current = null;
      abort.abort();
    };
  }, [db, user?.id]);

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
