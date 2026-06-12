import {
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { color, radius, shadow, space } from '@/lib/design-system';

export interface CardProps {
  children: React.ReactNode;
  padded?: boolean;
  flat?: boolean;
  onPress?: PressableProps['onPress'];
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export function Card({
  children,
  padded = true,
  flat = false,
  onPress,
  style,
  accessibilityLabel,
}: CardProps) {
  const combined: StyleProp<ViewStyle> = [
    styles.base,
    !flat && shadow.sm,
    padded ? styles.padded : null,
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={({ pressed }) => [
          combined,
          pressed ? { transform: [{ scale: 0.99 }] } : null,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={combined}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: color.bgElevated,
    borderWidth: 1,
    borderColor: color.border1,
    borderRadius: radius.lg,
  },
  padded: {
    padding: space[5],
  },
});
