import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { usePowerSync } from '@powersync/react';
import * as Crypto from 'expo-crypto';
import { useAuth } from '@/providers/AuthProvider';
import { createRound } from '@/db/queries/rounds';
import { createSquad, addShooterEntry } from '@/db/queries/squads';
import { Colors, Spacing, FontSize, BorderRadius } from '@/lib/constants';

const TARGET_OPTIONS = [25, 50, 75, 100];

export default function NewRoundScreen() {
  const router = useRouter();
  const db = usePowerSync();
  const { user } = useAuth();
  const [groundName, setGroundName] = useState('');
  const [totalTargets, setTotalTargets] = useState(50);
  const [isCreating, setIsCreating] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  async function handleCreate() {
    if (!user) return;
    const trimmed = groundName.trim();
    if (!trimmed) {
      Alert.alert('Ground name required', 'Please enter the name of the shooting ground.');
      return;
    }

    setIsCreating(true);
    try {
      const roundId = Crypto.randomUUID();
      const squadId = Crypto.randomUUID();
      const shooterEntryId = Crypto.randomUUID();

      await createRound(db, {
        id: roundId,
        created_by: user.id,
        ground_name: trimmed,
        date: today,
        total_targets: totalTargets,
      });

      await createSquad(db, { id: squadId, round_id: roundId });

      await addShooterEntry(db, {
        id: shooterEntryId,
        squad_id: squadId,
        user_id: user.id,
        shooter_name: user.display_name,
        position_in_squad: 1,
      });

      setGroundName('');
      router.push(`/round/${roundId}/setup`);
    } catch (e) {
      Alert.alert('Error', 'Failed to create round. Please try again.');
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.label}>Shooting Ground</Text>
      <TextInput
        style={styles.input}
        value={groundName}
        onChangeText={setGroundName}
        placeholder="e.g. West London Shooting School"
        placeholderTextColor={Colors.textMuted}
        autoCapitalize="words"
        returnKeyType="done"
      />

      <Text style={styles.label}>Date</Text>
      <View style={styles.dateBox}>
        <Text style={styles.dateText}>{today}</Text>
      </View>

      <Text style={styles.label}>Total Targets</Text>
      <View style={styles.targetRow}>
        {TARGET_OPTIONS.map((n) => (
          <TouchableOpacity
            key={n}
            style={[styles.targetBtn, totalTargets === n && styles.targetBtnActive]}
            onPress={() => setTotalTargets(n)}
          >
            <Text style={[styles.targetBtnText, totalTargets === n && styles.targetBtnTextActive]}>
              {n}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.createBtn, isCreating && styles.createBtnDisabled]}
        onPress={handleCreate}
        disabled={isCreating}
      >
        <Text style={styles.createBtnText}>{isCreating ? 'Creating...' : 'Create Round'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  container: {
    padding: Spacing.lg,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    marginTop: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    backgroundColor: Colors.bgSecondary,
  },
  dateBox: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    backgroundColor: Colors.bgTertiary,
  },
  dateText: {
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  targetRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  targetBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    backgroundColor: Colors.bgSecondary,
  },
  targetBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  targetBtnText: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  targetBtnTextActive: {
    color: '#FFFFFF',
  },
  createBtn: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  createBtnDisabled: {
    opacity: 0.6,
  },
  createBtnText: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
