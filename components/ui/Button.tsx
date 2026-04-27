import { useCallback } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {
  color,
  fontFamily,
  fontSize,
  layout,
  radius,
  shadow,
  space,
  tracking,
} from '@/lib/design-system';
import { Typography } from './Typography';

// Haptics is native-only. Loading lazily + guarded so the web bundle never
// touches a missing ImpactFeedbackStyle constant at click time.
let fireLightHaptic = (): void => {};
if (Platform.OS !== 'web') {
  try {
    const Haptics = require('expo-haptics');
    fireLightHaptic = () => {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      } catch {
        /* no-op */
      }
    };
  } catch {
    /* expo-haptics unavailable — leave as no-op */
  }
}

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'accent' | 'destructive' | 'scoring-hit' | 'scoring-miss' | 'scoring-nobird';
export type ButtonSize = 'md' | 'lg' | 'scoring';

export interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  haptic?: boolean;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

interface VariantStyle {
  bg: string;
  fg: string;
  border?: string;
  pressedBg?: string;
  shadow?: ViewStyle;
}

const VARIANT: Record<ButtonVariant, VariantStyle> = {
  primary: {
    bg: color.primary,
    fg: color.primaryFg,
    pressedBg: color.primaryHover,
    shadow: shadow.sm,
  },
  secondary: {
    bg: color.bgElevated,
    fg: color.primaryHover,
    border: color.primary,
  },
  ghost: {
    bg: 'transparent',
    fg: color.fg1,
  },
  accent: {
    bg: color.accent,
    fg: color.accentFg,
    pressedBg: color.accentHover,
    shadow: shadow.sm,
  },
  destructive: {
    bg: color.miss,
    fg: '#ffffff',
  },
  'scoring-hit': {
    bg: color.hit,
    fg: '#ffffff',
  },
  'scoring-miss': {
    bg: color.miss,
    fg: '#ffffff',
  },
  'scoring-nobird': {
    bg: '#2a2f26', // powder-700
    fg: '#ffffff',
  },
};

const SIZE: Record<ButtonSize, { minHeight: number; paddingH: number; fontSize: number; radius: number; tracking: number }> = {
  md: {
    minHeight: layout.touchTarget,
    paddingH: space[5],
    fontSize: fontSize.sm,
    radius: radius.pill,
    tracking: 0,
  },
  lg: {
    minHeight: 56,
    paddingH: space[6],
    fontSize: fontSize.md,
    radius: radius.pill,
    tracking: 0,
  },
  scoring: {
    minHeight: layout.touchXl + 4,
    paddingH: space[5],
    fontSize: fontSize.md,
    radius: radius.lg,
    tracking: tracking.ui,
  },
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  fullWidth,
  loading,
  haptic = true,
  leading,
  trailing,
  style,
  disabled,
  onPress,
  ...rest
}: ButtonProps) {
  const v = VARIANT[variant];
  const s = SIZE[size];

  const handlePress = useCallback(
    (evt: Parameters<NonNullable<PressableProps['onPress']>>[0]) => {
      if (haptic) fireLightHaptic();
      onPress?.(evt);
    },
    [onPress, haptic],
  );

  const isScoring = size === 'scoring';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      disabled={disabled || loading}
      onPress={handlePress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.base,
        v.shadow,
        {
          backgroundColor: pressed && v.pressedBg ? v.pressedBg : v.bg,
          borderColor: v.border,
          borderWidth: v.border ? 1.5 : 0,
          minHeight: s.minHeight,
          paddingHorizontal: s.paddingH,
          borderRadius: s.radius,
          opacity: disabled ? 0.5 : 1,
          transform: pressed ? [{ scale: 0.97 }] : undefined,
          width: fullWidth ? '100%' : undefined,
        },
        style,
      ]}
      {...rest}
    >
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      {loading ? (
        <ActivityIndicator color={v.fg} size="small" />
      ) : (
        <Typography
          style={{
            fontFamily: isScoring ? fontFamily.bodyBold : fontFamily.bodySemibold,
            fontSize: s.fontSize,
            color: v.fg,
            letterSpacing: s.tracking,
            textTransform: isScoring ? 'uppercase' : undefined,
          }}
        >
          {label}
        </Typography>
      )}
      {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[2],
  },
  leading: { marginRight: space[1] },
  trailing: { marginLeft: space[1] },
});
