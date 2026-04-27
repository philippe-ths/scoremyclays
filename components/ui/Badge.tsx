import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { color, fontFamily, fontSize, radius, space, tracking } from '@/lib/design-system';
import { Typography } from './Typography';

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'live';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  size?: BadgeSize;
  style?: StyleProp<ViewStyle>;
}

const TONE: Record<BadgeTone, { bg: string; fg: string }> = {
  neutral: { bg: color.bgSunken, fg: color.fg2 },
  success: { bg: color.hitBg, fg: color.hit },
  warning: { bg: color.noBirdBg, fg: color.noBird },
  danger: { bg: color.missBg, fg: color.miss },
  info: { bg: '#e8f0f7', fg: '#1e5280' },
  live: { bg: '#fde8e4', fg: color.live },
};

export function Badge({ label, tone = 'neutral', size = 'sm', style }: BadgeProps) {
  const t = TONE[tone];
  const isSm = size === 'sm';
  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: t.bg,
          paddingHorizontal: isSm ? space[2] : space[3],
          paddingVertical: isSm ? space[1] : space[2] - 2,
        },
        style,
      ]}
    >
      <Typography
        style={{
          fontFamily: fontFamily.bodySemibold,
          fontSize: isSm ? fontSize.xs : fontSize.sm,
          color: t.fg,
          letterSpacing: tracking.ui,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
  },
});
