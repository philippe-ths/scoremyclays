import {
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { color, fontFamily, fontSize, radius, space } from '@/lib/design-system';
import { Typography } from './Typography';

export interface ChipProps {
  label: string;
  active?: boolean;
  onPress?: PressableProps['onPress'];
  disabled?: boolean;
  leading?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Chip({ label, active, onPress, disabled, leading, style }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected: active, disabled }}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: active ? color.primary : color.bgElevated,
          borderColor: active ? color.primary : color.border2,
          opacity: disabled ? 0.5 : 1,
          transform: pressed ? [{ scale: 0.97 }] : undefined,
        },
        style,
      ]}
    >
      {leading}
      <Typography
        style={{
          fontFamily: fontFamily.bodyMedium,
          fontSize: fontSize.sm,
          color: active ? color.primaryFg : color.fg1,
        }}
      >
        {label}
      </Typography>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1] + 2,
    paddingHorizontal: space[4] - 2,
    paddingVertical: space[2],
    borderRadius: radius.pill,
    borderWidth: 1,
  },
});
