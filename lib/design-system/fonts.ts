/**
 * Font loader for the ScoreMyClays design system.
 *
 * Loads Fraunces (display), Inter (body/UI) and JetBrains Mono (numbers)
 * via `expo-font`. Call `useDesignSystemFonts()` at the root layout and
 * keep the splash screen visible until it returns `true`.
 */

import { useFonts } from 'expo-font';
import {
  Fraunces_600SemiBold,
  Fraunces_700Bold,
  Fraunces_800ExtraBold,
} from '@expo-google-fonts/fraunces';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_600SemiBold,
  JetBrainsMono_700Bold,
} from '@expo-google-fonts/jetbrains-mono';

export function useDesignSystemFonts(): boolean {
  const [loaded] = useFonts({
    Fraunces_600SemiBold,
    Fraunces_700Bold,
    Fraunces_800ExtraBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    JetBrainsMono_400Regular,
    JetBrainsMono_600SemiBold,
    JetBrainsMono_700Bold,
  });
  return loaded;
}
