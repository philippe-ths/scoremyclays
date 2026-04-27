import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import { color, space, radius, fontSize, fontWeight, shadow } from '@/lib/design-system';
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
    left: space[4],
    right: space[4],
    bottom: space[4],
    padding: space[4],
    borderRadius: radius.lg,
    backgroundColor: color.bgElevated,
    borderWidth: 1,
    borderColor: color.border1,
    ...shadow.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[4],
    zIndex: 1000,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: color.fg1,
    marginBottom: space[1],
  },
  body: {
    fontSize: fontSize.sm,
    color: color.fg2,
    lineHeight: 20,
  },
  dismiss: {
    paddingHorizontal: space[4],
    paddingVertical: space[2],
    borderRadius: radius.md,
    backgroundColor: color.bgSunken,
  },
  dismissText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: color.fg1,
  },
});
