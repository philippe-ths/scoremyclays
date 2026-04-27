import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { color } from '@/lib/design-system';

export interface ScreenProps {
  children: React.ReactNode;
  edges?: Edge[];
  dark?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Root wrapper for a screen. Applies the bone (or powder) background
 * and safe-area insets consistently. Use `dark` for the scoring phase.
 */
export function Screen({ children, edges = ['top', 'left', 'right'], dark, style }: ScreenProps) {
  return (
    <SafeAreaView
      edges={edges}
      style={[
        styles.root,
        { backgroundColor: dark ? color.bgDark : color.bg },
        style,
      ]}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
