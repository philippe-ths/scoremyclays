import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { usePowerSync } from '@powersync/react';
import { useAuth } from '@/providers/AuthProvider';
import { Colors } from '@/lib/constants';
import type { Invite, User, Round } from '@/lib/types';
import { InviteStatus } from '@/lib/types';
import {
  listIncomingInvitesForUser,
  updateInviteStatus,
} from '@/db/queries/invites';
import { getUserById } from '@/db/queries/users';
import * as Crypto from 'expo-crypto';
import { addShooterEntry, getSquadByRound } from '@/db/queries/squads';

export default function InvitesScreen() {
  const { user } = useAuth();
  const db = usePowerSync();

  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [inviteDetails, setInviteDetails] = useState<Record<string, { inviter: User; round: Round }>>({});

  // Load invites
  const loadInvites = useCallback(async () => {
    if (!user?.user_id) return;

    try {
      const pendingInvites = await listIncomingInvitesForUser(
        db,
        user.user_id,
        InviteStatus.PENDING
      );
      setInvites(pendingInvites);

      // Load inviter and round details for each invite
      const details: Record<string, { inviter: User; round: Round }> = {};
      for (const invite of pendingInvites) {
        try {
          const inviter = await getUserById(db, invite.inviter_id);
          const round = await db.getOptional<Round>(
            'SELECT * FROM rounds WHERE id = ?',
            [invite.round_id]
          );

          if (inviter && round) {
            details[invite.id] = { inviter, round };
          }
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

  // Load invites on mount and when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadInvites();
    }, [loadInvites])
  );

  const handleAcceptInvite = async (invite: Invite) => {
    try {
      // Get the squad for this round
      const squad = await getSquadByRound(db, invite.round_id);
      if (!squad) {
        Alert.alert('Error', 'Could not find squad for this round');
        return;
      }

      // Check if squad is full
      const shooterCount = await db.getOptional<{ count: number }>(
        'SELECT COUNT(*) as count FROM shooter_entries WHERE squad_id = ?',
        [squad.id]
      );

      if (shooterCount && shooterCount.count >= 6) {
        Alert.alert('Error', 'This squad is full (max 6 shooters)');
        return;
      }

      // Get next position
      const maxPosition = await db.getOptional<{ max_pos: number }>(
        'SELECT MAX(position_in_squad) as max_pos FROM shooter_entries WHERE squad_id = ?',
        [squad.id]
      );
      const nextPosition = (maxPosition?.max_pos || 0) + 1;

      // Create shooter entry with user_id link
      await addShooterEntry(db, {
        id: Crypto.randomUUID(),
        squad_id: squad.id,
        user_id: invite.invitee_user_id,
        shooter_name: inviteDetails[invite.id]?.inviter.display_name || 'Unknown',
        position_in_squad: nextPosition,
      });

      // Update invite status
      await updateInviteStatus(db, invite.id, InviteStatus.ACCEPTED);

      Alert.alert('Success', 'You have joined the round!', [
        { text: 'OK', onPress: () => loadInvites() },
      ]);
    } catch (err) {
      console.error('Error accepting invite:', err);
      Alert.alert('Error', 'Failed to accept invite');
    }
  };

  const handleDeclineInvite = async (inviteId: string) => {
    try {
      await updateInviteStatus(db, inviteId, InviteStatus.DECLINED);
      Alert.alert('Success', 'Invite declined');
      loadInvites();
    } catch (err) {
      console.error('Error declining invite:', err);
      Alert.alert('Error', 'Failed to decline invite');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (invites.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Invites Yet</Text>
          <Text style={styles.emptyText}>
            When someone invites you to a round, you'll see it here.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={invites}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {
            setRefreshing(true);
            loadInvites();
          }} />
        }
        renderItem={({ item }) => {
          const detail = inviteDetails[item.id];
          if (!detail) return null;

          const { inviter, round } = detail;

          return (
            <View style={styles.inviteCard}>
              <View style={styles.inviteHeader}>
                <View style={styles.inviterInfo}>
                  <Text style={styles.inviteTitle}>
                    {inviter.display_name} (@{inviter.user_id}) invited you to a round
                  </Text>
                  <Text style={styles.roundInfo}>
                    {round.ground_name} • {new Date(round.date).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              <View style={styles.roundDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Targets:</Text>
                  <Text style={styles.detailValue}>{round.total_targets}</Text>
                </View>
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => handleAcceptInvite(item)}
                >
                  <Text style={styles.acceptButtonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.declineButton}
                  onPress={() => {
                    Alert.alert(
                      'Decline Invite',
                      'Are you sure you want to decline this invite?',
                      [
                        { text: 'Cancel', onPress: () => {} },
                        {
                          text: 'Decline',
                          onPress: () => handleDeclineInvite(item.id),
                          style: 'destructive',
                        },
                      ]
                    );
                  }}
                >
                  <Text style={styles.declineButtonText}>Decline</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  inviteCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inviteHeader: {
    marginBottom: 12,
  },
  inviterInfo: {
    gap: 4,
  },
  inviteTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  roundInfo: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  roundDetails: {
    backgroundColor: Colors.bgSecondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: Colors.hit,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  declineButton: {
    flex: 1,
    backgroundColor: Colors.bgSecondary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.miss,
  },
  declineButtonText: {
    color: Colors.miss,
    fontWeight: '600',
    fontSize: 14,
  },
});
