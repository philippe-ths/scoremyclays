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
import { smcListIncomingInvitesForUser } from '@/db/queries/smc-invites';
import { Colors, Spacing, FontSize, BorderRadius } from '@/lib/constants';
import { RoundStatus, InviteStatus, type Round } from '@/lib/types';

export default function HomeScreen() {
  const db = usePowerSync();
  const { user } = useAuth();
  const router = useRouter();
  const [recent, setRecent] = useState<Round[]>([]);
  const [pendingInviteCount, setPendingInviteCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      smcListRounds(db, user.id).then((all) => setRecent(all.slice(0, 3)));
      if (user.user_id) {
        smcListIncomingInvitesForUser(db, user.user_id, InviteStatus.PENDING)
          .then((invites) => setPendingInviteCount(invites.length));
      }
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
      <View style={styles.hero}>
        <Text style={styles.title}>ScoreMyClays</Text>
        <Text style={styles.subtitle}>Track your shooting scores</Text>
      </View>

      <TouchableOpacity style={styles.newRoundBtn} onPress={() => router.push('/new-round')}>
        <Text style={styles.newRoundBtnText}>+ New Round</Text>
      </TouchableOpacity>

      {pendingInviteCount > 0 && (
        <TouchableOpacity
          style={styles.inviteBanner}
          onPress={() => router.push('/invites')}
        >
          <Text style={styles.inviteBannerText}>
            You have {pendingInviteCount} pending invite{pendingInviteCount > 1 ? 's' : ''}
          </Text>
        </TouchableOpacity>
      )}

      <Text style={styles.sectionTitle}>Recent Rounds</Text>

      <FlatList
        data={recent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={recent.length === 0 ? styles.emptyContainer : undefined}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No rounds yet. Start your first one!</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handlePress(item)}>
            <View style={styles.cardRow}>
              <Text style={styles.groundName}>{item.ground_name}</Text>
              <Text
                style={[
                  styles.status,
                  item.status === RoundStatus.COMPLETED && { color: Colors.hit },
                  item.status === RoundStatus.IN_PROGRESS && { color: Colors.primary },
                  item.status === RoundStatus.SETUP && { color: Colors.textMuted },
                ]}
              >
                {item.status === RoundStatus.COMPLETED ? 'Done' : item.status === RoundStatus.SETUP ? 'Setup' : 'In Progress'}
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
    padding: Spacing.lg,
  },
  hero: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize['3xl'],
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  newRoundBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  newRoundBtnText: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  inviteBanner: {
    backgroundColor: Colors.hit,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  inviteBannerText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: FontSize.base,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSize.base,
    color: Colors.textMuted,
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
  detail: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
});
