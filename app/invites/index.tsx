import { useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { usePowerSync } from '@powersync/react';
import { useAuth } from '@/providers/AuthProvider';
import { color, space } from '@/lib/design-system';
import { InviteStatus, RoundStatus, type Invite, type User, type Round } from '@/lib/types';
import {
  smcListIncomingInvitesForUser,
  smcUpdateInviteStatus,
} from '@/db/queries/smc-invites';
import { smcGetUserById } from '@/db/queries/smc-users';
import { smcGetRound } from '@/db/queries/smc-rounds';
import { smcJoinSquad } from '@/db/queries/smc-squads';
import {
  Body,
  BodySm,
  Button,
  Card,
  H2,
  Meta,
  Screen,
  TopBar,
} from '@/components/ui';

export default function InvitesScreen() {
  const { user } = useAuth();
  const db = usePowerSync();
  const router = useRouter();

  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [inviteDetails, setInviteDetails] = useState<
    Record<string, { inviter: User | null; round: Round | null }>
  >({});

  const loadInvites = useCallback(async () => {
    if (!user?.user_id) return;
    try {
      const pendingInvites = await smcListIncomingInvitesForUser(
        db,
        user.user_id,
        InviteStatus.PENDING,
      );
      setInvites(pendingInvites);
      const details: Record<string, { inviter: User | null; round: Round | null }> = {};
      for (const invite of pendingInvites) {
        try {
          const inviter = await smcGetUserById(db, invite.inviter_id);
          const round = await db.getOptional<Round>('SELECT * FROM rounds WHERE id = ?', [
            invite.round_id,
          ]);
          details[invite.id] = { inviter: inviter ?? null, round: round ?? null };
        } catch (err) {
          console.error('Error loading invite details:', err);
        }
      }
      setInviteDetails(details);
    } catch (err) {
      console.error('Error loading invites:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.user_id, db]);

  useFocusEffect(
    useCallback(() => {
      loadInvites();
    }, [loadInvites]),
  );

  const showToast = (message: string) => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') window.alert(message);
    } else {
      Alert.alert('', message);
    }
  };

  const handleAcceptInvite = async (invite: Invite) => {
    try {
      const result = await smcJoinSquad(db, {
        roundId: invite.round_id,
        user_id: user!.id,
        shooter_name: user!.display_name || 'Unknown',
      });
      if (!result.ok) {
        showToast(
          result.reason === 'no_squad'
            ? 'Could not find squad for this round.'
            : 'This squad is full (max 6 shooters).',
        );
        return;
      }
      await smcUpdateInviteStatus(db, invite.id, InviteStatus.ACCEPTED);

      const round = await smcGetRound(db, invite.round_id);
      const destination =
        round?.status === RoundStatus.SETUP
          ? `/round/${invite.round_id}/waiting`
          : round?.status === RoundStatus.IN_PROGRESS
            ? `/round/${invite.round_id}/score`
            : `/round/${invite.round_id}/summary`;

      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') window.alert('You have joined the round!');
        router.push(destination as any);
      } else {
        Alert.alert('Success', 'You have joined the round!', [
          {
            text: 'OK',
            onPress: () => {
              loadInvites();
              router.push(destination as any);
            },
          },
        ]);
      }
    } catch (err) {
      console.error('Error accepting invite:', err);
      showToast('Failed to accept invite.');
    }
  };

  const declineInvite = async (inviteId: string) => {
    try {
      await smcUpdateInviteStatus(db, inviteId, InviteStatus.DECLINED);
      showToast('Invite declined.');
      loadInvites();
    } catch (err) {
      console.error('Error declining invite:', err);
      showToast('Failed to decline invite.');
    }
  };

  const confirmDecline = (inviteId: string) => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm('Are you sure you want to decline this invite?')) {
        declineInvite(inviteId);
      }
    } else {
      Alert.alert('Decline Invite', 'Are you sure you want to decline this invite?', [
        { text: 'Cancel' },
        { text: 'Decline', style: 'destructive', onPress: () => declineInvite(inviteId) },
      ]);
    }
  };

  return (
    <Screen>
      <TopBar title="Invites" onBack={() => router.back()} />
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={color.primary} />
        </View>
      ) : invites.length === 0 ? (
        <View style={styles.centered}>
          <H2 align="center">No Invites Yet</H2>
          <BodySm tone="muted" align="center" style={{ marginTop: space[2], maxWidth: 320 }}>
            When someone invites you to a round, you'll see it here.
          </BodySm>
        </View>
      ) : (
        <FlatList
          data={invites}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: space[3] }} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadInvites();
              }}
            />
          }
          renderItem={({ item }) => {
            const { inviter, round } = inviteDetails[item.id] ?? {};
            return (
              <Card>
                <Body weight="600">
                  {inviter
                    ? `${inviter.display_name} (@${inviter.user_id}) invited you to a round`
                    : 'You have been invited to a round'}
                </Body>
                {round ? (
                  <Meta style={{ marginTop: space[1] }}>
                    {round.ground_name} · {new Date(round.date).toLocaleDateString()} · {round.total_targets} targets
                  </Meta>
                ) : null}
                <View style={styles.buttonRow}>
                  <Button
                    label="Accept"
                    variant="primary"
                    size="md"
                    style={{ flex: 1 }}
                    onPress={() => handleAcceptInvite(item)}
                  />
                  <Button
                    label="Decline"
                    variant="secondary"
                    size="md"
                    style={{ flex: 1 }}
                    onPress={() => confirmDecline(item.id)}
                  />
                </View>
              </Card>
            );
          }}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: space[6],
  },
  list: {
    padding: space[5],
  },
  buttonRow: {
    flexDirection: 'row',
    gap: space[2],
    marginTop: space[4],
  },
});
