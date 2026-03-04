import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, useColorScheme } from 'react-native';
import { DatabaseProvider, useDatabase } from '@/providers/DatabaseProvider';
import { AuthProvider, useAuth } from '@/providers/AuthProvider';

// Custom error boundary to handle Symbol serialization issues
export function ErrorBoundary({ error, retry }: { error: Error; retry: () => void }) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.errorMessage}>{errorMessage}</Text>
      <Text style={styles.errorHint}>
        Try refreshing the page or check your internet connection.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: '#ff6b6b',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorHint: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const colorScheme = useColorScheme();
  const { isReady } = useDatabase();
  const { isLoading, isAuthenticated, profileComplete } = useAuth();

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
        {!isAuthenticated ? (
          // Auth Stack - shown when not logged in
          <>
            <Stack.Screen 
              name="auth/login" 
              options={{ 
                headerShown: false,
              }} 
            />
            <Stack.Screen 
              name="auth/signup" 
              options={{ 
                headerShown: false,
              }} 
            />
            <Stack.Screen 
              name="auth/profile-setup" 
              options={{ 
                headerShown: false,
              }} 
            />
          </>
        ) : !profileComplete ? (
          // Profile Setup Screen - shown when logged in but profile incomplete
          <Stack.Screen 
            name="auth/profile-setup" 
            options={{ 
              headerShown: false,
            }} 
          />
        ) : (
          // App Stack - shown when authenticated and profile complete
          <>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="clubs/[id]/index" options={{ title: 'Club Details' }} />
            <Stack.Screen name="round/[id]/setup" options={{ title: 'Round Setup' }} />
            <Stack.Screen name="round/[id]/score" options={{ title: 'Scoring' }} />
            <Stack.Screen name="round/[id]/summary" options={{ title: 'Summary' }} />
            <Stack.Screen name="profile/edit" options={{ title: 'Edit Profile' }} />
            <Stack.Screen name="invites/index" options={{ title: 'Invites' }} />
          </>
        )}
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
