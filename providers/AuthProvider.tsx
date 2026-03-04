import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { usePowerSync } from '@powersync/react';
import * as Crypto from 'expo-crypto';
import type { User } from '@/lib/types';
import { useDatabase } from './DatabaseProvider';
import { supabase } from '@/lib/supabase';
import type { AuthSession } from '@supabase/supabase-js';

export interface AuthContextValue {
  user: User | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  profileComplete: boolean; // true if user_id is set
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  profileComplete: false,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isReady } = useDatabase();
  const db = usePowerSync();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state and listen to changes
  useEffect(() => {
    if (!isReady) return;

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
        console.error('Error fetching session:', error);
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
   * Sync Supabase auth user with local database User table
   * Creates a local User record if it doesn't exist
   */
  async function syncUserWithDatabase(userId: string, email: string | null) {
    try {
      // Check if user exists in local database
      const existing = await db.getOptional<User>(
        'SELECT * FROM users WHERE id = ?',
        [userId]
      );

      if (existing) {
        setUser(existing);
      } else {
        // Create new user record
        const now = new Date().toISOString();
        const newUser: User = {
          id: userId,
          display_name: '',
          email,
          user_id: null, // Will be set during profile setup
          discoverable: 0, // Default to private
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
      }
    } catch (error) {
      console.error('Error syncing user with database:', error);
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      // Auth state listener will handle the rest
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // Auth state listener will handle the rest
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const value: AuthContextValue = {
    user,
    session,
    isLoading,
    isAuthenticated: !!session,
    profileComplete: !!user?.user_id,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
