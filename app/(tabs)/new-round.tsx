import { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePowerSync } from '@powersync/react';
import * as Crypto from 'expo-crypto';
import { useAuth } from '@/providers/AuthProvider';
import { listClubs, getClub } from '@/db/queries/clubs';
import { Colors, Spacing, FontSize, BorderRadius } from '@/lib/constants';
import type { Club } from '@/lib/types';

export default function NewRoundScreen() {
  const router = useRouter();
  const db = usePowerSync();
  const { user } = useAuth();
  const params = useLocalSearchParams<{ clubId?: string }>();

  const [isCreating, setIsCreating] = useState(false);

  // Club selection state
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [clubSearch, setClubSearch] = useState('');
  const [clubResults, setClubResults] = useState<Club[]>([]);
  const [showClubDropdown, setShowClubDropdown] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  // Load club if arriving from club detail screen
  useEffect(() => {
    if (params.clubId) {
      (async () => {
        const club = await getClub(db, params.clubId!);
        if (club) {
          setSelectedClub(club);
          setClubSearch(club.name);
        }
      })();
    }
  }, [db, params.clubId]);

  // Search clubs as user types
  const searchClubs = useCallback(async (query: string) => {
    setClubSearch(query);
    if (query.trim().length === 0) {
      setClubResults([]);
      setShowClubDropdown(false);
      return;
    }
    const results = await listClubs(db, query);
    setClubResults(results);
    setShowClubDropdown(results.length > 0);
  }, [db]);

  function handleSelectClub(club: Club) {
    setSelectedClub(club);
    setClubSearch(club.name);
    setShowClubDropdown(false);
  }

  function handleClearClub() {
    setSelectedClub(null);
    setClubSearch('');
    setShowClubDropdown(false);
  }

  async function handleCreate() {
    if (!user) return;
    if (!selectedClub) {
      Alert.alert('Club required', 'Please select a club to start a round.');
      return;
    }

    setIsCreating(true);
    try {
      const roundId = Crypto.randomUUID();
      const squadId = Crypto.randomUUID();
      const shooterEntryId = Crypto.randomUUID();

      await db.writeTransaction(async (tx) => {
        await tx.execute(
          'INSERT INTO rounds (id, created_by, ground_name, date, total_targets, status, notes, club_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [roundId, user.id, selectedClub.name, today, 0, 'IN_PROGRESS', null, selectedClub.id, new Date().toISOString(), new Date().toISOString()],
        );
        await tx.execute(
          'INSERT INTO squads (id, round_id) VALUES (?, ?)',
          [squadId, roundId],
        );
        await tx.execute(
          'INSERT INTO shooter_entries (id, squad_id, round_id, user_id, shooter_name, position_in_squad) VALUES (?, ?, ?, ?, ?, ?)',
          [shooterEntryId, squadId, roundId, user.id, user.display_name, 1],
        );
      });

      setSelectedClub(null);
      setClubSearch('');
      router.push(`/round/${roundId}/setup`);
    } catch (e) {
      Alert.alert('Error', 'Failed to create round. Please try again.');
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" onScrollBeginDrag={() => setShowClubDropdown(false)}>
      {/* Club Selection */}
      <Text style={styles.label}>Club</Text>
      <View style={styles.clubSearchContainer}>
        {selectedClub ? (
          <View style={styles.selectedClubRow}>
            <Text style={styles.selectedClubName}>{selectedClub.name}</Text>
            <TouchableOpacity onPress={handleClearClub}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TextInput
            style={styles.input}
            value={clubSearch}
            onChangeText={searchClubs}
            placeholder="Search for a club..."
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
          />
        )}
        {showClubDropdown && (
          <View style={styles.dropdown}>
            {clubResults.map((club) => (
              <TouchableOpacity
                key={club.id}
                style={styles.dropdownItem}
                onPress={() => handleSelectClub(club)}
              >
                <Text style={styles.dropdownItemText}>{club.name}</Text>
                {club.description ? (
                  <Text style={styles.dropdownItemSub} numberOfLines={1}>{club.description}</Text>
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <Text style={styles.label}>Date</Text>
      <View style={styles.dateBox}>
        <Text style={styles.dateText}>{today}</Text>
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
  clubSearchContainer: {
    position: 'relative',
    zIndex: 10,
  },
  selectedClubRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    backgroundColor: Colors.bgSecondary,
  },
  selectedClubName: {
    fontSize: FontSize.base,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
  },
  clearText: {
    fontSize: FontSize.sm,
    color: Colors.miss,
    marginLeft: Spacing.sm,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 20,
    ...Platform.select({ android: { elevation: 10 } }),
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xs,
    backgroundColor: Colors.bgPrimary,
    maxHeight: 200,
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dropdownItemText: {
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  dropdownItemSub: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
