import { useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { usePowerSync } from '@powersync/react';
import { useAuth } from '@/providers/AuthProvider';
import { smcListRounds } from '@/db/queries/smc-rounds';
import { Colors, Spacing, FontSize, BorderRadius } from '@/lib/constants';
import { RoundStatus, type Round } from '@/lib/types';

const STATUS_LABELS: Record<string, string> = {  [RoundStatus.SETUP]: 'Setup',  [RoundStatus.COMPLETED]: 'Completed',
  [RoundStatus.IN_PROGRESS]: 'In Progress',
  [RoundStatus.ABANDONED]: 'Abandoned',
};

export default function HistoryScreen() {
  const db = usePowerSync();
  const { user } = useAuth();
  const router = useRouter();
  const [rounds, setRounds] = useState<Round[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      smcListRounds(db, user.id).then(setRounds);
    }, [db, user]),
  );

  function handlePress(round: Round) {
    if (round.status === RoundStatus.IN_PROGRESS) {
      router.push(`/round/${round.id}/score`);
    } else if (round.status === RoundStatus.SETUP) {
      router.push(`/round/${round.id}/setup`);
    } else {
      router.push(`/round/${round.id}/summary`);
    }
  }

  return (
    <View style={styles.root}>
      <FlatList
        data={rounds}
        keyExtractor={(item) => item.id}
        contentContainerStyle={rounds.length === 0 ? styles.emptyContainer : styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No rounds yet</Text>
            <Text style={styles.emptySubtitle}>Create a new round to get started</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handlePress(item)}>
            <View style={styles.cardRow}>
              <Text style={styles.groundName}>{item.ground_name}</Text>
              <Text
                style={[
                  styles.status,
                  item.status === RoundStatus.COMPLETED && styles.statusCompleted,
                  item.status === RoundStatus.IN_PROGRESS && styles.statusInProgress,
                  item.status === RoundStatus.SETUP && styles.statusSetup,
                ]}
              >
                {STATUS_LABELS[item.status] ?? item.status}
              </Text>
            </View>
            <Text style={styles.detail}>
              {item.date} · {item.total_targets} targets
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  list: {
    padding: Spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  card: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.bgSecondary,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groundName: {
    fontSize: FontSize.base,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
  },
  status: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  statusCompleted: {
    color: Colors.hit,
  },
  statusInProgress: {
    color: Colors.primary,
  },
  statusSetup: {
    color: Colors.textMuted,
  },
  detail: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
});
