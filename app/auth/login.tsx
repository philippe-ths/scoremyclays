import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { color, radius, space } from '@/lib/design-system';
import {
  BodySm,
  BrandMark,
  Button,
  DisplayXl,
  Meta,
  Screen,
  TextInput,
  Typography,
} from '@/components/ui';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(msg);
      Alert.alert('Login Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={styles.content}>
        <View style={styles.hero}>
          <BrandMark variant="icon" size={56} />
          <DisplayXl style={{ marginTop: space[4] }}>Welcome Back</DisplayXl>
          <Meta style={{ marginTop: space[1] }}>Log In to Your Account</Meta>
        </View>

        <View style={styles.form}>
          {error ? (
            <View style={styles.errorBox}>
              <BodySm tone="danger">{error}</BodySm>
            </View>
          ) : null}

          <TextInput
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />

          <TextInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />

          <Button
            label={loading ? 'Logging in…' : 'Log In'}
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            onPress={handleLogin}
            style={{ marginTop: space[2] }}
          />
        </View>

        <View style={styles.footer}>
          <Typography variant="bodySm" tone="muted">
            Don't have an account?{' '}
          </Typography>
          <Pressable onPress={() => router.push('/auth/signup')} disabled={loading} hitSlop={8}>
            <Typography variant="bodySm" tone="primary" weight="600">
              Sign Up
            </Typography>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: space[5],
    paddingVertical: space[8],
    justifyContent: 'space-between',
  },
  hero: {
    alignItems: 'flex-start',
    marginBottom: space[8],
  },
  form: {
    gap: space[4],
  },
  errorBox: {
    backgroundColor: color.missBg,
    borderRadius: radius.md,
    padding: space[3],
    borderLeftWidth: 4,
    borderLeftColor: color.miss,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
