import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import { BorderRadius, Colors, FontSize, Spacing } from '@/lib/constants';
import { shouldShowIOSInstallPrompt } from '@/lib/iosInstallPrompt';

const DISMISS_KEY = 'smc.iosInstallPrompt.dismissed';

export default function IOSInstallPrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const nav = window.navigator as Navigator & { standalone?: boolean };
    const isStandalone =
      nav.standalone === true ||
      window.matchMedia?.('(display-mode: standalone)').matches === true;

    const dismissed = window.localStorage?.getItem(DISMISS_KEY) === '1';

    setVisible(
      shouldShowIOSInstallPrompt({
        userAgent: nav.userAgent,
        isStandalone,
        dismissed,
      })
    );
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    try {
      window.localStorage?.setItem(DISMISS_KEY, '1');
    } catch {
      // localStorage may be unavailable (private mode); dismissal is best-effort.
    }
    setVisible(false);
  };

  return (
    <View style={styles.banner} accessibilityRole="alert">
      <View style={styles.textBlock}>
        <Text style={styles.title}>Install ScoreMyClays</Text>
        <Text style={styles.body}>
          Tap the Share icon, then "Add to Home Screen" to use ScoreMyClays like a native app — including offline during a round.
        </Text>
      </View>
      <TouchableOpacity style={styles.dismiss} onPress={dismiss} accessibilityLabel="Dismiss install prompt">
        <Text style={styles.dismissText}>Dismiss</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    left: Spacing.md,
    right: Spacing.md,
    bottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.bgPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    zIndex: 1000,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.base,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  body: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  dismiss: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.bgTertiary,
  },
  dismissText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});
