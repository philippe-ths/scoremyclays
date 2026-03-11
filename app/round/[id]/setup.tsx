import { useCallback, useState } from 'react';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { usePowerSync, useQuery } from '@powersync/react';
import * as Crypto from 'expo-crypto';
import { useAuth } from '@/providers/AuthProvider';
import { getRound } from '@/db/queries/rounds';
import { getSquadByRound, addShooterEntry, listShooterEntries, removeShooterEntry } from '@/db/queries/squads';
import { getClubWithDetails } from '@/db/queries/clubs';
import { createInvite, checkDuplicateInvite } from '@/db/queries/invites';
import { getUserByUserId } from '@/db/queries/users';
import { Colors, Spacing, FontSize, BorderRadius, MAX_SQUAD_SIZE } from '@/lib/constants';
import { formatStandDetail, formatPositionTitle } from '@/lib/formatting';
import { InviteStatus, type ShooterEntry, type Round, type PositionWithStands, type User } from '@/lib/types';
import { UserSearch } from '@/components/UserSearch';

export default function RoundSetupScreen() {
  const { id: roundId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const db = usePowerSync();
  const { user } = useAuth();

  const [round, setRound] = useState<Round | null>(null);
  const [shooters, setShooters] = useState<ShooterEntry[]>([]);
  const [squadId, setSquadId] = useState<string | null>(null);
  const [newShooterName, setNewShooterName] = useState('');
  const [clubPositions, setClubPositions] = useState<PositionWithStands[]>([]);

  // Reactively watch pending invites — auto-updates when sync changes the invites table
  const { data: pendingInviteRows } = useQuery<{ id: string; invitee_user_id: string; status: string }>(
    'SELECT id, invitee_user_id, status FROM invites WHERE round_id = ? AND inviter_id = ? AND status = ?',
    [roundId ?? '', user?.id ?? '', InviteStatus.PENDING],
  );
  const pendingInvites = pendingInviteRows ?? [];

  const reload = useCallback(async () => {
    if (!roundId) return;
    const r = await getRound(db, roundId);
    setRound(r);

    // Load club positions
    if (r?.club_id) {
      const clubData = await getClubWithDetails(db, r.club_id);
      if (clubData) {
        setClubPositions(clubData.positions);
      }
    }

    const squad = await getSquadByRound(db, roundId);
    if (squad) {
      setSquadId(squad.id);
      const entries = await listShooterEntries(db, squad.id);
      setShooters(entries);
    }
  }, [db, roundId]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  async function handleSelectUserForInvite(selectedUser: User) {
    if (!user || !roundId) return;

    // Check if already invited or participant
    const existing = await checkDuplicateInvite(db, roundId, selectedUser.user_id!);
    if (existing) {
      if (existing.status === InviteStatus.PENDING) {
        Alert.alert('Already invited', 'You have already invited this user to this round.');
      } else if (existing.status === InviteStatus.ACCEPTED) {
        Alert.alert('Already participant', 'This user is already a participant in this round.');
      } else {
        Alert.alert('Re-inviting', 'Sending a new invite to this user.');
        // Update declined invite back to PENDING
        await createInvite(db, {
          id: existing.id,
          round_id: roundId,
          inviter_id: user.id,
          invitee_id: selectedUser.id,
          invitee_user_id: selectedUser.user_id!,
        });
      }
      return;
    }

    // Create invite
    try {
      await createInvite(db, {
        id: Crypto.randomUUID(),
        round_id: roundId,
        inviter_id: user.id,
        invitee_id: selectedUser.id,
        invitee_user_id: selectedUser.user_id!,
      });

      Alert.alert('Invited!', `${selectedUser.display_name} has been invited to the round.`);
      await reload();
    } catch (err) {
      Alert.alert('Error', 'Failed to send invite');
      console.error('Error sending invite:', err);
    }
  }

  async function handleAddShooter() {
    if (!squadId || !user) return;
    const name = newShooterName.trim();
    if (!name) {
      Alert.alert('Name required', 'Enter the shooter\'s name.');
      return;
    }
    if (shooters.length >= MAX_SQUAD_SIZE) {
      Alert.alert('Squad full', `Maximum ${MAX_SQUAD_SIZE} shooters per squad.`);
      return;
    }
    await addShooterEntry(db, {
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
      Alert.alert('Cannot remove', 'At least one shooter is required.');
      return;
    }
    await removeShooterEntry(db, entryId);
    await reload();
  }

  function handleStartScoring() {
    if (shooters.length === 0) {
      Alert.alert('Add shooters', 'At least one shooter is required.');
      return;
    }
    router.push(`/round/${roundId}/score`);
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Club Positions Preview */}
      <Text style={styles.sectionTitle}>Positions</Text>
      {clubPositions.map((position) => (
        <View key={position.id} style={styles.card}>
          <Text style={styles.cardTitle}>
            {formatPositionTitle(position)}
          </Text>
          {position.stands.map((stand) => (
            <Text key={stand.id} style={styles.cardDetail}>
              Stand {stand.stand_number} · {formatStandDetail(stand)}
            </Text>
          ))}
        </View>
      ))}

      {/* Squad Section */}
      <Text style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>Squad</Text>

      {shooters.map((entry) => (
        <View key={entry.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>
                {entry.position_in_squad}. {entry.shooter_name}
                {entry.user_id === user?.id ? ' (You)' : ''}
              </Text>
              {entry.user_id && (
                <Text style={styles.userIdBadge}>Linked user</Text>
              )}
            </View>
            <TouchableOpacity onPress={() => handleRemoveShooter(entry.id)}>
              <Text style={styles.deleteText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Pending Invites */}
      {pendingInvites.length > 0 && (
        <>
          <Text style={[styles.label, { marginTop: Spacing.md, marginBottom: Spacing.sm }]}>
            Pending Invites ({pendingInvites.length})
          </Text>
          {pendingInvites.map((invite) => (
            <View key={invite.id} style={styles.pendingInviteCard}>
              <Text style={styles.pendingInviteText}>
                Waiting for @{invite.invitee_user_id} to accept...
              </Text>
            </View>
          ))}
        </>
      )}

      {/* Invite Users Section */}
      <View style={[styles.section, { marginTop: Spacing.lg, marginBottom: Spacing.md }]}>
        <Text style={styles.label}>Invite Users</Text>
        <UserSearch
          onSelectUser={handleSelectUserForInvite}
          currentUserInternalId={user?.id}
        />
      </View>

      <View style={styles.addShooterRow}>
        <TextInput
          style={styles.shooterInput}
          value={newShooterName}
          onChangeText={setNewShooterName}
          placeholder="Or add shooter by name"
          placeholderTextColor={Colors.textMuted}
          returnKeyType="done"
          onSubmitEditing={handleAddShooter}
        />
        <TouchableOpacity style={styles.addShooterBtn} onPress={handleAddShooter}>
          <Text style={styles.addShooterBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Start Button */}
      <TouchableOpacity style={styles.startBtn} onPress={handleStartScoring}>
        <Text style={styles.startBtnText}>Start Scoring</Text>
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
    paddingBottom: Spacing.xxl,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  card: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.bgSecondary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: FontSize.base,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  cardDetail: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  deleteText: {
    fontSize: FontSize.sm,
    color: Colors.miss,
  },
  addShooterRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  shooterInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    backgroundColor: Colors.bgSecondary,
  },
  addShooterBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
  },
  addShooterBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: FontSize.base,
  },
  startBtn: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.hit,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  startBtnText: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userIdBadge: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
  pendingInviteCard: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FBBF24',
    borderLeftWidth: 3,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  pendingInviteText: {
    fontSize: FontSize.sm,
    color: '#78350F',
    fontWeight: '500',
  },
  section: {
    gap: Spacing.md,
  },
  label: {
    fontSize: FontSize.base,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});
