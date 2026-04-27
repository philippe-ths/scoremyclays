import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { color, space } from '@/lib/design-system';
import { BodySm } from '@/components/ui';

interface LoadingPlaceholderProps {
  message?: string;
}

export default function LoadingPlaceholder({ message = 'Loading…' }: LoadingPlaceholderProps) {
  return (
    <View style={styles.centered}>
      <ActivityIndicator size="small" color={color.primary} />
      <BodySm tone="muted" style={{ marginTop: space[3] }}>
        {message}
      </BodySm>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.bg,
  },
});
