import { StyleSheet, Text, View } from 'react-native';

export default function NewRoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Round</Text>
      <Text style={styles.subtitle}>Create a new shooting round</Text>
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
});
