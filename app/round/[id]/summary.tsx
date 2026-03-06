import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function RoundSummaryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Round Summary</Text>
      <Text style={styles.subtitle}>Final scores and details</Text>
      <Text style={styles.id}>Round: {id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    color: '#6B7280',
  },
  id: {
    fontSize: 12,
    marginTop: 16,
    color: '#9CA3AF',
    fontFamily: 'monospace',
  },
});
