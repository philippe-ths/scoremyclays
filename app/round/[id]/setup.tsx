import { useCallback, useState } from 'react';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { usePowerSync, useQuery } from '@powersync/react';
import * as Crypto from 'expo-crypto';
import { useAuth } from '@/providers/AuthProvider';
import { smcGetRound, smcUpdateRoundStatus } from '@/db/queries/smc-rounds';
import { smcGetSquadByRound, smcAddShooterEntry, smcRemoveShooterEntry } from '@/db/queries/smc-squads';
import { smcGetClubWithDetails } from '@/db/queries/smc-clubs';
import { smcCreateInvite, smcCheckDuplicateInvite } from '@/db/queries/smc-invites';
import { MAX_SQUAD_SIZE } from '@/lib/constants';
import { color, radius, space } from '@/lib/design-system';
import { formatStandDetail, formatPositionTitle } from '@/lib/formatting';
import { InviteStatus, RoundStatus, type ShooterEntry, type Round, type PositionWithStands, type User } from '@/lib/types';
import { getSetupGuardRedirect } from '@/lib/round-guards';
import { UserSearch } from '@/components/UserSearch';
import {
  Badge,
  Body,
  BodySm,
  Button,
  Card,
  H3,
  Label,
  Meta,
  Screen,
  TextInput,
  TopBar,
  Typography,
} from '@/components/ui';

export default function RoundSetupScreen() {
  const { id: roundId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const db = usePowerSync();
  const { user } = useAuth();

  const [round, setRound] = useState<Round | null>(null);
  const [squadId, setSquadId] = useState<string | null>(null);
  const [newShooterName, setNewShooterName] = useState('');
  const [clubPositions, setClubPositions] = useState<PositionWithStands[]>([]);

  const { data: shooterRows } = useQuery<ShooterEntry>(
    `SELECT se.* FROM shooter_entries se
     JOIN squads s ON se.squad_id = s.id
     WHERE s.round_id = ?
     ORDER BY se.position_in_squad`,
    [roundId ?? ''],
  );
  const shooters = shooterRows ?? [];

  const { data: pendingInviteRows } = useQuery<{ id: string; invitee_user_id: string; status: string }>(
    'SELECT id, invitee_user_id, status FROM invites WHERE round_id = ? AND inviter_id = ? AND status = ?',
    [roundId ?? '', user?.id ?? '', InviteStatus.PENDING],
  );
  const pendingInvites = pendingInviteRows ?? [];

  const reload = useCallback(async () => {
    if (!roundId || !user) return;
    const r = await smcGetRound(db, roundId);
    const redirect = getSetupGuardRedirect(r, user.id, roundId);
    if (redirect) {
      router.replace(redirect);
      return;
    }
    setRound(r);
    if (r?.club_id) {
      const clubData = await smcGetClubWithDetails(db, r.club_id);
      if (clubData) setClubPositions(clubData.positions);
    }
    const squad = await smcGetSquadByRound(db, roundId);
    if (squad) setSquadId(squad.id);
  }, [db, roundId, user, router]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  async function handleSelectUserForInvite(selectedUser: User) {
    if (!user || !roundId) return;
    const existing = await smcCheckDuplicateInvite(db, roundId, selectedUser.user_id!);
    if (existing) {
      if (existing.status === InviteStatus.PENDING) {
        Alert.alert('Already Invited', 'You have already invited this shooter to this round.');
      } else if (existing.status === InviteStatus.ACCEPTED) {
        Alert.alert('Already Participant', 'This shooter is already a participant.');
      } else {
        Alert.alert('Re-inviting', 'Sending a new invite to this shooter.');
        await smcCreateInvite(db, {
          id: existing.id,
          round_id: roundId,
          inviter_id: user.id,
          invitee_id: selectedUser.id,
          invitee_user_id: selectedUser.user_id!,
        });
      }
      return;
    }
    try {
      await smcCreateInvite(db, {
        id: Crypto.randomUUID(),
        round_id: roundId,
        inviter_id: user.id,
        invitee_id: selectedUser.id,
        invitee_user_id: selectedUser.user_id!,
      });
      Alert.alert('Invited', `${selectedUser.display_name} has been invited to the round.`);
      await reload();
    } catch (err) {
      Alert.alert('Error', 'Failed to send invite.');
      console.error('Error sending invite:', err);
    }
  }

  async function handleAddShooter() {
    if (!squadId || !user) return;
    const name = newShooterName.trim();
    if (!name) return Alert.alert('Name required', "Enter the shooter's name.");
    if (shooters.length >= MAX_SQUAD_SIZE) {
      return Alert.alert('Squad Full', `Maximum ${MAX_SQUAD_SIZE} shooters per squad.`);
    }
    await smcAddShooterEntry(db, {
      id: Crypto.randomUUID(),
      squad_id: squadId,
      round_id: roundId!,
      user_id: null,
      shooter_name: name,
      position_in_squad: shooters.length + 1,
    });
    setNewShooterName('');
    await reload();
  }

  async function handleRemoveShooter(entryId: string) {
    if (shooters.length <= 1) {
      return Alert.alert('Cannot Remove', 'At least one shooter is required.');
    }
    await smcRemoveShooterEntry(db, entryId);
    await reload();
  }

  async function handleStartScoring() {
    if (shooters.length === 0) {
      return Alert.alert('Add Shooters', 'At least one shooter is required.');
    }
    await smcUpdateRoundStatus(db, roundId!, RoundStatus.IN_PROGRESS);
    router.push(`/round/${roundId}/score`);
  }

  return (
    <Screen>
      <TopBar
        title={round?.ground_name ?? 'Round Setup'}
        onBack={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.section}>
          <H3>Positions</H3>
          <View style={{ gap: space[2] }}>
            {clubPositions.map((position) => (
              <Card key={position.id}>
                <Body weight="600">{formatPositionTitle(position)}</Body>
                {position.stands.map((stand) => (
                  <Meta key={stand.id} style={{ marginTop: space[1] }}>
                    Stand {stand.stand_number} · {formatStandDetail(stand)}
                  </Meta>
                ))}
              </Card>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <H3>Squad</H3>
          <View style={{ gap: space[2] }}>
            {shooters.map((entry) => (
              <Card key={entry.id}>
                <View style={styles.shooterRow}>
                  <View style={{ flex: 1 }}>
                    <Body weight="600">
                      {entry.position_in_squad}. {entry.shooter_name}
                      {entry.user_id === user?.id ? ' (You)' : ''}
                    </Body>
                    {entry.user_id ? (
                      <Badge label="Linked" tone="info" style={{ marginTop: space[1] }} />
                    ) : null}
                  </View>
                  <Pressable hitSlop={8} onPress={() => handleRemoveShooter(entry.id)}>
                    <Typography tone="danger" weight="600">
                      Remove
                    </Typography>
                  </Pressable>
                </View>
              </Card>
            ))}
          </View>
        </View>

        {pendingInvites.length > 0 ? (
          <View style={styles.section}>
            <Label>Pending Invites ({pendingInvites.length})</Label>
            <View style={{ gap: space[2] }}>
              {pendingInvites.map((invite) => (
                <View key={invite.id} style={styles.pendingInvite}>
                  <BodySm>Waiting for @{invite.invitee_user_id} to accept…</BodySm>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <Label>Invite Shooters</Label>
          <UserSearch onSelectUser={handleSelectUserForInvite} currentUserInternalId={user?.id} />
        </View>

        <View style={styles.section}>
          <Label>Add Shooter by Name</Label>
          <View style={styles.addShooterRow}>
            <View style={{ flex: 1 }}>
              <TextInput
                value={newShooterName}
                onChangeText={setNewShooterName}
                placeholder="Shooter name"
                returnKeyType="done"
                onSubmitEditing={handleAddShooter}
              />
            </View>
            <Button label="Add" variant="primary" size="md" onPress={handleAddShooter} />
          </View>
        </View>

        <Button
          label="Start Scoring"
          variant="primary"
          size="lg"
          fullWidth
          onPress={handleStartScoring}
          style={{ marginTop: space[4] }}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: space[5],
    paddingBottom: space[12],
    gap: space[6],
  },
  section: {
    gap: space[3],
  },
  shooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  pendingInvite: {
    backgroundColor: color.noBirdBg,
    borderLeftWidth: 3,
    borderLeftColor: color.noBird,
    borderRadius: radius.md,
    padding: space[3],
  },
  addShooterRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[2],
  },
});
