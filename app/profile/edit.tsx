import { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { usePowerSync } from '@powersync/react';
import { color, radius, space } from '@/lib/design-system';
import type { Club } from '@/lib/types';
import { smcUpdateUserProfile } from '@/db/queries/smc-users';
import {
  Body,
  BodySm,
  Button,
  Chip,
  H3,
  Label,
  Screen,
  TextInput,
  TopBar,
  Typography,
} from '@/components/ui';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const db = usePowerSync();

  const [displayName, setDisplayName] = useState('');
  const [discoverable, setDiscoverable] = useState(false);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClubIds, setSelectedClubIds] = useState<string[]>([]);
  const [gear, setGear] = useState<string[]>([]);
  const [newGearItem, setNewGearItem] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const allClubs = await db.getAll<Club>('SELECT * FROM clubs ORDER BY name');
        setClubs(allClubs);
        setDisplayName(user.display_name);
        setDiscoverable(!!user.discoverable);
        setSelectedClubIds(user.favourite_club_ids ? JSON.parse(user.favourite_club_ids) : []);
        setGear(user.gear ? JSON.parse(user.gear) : []);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setInitialLoading(false);
      }
    })();
  }, [user, db]);

  const handleSaveProfile = async () => {
    if (!displayName.trim()) {
      setError('Display name is required.');
      return;
    }
    if (!user) return;
    setError(null);
    setLoading(true);
    try {
      await smcUpdateUserProfile(db, user.id, {
        display_name: displayName,
        discoverable: discoverable ? 1 : 0,
        favourite_club_ids: JSON.stringify(selectedClubIds),
        gear: JSON.stringify(gear),
      });
      await refreshUser();
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const addGear = () => {
    if (newGearItem.trim()) {
      setGear([...gear, newGearItem.trim()]);
      setNewGearItem('');
    }
  };
  const removeGear = (index: number) => setGear(gear.filter((_, i) => i !== index));
  const toggleClub = (id: string) =>
    setSelectedClubIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  if (initialLoading) {
    return (
      <Screen>
        <TopBar title="Edit Profile" onBack={() => router.back()} />
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={color.primary} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <TopBar title="Edit Profile" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {error ? (
          <View style={styles.errorBox}>
            <BodySm tone="danger">{error}</BodySm>
          </View>
        ) : null}

        <View style={styles.section}>
          <H3>Basic Information</H3>
          <TextInput
            label="Display Name"
            placeholder="Your name"
            value={displayName}
            onChangeText={setDisplayName}
            editable={!loading}
          />
          <View style={{ gap: space[1] }}>
            <Label>User ID (Cannot Be Changed)</Label>
            <View style={styles.readOnly}>
              <Body tone="muted">@{user?.user_id}</Body>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <H3>Favourite Grounds</H3>
          <View style={styles.chipRow}>
            {clubs.map((club) => (
              <Chip
                key={club.id}
                label={club.name}
                active={selectedClubIds.includes(club.id)}
                disabled={loading}
                onPress={() => toggleClub(club.id)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <H3>Gear</H3>
          <View style={styles.gearRow}>
            <View style={{ flex: 1 }}>
              <TextInput
                placeholder="e.g. Beretta 686 Silver Pigeon"
                value={newGearItem}
                onChangeText={setNewGearItem}
                editable={!loading}
              />
            </View>
            <Button
              label="Add"
              variant="primary"
              size="md"
              disabled={!newGearItem.trim() || loading}
              onPress={addGear}
            />
          </View>
          {gear.length > 0 ? (
            <View style={{ gap: space[2] }}>
              {gear.map((item, index) => (
                <View key={index} style={styles.gearItem}>
                  <Body style={{ flex: 1 }}>{item}</Body>
                  <Pressable onPress={() => removeGear(index)} disabled={loading} hitSlop={8}>
                    <Typography tone="muted" weight="600">
                      ✕
                    </Typography>
                  </Pressable>
                </View>
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.section}>
          <View style={styles.discoverableRow}>
            <View style={{ flex: 1, gap: space[1] }}>
              <H3>Discoverable</H3>
              <BodySm tone="muted">
                Allow others to find you by display name in invite search.
              </BodySm>
            </View>
            <Switch value={discoverable} onValueChange={setDiscoverable} disabled={loading} />
          </View>
        </View>

        <Button
          label={loading ? 'Saving…' : 'Save Changes'}
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          onPress={handleSaveProfile}
        />
        <Button
          label="Cancel"
          variant="secondary"
          size="lg"
          fullWidth
          disabled={loading}
          onPress={() => router.back()}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    paddingHorizontal: space[5],
    paddingVertical: space[6],
    gap: space[6],
  },
  errorBox: {
    backgroundColor: color.missBg,
    borderRadius: radius.md,
    padding: space[3],
    borderLeftWidth: 4,
    borderLeftColor: color.miss,
  },
  section: {
    gap: space[3],
  },
  readOnly: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: space[4],
    borderRadius: radius.md,
    backgroundColor: color.bgSunken,
    borderWidth: 1,
    borderColor: color.border1,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[2],
  },
  gearRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: space[2],
  },
  gearItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.bgSunken,
    paddingHorizontal: space[3],
    paddingVertical: space[3] - 2,
    borderRadius: radius.md,
  },
  discoverableRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[4],
  },
});
