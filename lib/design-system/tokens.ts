/**
 * ScoreMyClays Design System v0.1.0 — tokens.
 *
 * Mirrors `scoremyclays-design-system/project/colors_and_type.css`.
 * This file is the single source of truth for brand visuals. Import
 * from `@/lib/design-system` (barrel), not this file directly.
 */

import type { TextStyle, ViewStyle } from 'react-native';

// ─── Palettes ──────────────────────────────────────────────────────────

export const palette = {
  field: {
    50: '#f2f7f0',
    100: '#dfead9',
    200: '#bfd5b3',
    300: '#94b883',
    400: '#6b9a56',
    500: '#4a7d38',
    600: '#37632a',
    700: '#2c4e22',
    800: '#233f1d',
    900: '#1c3218',
    950: '#0f1d0d',
  },
  clay: {
    50: '#fdf5ec',
    100: '#fae5cc',
    200: '#f5c88f',
    300: '#efa556',
    400: '#e88230',
    500: '#d96515',
    600: '#b74f0f',
    700: '#8f3c0d',
    800: '#6b2d0c',
    900: '#4a200a',
  },
  bone: {
    0: '#ffffff',
    50: '#faf8f3',
    100: '#f2ede2',
    200: '#e6dfcd',
    300: '#d2c9b2',
    400: '#a89f86',
    500: '#7c7460',
    600: '#5a5445',
    700: '#403b30',
    800: '#2a2720',
    900: '#18160f',
  },
  powder: {
    600: '#3a4034',
    700: '#2a2f26',
    800: '#1e221b',
    900: '#141711',
    950: '#0a0d08',
  },
} as const;

// ─── Semantic colors ───────────────────────────────────────────────────

export const color = {
  // Surfaces
  bg: palette.bone[50],
  bgElevated: palette.bone[0],
  bgSunken: palette.bone[100],
  bgInverse: palette.field[900],
  bgDark: palette.powder[950],
  bgDarkElevated: palette.powder[800],

  // Foregrounds
  fg1: palette.bone[900],
  fg2: palette.bone[700],
  fg3: palette.bone[500],
  fg4: palette.bone[400],
  fgInverse: palette.bone[50],
  fgDark1: palette.bone[0],
  fgDark2: palette.bone[400],

  // Borders
  border1: palette.bone[200],
  border2: palette.bone[300],
  borderStrong: palette.bone[400],
  borderDark: palette.powder[700],

  // Brand
  primary: palette.field[700],
  primaryHover: palette.field[800],
  primaryFg: palette.bone[50],
  accent: palette.clay[500],
  accentHover: palette.clay[600],
  accentFg: palette.bone[0],

  // Status — shooting-literal
  hit: '#2c8a3f',
  hitBg: '#e5f4e8',
  miss: '#b42318',
  missBg: '#fde8e6',
  noBird: palette.clay[500],
  noBirdBg: '#fef1dd',

  // Medals
  medalGold: '#c8a24a',
  medalSilver: '#a8a8a8',
  medalBronze: '#9a6b3e',

  // Performance
  positive: palette.field[600],
  negative: '#b42318',

  // Live indicator
  live: '#d93f2b',
} as const;

// ─── Spacing — 4px base ────────────────────────────────────────────────

export const space = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
} as const;

// ─── Radii ─────────────────────────────────────────────────────────────

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 20,
  '2xl': 28,
  pill: 999,
} as const;

// ─── Shadows ───────────────────────────────────────────────────────────
// Warm-tinted, two-layer where possible. React Native does not support
// multi-layer shadows natively — we approximate with the stronger layer
// and use `elevation` on Android.

export const shadow: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'darkMd', ViewStyle> = {
  xs: {
    shadowColor: '#18160f',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#18160f',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#18160f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#18160f',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 8,
  },
  xl: {
    shadowColor: '#18160f',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.14,
    shadowRadius: 48,
    elevation: 16,
  },
  darkMd: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 6,
  },
};

// ─── Typography ────────────────────────────────────────────────────────
// Font family names match the keys used in `useFonts` in `fonts.ts`.

export const fontFamily = {
  display: 'Fraunces_700Bold',
  displayBlack: 'Fraunces_800ExtraBold',
  displayMedium: 'Fraunces_600SemiBold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemibold: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
  mono: 'JetBrainsMono_400Regular',
  monoSemibold: 'JetBrainsMono_600SemiBold',
  monoBold: 'JetBrainsMono_700Bold',
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  md: 18,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 52,
  '5xl': 64,
  '6xl': 80,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  black: '800',
} as const satisfies Record<string, TextStyle['fontWeight']>;

export const lineHeight = {
  tight: 1.1,
  snug: 1.25,
  normal: 1.5,
  loose: 1.7,
} as const;

export const tracking = {
  tight: -0.4, // approx -0.02em at 20px
  normal: 0,
  wide: 0.8,
  ui: 1.6, // for UPPERCASE UI labels — ~0.08em
} as const;

/**
 * Semantic text style presets. Apply via `<Text style={text.h1}>`.
 * `lineHeight` in RN is absolute pixels, so we compute from fontSize
 * × the multiplier table above at build time here.
 */
export const text = {
  displayXl: {
    fontFamily: fontFamily.displayBlack,
    fontSize: fontSize['6xl'],
    lineHeight: fontSize['6xl'] * lineHeight.tight,
    letterSpacing: tracking.tight,
    color: color.fg1,
  },
  display: {
    fontFamily: fontFamily.display,
    fontSize: fontSize['4xl'],
    lineHeight: fontSize['4xl'] * lineHeight.tight,
    letterSpacing: tracking.tight,
    color: color.fg1,
  },
  h1: {
    fontFamily: fontFamily.display,
    fontSize: fontSize['3xl'],
    lineHeight: fontSize['3xl'] * lineHeight.tight,
    letterSpacing: tracking.tight,
    color: color.fg1,
  },
  h2: {
    fontFamily: fontFamily.displayMedium,
    fontSize: fontSize['2xl'],
    lineHeight: fontSize['2xl'] * lineHeight.snug,
    color: color.fg1,
  },
  h3: {
    fontFamily: fontFamily.bodySemibold,
    fontSize: fontSize.xl,
    lineHeight: fontSize.xl * lineHeight.snug,
    color: color.fg1,
  },
  h4: {
    fontFamily: fontFamily.bodySemibold,
    fontSize: fontSize.lg,
    lineHeight: fontSize.lg * lineHeight.snug,
    color: color.fg1,
  },
  body: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.base,
    lineHeight: fontSize.base * lineHeight.normal,
    color: color.fg1,
  },
  bodySm: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * lineHeight.normal,
    color: color.fg2,
  },
  meta: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: fontSize.sm,
    color: color.fg3,
  },
  label: {
    fontFamily: fontFamily.bodySemibold,
    fontSize: fontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: tracking.ui,
    color: color.fg3,
  },
  score: {
    fontFamily: fontFamily.monoBold,
    fontSize: fontSize['5xl'],
    letterSpacing: tracking.tight,
    lineHeight: fontSize['5xl'],
    color: color.fg1,
  },
  scoreSm: {
    fontFamily: fontFamily.monoSemibold,
  },
  mono: {
    fontFamily: fontFamily.mono,
  },
} as const satisfies Record<string, TextStyle>;

// ─── Motion ────────────────────────────────────────────────────────────

export const duration = {
  fast: 120,
  normal: 200,
  slow: 320,
} as const;

// ─── Layout ────────────────────────────────────────────────────────────

export const layout = {
  contentMax: 1200,
  mobileMax: 430,
  touchTarget: 48, // min tap target
  touchXl: 72, // glove-friendly scoring buttons
} as const;

// ─── Aggregated default export for convenience ─────────────────────────

export const tokens = {
  palette,
  color,
  space,
  radius,
  shadow,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  tracking,
  text,
  duration,
  layout,
} as const;

export type Tokens = typeof tokens;
