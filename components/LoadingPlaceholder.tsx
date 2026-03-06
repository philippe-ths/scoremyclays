import { StyleSheet, Text, View } from 'react-native';
import { Colors, FontSize } from '@/lib/constants';

interface LoadingPlaceholderProps {
  message?: string;
}

export default function LoadingPlaceholder({ message = 'Loading...' }: LoadingPlaceholderProps) {
  return (
    <View style={styles.centered}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
  },
});
