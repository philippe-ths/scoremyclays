import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator, View, useColorScheme } from 'react-native';
import { DatabaseProvider, useDatabase } from '@/providers/DatabaseProvider';
import { AuthProvider, useAuth } from '@/providers/AuthProvider';

export { ErrorBoundary } from 'expo-router';

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
        <Stack.Screen name="round/[id]/score" options={{ title: 'Scoring', headerShown: true }} />
        <Stack.Screen name="round/[id]/summary" options={{ title: 'Summary', headerShown: true }} />
        <Stack.Screen name="profile/edit" options={{ title: 'Edit Profile', headerShown: true }} />
        <Stack.Screen name="invites/index" options={{ title: 'Invites', headerShown: true }} />
      </Stack>
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
        <AppContent />
      </AuthProvider>
    </DatabaseProvider>
  );
}
