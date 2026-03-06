import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  SafeAreaView,
  ScrollView,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { usePowerSync } from '@powersync/react';
import { Colors } from '@/lib/constants';
import type { Club } from '@/lib/types';
import { updateUserProfile } from '@/db/queries/users';

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

  // Load initial data
  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        const allClubs = await db.getAll<Club>('SELECT * FROM clubs ORDER BY name');
        setClubs(allClubs);

        // Parse user data
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

  const validateForm = (): boolean => {
    if (!displayName.trim()) {
      setError('Display name is required');
      return false;
    }
    return true;
  };

  const handleSaveProfile = async () => {
    if (!validateForm() || !user) return;

    setError(null);
    setLoading(true);

    try {
      await updateUserProfile(db, user.id, {
        display_name: displayName,
        discoverable: discoverable ? 1 : 0,
        favourite_club_ids: JSON.stringify(selectedClubIds),
        gear: JSON.stringify(gear),
      });

      await refreshUser();
      router.back();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGear = () => {
    if (newGearItem.trim()) {
      setGear([...gear, newGearItem.trim()]);
      setNewGearItem('');
    }
  };

  const handleRemoveGear = (index: number) => {
    setGear(gear.filter((_, i) => i !== index));
  };

  const toggleClubSelection = (clubId: string) => {
    if (selectedClubIds.includes(clubId)) {
      setSelectedClubIds(selectedClubIds.filter(id => id !== clubId));
    } else {
      setSelectedClubIds([...selectedClubIds, clubId]);
    }
  };

  if (initialLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Edit Profile</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Display Name */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Display Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Your name"
                placeholderTextColor="#9CA3AF"
                value={displayName}
                onChangeText={setDisplayName}
                editable={!loading}
              />
            </View>

            {/* User ID (Read-only) */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>User ID (Cannot be changed)</Text>
              <View style={styles.readOnlyInput}>
                <Text style={styles.readOnlyInputText}>@{user?.user_id}</Text>
              </View>
            </View>
          </View>

          {/* Favourite Clubs */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Favourite Clubs</Text>
            <View style={styles.clubGrid}>
              {clubs.map(club => (
                <TouchableOpacity
                  key={club.id}
                  style={[
                    styles.clubChip,
                    selectedClubIds.includes(club.id) && styles.clubChipSelected,
                  ]}
                  onPress={() => toggleClubSelection(club.id)}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.clubChipText,
                      selectedClubIds.includes(club.id) && styles.clubChipTextSelected,
                    ]}
                  >
                    {club.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Gear */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gear</Text>
            <View style={styles.gearInputRow}>
              <TextInput
                style={[styles.input, styles.gearInput]}
                placeholder="e.g., Beretta 686 Silver Pigeon"
                placeholderTextColor="#9CA3AF"
                value={newGearItem}
                onChangeText={setNewGearItem}
                editable={!loading}
              />
              <TouchableOpacity
                style={[
                  styles.addGearButton,
                  (!newGearItem.trim() || loading) && styles.buttonDisabled,
                ]}
                onPress={handleAddGear}
                disabled={!newGearItem.trim() || loading}
              >
                <Text style={styles.addGearButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
            {gear.length > 0 && (
              <View style={styles.gearList}>
                {gear.map((item, index) => (
                  <View key={index} style={styles.gearItem}>
                    <Text style={styles.gearItemText}>{item}</Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveGear(index)}
                      disabled={loading}
                    >
                      <Text style={styles.gearRemoveButton}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Discoverable Toggle */}
          <View style={styles.section}>
            <View style={styles.discoverableHeader}>
              <View style={styles.discoverableTextContainer}>
                <Text style={styles.sectionTitle}>Discoverable</Text>
                <Text style={styles.helperText}>
                  Allow others to find you by display name in invite search.
                </Text>
              </View>
              <Switch
                value={discoverable}
                onValueChange={setDiscoverable}
                disabled={loading}
              />
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSaveProfile}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Save Changes</Text>
            )}
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  form: {
    gap: 32,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.miss,
  },
  errorText: {
    color: '#991B1B',
    fontSize: 14,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.textPrimary,
    backgroundColor: '#fff',
  },
  readOnlyInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: Colors.bgSecondary,
  },
  readOnlyInputText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  helperText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  clubGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  clubChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  clubChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  clubChipText: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  clubChipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  gearInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  gearInput: {
    flex: 1,
  },
  addGearButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 48,
  },
  addGearButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  gearList: {
    gap: 8,
  },
  gearItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.bgSecondary,
    borderRadius: 8,
  },
  gearItemText: {
    fontSize: 14,
    color: Colors.textPrimary,
    flex: 1,
  },
  gearRemoveButton: {
    fontSize: 18,
    color: Colors.textSecondary,
    paddingLeft: 8,
  },
  discoverableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
  },
  discoverableTextContainer: {
    flex: 1,
    gap: 4,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 48,
  },
  cancelButtonText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
});
