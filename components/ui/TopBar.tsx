import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color, fontFamily, fontSize, space } from '@/lib/design-system';
import { Typography } from './Typography';

export interface TopBarProps {
  title: string;
  onBack?: () => void;
  action?: { label: string; onPress: () => void; disabled?: boolean };
  right?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function TopBar({ title, onBack, action, right, style }: TopBarProps) {
  return (
    <View style={[styles.bar, style]}>
      {onBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={onBack}
          hitSlop={12}
          style={styles.back}
        >
          <Ionicons name="chevron-back" size={24} color={color.fg1} />
        </Pressable>
      ) : null}
      <Typography
        style={{
          flex: 1,
          fontFamily: fontFamily.display,
          fontSize: 22,
          color: color.fg1,
          letterSpacing: -0.2,
        }}
        numberOfLines={1}
      >
        {title}
      </Typography>
      {action ? (
        <Pressable
          accessibilityRole="button"
          onPress={action.onPress}
          disabled={action.disabled}
          hitSlop={8}
        >
          <Typography
            style={{
              fontFamily: fontFamily.bodySemibold,
              fontSize: fontSize.sm,
              color: action.disabled ? color.fg4 : color.primary,
            }}
          >
            {action.label}
          </Typography>
        </Pressable>
      ) : null}
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    minHeight: 56,
    paddingHorizontal: space[5],
    paddingVertical: space[3] + 2,
    backgroundColor: color.bg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.border1,
  },
  back: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
