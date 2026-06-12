import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { usePowerSync } from '@powersync/react';
import { useAuth } from '@/providers/AuthProvider';
import { smcListRounds } from '@/db/queries/smc-rounds';
import { space } from '@/lib/design-system';
import { formatRoundStatusLabel } from '@/lib/formatting';
import { RoundStatus, type RoundListItem } from '@/lib/types';
import {
  Badge,
  BodySm,
  Card,
  H1,
  H2,
  Meta,
  Screen,
  Typography,
} from '@/components/ui';

export default function HistoryScreen() {
  const db = usePowerSync();
  const { user } = useAuth();
  const router = useRouter();
  const [rounds, setRounds] = useState<RoundListItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      smcListRounds(db, user.id).then(setRounds);
    }, [db, user]),
  );

  function handlePress(round: RoundListItem) {
    if (round.status === RoundStatus.IN_PROGRESS) {
      router.push(`/round/${round.id}/score`);
    } else if (round.status === RoundStatus.SETUP) {
      const isOwner = round.created_by === user?.id;
      router.push(isOwner ? `/round/${round.id}/setup` : `/round/${round.id}/waiting`);
    } else {
      router.push(`/round/${round.id}/summary`);
    }
  }

  function tone(item: RoundListItem): 'success' | 'info' | 'danger' | 'neutral' {
    if (item.has_unresolved_conflicts === 1) return 'danger';
    if (item.status === RoundStatus.COMPLETED) return 'success';
    if (item.status === RoundStatus.IN_PROGRESS) return 'info';
    return 'neutral';
  }

  return (
    <Screen>
      <View style={styles.header}>
        <H1>History</H1>
        <Meta>Your Past Rounds</Meta>
      </View>
      <FlatList
        data={rounds}
        keyExtractor={(item) => item.id}
        contentContainerStyle={rounds.length === 0 ? styles.emptyContainer : styles.list}
        ItemSeparatorComponent={() => <View style={{ height: space[2] }} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <H2 align="center">No Rounds Yet</H2>
            <BodySm tone="muted" align="center" style={{ marginTop: space[2] }}>
              Create a new round to get started.
            </BodySm>
          </View>
        }
        renderItem={({ item }) => (
          <Card onPress={() => handlePress(item)}>
            <View style={styles.cardRow}>
              <Typography variant="body" weight="600" numberOfLines={1} style={{ flex: 1 }}>
                {item.ground_name}
              </Typography>
              <Badge
                label={
                  item.has_unresolved_conflicts === 1
                    ? 'Conflicted'
                    : formatRoundStatusLabel(item.status)
                }
                tone={tone(item)}
              />
            </View>
            <Meta style={{ marginTop: space[1] }}>
              {item.date} · {item.total_targets} targets
            </Meta>
          </Card>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: space[5],
    paddingTop: space[3],
    paddingBottom: space[4],
  },
  list: {
    paddingHorizontal: space[5],
    paddingBottom: space[12],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: space[6],
  },
  emptyState: {
    alignItems: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space[3],
  },
});
