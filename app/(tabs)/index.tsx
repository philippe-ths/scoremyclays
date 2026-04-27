import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { usePowerSync } from '@powersync/react';
import { useAuth } from '@/providers/AuthProvider';
import { smcListRounds } from '@/db/queries/smc-rounds';
import { smcListIncomingInvitesForUser } from '@/db/queries/smc-invites';
import { color, fontFamily, radius, space } from '@/lib/design-system';
import { formatRoundStatusLabel } from '@/lib/formatting';
import { RoundStatus, InviteStatus, type RoundListItem } from '@/lib/types';
import {
  Badge,
  BodySm,
  BrandMark,
  Button,
  Card,
  H1,
  H3,
  Meta,
  Screen,
  Typography,
} from '@/components/ui';

export default function HomeScreen() {
  const db = usePowerSync();
  const { user } = useAuth();
  const router = useRouter();
  const [recent, setRecent] = useState<RoundListItem[]>([]);
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

  function statusTone(item: RoundListItem): 'success' | 'warning' | 'danger' | 'neutral' | 'info' {
    if (item.has_unresolved_conflicts === 1) return 'danger';
    if (item.status === RoundStatus.COMPLETED) return 'success';
    if (item.status === RoundStatus.IN_PROGRESS) return 'info';
    return 'neutral';
  }

  function statusLabel(item: RoundListItem): string {
    if (item.has_unresolved_conflicts === 1) return 'Conflicted';
    return formatRoundStatusLabel(item.status);
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <BrandMark variant="icon" size={44} />
        <View style={styles.heroText}>
          <H1>ScoreMyClays</H1>
          <Meta>Track Your Shooting Scores</Meta>
        </View>
      </View>

      <View style={styles.content}>
        <Button
          label="+ New Round"
          variant="primary"
          size="lg"
          fullWidth
          onPress={() => router.push('/new-round')}
        />

        {pendingInviteCount > 0 ? (
          <Card
            onPress={() => router.push('/invites')}
            style={styles.inviteBanner}
          >
            <View style={styles.inviteRow}>
              <Typography variant="body" weight="600" tone="inverse">
                You have {pendingInviteCount} pending invite{pendingInviteCount > 1 ? 's' : ''}
              </Typography>
              <Badge label="View" tone="warning" />
            </View>
          </Card>
        ) : null}

        <H3 style={styles.sectionTitle}>Recent Rounds</H3>

        <FlatList
          data={recent}
          keyExtractor={(item) => item.id}
          contentContainerStyle={
            recent.length === 0 ? styles.emptyContainer : styles.listGap
          }
          ItemSeparatorComponent={() => <View style={{ height: space[2] }} />}
          ListEmptyComponent={
            <BodySm tone="meta" align="center">
              No rounds yet. Start your first one.
            </BodySm>
          }
          renderItem={({ item }) => (
            <Card onPress={() => handlePress(item)} padded={false} style={styles.roundCard}>
              <View style={styles.roundRow}>
                <View style={styles.roundThumb}>
                  <Typography
                    tone="inverse"
                    style={{ fontFamily: fontFamily.displayBlack, fontSize: 18 }}
                  >
                    {item.ground_name.charAt(0).toUpperCase()}
                  </Typography>
                </View>
                <View style={styles.roundBody}>
                  <Typography variant="body" weight="600" numberOfLines={1}>
                    {item.ground_name}
                  </Typography>
                  <Meta>
                    {item.date} · {item.total_targets} targets
                  </Meta>
                </View>
                <Badge label={statusLabel(item)} tone={statusTone(item)} />
              </View>
            </Card>
          )}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    paddingHorizontal: space[5],
    paddingTop: space[3],
    paddingBottom: space[4],
  },
  heroText: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: space[5],
    gap: space[4],
  },
  inviteBanner: {
    backgroundColor: color.primary,
    borderColor: color.primary,
  },
  inviteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space[3],
  },
  sectionTitle: {
    marginTop: space[2],
  },
  listGap: {
    paddingBottom: space[8],
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: space[8],
  },
  roundCard: {
    padding: space[3] + 2,
  },
  roundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3] + 2,
  },
  roundThumb: {
    width: 48,
    height: 48,
    borderRadius: radius.md + 2,
    backgroundColor: color.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundBody: {
    flex: 1,
  },
});
