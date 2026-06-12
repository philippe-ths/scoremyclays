import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { color, radius, space } from '@/lib/design-system';
import {
  BodySm,
  Button,
  DisplayXl,
  H1,
  Meta,
  Screen,
  TextInput,
  Typography,
} from '@/components/ui';

export default function SignupScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const validateForm = (): boolean => {
    if (!email.trim()) {
      setError('Email is required.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (!password.trim()) {
      setError('Password is required.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;
    setError(null);
    setLoading(true);
    try {
      await signUp(email, password);
      setSignupSuccess(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Sign up failed. Please try again.';
      setError(msg);
      Alert.alert('Sign Up Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll}>
        {signupSuccess ? (
          <>
            <View style={styles.header}>
              <H1>Check Your Email</H1>
              <Meta style={{ marginTop: space[2] }}>
                We've sent a confirmation link to{' '}
                <Typography weight="600">{email}</Typography>
              </Meta>
            </View>
            <View style={styles.infoBox}>
              <BodySm tone="muted">
                Click the link in the email to verify your account, then come back here to log in.
              </BodySm>
            </View>
            <Button
              label="Go to Login"
              variant="primary"
              size="lg"
              fullWidth
              onPress={() => router.replace('/auth/login')}
              style={{ marginTop: space[6] }}
            />
          </>
        ) : (
          <>
            <View style={styles.header}>
              <DisplayXl>Create Account</DisplayXl>
              <Meta style={{ marginTop: space[1] }}>Join ScoreMyClays to Get Started</Meta>
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
                placeholder="At least 6 characters"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
              <TextInput
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!loading}
              />

              <View style={styles.infoBox}>
                <BodySm tone="muted">
                  You'll be able to verify your email after creating your account.
                </BodySm>
              </View>

              <Button
                label={loading ? 'Creating…' : 'Create Account'}
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                onPress={handleSignup}
                style={{ marginTop: space[2] }}
              />
            </View>

            <View style={styles.footer}>
              <BodySm tone="muted">Already have an account? </BodySm>
              <Pressable
                onPress={() => router.push('/auth/login')}
                disabled={loading}
                hitSlop={8}
              >
                <Typography variant="bodySm" tone="primary" weight="600">
                  Log In
                </Typography>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: space[5],
    paddingVertical: space[8],
    gap: space[4],
  },
  header: {
    marginBottom: space[6],
  },
  form: {
    gap: space[4],
    marginBottom: space[6],
  },
  errorBox: {
    backgroundColor: color.missBg,
    borderRadius: radius.md,
    padding: space[3],
    borderLeftWidth: 4,
    borderLeftColor: color.miss,
  },
  infoBox: {
    backgroundColor: '#e8f0f7',
    borderRadius: radius.md,
    padding: space[3],
    borderLeftWidth: 4,
    borderLeftColor: color.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: space[4],
  },
});
