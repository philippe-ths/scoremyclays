import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePowerSync } from '@powersync/react';
import { useAuth } from '@/providers/AuthProvider';
import { smcListClubs, smcGetClub } from '@/db/queries/smc-clubs';
import { smcCreateRound } from '@/db/queries/smc-rounds';
import { color, radius, shadow, space } from '@/lib/design-system';
import { type Club } from '@/lib/types';
import {
  Body,
  BodySm,
  Button,
  H1,
  Label,
  Meta,
  Screen,
  TextInput,
  Typography,
} from '@/components/ui';

export default function NewRoundScreen() {
  const router = useRouter();
  const db = usePowerSync();
  const { user } = useAuth();
  const params = useLocalSearchParams<{ clubId?: string }>();

  const [isCreating, setIsCreating] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [clubSearch, setClubSearch] = useState('');
  const [clubResults, setClubResults] = useState<Club[]>([]);
  const [showClubDropdown, setShowClubDropdown] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (params.clubId) {
      (async () => {
        const club = await smcGetClub(db, params.clubId!);
        if (club) {
          setSelectedClub(club);
          setClubSearch(club.name);
        }
      })();
    }
  }, [db, params.clubId]);

  const searchClubs = useCallback(
    async (query: string) => {
      setClubSearch(query);
      if (query.trim().length === 0) {
        setClubResults([]);
        setShowClubDropdown(false);
        return;
      }
      const results = await smcListClubs(db, query);
      setClubResults(results);
      setShowClubDropdown(results.length > 0);
    },
    [db],
  );

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
      const { roundId } = await smcCreateRound(db, {
        created_by: user.id,
        creator_name: user.display_name,
        ground_name: selectedClub.name,
        date: today,
        total_targets: 0,
        club_id: selectedClub.id,
      });

      setSelectedClub(null);
      setClubSearch('');
      router.push(`/round/${roundId}/setup`);
    } catch {
      Alert.alert('Error', 'Failed to create round. Please try again.');
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={() => setShowClubDropdown(false)}
      >
        <View style={styles.header}>
          <H1>New Round</H1>
          <Meta>Start a Round at a Shooting Ground</Meta>
        </View>

        <View style={styles.field}>
          <Label style={styles.label}>Ground</Label>
          <View style={styles.clubSearchContainer}>
            {selectedClub ? (
              <View style={styles.selectedClubRow}>
                <Body weight="600" style={{ flex: 1 }} numberOfLines={1}>
                  {selectedClub.name}
                </Body>
                <Pressable hitSlop={8} onPress={handleClearClub}>
                  <Typography variant="bodySm" tone="danger" weight="600">
                    Clear
                  </Typography>
                </Pressable>
              </View>
            ) : (
              <TextInput
                value={clubSearch}
                onChangeText={searchClubs}
                placeholder="Search for a ground…"
                autoCapitalize="none"
                autoCorrect={false}
              />
            )}
            {showClubDropdown ? (
              <View style={styles.dropdown}>
                {clubResults.map((club) => (
                  <Pressable
                    key={club.id}
                    onPress={() => handleSelectClub(club)}
                    style={({ pressed }) => [
                      styles.dropdownItem,
                      pressed && { backgroundColor: color.bgSunken },
                    ]}
                  >
                    <Body weight="500">{club.name}</Body>
                    {club.description ? (
                      <BodySm tone="muted" numberOfLines={1}>
                        {club.description}
                      </BodySm>
                    ) : null}
                  </Pressable>
                ))}
              </View>
            ) : null}
          </View>
        </View>

        <Button
          label={isCreating ? 'Creating…' : 'Create Round'}
          variant="primary"
          size="lg"
          fullWidth
          loading={isCreating}
          disabled={isCreating}
          onPress={handleCreate}
          style={styles.createBtn}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: space[5],
  },
  header: {
    marginBottom: space[6],
  },
  field: {
    gap: space[2],
  },
  label: {
    marginBottom: space[1],
  },
  clubSearchContainer: {
    position: 'relative',
    zIndex: 10,
  },
  selectedClubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space[3],
    borderWidth: 1.5,
    borderColor: color.primary,
    borderRadius: radius.md,
    padding: space[4],
    backgroundColor: color.bgElevated,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 20,
    marginTop: space[1] + 2,
    borderWidth: 1,
    borderColor: color.border1,
    borderRadius: radius.md,
    backgroundColor: color.bgElevated,
    maxHeight: 220,
    overflow: 'hidden',
    ...Platform.select({
      ios: shadow.md,
      android: { elevation: 6 },
    }),
  },
  dropdownItem: {
    padding: space[4],
    borderBottomWidth: 1,
    borderBottomColor: color.border1,
  },
  createBtn: {
    marginTop: space[8],
  },
});
