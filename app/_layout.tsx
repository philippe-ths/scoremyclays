import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { DatabaseProvider, useDatabase } from '@/providers/DatabaseProvider';
import { AuthProvider, useAuth } from '@/providers/AuthProvider';
import { SyncProvider } from '@/providers/SyncProvider';
import IOSInstallPrompt from '@/components/IOSInstallPrompt';
import { registerServiceWorker } from '@/lib/registerServiceWorker';
import { breadcrumb, installGlobalHandlers } from '@/lib/crashLog';

installGlobalHandlers();
breadcrumb('app.boot');
registerServiceWorker();

export function ErrorBoundary({ error, retry }: { error: Error; retry: () => void }) {
  const errorMessage = error instanceof Error ? error.message : String(error);

  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.errorMessage}>{errorMessage}</Text>
      <TouchableOpacity style={styles.errorButton} onPress={retry}>
        <Text style={styles.errorButtonText}>Try again</Text>
      </TouchableOpacity>
    </View>
  );
}

SplashScreen.preventAutoHideAsync();

/**
 * Redirect users based on auth state:
 * - Not authenticated → /auth/login
 * - Authenticated but no profile → /auth/profile-setup
 * - Authenticated with profile + on auth screen → /
 */
function useProtectedRoute() {
  const { isAuthenticated, profileComplete, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/auth/login');
    } else if (isAuthenticated && !profileComplete && segments.join('/') !== 'auth/profile-setup') {
      router.replace('/auth/profile-setup');
    } else if (isAuthenticated && profileComplete && inAuthGroup) {
      router.replace('/');
    }
  }, [isAuthenticated, profileComplete, isLoading, segments]);
}

function AppContent() {
  const colorScheme = useColorScheme();
  const { isReady } = useDatabase();
  const { isLoading } = useAuth();

  useProtectedRoute();

  if (!isReady || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
        <Stack.Screen name="auth/profile-setup" options={{ headerShown: false }} />
        <Stack.Screen name="clubs/[id]/index" options={{ title: 'Club Details', headerShown: true }} />
        <Stack.Screen name="round/[id]/setup" options={{ title: 'Round Setup', headerShown: true }} />
        <Stack.Screen name="round/[id]/waiting" options={{ title: 'Round', headerShown: true }} />
        <Stack.Screen name="round/[id]/score" options={{ title: 'Scoring', headerShown: true }} />
        <Stack.Screen name="round/[id]/conflicts" options={{ title: 'Resolve Conflicts', headerShown: true }} />
        <Stack.Screen name="round/[id]/summary" options={{ title: 'Summary', headerShown: true }} />
        <Stack.Screen name="profile/edit" options={{ title: 'Edit Profile', headerShown: true }} />
        <Stack.Screen name="invites/index" options={{ title: 'Invites', headerShown: true }} />
      </Stack>
      <IOSInstallPrompt />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({});

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <DatabaseProvider>
      <AuthProvider>
        <SyncProvider>
          <AppContent />
        </SyncProvider>
      </AuthProvider>
    </DatabaseProvider>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#0F172A',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 15,
    color: '#FCA5A5',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#2563EB',
  },
  errorButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
