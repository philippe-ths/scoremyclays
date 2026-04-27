import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DatabaseProvider, useDatabase } from '@/providers/DatabaseProvider';
import { AuthProvider, useAuth } from '@/providers/AuthProvider';
import { SyncProvider } from '@/providers/SyncProvider';
import IOSInstallPrompt from '@/components/IOSInstallPrompt';
import { registerServiceWorker } from '@/lib/registerServiceWorker';
import { breadcrumb, installGlobalHandlers } from '@/lib/crashLog';
import {
  color,
  space,
  useDesignSystemFonts,
} from '@/lib/design-system';
import { Button, H1, BodySm } from '@/components/ui';

installGlobalHandlers();
breadcrumb('app.boot');
registerServiceWorker();

export function ErrorBoundary({ error, retry }: { error: Error; retry: () => void }) {
  const errorMessage = error instanceof Error ? error.message : String(error);

  return (
    <View style={styles.errorContainer}>
      <H1 align="center">Something went wrong</H1>
      <BodySm tone="danger" align="center" style={styles.errorMessage}>
        {errorMessage}
      </BodySm>
      <Button label="Try again" onPress={retry} />
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
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={color.primary} />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/signup" />
        <Stack.Screen name="auth/profile-setup" />
        <Stack.Screen name="clubs/[id]/index" />
        <Stack.Screen name="round/[id]/setup" />
        <Stack.Screen name="round/[id]/waiting" />
        <Stack.Screen name="round/[id]/score" />
        <Stack.Screen name="round/[id]/conflicts" />
        <Stack.Screen name="round/[id]/summary" />
        <Stack.Screen name="profile/edit" />
        <Stack.Screen name="invites/index" />
      </Stack>
      <IOSInstallPrompt />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const fontsLoaded = useDesignSystemFonts();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <DatabaseProvider>
        <AuthProvider>
          <SyncProvider>
            <AppContent />
          </SyncProvider>
        </AuthProvider>
      </DatabaseProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: space[6],
    gap: space[4],
    backgroundColor: color.bg,
  },
  errorMessage: {
    marginBottom: space[3],
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.bg,
  },
});
