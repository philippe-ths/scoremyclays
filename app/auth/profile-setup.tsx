import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Alert,
  SafeAreaView,
  ScrollView,
  Switch,
} from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import { usePowerSync } from '@powersync/react';
import { Colors } from '@/lib/constants';
import type { Club } from '@/lib/types';
import { updateUserProfile, isUserIdAvailable } from '@/db/queries/users';

export default function ProfileSetupScreen() {
  const { user, signOut, refreshUser } = useAuth();
  const db = usePowerSync();
  
  const [displayName, setDisplayName] = useState('');
  const [userId, setUserId] = useState('');
  const [userIdAvailable, setUserIdAvailable] = useState(true);
  const [checkingUserId, setCheckingUserId] = useState(false);
  const [discoverable, setDiscoverable] = useState(false);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClubIds, setSelectedClubIds] = useState<string[]>([]);
  const [gear, setGear] = useState<string[]>([]);
  const [newGearItem, setNewGearItem] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load clubs on mount
  useEffect(() => {
    const loadClubs = async () => {
      try {
        const loadedClubs = await db.getAll<Club>(
          'SELECT * FROM clubs ORDER BY name'
        );
        setClubs(loadedClubs);
      } catch (err) {
        console.error('Error loading clubs:', err);
      }
    };
    loadClubs();
  }, [db]);

  // Check userId availability with debounce
  useEffect(() => {
    if (!userId.trim()) {
      setUserIdAvailable(true);
      return;
    }

    const timer = setTimeout(() => {
      checkUserIdAvailability();
    }, 500);

    return () => clearTimeout(timer);
  }, [userId]);

  const checkUserIdAvailability = async () => {
    if (!userId.trim()) return;

    setCheckingUserId(true);
    try {
      const available = await isUserIdAvailable(db, userId);
      setUserIdAvailable(available);
    } catch (err) {
      console.error('Error checking userId:', err);
    } finally {
      setCheckingUserId(false);
    }
  };

  const validateForm = (): boolean => {
    if (!displayName.trim()) {
      setError('Display name is required');
      return false;
    }

    if (!userId.trim()) {
      setError('User ID is required');
      return false;
    }

    if (!userIdAvailable) {
      setError('This User ID is already taken');
      return false;
    }

    // Validate userId format: alphanumeric, underscore, hyphen only
    if (!/^[a-zA-Z0-9_-]+$/.test(userId)) {
      setError('User ID can only contain letters, numbers, underscores, and hyphens');
      return false;
    }

    if (userId.length < 3) {
      setError('User ID must be at least 3 characters');
      return false;
    }

    if (userId.length > 20) {
      setError('User ID must be 20 characters or less');
      return false;
    }

    return true;
  };

  const handleCompleteProfile = async () => {
    if (!validateForm() || !user) return;

    setError(null);
    setLoading(true);

    try {
      await updateUserProfile(db, user.id, {
        display_name: displayName,
        user_id: userId,
        discoverable: discoverable ? 1 : 0,
        favourite_club_ids: JSON.stringify(selectedClubIds),
        gear: JSON.stringify(gear),
      });
      // Refresh auth user state so profileComplete becomes true
      await refreshUser();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete profile';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>Set up your account details</Text>
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
              <Text style={styles.label}>Display Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Your name"
                placeholderTextColor="#9CA3AF"
                value={displayName}
                onChangeText={setDisplayName}
                editable={!loading}
              />
            </View>

            {/* User ID */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>User ID *</Text>
              <Text style={styles.helperText}>
                Unique handle for invites (3-20 characters, letters/numbers/underscore/hyphen)
              </Text>
              <View style={styles.userIdWrapper}>
                <TextInput
                  style={[styles.input, styles.userIdInput]}
                  placeholder="unique_handle"
                  placeholderTextColor="#9CA3AF"
                  value={userId}
                  onChangeText={setUserId}
                  autoCapitalize="none"
                  editable={!loading}
                />
                {checkingUserId && (
                  <ActivityIndicator
                    size="small"
                    color={Colors.primary}
                    style={styles.userIdSpinner}
                  />
                )}
              </View>
              {userId.trim() && !checkingUserId && (
                <Text
                  style={[
                    styles.availabilityText,
                    userIdAvailable
                      ? styles.availableText
                      : styles.unavailableText,
                  ]}
                >
                  {userIdAvailable ? '✓ Available' : '✗ Already taken'}
                </Text>
              )}
            </View>
          </View>

          {/* Favourite Clubs */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Favourite Clubs (Optional)</Text>
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
            <Text style={styles.sectionTitle}>Gear (Optional)</Text>
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
                  Allow others to find you by display name in invite search. Your User ID is always searchable.
                </Text>
              </View>
              <Switch
                value={discoverable}
                onValueChange={setDiscoverable}
                disabled={loading}
              />
            </View>
          </View>

          {/* Complete Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleCompleteProfile}
            disabled={loading || !userIdAvailable}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Complete Setup</Text>
            )}
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={async () => {
              if (Platform.OS === 'web') {
                if (window.confirm('Are you sure you want to log out?')) {
                  try {
                    await signOut();
                  } catch (err) {
                    console.error('Failed to log out:', err);
                  }
                }
              } else {
                Alert.alert(
                  'Log Out',
                  'Are you sure you want to log out?',
                  [
                    { text: 'Cancel' },
                    {
                      text: 'Log Out',
                      onPress: async () => {
                        try {
                          await signOut();
                        } catch (err) {
                          Alert.alert('Error', 'Failed to log out');
                        }
                      },
                      style: 'destructive',
                    },
                  ]
                );
              }
            }}
            disabled={loading}
          >
            <Text style={styles.logoutButtonText}>Log Out</Text>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
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
  helperText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  userIdWrapper: {
    position: 'relative',
  },
  userIdInput: {
    paddingRight: 40,
  },
  userIdSpinner: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  availabilityText: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
  },
  availableText: {
    color: Colors.hit,
  },
  unavailableText: {
    color: Colors.miss,
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
  logoutButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.miss,
    backgroundColor: 'transparent',
  },
  logoutButtonText: {
    color: Colors.miss,
    fontSize: 16,
    fontWeight: '600',
  },
});
